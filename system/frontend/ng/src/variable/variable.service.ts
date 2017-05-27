import {IHttpService, IPromise, IHttpPromiseCallbackArg} from "angular";
import {Config} from "../config/config.model";
import {Variable, Stream} from "./variable";
import * as _ from "lodash";
import {StreamSeries, SocketBindingProperties, VariableRequest} from "./variable.model";
import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;

export interface IVariableService {
    removeVariable(sensorId: string, id: string): IPromise<void>;
    getAllVariables(sensorId: string): IPromise<Variable[]>;
    addVariable(variable: Variable, sensorId: string): IPromise<Variable>;
    getVariable(id: string): IPromise<Variable>;
    getStreams(variableId: string): IPromise<StreamSeries[]>;
    bindToVariableUpdates(variableId: string,
                          sensorId: string,
                          handler: (update: Stream) => void): IPromise<string>;
    unbindUpdates(variableId: string, handlerId: string): IPromise<void>;
    createStreamSeries(stream: Stream): StreamSeries;
}

export class VariableService implements IVariableService {

    static id = "variableService";

    private sockets: {[id: string]: Socket} = {};

    constructor(private $http: IHttpService,
                private config: Config) {
        "ngInject";
    }

    getAllVariables(sensorId: string): IPromise<Variable[]> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/variable`, {
                params: {sensorId: sensorId}
            })
            .then((response: IHttpPromiseCallbackArg<Variable[]>) => {
                return response.data;
            });
    }

    removeVariable(sensorId: string, id: string): IPromise<void> {
        return this.$http
            .delete(`${this.config.apiEndpointUrl}/api/variable`, {
                params: {
                    variableId: id,
                    sensorId: sensorId
                }
            })
            .then(() => {
                return;
            });
    }

    addVariable(variable: Variable, sensorId: string): IPromise<Variable> {
        let request: VariableRequest = {
            variable: variable,
            sensorId: sensorId
        };

        return this.$http
            .post(`${this.config.apiEndpointUrl}/api/variable`, request)
            .then((response: IHttpPromiseCallbackArg<Variable>) => {
                return response.data;
            });
    }

    getVariable(id: string): IPromise<Variable> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/variable/${id}`)
            .then((response: IHttpPromiseCallbackArg<Variable>) => {
                return response.data;
            });
    }

    getStreams(variableId: string): IPromise<StreamSeries[]> {
        return this.$http
            .get(`${this.config.apiEndpointUrl}/api/stream/${variableId}`)
            .then((response: IHttpPromiseCallbackArg<Stream[]>) => {
                return response.data;
            })
            .then((streams: Stream[]) => {
                let series = _.map<Stream, StreamSeries>(streams, this.createStreamSeries);
                return series;
            });
    }

    bindToVariableUpdates(variableId: string,
                          sensorId: string,
                          handler: (update: Stream) => void): IPromise<string> {
        return this.$http
            .post(`${this.config.apiEndpointUrl}/api/variable/${variableId}/bind`, {
                sensorId: sensorId
            })
            .then((response: IHttpPromiseCallbackArg<SocketBindingProperties>) => {
                return response.data;
            })
            .then((socketBindingProperties: SocketBindingProperties) => {
                let socket = io.connect(socketBindingProperties.url);
                socket.on(socketBindingProperties.eventName, handler);
                this.sockets[variableId] = socket;

                return socketBindingProperties.handlerId;
            });
    }

    unbindUpdates(variableId: string, handlerId: string): angular.IPromise<void> {
        return this.$http
            .post(`${this.config.apiEndpointUrl}/api/variable/unbind`, {
                handlerId: handlerId
            })
            .then(() => {
                this.sockets[variableId].close();
                delete this.sockets[variableId];
            });
    }

    createStreamSeries(stream: Stream): StreamSeries {
        let streamSeries = new StreamSeries();
        streamSeries.x = new Date(Date.parse(stream.timeStamp.toString()));
        streamSeries.y = stream.value;

        return streamSeries;
    }
}
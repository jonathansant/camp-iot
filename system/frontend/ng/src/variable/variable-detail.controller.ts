import {BaseController} from "../shared/controllers/base.controller";
import {IVariableService} from "./variable.service";
import {Variable, StreamSeries, Stream} from "./variable.model";
import * as _ from "lodash";
import {IRootScopeService, IScope, IWindowService} from "angular";

export class VariableDetailController extends BaseController {

    variable: Variable;
    streamSeries: Array<Array<string|number>> = [];

    private currentHandlerId: string;

    constructor(private variableService: IVariableService,
                protected FoundationApi: any,
                private $stateParams: any,
                private $scope: IScope,
                private $rootScope: IRootScopeService,
                private $window: IWindowService) {
        "ngInject";

        super(FoundationApi);

        this.loadVariable();
        this.handlerUnbindings();
    }

    private loadVariable(): void {
        this.variableService
            .getVariable(this.$stateParams.id)
            .then((variable: Variable) => {
                this.variable = variable;
            })
            .then(() => {
                if (this.variable.isStream) {
                    return this.variableService
                        .getStreams(this.variable._id);
                }

                return [];
            })
            .then((streams: StreamSeries[]) => {
                this.calculateXYAxis(streams);
            })
            .then(() => {
                this.openSocketForUpdates();
            })
            .catch((err: Error) => {
                this.genericErrorNotification(err.message);
            });
    }

    private calculateXYAxis(streams: StreamSeries[]): void {
        _.forEach(streams, (stream: StreamSeries) => {
            this.streamSeries.push(stream.toCoordinate());
        });
    }

    private openSocketForUpdates(): void {
        this.variableService.bindToVariableUpdates(
            this.variable._id,
            this.$stateParams.parentId,
            (update: Stream) => {
                this.variable.value = update.value;

                if (this.variable.isStream) {
                    let strmSeries = this.variableService.createStreamSeries(update);
                    this.calculateXYAxis([strmSeries]);

                    if (this.streamSeries.length > 8) {
                        this.streamSeries.splice(0, 1);
                    }
                }

                this.$rootScope.$digest();
            })
            .then((handlerId: string) => {
                this.currentHandlerId = handlerId;
            });
    }

    private handlerUnbindings(): void {
        this.$scope.$on("$destroy", () => {
            this.variableService.unbindUpdates(this.variable._id, this.currentHandlerId);
        });

        this.$window.onbeforeunload = () => {
            this.variableService.unbindUpdates(this.variable._id, this.currentHandlerId);
        };
    }
}
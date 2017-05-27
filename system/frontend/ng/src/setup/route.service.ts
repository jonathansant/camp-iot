import {IStateProvider, IUrlRouterProvider} from "angular-ui-router";
import {ILocationProvider, IAngularEvent} from "angular";
import {LoginController} from "../login/login.controller";
import {IRootScopeService} from "angular";
import {IContextService} from "../context/context.service";
import {IStateService, IState} from "angular-ui-router";
import {SensorController, SensorDetailController} from "../sensor/sensor";
import {VariableDetailController} from "../variable/variable-detail.controller";
import {JobDetailController} from "../job/job-detail.controller";
import {HomeController} from "../home/home.controller";

export interface IRouteService {
    onStateChange(): void;
}

export class RouteService implements IRouteService {
    static id = "routeService";

    constructor(private $rootScope: IRootScopeService,
                private contextService: IContextService,
                private $state: IStateService) {
        "ngInject";
    }

    static setup($stateProvider: IStateProvider,
                 $urlRouterProvider: IUrlRouterProvider,
                 $locationProvider: ILocationProvider): void {
        "ngInject";

        $urlRouterProvider.when("", "/home");

        /*$locationProvider.html5Mode({
         enabled: true,
         requireBase: false
         });*/

        $urlRouterProvider.otherwise("/");
        $locationProvider.hashPrefix("!");

        $stateProvider
            .state("secure", {
                url: "/",
                template: "<ui-view/>",
                abstract: true
            })
            .state("login", {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: LoginController,
                controllerAs: "vm"
            })
            .state("secure.home", {
                url: "^/home",
                templateUrl: "templates/home.html",
                controller: HomeController,
                controllerAs: "vm"
            })
            .state("secure.sensor", {
                url: "^/sensor",
                templateUrl: "templates/sensor.html",
                controller: SensorController,
                controllerAs: "vm"
            })
            // .state("secure.sensor-detail", {
            //     url: "^/sensor/:id",
            //     templateUrl: "templates/sensor-detail.html",
            //     controller: SensorDetailController,
            //     controllerAs: "vm"
            // })
            .state("secure.sensor-detail", {
                url: "^/sensor/:id",
                templateUrl: "templates/sensor-detail.html",
                controller: SensorDetailController,
                controllerAs: "vm",
                //abstract: true
            })
            // .state("secure.sensor-detail.full", {
            //     url: "^/sensor/:id",
            //     views: {
            //         "variableList": {
            //             templateUrl: "templates/variable-list.html",
            //             controller: VariableController,
            //             controllerAs: "vm"
            //         }
            //     }
            // })
            .state("secure.variable-detail", {
                url: "^/variable/:id?parentId",
                views: {
                    "": {
                        templateUrl: "templates/variable-detail.html",
                        controller: VariableDetailController,
                        controllerAs: "vm"
                    }
                }
            })
            .state("secure.job-detail", {
                url: "^/job/:id?parentId",
                views: {
                    "": {
                        templateUrl: "templates/job-detail.html",
                        controller: JobDetailController,
                        controllerAs: "vm"
                    }
                }
            });
    }

    onStateChange(): void {
        this.$rootScope.$on("$stateChangeStart", (event: IAngularEvent, toState: IState) => {
            var stateName = toState.name;

            if (!this.contextService.isLoggedIn
                && stateName.match(/secure/)) {

                event.preventDefault();
                this.$state.go("login");
            }
        });
    }
}
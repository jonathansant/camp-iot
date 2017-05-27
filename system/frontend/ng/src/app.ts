import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import * as foundation from "foundation";
import * as ngAnimate from "angular-animate";
import * as LocalStorageModule from "angular-local-storage";
import {FastClick} from "fastclick";
import consts from "./consts";
import {RouteService, IRouteService} from "./setup/route.service";
import {AuthService} from "./authentication/authentication.service";
import {ContextService} from "./context/context.service";
import {Config} from "./config/config.model";
import ILocalStorageServiceProvider = angular.local.storage.ILocalStorageServiceProvider;
import {MenuController} from "./home/menu.controller";
import {SensorService} from "./sensor/sensor";
import {HttpInterceptor} from "./http/http.interceptor";
import IHttpProvider = angular.IHttpProvider;
import {EntityListComponent} from "./entity-list/entity-list.component";
import * as angularClipboard from "angular-clipboard";
import {VariableService} from "./variable/variable";
import {VariableFormComponent} from "./variable/variable-form.component";
import {VariableListComponent} from "./variable/variable-list.component";
import {EntityInfoComponent} from "./entity-info/entity-info.component";
import * as hichartsNg from "highcharts-ng";
import {VariableChartComponent} from "./variable/variable-chart.component";
import {JobService} from "./job/job.service";
import {JobFormComponent} from "./job/job-form.component";
import {JobListComponent} from "./job/job-list.component";
import {HomeService} from "./home/home.service";

let campModule = angular.module(consts.appName, [
    <any>uiRouter,
    <any>foundation,
    <any>ngAnimate,
    <any>LocalStorageModule,
    <any>angularClipboard,
    <any>hichartsNg
    //"foundation.dynamicRouting",
    //"foundation.dynamicRouting.animations"
]);

campModule.config(RouteService.setup);

campModule.config(["localStorageServiceProvider", "$httpProvider",
    (localStorageServiceProvider: ILocalStorageServiceProvider,
     $http: IHttpProvider) => {
        localStorageServiceProvider
            .setStorageType("localStorage");

        localStorageServiceProvider.setPrefix("camp");

        $http.interceptors.push("campInterceptor");
    }]);

campModule.config(["highchartsNGProvider", function (highchartsNGProvider: any) {
    highchartsNGProvider.lazyLoad();
}]);

campModule.run(["routeService",
    (routeService: IRouteService) => {
        FastClick.attach(document.body);
        $(document).foundation();

        routeService.onStateChange();
    }]);


//todo move these to appropriate files
campModule.constant("config", <Config>{
    //apiEndpointUrl: "http://camp-controller.westeurope.cloudapp.azure.com"
    // apiEndpointUrl: "http://192.168.0.13:3000"
    apiEndpointUrl: "http://ec2-52-208-241-214.eu-west-1.compute.amazonaws.com"
    //apiEndpointUrl: "http://camp-controller.azurewebsites.net"
    //apiEndpointUrl: "https://camp-controller.herokuapp.com"
});

campModule.service(VariableService.id, VariableService);
campModule.service(JobService.id, JobService);
campModule.service(RouteService.id, RouteService);
campModule.service(ContextService.id, ContextService);
campModule.service(AuthService.id, AuthService);
campModule.service(HomeService.id, HomeService);
campModule.controller(MenuController.id, MenuController);
campModule.service(SensorService.id, SensorService);
campModule.factory(HttpInterceptor.id, HttpInterceptor.factory);
campModule.component(EntityListComponent.id, EntityListComponent.component());
campModule.component(VariableFormComponent.id, VariableFormComponent.component());
campModule.component(JobFormComponent.id, JobFormComponent.component());
campModule.component(VariableListComponent.id, VariableListComponent.component());
campModule.component(JobListComponent.id, JobListComponent.component());
campModule.component(EntityInfoComponent.id, EntityInfoComponent.component());
campModule.component(VariableChartComponent.id, VariableChartComponent.component());
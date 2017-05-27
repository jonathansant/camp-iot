import {IAugmentedJQueryStatic, IWindowService, IScope} from "angular";
import * as _ from "lodash";

export class VariableChartController {

    private _config: any;

    constructor(private $scope: IScope,
                private $element: IAugmentedJQueryStatic,
                private $window: IWindowService) {
        "ngInject";

        this._config = {
            options: {
                chart: {
                    type: "area",
                    zoomType: "x",
                    backgroundColor: null//"#F0F0F3"
                }
            },
            series: [
                {
                    name: "Value",
                    data: (<any>this).streamSeries,
                    showInLegend: false
                }
            ],
            title: {
                text: ""
            },
            xAxis: {
                title: {
                    text: "Date/Time"
                },
                //type: "datetime",
                // dateTimeLabelFormats: {
                //     second: "%Y-%m-%d<br/>%H:%M:%S",
                //     minute: "%Y-%m-%d<br/>%H:%M",
                //     hour: "%Y-%m-%d<br/>%H:%M",
                //     day: "%Y<br/>%m-%d",
                //     week: "%Y<br/>%m-%d",
                //     month: "%Y-%m",
                //     year: "%Y"
                // }
                categories: _.map((<any>this).streamSeries, (stream: Array<string|number>) => {
                    return stream[0];
                }) /*["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]*/
            },
            yAxis: {
                title: {
                    text: "Recorded Value"
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080"
                }]
            },
            tooltip: {
                valueSuffix: ""
            }
        };

        this.setChartSize();
        this.handleWindowResize();
    }

    get chartConfig(): any {
        return this._config;
    }

    private setChartSize(): void {
        let parentNode: any = <HTMLElement>(<any>this.$element)[0].parentNode;
        let width = this.calculateChartWidth(parentNode);

        this._config.size = {
            width: width,
            height: this.calculateChartHeight(width)
        };
    }

    private calculateChartWidth(parent?: HTMLElement): number {
        let parentElement = parent || <HTMLElement>(<any>this.$element)[0].parentNode;
        return parentElement.offsetWidth;
    }

    private calculateAspectRatio(): number {
        return this.$window.innerWidth / this.$window.innerHeight;
    }

    private calculateChartHeight(width: number): number {
        let aspectRatio = this.calculateAspectRatio();

        return aspectRatio > 1
            ? width / aspectRatio
            : width * aspectRatio;
    }

    private handleWindowResize(): void {
        let theWindow = angular.element(this.$window);
        let parentElement = <HTMLElement>(<any>this.$element)[0].parentNode;

        theWindow.bind("resize", () => {
            this._config.size.width = this.calculateChartWidth(parentElement);
            this._config.size.height = this.calculateChartHeight(this._config.size.width);
            this.$scope.$digest();
        });
    }
}
import {Component} from '@angular/core';
import { CourbePSService } from './courbePS.service';

import { Courbe } from './courbe';
import * as Highcharts from 'highcharts';

import * as moment from 'moment';

Highcharts.setOptions({
  colors: ['#058DC7', '#50B432', '#ED561B']
});


Highcharts.setOptions({
    lang : {
        contextButtonTitle : 'Chart context menu',
        decimalPoint : '.',
        downloadJPEG : 'Download JPEG image',
        downloadPDF : 'Download PDF document',
        downloadPNG : 'Download PNG image',
        downloadSVG : 'Download SVG vector image',
        drillUpText : 'Back to {series.name}',
        loading : 'Chargement...',
        months : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août",
                "Septembre", "Octobre", "Novembre", "Décembre"],
        numericSymbols : ["k", "M", "G", "T", "P", "E"],
        printChart : 'Print chart',
        resetZoom : 'Reset zoom',
        resetZoomTitle : 'Reset zoom level 1:1',
        shortMonths : ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct",
                "Nov", "Dec"],
        thousandsSep : "",
        weekdays : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    },
    global : {
        useUTC : false
    },
    plotOptions: {
        series: {
            animation: false
        }
    }
});

export const OPTIONS_XAXIS: Object = {
    type: 'datetime',
    tickInterval : 1000 * 60 * 10,
    ordinal: false,
    dateTimeLabelFormats: {
        second: '%Y-%m-%d<br/>%H:%M:%S',
        minute: '%Y-%m-%d<br/>%H:%M',
        hour: '%Y-%m-%d<br/>%H:%M',
        day: '%Y<br/>%m-%d',
        week: '%Y<br/>%m-%d',
        month: '%Y-%m',
        year: '%Y'
    }
};

@Component({
    selector: 'series',
    /*styleUrls: ['./series.component.css'],*/
    templateUrl: './series.component.html'
})
export class SeriesComponent {
    options: Object;
    courbe: Courbe;
    chart : any;
    errorCount : number = 0;
    afficherCourbe: boolean = true;

    constructor(private courbePSService: CourbePSService) {
        let date = new Date();

        this.courbe = {
            dateDebut: moment(date).startOf('month').toDate(),
            dateFin: moment(date).startOf('month').add({months:1}).subtract({seconds:1}).toDate(),
            ps:new Map<string, number>().set('PTE', 100).set('HPH', 120).set('HCH', 140).set('HPE', 160).set('HCE', 100),
            points: undefined
        };

        courbePSService.getCourbePS(this.courbe).subscribe(courbe => {
            this.courbe = courbe;
            this.options= this.buildOptions(courbe.points);
            /*this.options = {
                xAxis: OPTIONS_XAXIS,
                rangeSelector : {
                    "enabled" : false
                },
                zoomType : "x",
                type: 'line',
                series: [{
                    data: courbe.points
                }]
            };*/
        },
        err=> {this.errorCount++;console.log(this.errorCount);});
    }

    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }

    toto(input: string) : void {
            console.log('changed ', input);
            let serieId : string = 'toto';
            let serie : any = this.chart.get(serieId);
            serie.setVisible(!this.afficherCourbe);
            this.afficherCourbe = !this.afficherCourbe;
    };

    private buildOptions(points : any) : Object {
        return {
            series: [{
                id:"toto",
                data: points
            }],
            "chart" : {
                alignThresholds : true,
                /*"events" : {
                    selection : function(event) {
                        if (selectionCallbacks) {
                            self.handleArrayOrObject(selectionCallbacks, function(selectionCallback) {
                                selectionCallback(event);
                            });
                            return true;
                        }
                    },
                    click : function(event) {
                        if (clickCallbacks) {
                            self.handleArrayOrObject(clickCallbacks, function(clickCallback) {
                                clickCallback(event);
                            });
                            return true;
                        }

                    },
                    addSeries : function(event) {
                        this.hideLoading();
                        if (addSerieCallbacks) {
                            self.handleArrayOrObject(addSerieCallbacks, function(addSerieCallback) {
                                addSerieCallback(event);
                            });
                        }
                    },
                    redraw : function(event) {
                        if (redrawCallbacks) {
                            self.handleArrayOrObject(redrawCallbacks, function(redrawCallback) {
                                redrawCallback(event);
                            });
                            return true;
                        }
                    },
                    load : function(event) {
                        if (loadCallbacks) {
                            self.handleArrayOrObject(loadCallbacks, function(loadCallback) {
                                loadCallback(event);
                            });
                        }
                    }

                },*/
                "zoomType" : "x",
                "xAxis" : {
                    "tickInterval" : 1000 * 60 * 10,
                    "type" : "datetime"
                },
                "type" : "line"
            },
            "legend" : {
                enabled : true
            },
            navigator : {
                margin : 30
            },
            exporting : {
                sourceWidth : 800,
                type : 'image/jpeg',
                sourceHeight : 800,
                enabled : true,
                buttons : {
                    contextButton : {
                        enabled : false
                    }
                }
            },
            loading : {
                hideDuration : 100,
                showDuration : 100,
            },
            //tooltip : {formatter : tooltipService.tooltipFormatter },
            xAxis : [{
                endOnTick : true,
                startOnTick : true,
                ordinal: false,
                /*events : {
                    afterSetExtremes : function(event) {
                        if (navigatorCallbacks) {
                            self.handleArrayOrObject(navigatorCallbacks, function(navigatorCallback) {
                                navigatorCallback(event);
                            });
                        }
                    }
                }*/
            }, {
                id : 'columnAxis',
                linkedTo : 0,
                labels : {
                    enabled : false
                }
            }, {
                id : 'monotoneAxis',
                linkedTo : 0,
                offset : 0,
                labels : {
                    enabled : false
                }
            }],/*
            yAxis : [
                    {
                        id : 'KWH',
                        labels : {
                            align : 'right',
                            formatter : function(arg) {
                                return this.value / 1000;
                            },
                            style : {
                                color : '#4572A7'
                            }
                        },
                        title : {
                            text : 'KWH',
                            style : {
                                color : '#4572A7'
                            }
                        },
                        minPadding : 0.2,
                        maxPadding : 0.2,
                        showEmpty : false,
                        minTickInterval : 1000
                    },
                    {
                        id : 'C',
                        labels : {
                            align : 'left',
                            formatter : function() {
                                return this.value;
                            },
                            style : {
                                color : '#89A54E'
                            }
                        },
                        title : {
                            text : 'C',
                            style : {
                                color : '#89A54E'
                            }
                        },
                        minPadding : 0.2,
                        maxPadding : 0.2,
                        opposite : true,
                        showEmpty : false
                    },
                    {
                        id : 'KVAH',
                        labels : {
                            align : 'left',
                            formatter : function(arg) {
                                var axisKVAH = this.chart.get('KVAH');
                                var dataMinKVAH = axisKVAH.getExtremes().dataMin;
                                var dataMaxKVAH = axisKVAH.getExtremes().dataMax;
                                if (((dataMinKVAH < 10000 && dataMinKVAH > -10000) || (dataMaxKVAH > -10000 && dataMaxKVAH < 10000))
                                        && dataMinKVAH !== 0) {
                                    return this.value;
                                } else {
                                    return this.value / 1000;
                                }
                            },
                            style : {
                                color : '#89A54E'
                            }
                        },
                        title : {
                            text : 'ER',
                            style : {
                                color : '#89A54E'
                            }
                        },
                        minPadding : 0.2,
                        maxPadding : 0.2,
                        opposite : true,
                        showEmpty : false,
                        minTickInterval : 1000
                    }, {
                        id : 'KWH',
                        labels : {
                            align : 'left',
                            formatter : function() {
                                return this.value;
                            },
                            style : {
                                color : '#910000'
                            }
                        },
                        title : {
                            text : 'Puissance',
                            style : {
                                color : '#910000'
                            }
                        },
                        minPadding : 0.2,
                        maxPadding : 0.2,
                        opposite : true,
                        showEmpty : false
                    }, {
                        id : 'EMPTY_AXIS',
                        labels : {
                            enabled : false
                        },
                        title : {
                            text : null
                        },
                    }],*/
            "rangeSelector" : {
                "enabled" : false
            },
            "credits" : {
                "enabled" : false
            }
        };
    }

    public etendCourbe(valeurDuree: number, typeDuree : string) : void {
        this.courbePSService.etendCourbePS(valeurDuree, typeDuree, this.courbe).subscribe(courbe => {
            this.courbe = courbe;
            this.options = {
                xAxis: OPTIONS_XAXIS,
                series: [{
                    data: courbe.points
                }]
            };
        });
    }

}

import {Component} from '@angular/core';
import { CourbePSService } from './courbePS.service';

import { Courbe } from './courbe';
import * as Highcharts from 'highcharts';

import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';

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

export const PLOT_OPTIONS: Object = {
    chart : {
        zoomType : "x",
        type : "line"
    },
    legend : {
        enabled : true
    },
    navigator : {
        margin : 30,
    },
    loading : {
        hideDuration : 100,
        showDuration : 100,
    },
    //tooltip : {formatter : tooltipService.tooltipFormatter },
    xAxis : [{
        endOnTick : true,
        startOnTick : true,
        ordinal: false
    }],
    rangeSelector : {
        enabled : false
    },
    credits : {
        enabled : false
    }
};

@Component({
    selector: 'series',
    /*styleUrls: ['./series.component.css'],*/
    templateUrl: './series.component.html'
})
export class SeriesComponent {
    options: Object;
    listeCourbe: Array<Courbe>;
    chart : any;
    errorCount : number = 0;
    afficherCourbe: boolean = true;

    constructor(private courbePSService: CourbePSService) {
        let date = new Date();
        this.listeCourbe = [];
        this.listeCourbe.push({
            type:'PS',
            label:'custom_PS',
            dateDebut: moment(date).startOf('month').toDate(),
            dateFin: moment(date).startOf('month').add({years:1}).subtract({seconds:1}).toDate(),
            ps:new Map<string, number>().set('PTE', 100).set('HPH', 120).set('HCH', 140).set('HPE', 160).set('HCE', 100),
            points: undefined,
            link: 'http://localhost:8080/points_ps'
        });

        this.listeCourbe.push( {
            type:'EA',
            label:'cosinus_EA',
            dateDebut: moment(date).startOf('month').toDate(),
            dateFin: moment(date).startOf('month').add({years:1}).subtract({seconds:1}).toDate(),
            ps: undefined,
            points: undefined,
            link: 'http://localhost:8080/points_sample'
        });

        let arrayObservable : Array<Observable<any>> = [];
        for (let courbe of this.listeCourbe) {
            arrayObservable.push(courbePSService.getCourbe(courbe));
        }
        Observable.forkJoin(arrayObservable).subscribe(
            listeCourbe => {
                this.options= this.buildOptions(listeCourbe);
            },
            err=> {
                this.errorCount++;console.log(this.errorCount);
        });
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

    private approximationMinMax(arr, dateArray, date, name) {
        var ret = null;
        var maxBinding = {};
        var len = arr.length;
        if (len) {
            var max = -Number.MAX_VALUE;
            var min = Number.MAX_VALUE;
            var index = 0;
            for ( var i = 0; i < arr.length; i++) {
                if (arr[i] > max) {
                    max = arr[i];
                    index = i;
                }
                if (arr[i] < min) {
                    min = arr[i];
                }
            }
            var val1 = max;
            var UNDEFINED;
            // Si c'est une PS il ne faut pas appliquer le min / max :
            // Highstock ne le supporte pas.
            var groupthem = (max > min) && name.indexOf("_PS_") == -1 ? true : false;
            // var groupthem = (max > min) && name[0].indexOf("_PS_") == -1 ? true : false;
            ret = [val1, min, groupthem];

            if (!maxBinding[name[0]]) {
                maxBinding[name[0]] = {};
            }
            for ( var j = 0; j < dateArray.length; j++) {
                if (!maxBinding[dateArray[j]]) {
                    maxBinding[dateArray[j]] = {};
                }
                maxBinding[dateArray[j]][name[0]] = {
                    value : val1
                };

                if (dateArray[index]) {
                    maxBinding[dateArray[j]][name[0]].date = dateArray[index];
                }
            }
            if (!maxBinding[date[0]]) {
                maxBinding[date[0]] = {};
            }
            maxBinding[date[0]][name[0]] = {
                value : val1
            };
            if (dateArray[index]) {
                maxBinding[date[0]][name[0]].date = dateArray[index];
            }
        }
        return len ? ret : (arr.hasNulls ? null : UNDEFINED);
    };

    private buildSeries(listeCourbe : Array<Courbe>) : any {
        let seriesOption : any = {
            series: []
        };
        for (let courbe of listeCourbe) {
            seriesOption.series.push({
                id: courbe.label,
                name: courbe.label,
                dataGrouping: {
                    enabled : true,
                    units: [['week', [1]], ['month',[1]]],
                    approximation: this.approximationMinMax//'high'
                },
                data: courbe.points
            });
        }
        return seriesOption;
    };

    private buildOptions(listeCourbe : Array<Courbe>) : Object {
        let plotOptions : any = Object.assign(this.buildSeries(listeCourbe), PLOT_OPTIONS);
        Object.assign(plotOptions.navigator, this.buildSeries(listeCourbe));
        return plotOptions;
    }

    public etendCourbe(valeurDuree: number, typeDuree : string) : void {
        this.courbePSService.etendCourbePS(valeurDuree, typeDuree, this.listeCourbe[1]).subscribe(courbe => {
            let listeCourbe : Array<Courbe> = [];
            listeCourbe.push(courbe);
            this.options= this.buildOptions(listeCourbe);
        });
    }

}

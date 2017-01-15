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
    courbe: Courbe;
    chart : any;
    errorCount : number = 0;
    afficherCourbe: boolean = true;

    constructor(private courbePSService: CourbePSService) {
        let date = new Date();

        this.courbe = {
            dateDebut: moment(date).startOf('month').toDate(),
            dateFin: moment(date).startOf('month').add({years:1}).subtract({seconds:1}).toDate(),
            ps:new Map<string, number>().set('PTE', 100).set('HPH', 120).set('HCH', 140).set('HPE', 160).set('HCE', 100),
            points: undefined
        };

        courbePSService.getCourbe(this.courbe).subscribe(courbe => {
            this.courbe = courbe;
            this.options= this.buildOptions(courbe.points);
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

    private buildSeries(points : any) : any {
        return {
            series: [{
                id:"toto",
                dataGrouping: {
                    enabled : true,
                    units: [['week', [1]], ['month',[1]]],
                    approximation:'high'
                },
                data: points
            }]
        };
    };

    private buildOptions(points : any) : Object {
        let plotOptions : any = Object.assign(this.buildSeries(points), PLOT_OPTIONS);
        return Object.assign(plotOptions.navigator, this.buildSeries(points));
    }

    public etendCourbe(valeurDuree: number, typeDuree : string) : void {
        this.courbePSService.etendCourbePS(valeurDuree, typeDuree, this.courbe).subscribe(courbe => {
            this.courbe = courbe;
            this.options= this.buildOptions(courbe.points);
        });
    }

}

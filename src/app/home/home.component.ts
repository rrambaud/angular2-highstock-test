import {Component} from '@angular/core';
import { CourbePSService } from '../series/courbePS.service';

import { Courbe } from '../series/courbe';

import * as Highcharts from 'highcharts';
import * as moment from 'moment';

Highcharts.setOptions({
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
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    options: Object;
    courbe: Courbe;
    errorCount : number = 0;


    constructor(private courbePSService: CourbePSService) {
        let date = new Date();

        this.courbe = {
            type:'PS',
            label:'custom_PS',
            dateDebut: moment(date).startOf('month').toDate(),
            dateFin: moment(date).startOf('month').add({months:1}).subtract({seconds:1}).toDate(),
            ps:new Map<string, number>().set('PTE', 100).set('HPH', 120).set('HCH', 140).set('HPE', 160).set('HCE', 100),
            points: undefined,
            link: 'http://localhost:8080/points_ps'
        };

        courbePSService.getCourbe(this.courbe).subscribe(points => {
            this.options = {
                xAxis: OPTIONS_XAXIS,
                series: [{
                    data: points
                }]
            };
        },
        err=> {this.errorCount++;console.log(this.errorCount);});
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

import {Component} from '@angular/core';
import { CourbePSService } from './courbePS.service';

import * as Highcharts from 'highcharts';

Highcharts.setOptions({
    global : {
        useUTC : false
    }
});

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    options: Object;

    constructor(public courbePSService: CourbePSService) {
        courbePSService.getCourbePS().subscribe(points => {
            /*let points :Array<Array<Number>> = [];
            for (let point of pointsRaw) {
            points.push([point[0], point[1]]);
        }*/
        console.log(points);
        this.options = {
            title : { text : 'simple chart' },
            xAxis: {
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
            },
            series: [{
                data: points
            }]
        };
    });
}

}

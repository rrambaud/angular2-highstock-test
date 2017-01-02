import {Component} from '@angular/core';
import { OpenDataRteService } from './openDataRte.service';

import * as Highcharts from 'highcharts';

Highcharts.setOptions({
    global : {
        useUTC : false
    }
});

@Component({
    selector: 'about',
    styleUrls: ['./about.component.css'],
    templateUrl: './about.component.html'
})
export class AboutComponent {
    dataSetCatalog : any;
    options: Object;

    constructor(private openDataRteService: OpenDataRteService) {
        //on affiche le catalogue
        openDataRteService.getDataSetCatalog().subscribe(dataSetCatalog => {
            this.dataSetCatalog = dataSetCatalog;
        });

        this.openDataRteService.getConsoNetteParSegmentDataSet().subscribe(dataset => {
            console.log('dataset', dataset);
        });

        //on affiche un chart
        this.openDataRteService.getConsoNetteParSegmentRecords().subscribe(records => {
            this.options = {
                title : { text : 'simple chart' },
                chart: { type: 'pie' },
                series: [{
                    data: records
                }]
            };
        });
    }

}

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OpenDataRteService {
    constructor(private http: Http) {}

    getDataSetCatalog() : Observable<Array<number>> {
        return this.http.get('https://opendata.rte-france.com/api/v2/catalog/datasets').map(this.extractDataSetCatalog).catch(this.handleError);
    }

    getConsoNetteParSegmentDataSet() : Observable<any> {
        return this.http.get('https://opendata.rte-france.com/api/v2/catalog/datasets/conso_nette_par_segment').map(rawResponse => {
            let response = rawResponse.json();
            return {title: response.dataset.metas.title, description: response.dataset.metas.description};
        });
    }

    getConsoNetteParSegmentRecords() : Observable<any> {
        return this.http.get('https://opendata.rte-france.com/api/v2/catalog/datasets/conso_nette_par_segment/records')
            .map(this.extractConsoNette).catch(this.handleError);
    }

    private extractConsoNette(rawResponse: Response) {
        let response = rawResponse.json();
        console.log('response', response);
        let records : Array<Object> = [];
        for (let element of response.records) {
            records.push({
                name: element.record.fields.segment[0],
                y: element.record.fields.consommation,
                drilldown: element.record.fields.segment[0]
            });
        }
        console.log('records', records);
        return records || [];
    }

    getRecords(element : any) : Observable<any> {
        console.log('getRecords from service', element);
        let href : string = this.getHrefByRel(element.links, 'records');
        console.log('href', href);
        if (!href) {
            throw new Error('Pas de de lien !');
        }
        console.log(this.http.get(href));
        let extractData : any;
        switch (element.dataset_id) {
            /*case "parc_region_annuel_production_filiere":
                extractData = this.extractRecords;
                break;*/
                /*"longueur_region_annuelle_circuit_file"*/
            case "prod_par_filiere":
                extractData = this.extractRecordsProdParFiliere;
                break;
            default:
                extractData = this.extractRecords;
                break;
                // throw new Error("not expected type " + element.dataset_id);
        }
        return this.http.get(href).map(extractData).catch(this.handleError);
    }

    private extractRecordsProdParFiliere(rawResponse: Response) {
        let response = rawResponse.json();
        console.log('response', response);
        let plots : any =  {};
        plots.prod_bioenergies = [];
        plots.prod_eolien = [];
        plots.prod_hydraulique = [];
        plots.prod_nucleaire = [];
        plots.prod_solaire = [];
        plots.prod_therm = [];
        plots.prod_therm_charbon = [];
        plots.prod_therm_fioul = [];
        plots.prod_therm_gaz = [];
        plots.prod_total = [];
        for (let element of response.records) {
            let field : any = element.record.fields;
            let epochMs : number = Date.UTC(field.annee, 0);
            plots.prod_bioenergies.push([epochMs, field.prod_bioenergies]);
            plots.prod_eolien.push([epochMs, field.prod_eolien]);
            plots.prod_hydraulique.push([epochMs, field.prod_hydraulique]);
            plots.prod_nucleaire.push([epochMs, field.prod_nucleaire]);
            plots.prod_solaire.push([epochMs, field.prod_solaire]);
            plots.prod_therm.push([epochMs, field.prod_therm]);
            plots.prod_therm_charbon.push([epochMs, field.prod_therm_charbon]);
            plots.prod_therm_fioul.push([epochMs, field.prod_therm_fioul]);
            plots.prod_therm_gaz.push([epochMs, field.prod_therm_gaz]);
            plots.prod_total.push([epochMs, field.prod_total]);
        }
        plots.prod_total.sort((n1,n2)=> n1[0] > n2[0]);
        console.log('extractRecordsProdParFiliere', plots);
        return plots || [];
    }

    private extractRecords(rawResponse: Response) {
        let response = rawResponse.json();
        console.log('response', response);
        let records : Array<Object> = [];
        for (let element of response.records) {
            records.push(element.record.fields);
        }
        console.log('records', records);
        return records || [];
    }

    private getHrefByRel(links : Array<any>, rel : string) {
        for (let link of links) {
            if (link.rel === rel) {
                return link.href;
            }
        }
        return null;
    }

    private extractDataSetCatalog(rawResponse: Response) {
        let response = rawResponse.json();
        let datasets : Array<Object> = [];
        for (let element of response.datasets) {
            datasets.push({title:element.dataset.metas.default.title,
                description:element.dataset.metas.default.description,
                dataset_id:element.dataset.dataset_id,
                links:element.links});
        }
        console.log('DataSetCatalog', datasets);
        return datasets || [];
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}

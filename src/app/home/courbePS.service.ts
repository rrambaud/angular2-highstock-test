import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CourbePSService {
    constructor(private http: Http) {}

    getCourbePS(/*org: string*/) : Observable<Array<number>> {
        let params = new URLSearchParams();
        params.set('dateDebut', "15/12/2016 00:00:00");
        params.set('dateFin', "30/12/2016 23:59:59");
        params.set('PTE', '100');
        params.set('HPH', '120');
        params.set('HCH', '140');
        params.set('HPE', '160');
        params.set('HCE', '180');
        return this.http.get('http://localhost:8080/points_ps', {search: params}).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let points = res.json();
        return points || [];
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

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Courbe} from './courbe';

import * as moment from 'moment';

@Injectable()
export class CourbePSService {
    constructor(private http: Http) {}

    getCourbe(courbe: Courbe) : Observable<Courbe> {
        let params = new URLSearchParams();
        params.set('dateDebut', moment(courbe.dateDebut).format("DD/MM/YYYY HH:mm:ss"));
        params.set('dateFin', moment(courbe.dateFin).format("DD/MM/YYYY HH:mm:ss"));
        return this.http.get('http://localhost:8080/points_sample', {search: params}).map(function(res: Response) {
            courbe.points = res.json();
            return courbe;
        }).catch(this.handleError);
    }

    getCourbePS(courbe: Courbe) : Observable<Courbe> {
        let params = new URLSearchParams();
        params.set('dateDebut', moment(courbe.dateDebut).format("DD/MM/YYYY HH:mm:ss"));
        params.set('dateFin', moment(courbe.dateFin).format("DD/MM/YYYY HH:mm:ss"));
        courbe.ps.forEach((puissance: number, classeTemporelle: string) => {
            params.set(classeTemporelle, String(puissance));
        });
        return this.http.get('http://localhost:8080/points_ps', {search: params}).map(function(res: Response) {
            courbe.points = res.json();
            return courbe;
        }).catch(this.handleError);
    }

    etendCourbePS(valeurDuree: number, typeDuree : any, courbe: Courbe) : Observable<Courbe> {
        if (!(typeDuree === 'years' || typeDuree === 'months')) {
            throw new Error("type duree fausse " + typeDuree);
        }
        let dateDebut : Date;
        let dateFin : Date;
        if (valeurDuree > 0) {
            dateDebut = moment(courbe.dateFin).add(1, 'seconds').toDate();
            dateFin = moment(courbe.dateFin).add(valeurDuree, typeDuree).toDate();
            courbe.dateFin = dateFin;
        }
        else {
            dateFin = moment(courbe.dateDebut).add(-1, 'seconds').toDate();
            dateDebut = moment(courbe.dateDebut).add(valeurDuree, typeDuree).toDate();
            courbe.dateDebut = dateDebut;
        }

        let params = new URLSearchParams();
        params.set('dateDebut', moment(dateDebut).format("DD/MM/YYYY HH:mm:ss"));
        params.set('dateFin', moment(dateFin).format("DD/MM/YYYY HH:mm:ss"));
        courbe.ps.forEach((puissance: number, classeTemporelle: string) => {
            params.set(classeTemporelle, String(puissance));
        });
        return this.http.get('http://localhost:8080/points_ps', {search: params}).map(function(res: Response) {
            console.log(res)
            let points = res.json();
            if (valeurDuree > 0) {
                courbe.points = courbe.points.concat(points);
            }
            else {
                courbe.points = points.concat(courbe.points);
            }
            return courbe;
        }).catch(this.handleError);
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

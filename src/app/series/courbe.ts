
export class Courbe {
    type:string;
    label:string;
    dateDebut:Date;
    dateFin:Date;
    ps:Map<string, number>;
    points: Array<Array<any>>;
    link: string;
    visible: boolean;
}

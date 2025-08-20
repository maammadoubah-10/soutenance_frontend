import { TypeCourrier } from './typeCourrier';

export interface Soustype {
    id : number;
    designation : string;
    type: TypeCourrier;
}


export interface SoustypeDto {
    designation : string;
    type : number ;
}

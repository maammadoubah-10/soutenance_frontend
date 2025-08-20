export interface Registre {
    id : number;
    reference : string;
    service : number;
    categorie : number;
    ouvert:  boolean;
  startNumber:  number;
}



export interface RegistreDto {
    reference : string;
    service : number;
    categorie : number;
    ouvert:  boolean;

}

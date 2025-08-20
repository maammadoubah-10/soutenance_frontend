import { Personnel } from "./personnel";
import { Requerant } from "./requerant";

export interface Commentaire {
    id:number,
    commentaireParent: Commentaire,
    reponses: Commentaire[],
    commentaire: string,
    personnel: Personnel,
    fichier:string;
    requerant: Requerant
}

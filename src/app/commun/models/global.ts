export interface Global {
  API_BASE_URL_COURRIER: string;
  API_BASE_URL_RH: string;
  API_BASE_URL_WEBSOCKET: string;
  API_BASE_URL_DOMAIN: string;
  POSTE_COURRIER: string;
  TITRE_ESPACE_CONNEXION: string;
  TITRE_ESPACE_CONNEXION_PEDAGOGIE: string;
  OF: string;
  IFU_NINEA_CORRESPONDANT_COURRIER: string;
  RH_CSRH: string;
  RH_SG: string;
  RH_DG: string;
  RH_NOM_RH: string;
  RH_NOM_SG: string;
  RH_CSRH_DIM: string;
  RH_SG_DIM: string;
  RH_DG_DIM: string;
  SIGLE_PERSONNEL_ONLYOFFICE_EDITION: string;
  DESIGNATION_DG: string;
  IMAGE_CONNEXION: string;
}
// NE PAS OUBLIER DE CHANGER L'ACCUSE DE RECEPTION POUR CHAQUE ENTREPRISE ET AUSSI LE INDEX.HTML
// /LOCAL
// const API_BASE_URL_COURRIER = 'http://monbaresto.com:9003/courrier';
// const API_BASE_URL_RH = 'http://localhost:9002/rh';
// const API_BASE_URL_WEBSOCKET = 'ws://localhost:9002/rh';
// const API_BASE_URL_DOMAIN = 'https://jilmonde.jilms.bj';
// const POSTE_COURRIER = 'SECRETAIRE GENERAL';
// const TITRE_ESPACE_CONNEXION = 'l\'EISMV DE DAKAR';
// const OF = 'de'
// const IFU_NINEA_CORRESPONDANT_COURRIER = 'Ninea'
// const RH_CSRH = 'CHEF SERVICE DES RESSOURCES HUMAINES'
// const RH_CSRH_DIM = 'CSRH'
// const RH_SG = 'SECRETAIRE GENERAL'
// const RH_SG_DIM = 'SG'
// const RH_DG = 'DIRECTEUR GENERAL'
// const RH_DG_DIM = 'DG'
// const RH_NOM_RH = 'Trait. CSRH'
// const RH_NOM_SG = 'Visa. SG'
// const SIGLE_PERSONNEL_ONLYOFFICE_EDITION = 'CSRH'
// const DESIGNATION_DG = 'DIRECTEUR GENERAL'
// const IMAGE_CONNEXION = 'assets/ERP__img.png'


///PRESENTATION JILMONDE
// const API_BASE_URL_COURRIER = 'https://presentation.jilms.bj:9003/courrier';
// const API_BASE_URL_RH = 'https://presentation.jilms.bj:9002/personnel';
// const API_BASE_URL_WEBSOCKET = 'wss://presentation.jilms.bj:9002/personnel';
// const API_BASE_URL_DOMAIN = 'https://presentation.jilms.bj';
// const POSTE_COURRIER = 'ASSISTANT(E) DU DIRECTEUR GENERAL';
// const TITRE_ESPACE_CONNEXION = 'CABINET JILMONDE CONSULTING SARL';
// const OF = 'du';
// const IFU_NINEA_CORRESPONDANT_COURRIER = 'IFU'
// const RH_CSRH = 'CHEF SERVICE DE L\'ADMINISTRATION ET DES RESSOURCES HUMAINES'
// const RH_CSRH_DIM = 'SARH'
// const RH_SG = 'ASSISTANT(E) DU DIRECTEUR GENERAL'
// const RH_SG_DIM = 'ADG'
// const RH_DG = 'DIRECTEUR GENERAL'
// const RH_DG_DIM = 'DG'
// const RH_NOM_RH = 'Conf. SARH'
// const RH_NOM_SG = 'Valid. ADG'
// const SIGLE_PERSONNEL_ONLYOFFICE_EDITION = 'SARH'

////JILMONDE
// const API_BASE_URL_COURRIER = 'https://jilmonde.jilms.bj:9003/courrier';
// const API_BASE_URL_RH = 'https://jilmonde.jilms.bj:9002/personnel';
// const API_BASE_URL_WEBSOCKET = 'wss://jilmonde.jilms.bj:9002/personnel';
// const API_BASE_URL_DOMAIN = 'https://jilmonde.jilms.bj';
// const POSTE_COURRIER = 'ASSISTANT(E) DU DIRECTEUR GENERAL';
// const TITRE_ESPACE_CONNEXION = 'CABINET JILMONDE CONSULTING SARL';
// const TITRE_ESPACE_CONNEXION_PEDAGOGIE = 'DAKAR';
// const OF = 'du';
// const IFU_NINEA_CORRESPONDANT_COURRIER = 'IFU'
// const RH_CSRH = 'CHEF SERVICE DE L\'ADMINISTRATION ET DES RESSOURCES HUMAINES'
// const RH_CSRH_DIM = 'SARH'
// const RH_SG = 'ASSISTANT(E) DU DIRECTEUR GENERAL'
// const RH_SG_DIM = 'ADG'
// const RH_DG = 'DIRECTEUR GENERAL'
// const RH_DG_DIM = 'DG'
// const RH_NOM_RH = 'Trait. SARH'
// const RH_NOM_SG = 'Visa. ADG'
// const SIGLE_PERSONNEL_ONLYOFFICE_EDITION = 'SARH'
// const DESIGNATION_DG = 'DIRECTEUR GENERAL'
// const IMAGE_CONNEXION = 'assets/ERP__img.png'




//EISMV
const API_BASE_URL_COURRIER = 'https://jilms.eismv.org:9003/courrier';
const API_BASE_URL_RH = 'https://jilms.eismv.org:9002/personnel';
const API_BASE_URL_WEBSOCKET = 'wss://jilms.eismv.org:9002/personnel';
const API_BASE_URL_DOMAIN = 'https://jilms.eismv.org';
const POSTE_COURRIER = 'SECRETAIRE GENERAL';
const TITRE_ESPACE_CONNEXION = 'ISI RH';
const TITRE_ESPACE_CONNEXION_PEDAGOGIE = 'DAKAR';
const OF = 'de'
const IFU_NINEA_CORRESPONDANT_COURRIER = 'Ninea'
const RH_CSRH = 'CHEF SERVICE DES RESSOURCES HUMAINES'
const RH_CSRH_DIM = 'CSRH'
const RH_SG = 'SECRETAIRE GENERAL'
const RH_SG_DIM = 'SG'
const RH_DG = 'DIRECTEUR GENERAL'
const RH_DG_DIM = 'DG'
const RH_NOM_RH = 'Trait. CSRH'
const RH_NOM_SG = 'Visa. SG'
const SIGLE_PERSONNEL_ONLYOFFICE_EDITION = 'CSRH'
const DESIGNATION_DG = 'DIRECTEUR GENERAL'
const IMAGE_CONNEXION = 'assets/image_isi.png'

export const GLOBAL_CONFIG: Global = {
  API_BASE_URL_COURRIER,
  API_BASE_URL_RH,
  API_BASE_URL_WEBSOCKET,
  API_BASE_URL_DOMAIN,
  POSTE_COURRIER,
  TITRE_ESPACE_CONNEXION,
  OF,
  IFU_NINEA_CORRESPONDANT_COURRIER,
  RH_CSRH,
  RH_DG,
  RH_SG,
  RH_NOM_RH,
  RH_NOM_SG,
  RH_CSRH_DIM,
  RH_DG_DIM,
  RH_SG_DIM,
  SIGLE_PERSONNEL_ONLYOFFICE_EDITION,
  DESIGNATION_DG,
  TITRE_ESPACE_CONNEXION_PEDAGOGIE,
  IMAGE_CONNEXION

};

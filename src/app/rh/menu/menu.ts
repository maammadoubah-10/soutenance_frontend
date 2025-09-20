import {MenuItem} from "./menu.model";

export const MENU: MenuItem[] = [

  {
    id: 1,
    label: 'Les FONCTIONALITES',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Portail',
    icon: 'bx-home-circle',
    link: '/espacedetravail',
  },
  {
    id: 1,
    label: 'Les fonctionnalités',
    isTitle: true,
  },
  {
    id: 1,
    label: 'Tableau de bord',
    icon: 'bx-bar-chart-square',
    link: 'tableaudebord',
  },
  {
    id: 1,
    label: 'Gestion du Personnel',
    icon: 'bx-group',
    subItems: [
      {
        id: 2,
        label: 'Personnels',
        icon: 'bx-user',
        link: 'personnels',
      },
      {
        id: 6,
        label: 'Postes',
        icon: 'bx bx-poll',
        link: 'postes',
      },
      {
        id: 3,
        label: 'Services',
        icon: 'bx bx-bookmark',
        link: 'services',
      },
      {
        id: 4,
        label: 'Contrats',
        icon: 'bx bx-line-chart',
        link: 'contrats',
      },
      {
        id: 1.1,
        label: 'Indices',
        icon: 'bx bx-line-chart',
        link: 'indices',
      },
      // {
      //   id: 4,
      //   label: 'Mission',
      //   icon: 'bx bx-briefcase',
        // subItems: [
           {
             id: 4,
             label: 'Frais',
             icon: 'bx bx-wallet',
             link: 'frais',
           },
            {
              id: 4,
              label: 'Affectations',
              icon: 'bx bx-transfer',  
              link: 'affectations',
            },
            {
              id: 4,
              label: 'Présences',
              icon: 'bx bx-check-square',
              link: 'presences', 
            },


           {
             id: 4,
             label: 'Missions',
             icon: 'bx bxs-plane-take-off',
             link: 'missions',
           },
           {
             id: 4,
             label: 'Missionnaire Externe',
             icon: 'bx bxs-id-card',
             link: 'missionnaire-externes',
           },
        // ]
      //},
      {
        id: 4,
        label: 'Absence & Congé',
        icon: 'bx bx-confused',
         subItems: [
           {
             id: 4,
             label: 'Demandes',
             icon: 'bx bx-detail',
             link: 'demandes',
           },
           {
             id: 4,
             label: 'Congés',
             icon: 'bx bx-run',
             link: 'conges',
           },
         ]
      },
      {
        id: 4,
        label: 'Recrutement',
        icon: 'bx bx-badge',
        link: 'recrutements',
      },
    ]
  },


  {
    id: 1,
    label: 'Gestion de la Paie',
    icon: 'bx-money',
    subItems: [
      {
        id: 5,
        label: 'Retenus',
        icon: 'bx bxs-minus-square',
        link: 'retenus',
      },
      {
        id: 5,
        label: 'Etats',
        icon: 'bx bx-credit-card',
        subItems: [
          {
            id: 5,
            label: 'Fiche de paie',
            icon: 'bx bxs-file-pdf',
            link: 'export-etat',
          },
          {
            id: 5,
            label: 'Ordre de virement',
            icon: 'bx bxs-factory',
            link: 'ordre-virement',
          },
         /* {
            id: 5,
            label: 'Fiche de salaire',
            icon: 'bx bxs-file',
            link: 'etats',
          },*/
        ]
      },
      {
        id: 5,
        label: 'Autorisations',
        icon: 'bx bxs-badge-check ',
        link: 'autorisations',
      },
      {
        id: 22,
        label: 'Avancements',
        link: 'avancements',
        icon: 'bx bxs-credit-card-alt',
      },
      {
        id: 21,
        label: 'Salaire Bases',
        icon: 'bx bx-wallet-alt',
        link: 'salaire-bases',
      },
      {
        id: 22,
        label: 'Archives',
        icon: 'bx bx-file-blank',
        subItems: [
          {
            id: 5,
            label: 'Fiches de paie',
            icon: 'bx bxs-file-find',
            link: 'archives',
          },
          {
            id: 5,
            label: 'Fiches de salaire',
            icon: 'bx bxs-file-pdf',
            link: 'etats',
          },
        ]
      },
    ]
  },

  {
    id: 8,
    label: 'Définition Personnel',
    icon: 'bx-cog',
    subItems: [
      {
      id: 8,
      label: 'Type Dossiers',
      link: 'type-dossiers',
    },
      {
        id: 9,
        label: 'Type de pièce',
        link: 'type-pieces',
      },
      {
        id: 9,
        label: 'Type de contrat',
        link: 'type-contrats',
      },
      {
        id: 10,
        label: 'Statut personnel',
        link: 'statut-personnels',
      },
      {
        id: 9,
        label: 'Banques',
        link: 'banques',
      },
      {
        id: 9,
        label: 'Entités',
        link: 'entites',
      },
      {
        id: 9,
        label: 'Mode de paiement',
        link: 'mode-paiements',
      },
      {
        id: 9,
        label: 'Indices',
        link: 'indices',
      },
      {
        id: 9,
        label: 'Imputation',
        link: 'imputations',
      },
      {
        id: 9,
        label: 'Type de Mission',
        link: 'type-missions',
      },
      {
        id: 9,
        label: 'Facteur',
        link: 'facteurs',
      },
      {
        id: 9,
        label: 'Type de Demande',
        link: 'type-demandes',
      },
      {
        id: 9,
        label: 'Statut de Demande',
        link: 'statut-demandes',
      },

      {
        id: 9,
        label: 'Niveau d\'études',
        link: 'niveau-etudes',
      },

      {
        id: 9,
        label: 'Statut de Candidatures',
        link: 'statut-candidatures',
      },

      {
        id: 9,
        label: 'Type d\'evenements',
        link: 'type-evenements',
      },

      {
        id: 9,
        label: 'Critere d\'evenements',
        link: 'critere-evenements',
      },
      {
        id: 9,
        label: 'Note',
        link: 'notes',
      },
      {
        id: 9,
        label: 'Jury',
        link: 'jurys',
      },
    ]
  },


  {
    id: 8,
      label: 'Définition Paie',
    icon: 'bx-cog',
    subItems: [
      {
        id: 5,
        label: 'Echelons',
        icon: '',
        link: 'echelons',
      },
      {
        id: 22,
        label: 'Categories',
        link: 'categories',
        parentId: 21
      },
      {
        id: 22,
        label: 'Type de retenus',
        link: 'type-retenus',
        parentId: 21
      },
      {
        id: 22,
        label: 'Type autorisations',
        link: 'type-autorisations',
        parentId: 21
      },
      {
        id: 23,
        label: 'Type d\'impact salarial',
        link: 'type-impact-salarial',
        parentId: 21
      },
      {
        id: 23,
        label: 'Impact Salarial',
        link: 'impact-salarial',
        parentId: 21
      },

    ]
  },


];


import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'LES FONCTIONALITES',
        isTitle: true
    },
    {
        id: 2,
        label: 'Portail',
        icon: 'bx-home-circle',
        link: '/espacedetravail',
    },

    {
        id: 3,
        label: 'fonctionnalités',
        isTitle: true
    },
    {
        id: 4,
        label: 'Tableau de bord',
        icon: 'bx-bar-chart-square',
        link: 'tableaudebord',
    },
    {
        id: 5,
        label: 'banque',
        icon: 'bx-car',
        link: 'banque',
    },

     {
        id: 5,
        label: 'mode-paiement',
        icon: 'bx-car',
        link: 'mode-paiement',
    },
     {
        id: 5,
        label: 'type-retenus',
        icon: 'bx-car',
        link: 'type-retenus',
    },
    {
        id: 5,
        label: 'Retenus',
        icon: 'bx-car',
        link: 'retenus',
    },
    {
        id: 10,
        label: 'Unites',
        icon: 'bx-car',
        link: 'unite',
    },
    {
        id: 5,
        label: 'Etats',
        icon: 'bx-car',
        subItems: [
            {
                id: 5,
                label: 'Fiche de paie',
                icon: 'bx-car',
                link: 'export-etat',
            },
            {
                id: 5,
                label: 'Ordre de virement',
                icon: 'bx-car',
                link: 'ordre-virement',
            },
            {
              id: 5,
              label: 'Fiche de salaire',
              icon: 'bx-car',
              link: 'etats',
              },
        ]
    },
    {
        id: 5,
        label: 'Autorisations',
        icon: 'bx-car',
        link: 'autorisations',
    },
    {
        id: 7,
        label: 'entites',
        icon: 'bx-car',
        link: 'entites',
    },
    {
        id: 22,
        label: 'Avancements',
        link: 'avancements',
        icon: 'bx-car',
    },
    {
        id: 21,
        label: 'Salaire Bases',
        icon: 'bx-bitcoin',
        link: 'salaire-bases',
    },
    {
        id: 21,
        label: 'Definition',
        icon: 'bx-bitcoin',
        subItems: [
            {
                id: 5,
                label: 'Echelons',
                icon: 'bx-car',
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
                label: 'Type de primes',
                link: 'type-primes',
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
                id: 22,
                label: 'Type etats',
                link: 'type-etats',
                parentId: 21
            },
            /*{
                id: 22,
                label: 'Type prelevements',
                link: 'type-prelevements',
                parentId: 21
            },*/
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
    {
        id: 22,
        label: 'Archives',
        icon: 'bx-car',
        subItems: [{
          id: 5,
          label: 'Fiches de paie',
          icon: 'bx-car',
          link: 'archives',
      }, {
          id: 5,
          label: 'Fiches de salaire',
          icon: 'bx-car',
          link: 'archives-fiche-salaire',
      },]
    },

];



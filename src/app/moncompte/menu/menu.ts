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
        label: 'Profil',
        icon: 'bx-user-pin',
        link: 'profil',
    },
    {
        id: 9,
        label: 'Paramètre',
        icon: 'bx-chip',
        link: 'parametre',
    },
    {
        id: 10,
        label: 'Historique',
        icon: 'bx-data',
        link: 'historique',
    }
];


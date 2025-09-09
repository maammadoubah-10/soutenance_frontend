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
        label: 'Permissions',
        icon: 'bxs-lock-open',
        link: 'permissions',
    },
    {
        id: 6,
        label: 'Rôles',
        icon: 'bxs-group',
        link: 'roles',
    },
    {
        id: 7,
        label: 'Utilisateurs',
        icon: 'bxs-user',
        link: 'utilisateurs',
    },
            
    
];


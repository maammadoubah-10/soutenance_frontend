import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS',
        isTitle: true
    },
    {
        id: 2,
        label: 'DASHBOARDS',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'BADGE',
        },
        subItems: [
            {
                id: 3,
                label: 'DASHBOARDS.LIST.DEFAULT',
                link: '/',
                parentId: 2
            },
            {
                id: 4,
                label: 'DASHBOARDS.LIST.SAAS',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'DASHBOARDS.LIST.CRYPTO',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'DASHBOARDS.LIST.BLOG',
                link: '/',
                parentId: 2
            },
        ]
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'APPS.TEXT',
        isTitle: true
    },
    {
        id: 9,
        label: 'CALENDAR.TEXT',
        icon: 'bx-calendar',
        link: '/',
    },
    {
        id: 10,
        label: 'CHAT.TEXT',
        icon: 'bx-chat',
        link: '/',
        
    },
    {
        id: 11,
        label: 'FILEMANAGER.TEXT',
        icon: 'bx-file',
        link: '/',
        badge: {
            variant: 'success',
            text: 'BADGE',
        },
    },
    {
        id: 12,
        label: 'ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 13,
                label: 'ECOMMERCE.LIST.PRODUCTS',
                link: '/',
                parentId: 12
            },
            {
                id: 14,
                label: 'ECOMMERCE.LIST.PRODUCTDETAIL',
                link: '/',
                parentId: 12
            },
            {
                id: 15,
                label: 'ECOMMERCE.LIST.ORDERS',
                link: '/',
                parentId: 12
            },
            {
                id: 16,
                label: 'ECOMMERCE.LIST.CUSTOMERS',
                link: '/',
                parentId: 12
            },
            {
                id: 17,
                label: 'ECOMMERCE.LIST.CART',
                link: '/',
                parentId: 12
            },
            {
                id: 18,
                label: 'ECOMMERCE.LIST.CHECKOUT',
                link: '/',
                parentId: 12
            },
            {
                id: 19,
                label: 'ECOMMERCE.LIST.SHOPS',
                link: '/',
                parentId: 12
            },
            {
                id: 20,
                label: 'ECOMMERCE.LIST.ADDPRODUCT',
                link: '/',
                parentId: 12
            },
        ]
    },
    {
        id: 21,
        label: 'CRYPTO.TEXT',
        icon: 'bx-bitcoin',
        subItems: [
            {
                id: 22,
                label: 'CRYPTO.LIST.WALLET',
                link: '/',
                parentId: 21
            },
            {
                id: 23,
                label: 'CRYPTO.LIST.BUY/SELL',
                link: '/',
                parentId: 21
            },
            {
                id: 24,
                label: 'CRYPTO.LIST.EXCHANGE',
                link: '/',
                parentId: 21
            },
            {
                id: 25,
                label: 'CRYPTO.LIST.LENDING',
                link: '/',
                parentId: 21
            },
            {
                id: 26,
                label: 'CRYPTO.LIST.ORDERS',
                link: '/',
                parentId: 21
            },
            {
                id: 27,
                label: 'CRYPTO.LIST.KYCAPPLICATION',
                link: '/',
                parentId: 21
            },
            {
                id: 28,
                label: 'CRYPTO.LIST.ICOLANDING',
                link: '/',
                parentId: 21
            }
        ]
    },
    {
        id: 29,
        label: 'EMAIL.TEXT',
        icon: 'bx-envelope',
        subItems: [
            {
                id: 30,
                label: 'INBOX',
                link: '/',
                parentId: 29
            },
            {
                id: 31,
                label: 'READEMAIL',
                link: '/',
                parentId: 29
            },
            {
                id: 32,
                label: 'TEMPLATE.TEXT',
                badge: {
                    variant: 'success',
                    text: 'TEMPLATE.BADGE',
                },
                parentId: 29,
                subItems: [
                    {
                        id:33 ,
                        label: 'TEMPLATE.LIST.BASIC',
                        link: '/',
                        parentId:32 
                    },
                    {
                        id:34 ,
                        label: 'TEMPLATE.LIST.ALERT',
                        link: '/',
                        parentId:32 
                    },
                    {
                        id:35 ,
                        label: 'TEMPLATE.LIST.BILLING',
                        link: '/',
                        parentId:32 
                    }
                ]
            }
        ]
    },
    {
        id: 36,
        label: 'INVOICES.TEXT',
        icon: 'bx-receipt',
        subItems: [
            {
                id: 37,
                label: 'INVOICES.LIST.INVOICELIST',
                link: '/',
                parentId: 36
            },
            {
                id: 38,
                label: 'INVOICES.LIST.INVOICEDETAIL',
                link: '/',
                parentId: 36
            },
        ]
    },
    {
        id: 39,
        label: 'PROJECTS.TEXT',
        icon: 'bx-briefcase-alt-2',
        subItems: [
            {
                id: 40,
                label: 'PROJECTS.LIST.GRID',
                link: '/',
                parentId: 38
            },
            {
                id: 41,
                label: 'PROJECTS.LIST.PROJECTLIST',
                link: '/',
                parentId: 38
            },
            {
                id: 42,
                label: 'PROJECTS.LIST.OVERVIEW',
                link: '/',
                parentId: 38
            },
            {
                id: 43,
                label: 'PROJECTS.LIST.CREATE',
                link: '/',
                parentId: 38
            }
        ]
    },
    {
        id: 44,
        label: 'TASKS.TEXT',
        icon: 'bx-task',
        subItems: [
            {
                id: 45,
                label: 'TASKS.LIST.TASKLIST',
                link: '/',
                parentId: 44
            },
            {
                id: 46,
                label: 'TASKS.LIST.KANBAN',
                link: '/',
                parentId: 44
            },
            {
                id: 47,
                label: 'TASKS.LIST.CREATETASK',
                link: '/',
                parentId: 44
            }
        ]
    },
    
];


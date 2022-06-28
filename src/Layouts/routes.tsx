import {Home,users,Invest,Ticket,poinTf,tiketTf,Deposit,Withdraw,History,Genealogy} from 'icons';


const Routes=[
    {
        link:'/',
        title:'Home',
        icon: Home,
        routes:[]
    },
    {
        link:'/mitra/new',
        title:'Tambah Mitra',
        icon: users,
        routes:[]
    },
    {
        link:'/genealogy',
        title:'Genealogy',
        icon: Genealogy,
        routes:[]
    },
    {
        link:'/investment/create',
        title:'Order Paket',
        icon: Invest,
        routes:[]
    },
    {
        link:'',
        title:'Tiket Aktivasi',
        icon: Ticket,
        routes:[
            {
                link:'/tiket/order',
                title:'Order Tiket',
                icon: Ticket,
                routes:[]
            },
            {
                link:'/tiket/transfer',
                title:'Transfer Tiket',
                icon: tiketTf,
                routes:[]
            },
        ]
    },
    {
        link:'/wallet/deposit',
        title:'e-Wallet',
        icon: Deposit,
        routes:[
             {
                link:'/wallet/deposit',
                title:'Deposit',
                icon: Deposit
            },
            {
                link:'/wallet/transfer/poin',
                title:'Transfer Poin Wallet',
                icon: poinTf
            },
            {
                link:'/wallet/withdrawal',
                title:'Penarikan',
                icon: Withdraw
            },
        ]
    },
    {
        link:'',
        title:'Laporan',
        icon: History,
        routes:[
            {
                link:'/transaksi',
                title:'Riwayat Transaksi',
                icon: History
            },
            {
                link:'/investment/report',
                title:'Riwayat Investment',
                icon: History
            },
            {
                link:'/wallet/deposit/report',
                title:'Riwayat Deposit',
                icon: History
            },
            {
                link:'/wallet/withdrawal/report',
                title:'Riwayat Penarikan',
                icon: History
            },
            {
                link:'/tiket/report',
                title:'Riwayat Tiket',
                icon: History
            }
        ]
    },
    // {
    //     link:'/mou',
    //     title:'E-MoU',
    //     icon: Download,
    //     routes:[]
    // },
    
  

]

export default Routes;
import { createRouter, createWebHistory } from 'vue-router';
import PageHome from '@/views/PageHome.vue';
import BoardList from '@/views/board/BoardList.vue';
import HomePage from "@/views/componentpage/HomePage.vue";
import AccountLoginPage from "@/views/componentpage/AccountLoginPage.vue";
import SellerPage from "@/views/componentpage/SellerPage.vue";
import SellerPageSCSC from "@/views/componentpage/SellerSCSC.vue";
import AdminPageSCS from "@/views/componentpage/AdminPageSCS.vue";

const routes = [
    {
        path: '/',
        name: 'PageHome',
        component: PageHome
    },
    {
        path: '/about',
        name: 'PageAbout',
        component: () => import(/* webpackChunkName: "about" */ '../views/PageAbout.vue')
    },
    {
        path: '/board/list',
        name: 'BoardList',
        component: BoardList
    },
    {
        path: '/home',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/account/login',
        name: 'AccountLoginPage',
        component: AccountLoginPage
    },
    {
        path: '/seller',
        name: 'SellerPage',
        component: SellerPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/scs',
        name: 'AdminPageSCS',
        component: AdminPageSCS,
        meta: { requiresAuth: true, requiresSpecialAccess: true }  // Add meta field for special access
    },
    {
        path: '/seller/scsc',
        name: 'SellerPageSCSC',
        component: SellerPageSCSC,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const specialAccess = localStorage.getItem('user_typ_cd') === 'U02';

    console.log('Token:', token);
    console.log('Special Access:', specialAccess);
    console.log('To Route Meta:', to.meta);

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            console.log('Redirecting to login due to no token');
            next({ name: 'AccountLoginPage' }); // Redirect to login page if not authenticated
        } else if (to.matched.some(record => record.meta.requiresSpecialAccess) && !specialAccess) {
            console.log('Redirecting to login due to lack of special access');
            next({ name: 'AccountLoginPage' }); // Redirect to login page if special access is required and not granted
        } else {
            next(); // Allow navigation
        }
    } else {
        next();// Always allow navigation if no authentication required
    }
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import BoardList from '@/views/board/BoardList.vue'
import CustomerPage from "@/views/componentpage/CustomerPage.vue";
import AgentPage from "@/views/componentpage/AgentPage.vue";
import AdminPageSS from "@/views/componentpage/AdminPageSS.vue";
import AdminPageSC from "@/views/componentpage/AdminPageSC.vue";


const routes = [
    {
        path: '/',
        name: 'PageHome',
        component: PageHome
    },
    {
        path: '/about',
        name: 'PageAbout',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/PageAbout.vue')
    },
    {
        path: '/board/list',
        name: 'BoardList',
        component: BoardList
    },
    {
        path: '/customer',
        name: 'CustomerPage',
        component: CustomerPage
    },
    {
        path: '/agent',
        name: 'AgentPage',
        component: AgentPage
    },
    {
        path: '/admin/salessettlement',
        name: 'AdminPageSS',
        component: AdminPageSS
    },
    {
        path: '/admin/settlementcompleted',
        name: 'AdminPageSC',
        component: AdminPageSC
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
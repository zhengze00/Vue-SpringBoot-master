import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import BoardList from '@/views/board/BoardList.vue'
import ComponentPage from '@/views/componentpage/ComponentPage.vue'
import ManageNumber from '@/views/componentpage/ManageNumber.vue'
import OwnerSoldCostList from '@/views/componentpage/OwnerSoldCostList.vue'


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
        path: '/componentpage/component',
        name: 'ComponentPage',
        component: ComponentPage
    },
    {
        path: '/componentpage/manage',
        name: 'ManageNumber',
        component: ManageNumber
    },
    {
        path: '/componentpage/costlist',
        name: 'OwnerSoldCostList',
        component: OwnerSoldCostList
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
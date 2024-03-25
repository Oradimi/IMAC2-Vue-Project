import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router"
import ShipGallery from "./pages/ShipGallery.vue"
// import EquipmentGallery from "./pages/EquipmentGallery.vue"

const routes = [
    { path: '/ships', component: ShipGallery },
    // { path: '/equipment', component: EquipmentGallery },
    { path: '/:pathMatch(.*)', redirect: '/ships'}
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')

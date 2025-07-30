import Vue from 'https://unpkg.com/vue@2.7.16/dist/vue.esm.browser.js'
import VueRouter from 'https://unpkg.com/vue-router@3.6.5/dist/vue-router.esm.browser.js'


Vue.use(VueRouter)

import Home from '../pages/Home.js'
import LoginPage from '../pages/LoginPage.js'
import UserDashboard from '../pages/User/UserDashboard.js'
import AdminDashboard from '../pages/Admin/AdminDashboard.js'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: LoginPage },
  { path: '/user_dashboard', component: UserDashboard},
  { path: '/admin_dashboard', component: AdminDashboard},

]

const router = new VueRouter({
  routes
})


export default router;

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Categories from '../views/goods/Categories.vue'
import Params from '../views/goods/Params.vue'
import GoodsList from '../views/goods/GoodsList.vue'
import Add from '../views/goods/Add.vue'
import Order from '../views/order/Order.vue'
import Report from '../views/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', name: 'Users', component: Users },
      { path: '/rights', name: 'Rights', component: Rights },
      { path: '/roles', name: 'Roles', component: Roles },
      { path: '/categories', name: 'Categories', component: Categories },
      { path: '/params', name: 'Params', component: Params },
      { path: '/goods', name: 'GoodsList', component: GoodsList },
      { path: '/goods/add', name: 'Add', component: Add },
      { path: '/orders', name: 'Order', component: Order },
      { path: '/reports', name: 'Report', component: Report }
    ]
  },
  { path: '*', name: '404', redirect: '/home/welcome' }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 判断是否是登录页
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  // 若没有token就跳转到登录页
  if (!token) return next('/login')
  next()
})

export default router

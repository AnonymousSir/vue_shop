import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunckName: "group-login" */ '@/views/Login.vue')
const Home = () => import(/* webpackChunckName: "group-home" */ '@/views/Home.vue')
const Users = () => import(/* webpackChunckName: "group-users" */ '@/views/users/Users.vue')
const Rights = () => import(/* webpackChunckName: "group-power" */ '@/views/power/Rights.vue')
const Roles = () => import(/* webpackChunckName: "group-power" */ '@/views/power/Roles.vue')
const Categories = () => import(/* webpackChunckName: "group-cate" */ '@/views/goods/Categories.vue')
const Params = () => import(/* webpackChunckName: "group-cate" */ '@/views/goods/Params.vue')
const GoodsList = () => import(/* webpackChunckName: "group-goods" */ '@/views/goods/GoodsList.vue')
const Add = () => import(/* webpackChunckName: "group-goods" */ '@/views/goods/Add.vue')
const Order = () => import(/* webpackChunckName: "group-order" */ '@/views/order/Order.vue')
const Report = () => import(/* webpackChunckName: "group-report" */ '@/views/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/users',
    children: [
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

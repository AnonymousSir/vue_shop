import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'

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
      { path: '/users', name: 'Users', component: Users }
    ]
  }
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

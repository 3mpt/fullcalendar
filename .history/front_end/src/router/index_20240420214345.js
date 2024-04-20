import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Even from '../components/Even.vue'
import Users from '../components/Users.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login',name:'login', component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome},
        { path: '/user', component: Users },
        { path: '/even', component: Even },
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  let isAuthenticated = sessionStorage.getItem("token")
  if(to.name!=="login"&&!isAuthenticated){
    alert("请先登录");
    next({
      name:"login"    
  })
  } 
  else next(    
  )
}    
)
router.beforeEach((to,from,next)=>{
  this.role = this.$store.getters.getUserRole;
  if(to.name!=="login"&&!isAuthenticated){
    alert("您不是管理员");
    next({
      name:"welcome"    
  })
  } 
  else next(    
  )
}    
)
export default router

import { createRouter,createWebHashHistory } from 'vue-router'; // 导入 Vue Router 中的相关函数
import store from '../store/index.js'; // 导入 Vuex 中的 createStore 函数
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login',name:'login', component: ()=>import('../components/Login.vue')
    },
    {
      path: '/home',
      component: ()=>import('../components/Home.vue'),
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: ()=>import('../components/Welcome.vue')},
        { path: '/user', component: ()=>import('../components/Users.vue') },
        { path: '/even', component: ()=>import('../components/Even.vue') },
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
router.beforeEach((to, from, next) => {
  // 获取当前用户的角色信息
  const userRole = store.state.userRole;

  // 判断是否访问的是 /user 页面
  if (to.path === '/user') {
    // 如果角色不是 1，则禁止访问
    if (userRole !== 1) {
      alert('您没有权限访问该页面！');
      // 重定向到其他页面，比如首页
      next('/welcome');
    } else {
      // 如果角色是 1，允许访问
      next();
    }
  } else {
    // 如果不是访问 /user 页面，则直接放行
    next();
  }
});
router.beforeEach((to, from, next) => {
  // 获取当前用户的角色信息
  const userRole = store.state.userRole;
  // 判断是否访问的是 /user 页面
  if (to.path === '/even') {
    // 如果角色不是 1，则禁止访问
    if (userRole !== 1) {
      alert('您没有权限访问该页面！');
      // 重定向到其他页面，比如首页
      next('/welcome');
    } else {
      // 如果角色是 1，允许访问
      next();
    }
  } else {
    // 如果不是访问 /user 页面，则直接放行
    next();
  }
});
export default router ; 

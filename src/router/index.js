import Vue from 'vue'
import VueRouter from 'vue-router'




Vue.use(VueRouter)


// 4.暴露出去


import login from '../views/login'
import home from '../views/home'
import article from '../views/home/article/index.vue'
import publish from '../views/home/publish/index.vue'
import comment from '../views/home/comment/index.vue'
import manage from '../views/home/manage/index.vue'
import acount from '../views/home/acount/index.vue'


const routes = [
  { path: '/login', component: login },
  { path: '/', redirect: '/login' },
  {
    path: '/home', component: home,
    children: [
      { path: '/article', component: article },
      { path: '/publish', component: publish,name:'add' },
      { path: '/edit/:id', component: publish,name:'edit' },
      { path: '/comment', component: comment },
      { path: '/manage', component: manage },
      { path: '/acount', component: acount }
    ]
  },
]

import '../utils/http'

const router = new VueRouter({
  routes,
})


import nprogress from 'nprogress'
import 'nprogress/nprogress.css'


router.beforeEach((to, from, next) => {

  nprogress.start()

  // window.console.log(to)
  // window.console.log(from)
  // next();
  if (to.path == "/login") {
    // 如果去的是登录页面直接放行
    next();

  } else {

    //别的页面要判断是否有登录
    let str = window.localStorage.getItem('userInfo');
    if (str) {

      //有值代表登录了，就放行
      next()

    } else {

      Vue.prototype.$message.error('请先登录！');
      // router.push('/login');
      // 下面这句和上面这句都能实现
      next('/login');
    }
  }
})

import store from '../store/index'

// 导航后置守卫
// to:到哪了
// from:从哪来
router.afterEach((to) => {

  setTimeout(() => {
    nprogress.done();
  }, 500);
  store.commit('changeActive',to.path)
})


export default router
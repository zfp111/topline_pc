import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'


import './assets/base.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

// import './unitl/http' 
import store from './store/index'

import router from './router/index'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')

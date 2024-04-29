import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import store from './store'
import 'element-plus/theme-chalk/index.css'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app =createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(router)
app.use(ElementPlus)
app.use(store)

axios.defaults.baseURL = 'http://127.0.0.1:7000'
axios.defaults.headers['Content-Type'] = 'application/json'
// app.prototype.$http = axios
app.mount('#app');

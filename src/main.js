import Vue from 'vue'
import ElementUI from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import App from './App'
// require('es6-promise').polyfill()
// require('es6-promise/auto')
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/styles/index.scss' // global css

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

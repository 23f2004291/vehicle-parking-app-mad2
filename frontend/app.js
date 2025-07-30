import Vue from 'https://unpkg.com/vue@2.7.16/dist/vue.esm.browser.js'
import Vuex from 'https://unpkg.com/vuex@3.6.2/dist/vuex.esm.browser.js'

Vue.use(Vuex);

import router from './utils/router.js'
import Navbar from './components/Navbar.js'
import store from './utils/store.js'

new Vue({
  el: '#app',
  store,
  router,
  components: { Navbar },
  template: `
  <div>
  <Navbar />
  </br>
  <router-view></router-view>
  </div>
  `,
})

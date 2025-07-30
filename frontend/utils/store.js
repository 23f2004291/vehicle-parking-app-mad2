import Vue from 'https://unpkg.com/vue@2.6.14/dist/vue.esm.browser.js';
import Vuex from 'https://unpkg.com/vuex@3.6.2/dist/vuex.esm.browser.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth_token: null,
    role: null,
    loggedIn: false,
    user_id: null,
  },

  mutations: {
    setUser(state, user) {
      // If user not passed, get it from localStorage
      if (!user) {
        try {
          user = JSON.parse(localStorage.getItem('user'));
        } catch (err) {
          user = null;
        }
      }

      if (!user) {
        // No user or invalid JSON
        state.auth_token = null;
        state.role = null;
        state.loggedIn = false;
        state.user_id = null;
        return;
      }

      state.auth_token = user.token || null;
      state.role = user.role || null;
      state.loggedIn = !!user.token;
      state.user_id = user.id || null;
    },


    logout(state) {
      state.auth_token = null;
      state.role = null;
      state.loggedIn = false;
      state.user_id = null;
      localStorage.removeItem('user');
    }
  },

  actions: {
    // Define async login/logout later if needed
  }
});



try {
  store.commit('setUser');
  console.log('[Vuex] Store initialized:', store.state);
} catch (err) {
  console.warn('[Vuex] Store initialization failed:', err);
}

export default store;

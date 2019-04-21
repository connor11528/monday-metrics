import Vue from 'vue'
import Vuex from 'vuex'
import GoTrue from "gotrue-js";

Vue.use(Vuex)

// GoTrue dicumentation: https://github.com/netlify/gotrue
const auth = new GoTrue({
  APIUrl: "https://monday-metrics.netlify.com/.netlify/identity",
  audience: "",
  setCookie: false
});

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

export default new Vuex.Store({
  state: {
	currentUser: getSavedState("auth.currentUser"),
	loading: false,
	loggedIn: false,
	token: null,
	notifications: []
  },
  getters: {
  	loggedIn(state){
	  return !!state.currentUser;
	}
  },
  mutations: {
  	SET_CURRENT_USER(state, value){
	  state.currentUser = value;
	  saveState("auth.currentUser", value);
	},

	TOGGLE_LOAD(state){
	  state.loading = !state.loading;
	},

	ADD_NOTIFICATION(state, notification){
	  state.notifications.push(notification);
	},

	REMOVE_NOTIFICATION(state, notification){
	  state.notifications.splice(state.notifications.indexOf(notification), 1);
	},

  },
  actions: {
  	init({ dispatch }){
	  dispatch("validate");
	},
	validate({ commit, state }){
	  if (!state.currentUser){
	  	return Promise.resolve(null);
	  }

	  const user = auth.currentUser();

	  commit("SET_CURRENT_USER", user);

	  return user;
	},
	attemptLogin({ commit, dispatch }, credentials){
	  return new Promise((resolve, reject) => {
	    dispatch("attemptConfirmation", credentials).then(() => {

	      auth.login(credentials.email, credentials.password)
	        .then(response => {
	          resolve(response);
	          commit("SET_CURRENT_USER", response);
	        })
	        .catch(error => {
	          reject(error.json);
	        });
	    });
	  });
	},
	attemptConfirmation({ commit, dispatch }, credentials){
	  return new Promise((resolve, reject) => {
	    if (!credentials.token) {
	      resolve();
	      return;
	    }

	    auth.confirm(credentials.token)
	      .then(response => {
	        credentials.token = null;

	        dispatch("attemptLogin", credentials);

	        console.log(
	          "Confirmation email sent",
	          JSON.stringify({
	            response
	          })
	        );

	        resolve(response);
	      })
	      .catch(error => {
	        reject(error);
	        console.log(error);
	      });
	  });
	},
	attemptSignup({ commit }, credentials){
	  return new Promise((resolve, reject) => {

	    auth.signup(credentials.email, credentials.password)
	      .then(response => {
	        console.log("Confirmation email sent", response);
	        
	        commit("TOGGLE_LOAD");
	        resolve(response);
	      })
	      .catch(error => {
	        reject(error);
	        console.log("It's an error", error);
	      });
	  });
	},
	attemptLogout({ commit }){
	  return new Promise((resolve, reject) => {
	    const user = auth.currentUser();

	    user.logout()
	      .then(response => {
	        console.log(response);
	        resolve(response);
	        commit("SET_CURRENT_USER", null);
	      })
	      .catch(error => {
	        reject(error);
	        console.log("Could not log out", error);
	      });
	  })
    },
    addNotification({ commit }, notification){
	  commit("ADD_NOTIFICATION", notification);
	},
	removeNotification({ commit }, notification){
	  commit("REMOVE_NOTIFICATION", notification);
	}
  }
});

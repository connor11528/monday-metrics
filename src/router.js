import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        authRequired: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);

  if (!authRequired){
    return next();
  }

  // check if current user
  if (store.getters["auth/loggedIn"]) {
    // maybe do some validation to check token is valid //
    next()
  }
  
  next({ 
    name: "login", 
    query: { redirectFrom: to.fullPath } 
  });
});

export default router;
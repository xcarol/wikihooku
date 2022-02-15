import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/config';
import Layout from './views/Layout';
import ResetPassword from './views/ResetPassword';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('./views/layout/Home'),
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('./views/layout/Account'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import('./views/Confirm'),
  },
  {
    path: '/resetpass',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '*',
    redirect: '/',
  },
];

const Router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

Router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['session/isLoggedIn'];

  if (
    (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn)
    || (to.path === '/' && isLoggedIn && to.name !== 'Home')
  ) {
    next({ name: 'Home' });
    return;
  }

  next();
});

export default Router;

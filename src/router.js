import { createRouter, createWebHistory } from 'vue-router';
import store from './store/config';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/MainView.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('./views/AccountView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import('./views/ConfirmView.vue'),
  },
  {
    path: '/resetpass',
    name: 'ResetPassword',
    component: () => import('./views/ResetPassword.vue'),
  },
  {
    path: '/terms-of-service',
    name: 'terms',
    component: () => import('./views/TermsOfServiceView.vue'),
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('./views/HelpView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['session/isLoggedIn'];

  store.commit('viewTitle', '');

  if (
    (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn)
    || (to.path === '/' && isLoggedIn && to.name !== 'Home')
  ) {
    next({ name: 'Home' });
    return;
  }

  next();
});

export default router;

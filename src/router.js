import { createRouter, createWebHistory } from 'vue-router';
// import store from './store/config';
import Layout from './views/Layout.vue';
import ResetPassword from './views/ResetPassword.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('./views/layout/Home.vue'),
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('./views/layout/Account.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import('./views/Confirm.vue'),
  },
  {
    path: '/resetpass',
    name: 'ResetPassword',
    component: ResetPassword,
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

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = store.getters['session/isLoggedIn'];

//   if (
//     (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn)
//     || (to.path === '/' && isLoggedIn && to.name !== 'Home')
//   ) {
//     next({ name: 'Home' });
//     return;
//   }

//   next();
// });

export default router;

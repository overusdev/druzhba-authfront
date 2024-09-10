import { createRouter, createWebHistory } from "vue-router";
import MainPage from '../pages/Main.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: MainPage,
        },
    ],
  });

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth) && !store.getters['auth/isSignedIn']) {
//     next({ name: 'account-signin', query: { next: to.fullPath } })
//     } else {
//     next()
//     }
// })

export default router;
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwt');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
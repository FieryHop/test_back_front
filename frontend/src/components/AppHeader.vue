<template>
  <header>
    <h1>Task Manager</h1>
    <nav>
      <button v-if="isAuthenticated" @click="logout">Logout</button>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => !!authStore.user);

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

button {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #d32f2f;
}
</style>
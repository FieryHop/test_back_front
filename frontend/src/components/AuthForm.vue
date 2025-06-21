<template>
  <form @submit.prevent="submit" class="auth-form">
    <div v-if="error" class="error">{{ error }}</div>

    <input type="text" v-model="form.username" placeholder="Username" required>
    <input type="password" v-model="form.password" placeholder="Password" required>

    <button type="submit" class="auth-button">{{ isLogin ? 'Login' : 'Register' }}</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store';
import { useRouter } from 'vue-router';

const props = defineProps({
  isLogin: Boolean
});

const authStore = useAuthStore();
const router = useRouter();
const form = ref({ username: '', password: '' });
const error = ref(null);

const submit = async () => {
  if (props.isLogin) {
    await authStore.login(form.value);
  } else {
    await authStore.register(form.value);
  }

  if (authStore.error) {
    error.value = authStore.error;
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error {
  color: #e53935;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.auth-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.auth-button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.auth-button:active {
  transform: translateY(0);
}
</style>
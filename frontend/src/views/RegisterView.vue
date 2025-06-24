<template>
  <div class="auth-container">
    <h2>Register</h2>
    <AuthForm :isLogin="false" />
    <div class="auth-footer">
      <p>Already have an account?</p>
      <button @click="goToLogin" class="auth-link-button">Login</button>
    </div>
  </div>
</template>

<script setup>
import AuthForm from '@/components/AuthForm.vue';
  import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.auth-footer p {
  margin: 0;
  color: #666;
}

.auth-link-button {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 16px;
}

.auth-link-button:hover {
  background-color: rgba(66, 185, 131, 0.1);
  transform: translateY(-2px);
}
</style>

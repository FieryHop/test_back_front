<template>
  <div class="auth-container">
    <h2>Login</h2>
    <AuthForm :isLogin="true" />
  </div>
</template>

<script setup>
import AuthForm from '@/components/AuthForm.vue';
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
</style>
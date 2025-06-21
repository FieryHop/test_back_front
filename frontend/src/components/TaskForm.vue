<template>
  <form @submit.prevent="addTask">
    <input type="text" v-model="title" placeholder="Task title" required>
    <textarea v-model="description" placeholder="Description"></textarea>
    <button type="submit">Add Task</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useTaskStore } from '@/store';

const title = ref('');
const description = ref('');
const taskStore = useTaskStore();

const addTask = () => {
  taskStore.addTask({
    title: title.value,
    description: description.value
  });
  title.value = '';
  description.value = '';
};
</script>

<style scoped>
form { display: flex; flex-direction: column; gap: 10px; }
</style>
<template>
  <div>
    <div class="controls">
      <div class="filters">
        <button
          @click="setFilter('all')"
          :class="{ active: filter === 'all' }"
        >
          All
        </button>
        <button
          @click="setFilter('active')"
          :class="{ active: filter === 'active' }"
        >
          Active
        </button>
        <button
          @click="setFilter('completed')"
          :class="{ active: filter === 'completed' }"
        >
          Completed
        </button>
      </div>

      <div class="sorts">
        <button
          @click="setSort('newest')"
          :class="{ active: sort === 'newest' }"
        >
          Newest
        </button>
        <button
          @click="setSort('oldest')"
          :class="{ active: sort === 'oldest' }"
        >
          Oldest
        </button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="taskStore.tasks.length === 0" class="empty-state">
      No tasks found. Add your first task!
    </div>

    <transition-group name="task-list" tag="div">
      <div v-for="task in filteredTasks" :key="task.id">
        <TaskItem :task="task" />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTaskStore } from '@/store';
import TaskItem from './TaskItem.vue';

const taskStore = useTaskStore();
onMounted(() => taskStore.fetchTasks());

const filteredTasks = computed(() => taskStore.filteredTasks);
const error = computed(() => taskStore.error);
const filter = computed(() => taskStore.filter);
const sort = computed(() => taskStore.sort);

const setFilter = (newFilter) => {
  taskStore.setFilter(newFilter);
};

const setSort = (newSort) => {
  taskStore.setSort(newSort);
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filters, .sorts {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background-color: #f5f5f5;
}

button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.error {
  color: red;
  margin-bottom: 15px;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #888;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
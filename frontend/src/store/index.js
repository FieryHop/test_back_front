import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null
  }),
  actions: {
    async register(userData) {
      try {
        await api.register(userData);
        this.error = null;
        return true;
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed';
        return false;
      }
    },
    async login(credentials) {
      try {
        const response = await api.login(credentials);
        localStorage.setItem('jwt', response.data.access_token);

        // Получаем ID пользователя из токена
        const tokenParts = response.data.access_token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        this.user = { id: payload.sub };

        this.error = null;
        return true;
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed';
        return false;
      }
    },
    logout() {
      localStorage.removeItem('jwt');
      this.user = null;
    },
    // Восстановление состояния при загрузке страницы
    initialize() {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const tokenParts = token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          this.user = { id: payload.sub };
        } catch (e) {
          console.error('Token parse error:', e);
          localStorage.removeItem('jwt');
        }
      }
    }
  }
});

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    filter: 'all',
    sort: 'newest', // 'newest' или 'oldest'
    error: null
  }),
  getters: {
    filteredTasks() {
      let tasks = this.tasks;

      // Фильтрация по статусу
      if (this.filter === 'completed') {
        tasks = tasks.filter(task => task.status);
      } else if (this.filter === 'active') {
        tasks = tasks.filter(task => !task.status);
      }

      // Сортировка по дате
      return [...tasks].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        return this.sort === 'newest'
          ? dateB - dateA  // Новые сверху
          : dateA - dateB; // Старые сверху
      });
    }
  },
  actions: {
    async fetchTasks() {
      try {
        const response = await api.getTasks();

        // Убедитесь, что задачи имеют правильный формат
        this.tasks = response.data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '', // Добавлено для обработки null
          status: task.status,
          created_at: task.created_at || new Date().toISOString()
        }));

        console.log('Tasks loaded:', this.tasks);
      } catch (error) {
        this.error = 'Failed to fetch tasks';
        console.error('Error fetching tasks:', error);
      }
    },
    setSort(newSort) {
      this.sort = newSort;
    },

    async addTask(taskData) {
      try {
        const response = await api.createTask(taskData);
        const newTask = {
          ...taskData,
          id: response.data.id,
          created_at: new Date().toISOString(),
          status: false
        };
        this.tasks.push(newTask);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to add task';
      }
    },

    async updateTask(id, updates) {
      try {
        await api.updateTask(id, updates);
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        }
        this.error = null;
      } catch (error) {
        if (error.response?.status === 403) {
          this.error = "You don't have permission to update this task";
        } else {
          this.error = error.response?.data?.error || 'Failed to update task';
        }
      }
    },

    async deleteTask(id) {
      try {
        await api.deleteTask(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.error = null;
      } catch (error) {
        if (error.response?.status === 403) {
          this.error = "You don't have permission to delete this task";
        } else {
          this.error = error.response?.data?.error || 'Failed to delete task';
        }
      }
    },

    setFilter(filter) {
      this.filter = filter;
    }
  }
});
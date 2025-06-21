<template>
  <div class="task" :class="{ completed: task.status }">
    <div v-if="!isEditing">
      <div class="task-header">
        <input
          type="checkbox"
          :checked="task.status"
          @change="toggleStatus"
          class="status-checkbox"
        >
        <h3 @click="startEditing" class="editable-title">{{ task.title }}</h3>

        <div class="task-actions">
          <button @click="startEditing" class="edit-btn">Edit</button>
          <button @click="confirmDelete" class="delete-btn">Delete</button>
        </div>
      </div>

      <p v-if="task.description" @click="startEditing" class="editable-description">
        {{ task.description }}
      </p>
      <small>{{ formatDateTime(task.created_at) }}</small>
    </div>

    <div v-else class="edit-form">
      <input
        type="text"
        v-model="editData.title"
        placeholder="Task title"
        class="edit-input"
        ref="titleInput"
        @keyup.enter="saveChanges"
        @keyup.esc="cancelEditing"
      >
      <textarea
        v-model="editData.description"
        placeholder="Description"
        class="edit-textarea"
      ></textarea>

      <div class="edit-buttons">
        <button @click="saveChanges" class="save-btn">Save</button>
        <button @click="cancelEditing" class="cancel-btn">Cancel</button>
      </div>
    </div>

    <div v-if="error" class="task-error">
      {{ error }}
      <button @click="error = ''">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { useTaskStore } from '@/store';

const props = defineProps(['task']);
const taskStore = useTaskStore();
const titleInput = ref(null);
const isEditing = ref(false);
const error = ref('');
const editData = reactive({
  title: '',
  description: ''
});

const startEditing = async () => {
  editData.title = props.task.title;
  editData.description = props.task.description;
  isEditing.value = true;

  // Фокусируемся на поле ввода после перехода в режим редактирования
  await nextTick();
  if (titleInput.value) {
    titleInput.value.focus();
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  error.value = '';
};

const saveChanges = async () => {
  if (!editData.title.trim()) {
    error.value = 'Title cannot be empty';
    return;
  }

  try {
    await taskStore.updateTask(props.task.id, {
      title: editData.title,
      description: editData.description
    });
    isEditing.value = false;
  } catch (e) {
    error.value = taskStore.error || 'Failed to update task';
  }
};

const toggleStatus = async () => {
  error.value = '';
  try {
    await taskStore.updateTask(props.task.id, {
      status: !props.task.status
    });
  } catch (e) {
    error.value = taskStore.error || 'Failed to update task status';
  }
};

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this task?')) {
    error.value = '';
    try {
      await taskStore.deleteTask(props.task.id);
    } catch (e) {
      error.value = taskStore.error || 'Failed to delete task';
    }
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.task {
  padding: 15px;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-checkbox {
  margin-right: 10px;
  cursor: pointer;
}

.editable-title {
  flex-grow: 1;
  margin: 0;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 18px;
}

.editable-title:hover {
  color: #42b983;
  text-decoration: underline;
}

.editable-description {
  cursor: pointer;
  transition: color 0.3s;
  margin: 8px 0;
  color: #555;
  line-height: 1.4;
}

.editable-description:hover {
  color: #42b983;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: 500;
}

.edit-btn {
  background-color: #ffc107;
  color: #333;
}

.edit-btn:hover {
  background-color: #e0a800;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #bd2130;
  transform: translateY(-1px);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.edit-input, .edit-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.edit-input:focus, .edit-textarea:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.edit-textarea {
  min-height: 80px;
  resize: vertical;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.save-btn, .cancel-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover {
  background-color: #218838;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.task-error {
  background-color: #ffebee;
  color: #b71c1c;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.task-error button {
  background: none;
  border: none;
  color: #b71c1c;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.task-error button:hover {
  color: #8e0c0c;
}

small {
  color: #888;
  font-size: 12px;
  display: block;
  margin-top: 5px;
}

.completed .editable-title,
.completed .editable-description {
  text-decoration: line-through;
  opacity: 0.7;
}

.completed .task {
  background-color: #f8f9fa;
}
</style>
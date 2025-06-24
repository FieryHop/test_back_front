import axios from 'axios';

const api = axios.create({
  baseURL: 'https://test-back-front-5.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});



api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.url.startsWith(API_PREFIX)) {
    config.url = API_PREFIX + config.url;
  }
  return config;
});

api.interceptors.request.use(config => {
  console.log('Request:', config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(response => {
  console.log('Response:', response.config.url, response.data);
  return response;
}, error => {
  console.error('API Error:', error.response?.data || error.message);

  if (error.response?.status === 401 &&
      !error.response?.data?.error?.includes("Forbidden")) {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  }

  return Promise.reject(error);
});

export default {
  register(user) {
    return api.post('/register', user);
  },
  login(credentials) {
    return api.post('/login', credentials);
  },
  getTasks() {
    return api.get('/tasks');
  },
  createTask(task) {
    return api.post('/tasks', task);
  },
  updateTask(id, task) {
    return api.put(`/tasks/${id}`, task);
  },
  deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  }
};

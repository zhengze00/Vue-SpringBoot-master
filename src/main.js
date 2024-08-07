import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

const app = createApp(App);

app.config.globalProperties.$axios = axios;  // 设置全局变量
app.config.globalProperties.$serverUrl = '//localhost:8080'; // 设置服务器 URL

app.use(router).mount('#app');

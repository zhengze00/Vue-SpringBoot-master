<template>
  <PageHeader2/>
  <div class="layer-pop-wrap" style="display:block;">
    <div class="layer-pop-bg"></div>
    <div class="layer-pop-area" style="width: 400px">
      <div class="pop-head">
        <h3>Account Login</h3>
      </div>
      <div class="pop-body">
        <div class="input-group">
          <input
              v-model="user_nm"
              type="text"
              class="pop-input"
              placeholder="Username: admin / seller"
              @keyup.enter="handleLogin"
          >
          <input
              v-model="user_pw"
              type="password"
              class="pop-input"
              placeholder="Password: 123456"
              @keyup.enter="handleLogin"
          >
        </div>
        <div class="pop-btn-area">
          <router-link to="/" class="pop-btn">Return</router-link>
          <button @click="handleLogin" class="pop-btn type2">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PageHeader2 from "@/components/PageHeader2.vue";

export default {
  components: {PageHeader2},
  data() {
    return {
      user_nm: '',
      user_pw: '',
    };
  },

  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8081/login', {
          user_nm: this.user_nm,
          user_pw: this.user_pw,
        });

        if (response.data.code === 1) {
          const userData = response.data.data;

          // 保存 JWT 和用户信息到本地存储
          localStorage.setItem('token', userData.token);
          localStorage.setItem('user_id', userData.user_id);
          localStorage.setItem('user_typ_cd', userData.user_typ_cd);
          localStorage.setItem('rgst_nm', userData.rgst_nm);

          localStorage.setItem('user_nm', userData.user_nm); // 添加这一行
          localStorage.setItem('user_contact', userData.user_contact); // 添加这一行
          localStorage.setItem('user_bank_acc', userData.user_bank_acc); // 添加这一行

          // 跳转到主页面
          this.$router.push('/seller');
        } else {
          alert('Wrong username or password. Please try again');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  }
}
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
</style>

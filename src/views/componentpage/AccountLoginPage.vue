<template>
  <div class="layer-pop-wrap" style="display:block;">
    <div class="layer-pop-bg"></div>
    <div class="layer-pop-area" style="width: 400px">
      <div class="pop-head">
        <h3>GoodLuckVIPStore CMS</h3>
      </div>
      <div class="pop-body">
        <div class="input-group">
          <input v-model="user_nm" type="text" class="pop-input" placeholder="Username: admin / seller">
          <input v-model="user_pw" type="password" class="pop-input" placeholder="Password: 123456">
        </div>
        <div class="pop-btn-area">
          <router-link to="/home" class="pop-btn">Return</router-link>
          <button @click="handleLogin" class="pop-btn type2">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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

        if (response.data.code===1) {
          // 保存 JWT 到本地存储
          localStorage.setItem('token', response.data.data);
          // 跳转到主页面
          this.$router.push('/seller');
        } else {
          alert('Invalid pw');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
</style>

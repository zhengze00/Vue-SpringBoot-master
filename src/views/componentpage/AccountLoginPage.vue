
<template>


  <!-- layer-pop-wrap : S -->
  <div class="layer-pop-wrap" style="display:block;">
    <div class="layer-pop-bg"></div>
    <div class="layer-pop-area" style="width: 400px">
      <div class="pop-head">
        <h3>GoodLuckVIPStore CMS</h3>
      </div>
      <div class="pop-body">
        <!-- 删除现有的文本 -->
        <div class="input-group">
          <input type="text" class="pop-input" placeholder="Username:  admin / seller ">
          <input type="password" class="pop-input" placeholder="Password: 123456">
        </div>
        <div class="pop-btn-area">
          <router-link to="/home" class="pop-btn">Return</router-link>
          <router-link to="/seller" class="pop-btn type2">Login</router-link>
        </div>
      </div>
    </div>
  </div>
  <!-- layer-pop-wrap : E -->
</template>


<script>

import axios from 'axios';

export default {
  data() {
    return {
      salePhnNums: [],
      exchangeRate: 1,
      showModal: false
    };
  },

  components: {

  },

  created() {
    this.fetchSalePhnNums();
  },
  methods: {
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://localhost:8081/getSalePhnNum');
        this.salePhnNums = response.data.salePhnNums;
        this.exchangeRate = parseFloat(response.data.exchangeRate); // 获取汇率
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    }
  }



};



</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
</style>
<template>
  <div class="wrap">
    <!-- header : S -->
    <header class="header">
      <div class="inner">
        <h1 class="logo">
          <router-link to="/home">
            <img src="../images/glvs_logo.png" alt="로고" />
          </router-link>
        </h1>
        <nav class="gnb-area">
          <ul class="gnb-menu">
            <li>
              <span class="allmenu-btn">ALLMENU</span>
              <ul class="sub_menu">
                <li @click="showModal = true">Personal Data</li>
                <li @click="showModal1 = true">Change Password</li>
                <li @click="logout">Logout                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="modal" :class="{ show: showModal }" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Personal Data</h2>
          <span class="close-btn" @click="showModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <p>Username:</p>
            <p>(WhatsApp) Contact Number:</p>
            <p>Owner Name:</p>
            <p>Bank Account:</p>
          </div>
          <div class="modal-section">
            <input v-model="userData.rgst_nm" type="text" class="input-gray" />
            <input v-model="userData.sale_contact" type="text" class="input-gray" />
            <input v-model="userData.rgst_nm" type="text" class="input-gray" />
            <input v-model="userBankAcc" type="text" class="input-gray" />
          </div>
        </div>
        <div id="app">
          <div class="btn-area">
            <a class="close-btn" @click="showModal = false">Cancel</a>
            <a class="next" @click="submitData">Submit</a>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ show: showModal1 }" @click.self="showModal1 = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Change Password</h2>
          <span class="close-btn" @click="showModal1 = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <p>Current Password:</p>
            <p>New Password:</p>
            <p>Confirm New Password:</p>
          </div>
          <div class="modal-section">
            <input v-model="userData.rgst_nm" type="text" class="input-gray" />
            <input v-model="userData.sale_contact" type="text" class="input-gray" />
            <input v-model="userData.rgst_nm" type="text" class="input-gray" />
          </div>
        </div>
        <div id="app">
          <div class="btn-area">
            <a class="close-btn" @click="showModal1 = false">Cancel</a>
            <a class="next" @click="submitData">Submit</a>
          </div>
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
      showModal: false,
      showModal1: false,
      userData: {
        rgst_nm: '',
        sale_contact: ''
      },
      userBankAcc: '',
      username: '',
      contactNumber: '',
      ownerName: '',
      bankAccount: ''
    };
  },

  async created() {
    await this.fetchUserData();
  },

  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get('http://localhost:8081/getUserData');
        this.userData = response.data.glvs_sale_phn_num; // 根据实际数据结构调整
        this.userBankAcc = response.data.glvs_user.user_bank_acc;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    async submitData() {
      try {
        const payload = {
          rgst_nm: this.username,
          sale_contact: this.contactNumber,
          owner_name: this.ownerName,
          user_bank_acc: this.bankAccount
        };
        await axios.post('http://localhost:8081/updateUserData', payload);
        this.showModal = false;
        this.showModal1 = false;
        alert('Data updated successfully!');
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    },

    logout() {
      this.$router.push('/home');
    }
  }
};
</script>



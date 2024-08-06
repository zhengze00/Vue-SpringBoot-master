<template>
  <div class="wrap">
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
                <li @click="logout">Logout</li>
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
            <input v-model="userData.user_nm" type="text" class="input-gray" />
            <input v-model="userData.user_contact" type="text" class="input-gray" />
            <input v-model="userData.rgst_nm" type="text" class="input-gray" />
            <input v-model="userData.user_bank_acc" type="text" class="input-gray" />
          </div>
        </div>
        <div class="btn-area">
          <a class="close-btn" @click="showModal = false">Cancel</a>
          <a class="next" @click="submitData">Submit</a>
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
            <input v-model="passwordData.currentPassword" type="password" class="input-gray" />
            <input v-model="passwordData.newPassword" type="password" class="input-gray" />
            <input v-model="passwordData.confirmNewPassword" type="password" class="input-gray" />
          </div>
        </div>
        <div class="btn-area">
          <a class="close-btn" @click="showModal1 = false">Cancel</a>
          <a class="next" @click="changePassword">Submit</a>
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
        user_nm: '',
        user_contact: '',
        rgst_nm: '',
        user_bank_acc: ''
      },
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    };
  },

  async created() {
    await this.fetchUserData();
  },

  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage 中
        const response = await axios.get('http://localhost:8081/getUserData', {
          params: { user_nm: localStorage.getItem('user_nm') },
          headers: {
            'Authorization': `Bearer ${token}` // 如果 token 是作为 Bearer token 发送的
          }
        });
        if (response.data && response.data.data) {
          this.userData = response.data.data;
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    async submitData() {
      console.log('Submit button clicked');
      try {
        const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage 中
        const response = await axios.post('http://localhost:8081/updateUserData', this.userData, {
          headers: {
            'Authorization': `Bearer ${token}` // 如果 token 是作为 Bearer token 发送的
          }
        });
        console.log('API response:', response.data);
        if (response.data.success) {
          this.showModal = false;
          alert('Data updated successfully!');
        } else {
          alert('Failed to update data.');
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    },

    async changePassword() {
      if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
        alert('New passwords do not match!');
        return;
      }

      try {
        const token = localStorage.getItem('token'); // 假设 token 存储在 localStorage 中
        await axios.post('http://localhost:8081/changePassword', this.passwordData, {
          headers: {
            'Authorization': `Bearer ${token}` // 如果 token 是作为 Bearer token 发送的
          }
        });
        this.showModal1 = false;
        alert('Password changed successfully!');
      } catch (error) {
        console.error('Error changing password:', error);
      }
    },

    logout() {
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped>
/* 你的样式 */
</style>

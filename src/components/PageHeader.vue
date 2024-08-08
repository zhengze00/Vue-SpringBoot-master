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
                <li @click="openPersonalDataModal">Personal Data</li>
                <li @click="openChangePasswordModal">Change Password</li>
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
            <p>Owner Name:</p>
            <p>Username:</p>
            <p>(WhatsApp) Contact Number:</p>
            <p>Bank Account:</p>
          </div>
          <div class="modal-section">
            <input v-model="updateForm.rgstName" readonly />
            <input v-model="updateForm.userName" />
            <input v-model="updateForm.userContact" />
            <input v-model="updateForm.userBankAccount" />
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
            <p>Owner Name:</p>
            <p>Current Password:</p>
            <p>New Password:</p>
            <!--
                        <p>Confirm New Password:</p>
            -->
          </div>
          <div class="modal-section">
            <input v-model="updateForm1.rgstName" readonly />
            <input v-model="updateForm1.currentPassword" type="password" class="input-gray" />
            <input v-model="updateForm1.newPassword" type="password" class="input-gray" />
            <!--            <input v-model="updateForm1.confirmNewPassword" type="password" class="input-gray" />-->
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
      updateForm1: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      updateForm: {
        userId: '',
        userName: '',
        userContact: '',
        rgstName: '',
        userBankAccount: ''
      }
    };
  },
  methods: {
    openPersonalDataModal() {
      this.showModal = true;
      this.updateForm.rgstName = localStorage.getItem('rgst_nm') || '';
      this.updateForm.userName = localStorage.getItem('userName') || ''; // Assuming you want to load additional data
      this.updateForm.userContact = localStorage.getItem('userContact') || ''; // Assuming you want to load additional data
      this.updateForm.userBankAccount = localStorage.getItem('userBankAccount') || ''; // Assuming you want to load additional data
    },
    openChangePasswordModal() {
      this.showModal1 = true;
      this.updateForm1.rgstName = localStorage.getItem('rgst_nm') || '';
      // Optionally load additional data if needed
    },
    submitData() {
      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/updateUserData', {
        user_id: this.updateForm.userId,
        user_nm: this.updateForm.userName,
        user_contact: this.updateForm.userContact,
        rgst_nm: this.updateForm.rgstName,
        user_bank_acc: this.updateForm.userBankAccount,
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Data updated successfully!');
            this.showModal = false;
            this.updateForm = {
              userId: '',
              userName: '',
              userContact: '',
              rgstName: '',
              userBankAccount: ''
            };
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting data.');
          });
    },
    changePassword() {
      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/changePassword', {
        user_nm: this.updateForm.userName, // Ensure sending username if needed
        user_pw: this.updateForm1.newPassword,
        rgst_nm: this.updateForm1.rgstName
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Password changed successfully!');
            this.showModal1 = false;
            this.updateForm1 = {
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: ''
            };
          })
          .catch(error => {
            console.error('Error changing password:', error);
            alert('Error changing password.');
          });
    },
    logout() {
      localStorage.clear();
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
/* Add any additional styles here */
</style>

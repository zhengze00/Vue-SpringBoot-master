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

    <!-- Personal Data Modal -->
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
            <input
                v-model="updateForm.userName"
                type="text"
                @keyup.enter="submitData"
            />
            <input
                v-model="updateForm.userContact"
                type="text"
                @input="formatPhoneNumber"
                maxlength="13"
                @keyup.enter="submitData"
            />
            <input v-model="updateForm.userBankAcc" type="text" />
          </div>
        </div>
        <div class="btn-area">
          <a class="close-btn" @click="showModal = false">Cancel</a>
          <a class="next" @click="submitData">Submit</a>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal" :class="{ show: showModal1 }" @click.self="showModal1 = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Change Password</h2>
          <span class="close-btn" @click="showModal1 = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <p>New Password:</p>
          </div>
          <div class="modal-section">
            <input
                v-model="updateForm1.newPassword"
                type="password"
                class="input-gray"
                @keyup.enter="changePassword"
            />
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
        userPw: '',
        newPassword: '',
      },
      updateForm: {
        userId: '',
        userName: '',
        userContact: '',
        rgstName: '',
        userBankAcc: ''
      }
    };
  },
  methods: {
    openPersonalDataModal() {
      this.showModal = true;
      this.updateForm.rgstName = localStorage.getItem('rgst_nm') || '';
      this.updateForm.userName = localStorage.getItem('user_nm') || '';
      this.updateForm.userContact = localStorage.getItem('user_contact') || '';
      this.updateForm.userBankAcc = localStorage.getItem('user_bank_acc') || '';
    },
    openChangePasswordModal() {
      this.showModal1 = true;
      this.updateForm1.rgstName = localStorage.getItem('rgst_nm') || '';
    },
    submitData() {
      if (!this.updateForm.userName || !this.updateForm.userContact || !this.updateForm.userBankAcc) {
        alert('All fields must be filled out!');
        return;
      }

      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/updateUserData', {
        user_id: localStorage.getItem('user_id'),
        user_nm: this.updateForm.userName,
        user_contact: this.updateForm.userContact,
        rgst_nm: this.updateForm.rgstName,
        user_bank_acc: this.updateForm.userBankAcc,
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Data updated successfully!');
            this.showModal = false;
            localStorage.setItem('user_nm', this.updateForm.userName);
            localStorage.setItem('user_contact', this.updateForm.userContact);
            localStorage.setItem('user_bank_acc', this.updateForm.userBankAcc);
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting data.');
          });
    },
    changePassword() {
      if (!this.updateForm1.newPassword) {
        alert('New Password must be filled out!');
        return;
      }

      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/changePassword', {
        user_nm: this.updateForm.userName,
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
              newPassword: ''
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
    },
    formatPhoneNumber(event) {
      let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

      // Limit input length to 11 digits
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Format the phone number
      if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      }
      if (value.length > 8) {
        value = value.slice(0, 8) + '-' + value.slice(8);
      }

      // Update the input field
      this.updateForm.userContact = value;
    }
  }
};
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
/* Add any additional styles here */
</style>

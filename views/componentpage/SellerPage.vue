<template>
  <PageHeader />
  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub on">
            <router-link to="/seller" class="active">SELLER</router-link>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a class="active">Manage Phone Number</a></li>
              <li><router-link to="/seller/scsc">Sales Commission Settlement Completed</router-link></li>
            </ul>
          </li>
          <li class="sub">
            <a href="#" @click.prevent="checkAdminAccess">ADMIN</a>
            <ul class="lnb-menu-sub"></ul>
          </li>
        </ul>
      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <h2 class="tit">Manage Phone Number</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>SELLER</li>
            <li>Manage Phone Number</li>
          </ul>
        </div>
        <div class="template min">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">
                <strong>Phone number:</strong>
                <span class="input-style">
                    <input type="text" v-model="phoneNumber" placeholder="" />
                  </span>
              </li>
              <li class="fix">
                <strong>Category:</strong>
                <span class="input-style">
                    <select v-model="category">
                      <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
                    </select>
                  </span>
              </li>
              <li class="fix">
                <strong>Price Range(Min):</strong>
                <span class="input-style">
                    <input type="text" v-model="priceMin" placeholder="" />
                  </span>
              </li>
              <li class="fix">
                <strong>Price Range(Max):</strong>
                <span class="input-style">
                    <input type="text" v-model="priceMax" placeholder="" />
                  </span>
              </li>
            </ul>
            <div class="search-btn">
              <button type="button" @click="search">Search</button>
              <button type="button" class="type2" @click="reset">Reset</button>
            </div>
            <div id="app">
              <div class="btn-area">
                <div class="search-btn">
                  <button type="button" class="type3 " @click="showModal = true">Upload Phone Number</button>
                </div>
              </div>
              <div class="modal" :class="{ show: showModal }" @click.self="showModal = false">
                <div class="modal-content" @keydown.enter="submitForm">
                  <div class="modal-header">
                    <h2>Upload Phone Number</h2>
                    <span class="close-btn close-btn-top-right" @click="showModal = false">×</span>
                  </div>
                  <div class="modal-body">
                    <div class="modal-section">
                      <p>Prefix Number:</p>
                      <p>Category:</p>
                      <p>Phone Number:</p>
                      <p>Price(MYR/RM):</p>
                      <p>Status:</p>
                      <p>Upload Date:</p>
                    </div>
                    <div class="modal-section">
                      <select v-model="form.prefixNumber">
                        <option v-for="prefix in prefixNumbers" :key="prefix" :value="prefix">{{ prefix }}</option>
                      </select>
                      <select v-model="form.category">
                        <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
                      </select>
                      <input
                          v-model="form.phoneNumber"
                          @input="formatPhoneNumber"
                          maxlength="13"
                      />
                      <input v-model="form.price" @input="formatPrice" placeholder="" />
                      <select v-model="form.status">
                        <option value="Selling">Selling</option>
                        <option value="SoldOut">SoldOut</option>
                      </select>
                      <input type="date" v-model="form.uploadDate" />
                    </div>
                  </div>
                  <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
                  <div class="btn-area">
                    <a @click="showModal = false">Cancel</a>
                    <a
                        class="next"
                        @click="submitForm"
                        :class="{ disabled: !!errorMessage }"
                        :style="{ cursor: errorMessage ? 'not-allowed' : 'pointer' }"
                    >Submit</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- //search-area -->
          <table class="table-style t-center list">
            <thead>
            <tr>
              <th>PREFIX NUMBER</th>
              <th>CATEGORY</th>
              <th>PHONE NUMBER</th>
              <th>PRICE (MYR/RM)</th>
              <th>PRICE (KRW/WON)</th>
              <th>STATUS</th>
              <th>UPLOAD DATE</th>
              <th>OWNER</th>
              <th>CONTACT NUMBER</th>
              <th>OPERATION</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="salePhnNum in paginatedPhnNums" :key="salePhnNum.sale_id">
              <td>{{ salePhnNum.sale_phn_pfx_cd }}</td>
              <td>{{ salePhnNum.sale_ctgr_cd }}</td>
              <td style="font-weight: 900; padding: 0.5em; border-radius: 4px;">{{ salePhnNum.sale_phn_num }}              </td>
              <td style="text-align: right;">{{ salePhnNum.sale_price.toLocaleString('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('RM', '') }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.sale_status_cd }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.sale_contact }}</td>
              <td>
                <button
                    v-if="salePhnNum.rgst_nm === rgstNm || userTypCd === 'U02'"
                    class="btn-edit"
                    @click="editRecord(salePhnNum)"
                >
                  Edit
                </button>
                <span
                    v-if="salePhnNum.rgst_nm === rgstNm || userTypCd === 'U02'"
                    class="separator"
                >|</span>
                <button
                    v-if="salePhnNum.rgst_nm === rgstNm || userTypCd === 'U02'"
                    class="btn-del"
                    @click="confirmDelete(salePhnNum.sale_id)"
                >
                  Delete
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          <!-- //table-style -->
          <div class="pageing">
            <a class="first" @click="goToPage(1)" :class="{ disabled: currentPage === 1 }"></a>
            <a class="pre" @click="goToPage(currentPage - 1)" :class="{ disabled: currentPage === 1 }"></a>
            <a v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ selected: currentPage === page }">{{ page }}</a>
            <a class="next" @click="goToPage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }"></a>
            <a class="last" @click="goToPage(totalPages)" :class="{ disabled: currentPage === totalPages }"></a>
          </div>
          <!-- Edit Modal -->
          <div class="modal" :class="{ show: showEditModal }" @click.self="showEditModal = false">
            <div class="modal-content" @keydown.enter="updateData" tabindex="0">
              <div class="modal-header">
                <h2>Edit Phone Number</h2>
                <span class="close-btn close-btn-top-right" @click="showEditModal = false">×</span>
              </div>
              <div class="modal-body">
                <div class="modal-section">
                  <p>Prefix Number:</p>
                  <p>Category:</p>
                  <p>Phone Number:</p>
                  <p>Price(MYR/RM):</p>
                  <p>Status:</p>
                  <p>Upload Date:</p>
                </div>
                <div class="modal-section">
                  <select v-model="editForm.prefixNumber">
                    <option v-for="prefix in prefixNumbers" :key="prefix" :value="prefix">{{ prefix }}</option>
                  </select>
                  <select v-model="editForm.category">
                    <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <input v-model="editForm.phoneNumber" readonly placeholder="" />
                  <input :value="formattedPrice" @input="updatePrice" placeholder=""/>
                  <select v-model="editForm.status">
                    <option value="Selling">Selling</option>
                    <option value="SoldOut">SoldOut</option>
                  </select>
                  <input type="date" v-model="editForm.uploadDate" />
                </div>
              </div>
              <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div> <!-- 显示错误消息 -->
              <div class="btn-area">
                <a class="close-btn" @click="showEditModal = false">Cancel</a>
                <a class="next" @click="updateData">Update</a>
              </div>
            </div>
          </div>
          <!-- Delete Confirmation Modal -->
          <div class="modal" :class="{ show: showDeleteConfirm }" @click.self="showDeleteConfirm = false">
            <div class="modal-content">
              <div class="modal-header">
                <h2>Delete Phone Number</h2>
                <span class="close-btn close-btn-top-right" @click="showDeleteConfirm = false">×</span>
              </div>
              <div class="modal-content-body">
                <p>Are you sure you want to delete this data?</p>
              </div>
              <div class="btn-area">
                <a class="close-btn" @click="showDeleteConfirm = false">Cancel</a>
                <a class="next" @click="deleteData">Confirm</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- //content -->
    </div>
    <!-- //container -->
  </div>
  <PageFooter />
</template>



<script>
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import axios from 'axios';

export default {
  data() {
    return {
      exchangeRate: 1,
      showModal: false,
      showEditModal: false,
      showDeleteConfirm: false,
      phoneNumber: '',
      category: '',
      priceMin: '',
      priceMax: '',
      errorMessage: '',
      salePhnNums: [],
      filteredPhnNums: [],
      userId: '',
      userTypCd: '',
      rgstNm: '',
      userName: '', // 添加
      userContact: '', // 添加
      userBankAcc: '', // 添加
      form: {
        prefixNumber: '',
        category: '',
        phoneNumber: '',
        price: '',
        status: '', // 默认状态
        uploadDate: new Date().toISOString().substr(0, 10), // 默认当天日期
        user_typ_cd: localStorage.getItem('user_typ_cd'),  // 新增字段
        user_nm: localStorage.getItem('user_nm')
      },
      editForm: {
        prefixNumber: '', // 默认选择010
        category: '',
        phoneNumber: '',
        price: '', // 原始数据，格式化后显示
        status: '', // 默认状态
        uploadDate: new Date().toISOString().substr(0, 10) // 默认当天日期
      },
      currentPage: 1,
      itemsPerPage: 20, // 每页显示20条记录
      recordToDelete: null, // 记录要删除的ID
      prefixNumbers: ['010', '011', '012', '013', '014', '015', '016', '017', '018', '019'], // 从010到019的选择
      categories: [ '0.1.2.3 SERIES', '0.1.9 SERIES', '1314 SERIES', '520 SERIES', 'AAA SERIES', 'AAAA SERIES', 'AAAAA SERIES', 'AAAAAA SERIES', 'AAAB SERIES', 'AABA SERIES', 'AABAA SERIES', 'AABB SERIES', 'AABBCC SERIES', 'AABBCCDD SERIES', 'AB SERIES', 'ABAA SERIES', 'ABAA/AABA SERIES', 'ABAB SERIES', 'ABABAB SERIES', 'ABBA SERIES', 'ABBB SERIES', 'BOSS SERIES', 'FENGSHUI 1349 SERIES', 'FENGSHUI 2678 SERIES', 'ICHING SERIES', 'LADDER SERIES', 'MATAFIZIK SERIES', 'NORMAL SERIES', 'ONG 88 SERIES', 'OTHER SERIES', 'REPEAT SERIES', 'THOUSAND NUMBER SERIES', 'YEAR SERIES'], // 类别选项
    };
  },
  components: {
    PageHeader,
    PageFooter
  },
  created() {
    this.userId = localStorage.getItem('user_id');
    this.userTypCd = localStorage.getItem('user_typ_cd');
    this.rgstNm = localStorage.getItem('rgst_nm');
    this.userName = localStorage.getItem('user_nm'); // 添加这一行
    this.userContact = localStorage.getItem('user_contact'); // 添加这一行
    this.userBankAcc = localStorage.getItem('user_bank_acc'); // 添加这一行
    this.fetchSalePhnNums();
  },
  methods: {
    formatPrice() {
      const value = this.form.price;
      if (value) {
        // 移除非数字字符，并格式化
        const numericValue = value.replace(/,/g, '');
        const number = parseFloat(numericValue);
        if (!isNaN(number)) {
          this.form.price = number.toLocaleString('en-MY');
        }
      }
    },
    updatePrice(event) {
      // 将用户输入的值（可能包含千位分隔符）转化为原始数值
/*      this.form.price = value;
      const value = event.target.value.replace(/,/g, '');*/
      this.formattedPrice = event.target.value;
    },
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://148.66.156.232:8081/getSalePhnNum', {
          headers: {
            token: localStorage.getItem('token')
          }
        });
        this.salePhnNums = response.data.salePhnNums.filter(phnNum => ['SoldOut', 'Selling'].includes(phnNum.sale_status_cd)); // 过滤状态
        this.exchangeRate = parseFloat(response.data.exchangeRate); // 获取汇率
        this.filteredPhnNums = this.salePhnNums; // 初始化过滤后的数据
      } catch (error) {
        console.error('Error fetching components:', error);
      }
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
      this.form.phoneNumber = value;

      this.errorMessage = '';
    },
    checkAdminAccess() {
      const userTypeCd = localStorage.getItem('user_typ_cd');

      if (userTypeCd === 'U01') {
        alert('You do not have permission to access ADMIN.');
      } else {
        this.$router.push('/admin/scs'); // 如果有权限，则跳转到 ADMIN 页面
      }
    },
    search() {
      const formattedPhoneNumber = this.phoneNumber.replace(/-/g, '');
      this.filteredPhnNums = this.salePhnNums.filter(phnNum => {
        const formattedSalePhnNum = phnNum.sale_phn_num.replace(/-/g, '');
        const matchesPhoneNumber = !formattedPhoneNumber || formattedSalePhnNum.includes(formattedPhoneNumber);
        const matchesCategory = !this.category || phnNum.sale_ctgr_cd === this.category;
        const priceMinNum = parseFloat(this.priceMin);
        const priceMaxNum = parseFloat(this.priceMax);
        const salePriceNum = parseFloat(phnNum.sale_price);
        const matchesPriceMin = isNaN(priceMinNum) || salePriceNum >= priceMinNum;
        const matchesPriceMax = isNaN(priceMaxNum) || salePriceNum <= priceMaxNum;
        const matchesStatus = ['Selling', 'SoldOut'].includes(phnNum.sale_status_cd); // 只匹配 Selling 或 SoldOut
        return matchesPhoneNumber && matchesCategory && matchesPriceMin && matchesPriceMax && matchesStatus;
      });
      this.currentPage = 1;  // 重置到第一页
    },
    reset() {
      this.phoneNumber = '';
      this.category = '';
      this.priceMin = '';
      this.priceMax = '';
      this.filteredPhnNums = this.salePhnNums;
      this.currentPage = 1; // 重置到第一页
    },
    submitForm() {
      this.errorMessage = '';

      if (Object.values(this.form).some(value => value === '')) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      // Validate phone number prefix
      const phoneNumber = this.form.phoneNumber.replace(/-/g, '');
      const numericPrice = parseFloat(this.form.price.replace(/,/g, ''));
      const prefixNumber = this.form.prefixNumber;
      if (!phoneNumber.startsWith(prefixNumber)) {
        this.errorMessage = 'Phone number does not match the selected prefix number.';
        return;
      }

      this.errorMessage = ''; // Clear error message if valid

      const token = localStorage.getItem('token');
      axios.post('http://148.66.156.232:8081/upload_phone', {
        sale_phn_pfx_cd: this.form.prefixNumber,
        sale_ctgr_cd: this.form.category,
        sale_phn_num: this.form.phoneNumber,
        sale_price: numericPrice,
        sale_status_cd: this.form.status,
        rgst_dt: this.form.uploadDate,
        user_typ_cd: this.form.user_typ_cd,
        user_nm: this.form.user_nm
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Phone number uploaded successfully!');
            this.showModal = false;
            this.form = {
              prefixNumber: '',
              category: '',
              phoneNumber: '',
              price: '',
              status: '',
              uploadDate: new Date().toISOString().substr(0, 10),
              user_typ_cd: localStorage.getItem('user_typ_cd'),
              user_nm: localStorage.getItem('user_nm')
            };
            this.fetchSalePhnNums(); // Refresh data
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting data.');
          });
    },
    editRecord(record) {
      this.editForm = {
        prefixNumber: record.sale_phn_pfx_cd,
        category: record.sale_ctgr_cd,
        phoneNumber: record.sale_phn_num,
        price: record.sale_price,
        status: record.sale_status_cd,
        uploadDate: record.rgst_dt
      };
      this.showEditModal = true;
    },
    updateData() {
      const phoneNumber = this.editForm.phoneNumber.replace(/-/g, '');
      const prefixNumber = this.editForm.prefixNumber;

      if (!phoneNumber.startsWith(prefixNumber)) {
        this.errorMessage = 'Phone number does not match the selected prefix number.';
        return;
      }
      // 清除错误消息
      this.errorMessage = '';
      const token = localStorage.getItem('token');
      axios.post('http://148.66.156.232:8081/update_phone', {
        sale_phn_pfx_cd: this.editForm.prefixNumber,
        sale_ctgr_cd: this.editForm.category,
        sale_phn_num: this.editForm.phoneNumber,
        sale_price: this.editForm.price,
        sale_status_cd: this.editForm.status,
        rgst_dt: this.editForm.uploadDate,
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Data updated successfully!');
            this.showEditModal = false;
            this.editForm = {
              prefixNumber: '', // 重置为默认值
              category: '',
              phoneNumber: '',
              price: '',
              status: '', // 重置为默认状态
              uploadDate: new Date().toISOString().substr(0, 10) // 重置为当天日期
            };
            this.fetchSalePhnNums(); // 刷新数据
          })
          .catch(error => {
            console.error('Error updating data:', error);
            alert('Error updating data.');
          });
    },
    confirmDelete(id) {
      this.recordToDelete = parseInt(id, 10); // 确保 ID 是整数
      this.showDeleteConfirm = true;
    },

    async deleteData() {
      if (this.recordToDelete) {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://148.66.156.232:8081/delete_phone', {sale_id: this.recordToDelete}, {
            headers: {token: `${token}`}
          });
          this.fetchSalePhnNums(); // 刷新数据
          this.showDeleteConfirm = false; // 关闭确认对话框
        } catch (error) {
          console.error('Error deleting data:', error);
          alert('Error deleting data.');
        }
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  computed: {
    formattedPrice: {
      get() {
        // 将原始价格格式化为千位分隔符形式
        const number = parseFloat(this.editForm.price);
        return isNaN(number) ? '' : number.toLocaleString('en-MY');
      },
      // 更新原始价格数据
      set(value) {
        // 去掉千位分隔符，更新原始数据
        this.editForm.price = value.replace(/,/g, '');
      }
    },
    totalPages() {
      return Math.ceil(this.filteredPhnNums.length / this.itemsPerPage);
    },
    paginatedPhnNums() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPhnNums.slice(start, end);
    }
  },
  watch: {
    phoneNumber: 'search',
    category: 'search',
    priceMin: 'search',
    priceMax: 'search'
  }
};
</script>


<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
/* Add any additional styles here */
</style>
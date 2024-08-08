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
                <div class="modal-content">
                  <div class="modal-header">
                    <h2>Upload Phone Number</h2>
                    <span class="close-btn" @click="showModal = false">×</span>
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
                      <input v-model="form.phoneNumber" placeholder=""/>
                      <input v-model="form.price" placeholder="" />
                      <select v-model="form.status">
                        <option value="Selling">Selling</option>
                        <option value="SoldOut">SoldOut</option>
                      </select>
                      <input type="date" v-model="form.uploadDate" />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" @click="submitForm">Submit</button>
                    <button type="button" @click="showModal = false">Cancel</button>
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
              <td style="font-weight: 900; padding: 0.5em; border-radius: 4px;">
                {{ salePhnNum.sale_phn_num }}
              </td>
              <td style="text-align: right;">{{ salePhnNum.sale_price }}</td>
              <td style="text-align: right;">
                {{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}
              </td>
              <td>{{ salePhnNum.sale_status_cd }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.sale_contact }}</td>
              <td><span v-if="salePhnNum.rgst_nm === rgstNm" class="operation" @click="editRecord(salePhnNum)">Edit</span>
                <span v-if="salePhnNum.rgst_nm === rgstNm" class="separator">|</span>
                <span v-if="salePhnNum.rgst_nm === rgstNm" class="operation" @click="confirmDelete(salePhnNum.sale_id)">Delete</span>
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
            <div class="modal-content">
              <div class="modal-header">
                <h2>Edit Phone Number</h2>
                <span class="close-btn" @click="showEditModal = false">×</span>
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
                  <input v-model="editForm.price" placeholder="" />
                  <select v-model="editForm.status">
                    <option value="Selling">Selling</option>
                    <option value="SoldOut">SoldOut</option>
                  </select>
                  <input type="date" v-model="editForm.uploadDate" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" @click="updateData">Update</button>
                <button type="button" @click="showEditModal = false">Cancel</button>
              </div>
            </div>
          </div>
          <!-- Delete Confirmation Modal -->
          <div class="modal" :class="{ show: showDeleteConfirm }" @click.self="showDeleteConfirm = false">
            <div class="modal-content">
              <div class="modal-header">
                <h2>Confirm Deletion</h2>
                <span class="close-btn" @click="showDeleteConfirm = false">×</span>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete this data?</p>
              </div>
              <div class="modal-footer">
                <button type="button" @click="deleteData">Yes</button>
                <button type="button" @click="showDeleteConfirm = false">Cancel</button>
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
      salePhnNums: [],
      filteredPhnNums: [],
      userId: '',
      userTypCd: '',
      rgstNm: '',
      form: {
        prefixNumber: '', // 默认选择010
        category: '',
        phoneNumber: '',
        price: '',
        status: '', // 默认状态
        uploadDate: new Date().toISOString().substr(0, 10) // 默认当天日期
      },
      editForm: {
        prefixNumber: '', // 默认选择010
        category: '',
        phoneNumber: '',
        price: '',
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

    this.fetchSalePhnNums();
  },
  methods: {
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://localhost:8081/getSalePhnNum', {
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
    formatPhoneNumber() {
      const rawNumber = this.form.phoneNumber.replace(/-/g, '');
      if (rawNumber.length === 11) {
        this.form.phoneNumber = `${rawNumber.slice(0, 3)}-${rawNumber.slice(3, 7)}-${rawNumber.slice(7)}`;
      }
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
      if (Object.values(this.form).some(value => value === '')) {
        alert('Please fill in all fields.');
        return;
      }
      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/upload_phone', {
        sale_phn_pfx_cd: this.form.prefixNumber,
        sale_ctgr_cd: this.form.category,
        sale_phn_num: this.form.phoneNumber,
        sale_price: this.form.price,
        sale_status_cd: this.form.status,
        rgst_dt: this.form.uploadDate
      }, {
        headers: {
          token: `${token}`
        }
      })
          .then(() => {
            alert('Phone number upload successfully!');
            this.showModal = false;
            this.form = {
              prefixNumber: '',
              category: '',
              phoneNumber: '',
              price: '',
              status: '',
              uploadDate: new Date().toISOString().substr(0, 10)
            };
            this.fetchSalePhnNums(); // 刷新数据
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
      const token = localStorage.getItem('token');
      axios.post('http://localhost:8081/update_phone', {
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
          await axios.post('http://localhost:8081/delete_phone', { sale_id: this.recordToDelete }, {
            headers: { token: `${token}` }
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
<template>
  <PageHeader/>
  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub on">
            <router-link to="/seller" class="active">SELLER</router-link>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a  class="active">Manage Phone Number</a></li>
            </ul>
          </li>
          <li class="sub">
            <a href="/admin/scs">ADMIN</a>
            <ul class="lnb-menu-sub">
            </ul>
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
                                          <option>ALL</option>
                                          <option>0.1.2.3 SERIES</option>
                                          <option>0.1.9 SERIES</option>
                                          <option>1314 SERIES</option>
                                          <option>520 SERIES</option>
                                          <option>AAA SERIES</option>
                                          <option>AAAA SERIES</option>
                                          <option>AAAAA SERIES</option>
                                          <option>AAAAAA SERIES</option>
                                          <option>AAAB SERIES</option>
                                          <option>AABA SERIES</option>
                                          <option>AABAA SERIES</option>
                                          <option>AABB SERIES</option>
                                          <option>AABBCC SERIES</option>
                                          <option>AABBCCDD SERIES</option>
                                          <option>AB SERIES</option>
                                          <option>ABAA SERIES</option>
                                          <option>ABAA/AABA SERIES</option>
                                          <option>ABAB SERIES</option>
                                          <option>ABABAB SERIES</option>
                                          <option>ABBA SERIES</option>
                                          <option>ABBB SERIES</option>
                                          <option>BOSS SERIES</option>
                                          <option>FENGSHUI 1349 SERIES</option>
                                          <option>FENGSHUI 2678 SERIES</option>
                                          <option>ICHING SERIES</option>
                                          <option>LADDER SERIES</option>
                                          <option>MATAFIZIK SERIES</option>
                                          <option>NORMAL SERIES</option>
                                          <option>ONG 88 SERIES</option>
                                          <option>OTHER SERIES</option>
                                          <option>REPEAT SERIES</option>
                                          <option>THOUSAND NUMBER SERIES</option>
                                          <option>YEAR SERIES</option>
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
                  <button type="button" class="type3" @click="showModal = true">Upload Phone Number</button>
                </div>
              </div>

              <div class="modal" :class="{ show: showModal }" @click.self="showModal = false">
                <div class="modal-content">
                  <div class="modal-header">
                    <h2>Upload Phone Number</h2>
                    <span class="close-btn" @click="showModal = false">&times;</span>
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
                      <input v-model="form.prefixNumber" placeholder="Prefix Number">
                      <input v-model="form.category" placeholder="Category">
                      <input v-model="form.phoneNumber" placeholder="Phone Number">
                      <input v-model="form.price" placeholder="Price(MYR/RM)">
                      <input v-model="form.status" placeholder="Status">
                      <input v-model="form.uploadDate" placeholder="Upload Date">
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
          <!--             <colgroup>
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                              <col style="width:100px;">
                          </colgroup>-->
          <thead>
          <!--             <tr>
                          <th rowspan="2">구분</th>
                          <th colspan="7">EAI</th>
                          <th colspan="3">EIGW</th>
                      </tr>-->
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
          <tr v-for="salePhnNum in filteredPhnNums" :key="salePhnNum.sale_id">
            <td>{{ salePhnNum.sale_phn_pfx_cd }}</td>
            <td>{{ salePhnNum.sale_ctgr_cd }}</td>
            <td>{{ salePhnNum.sale_phn_num }}</td>
            <td style="text-align: right;">{{ salePhnNum.sale_price }}</td>
            <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
            <td>{{ salePhnNum.sale_status_nm }}</td>
            <td>{{ salePhnNum.rgst_dt }}</td>
            <td>{{ salePhnNum.rgst_nm }}</td>
            <td>{{ salePhnNum.sale_contact }}</td>
            <td></td>
          </tr>
          </tbody>

        </table>
        <!-- //table-style -->

        <div class="pageing">
          <a class="first"></a>
          <a class="pre"></a>
          <a class="selected">1</a>
          <a>2</a>
          <a>3</a>
          <a>4</a>
          <a>5</a>
          <a>6</a>
          <a>7</a>
          <a>8</a>
          <a>9</a>
          <a>10</a>
          <a class="next"></a>
          <a class="last"></a>
        </div>

      </div>
    </div>
  </div>
  </div>
  <PageFooter/>
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
      phoneNumber: '',
      category: '',
      priceMin: '',
      priceMax: '',
      salePhnNums: [],
      filteredPhnNums: [],
      form: {
        prefixNumber: '',
        category: '',
        phoneNumber: '',
        price: '',
        status: '',
        uploadDate: ''
      }
    };
  },

  components: {
    PageHeader,
    PageFooter
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
        this.filteredPhnNums = this.salePhnNums; // 初始化过滤后的数据
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    },

    search() {
      this.filteredPhnNums = this.salePhnNums.filter(phnNum => {
        const matchesPhoneNumber = !this.phoneNumber || phnNum.sale_phn_num.includes(this.phoneNumber);
        const matchesCategory = !this.category || phnNum.sale_ctgr_nm === this.category;
        const priceMinNum = parseFloat(this.priceMin);
        const priceMaxNum = parseFloat(this.priceMax);
        const salePriceNum = parseFloat(phnNum.sale_price);

        const matchesPriceMin = isNaN(priceMinNum) || salePriceNum >= priceMinNum;
        const matchesPriceMax = isNaN(priceMaxNum) || salePriceNum <= priceMaxNum;

        // 返回所有条件都匹配的结果
        return matchesPhoneNumber && matchesCategory && matchesPriceMin && matchesPriceMax;
      });
    },

    reset() {
      this.phoneNumber = '';
      this.category = '';
      this.priceMin = '';
      this.priceMax = '';
      this.filteredPhnNums = this.salePhnNums;
    },

    submitForm() {
      // 确保表单中的所有字段都有值
      if (Object.values(this.form).some(value => value === '')) {
        alert('Please fill in all fields.');
        return;
      }

      const token = localStorage.getItem('token');

      // 将表单数据上传到后端
      axios.post('http://localhost:8081/upload_phone', {
        sale_phn_pfx_cd: this.form.prefixNumber,
        sale_ctgr_cd: this.form.category,
        sale_phn_num: this.form.phoneNumber,
        sale_price: this.form.price,
        sale_status_cd: this.form.status,
        rgst_dt: this.form.uploadDate
      },{
        headers: {
          token: `${token}`
        }})
          .then(() => {
            alert('Data submitted successfully!');
            this.showModal = false;
            // 清空表单数据
            this.form = {
              prefixNumber: '',
              category: '',
              phoneNumber: '',
              price: '',
              status: '',
              uploadDate: ''
            };
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting data.');
          });
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
</style>
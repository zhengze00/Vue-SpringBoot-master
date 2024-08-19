<template>
  <div>
    <PageHeader2/>
    <div class="wrap">
      <div class="container">
        <aside class="lnb">
          <h2 class="lnb-tit">MENU</h2>
          <ul class="lnb-menu">
            <li class="sub on">
              <a class="active">GLVS</a>
              <ul class="lnb-menu-sub" style="display: block">
                <li><a class="active">Search Phone Number</a></li>
              </ul>
            </li>
          </ul>
        </aside>
        <div class="content">
          <div class="content-tit">
            <h2 class="tit">GLVS</h2>
            <h2 class="tit">Search Phone Number</h2>
            <ul class="navigation">
              <li>HOME</li>
              <li>GLVS</li>
              <li>Search Phone Number</li>
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
              </div>
              <div class="search-btn">
                <button type="button" class="type2" @click="reset">Reset</button>
              </div>
            </div>
          </div>
          <table class="table-style t-center list">
            <thead>
            <tr>
              <th >PREFIX NUMBER</th>
              <th >CATEGORY</th>
              <th >PHONE NUMBER</th>
              <th >PRICE <br>(MYR/RM)</th>
              <th >PRICE <br>(KRW/WON)</th>
              <th >STATUS</th>
              <th >UPLOAD DATE</th>
              <th >OWNER</th>
              <th >↓CONTACT NUMBER↓<br>(WhatsApp)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="salePhnNum in paginatedPhnNums" :key="salePhnNum.sale_id">
              <td>{{ salePhnNum.sale_phn_pfx_cd }}</td>
              <td>{{ salePhnNum.sale_ctgr_cd }}</td>
              <td style="font-weight: 900; padding: 0.5em; border-radius: 4px; ">{{ salePhnNum.sale_phn_num }}</td>
              <td style="text-align: right;">{{ salePhnNum.sale_price.toLocaleString('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('RM', '') }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.sale_status_cd }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.sale_contact }}</td>
            </tr>
            </tbody>
          </table>

          <div class="pageing">
            <a class="first" @click="goToPage(1)" :class="{ disabled: currentPage === 1 }"></a>
            <a class="pre" @click="goToPage(currentPage - 1)" :class="{ disabled: currentPage === 1 }"></a>
            <a v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ selected: currentPage === page }">{{ page }}</a>
            <a class="next" @click="goToPage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }"></a>
            <a class="last" @click="goToPage(totalPages)" :class="{ disabled: currentPage === totalPages }"></a>
          </div>
          <div id="app">
            <div class="btn-area">
              <a @click="openModal">Sales Status</a>
              <router-link to="/account/login" class="next">Account Login</router-link>
            </div>
            <div class="modal" :class="{ show: showModal }" @click.self="closeModal">
              <div class="modal-content">
                <div class="modal-header">
                  <h2>Sales Status of Each Prefix Number</h2>
                  <span class="close-btn close-btn-top-right" @click="closeModal">×</span>

                </div>
                <table>
                  <thead>
                  <tr>
                    <th>Prefix Number</th>
                    <th>Total Sales</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in sortedSoldCountByPrefix" :key="item.phonePrefix">
                    <td>{{ item.phone_prefix }}</td>
                    <td>{{ item.sold_count }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter/>
  </div>
</template>

<script>
import PageHeader2 from '@/components/PageHeader2';
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
      soldCountByPrefix: [],
      currentPage: 1,
      itemsPerPage: 20
    };
  },
  components: {
    PageHeader2,
    PageFooter
  },
  created() {
    this.fetchSalePhnNums();
    this.fetchSoldCountByPrefix();
  },
  methods: {
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://localhost:8081/getSalePhnNum');
        this.salePhnNums = response.data.salePhnNums.filter(phnNum => ['Selling'].includes(phnNum.sale_status_cd)); // 过滤状态;
        this.exchangeRate = parseFloat(response.data.exchangeRate); // 获取汇率
        this.filteredPhnNums = this.salePhnNums; // 初始化过滤后的数据
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    },
    search() {
      const formattedPhoneNumber = this.phoneNumber.replace(/-/g, '');

      this.filteredPhnNums = this.salePhnNums.filter(phnNum => {
        const formattedSalePhnNum = phnNum.sale_phn_num.replace(/-/g, '');

        const matchesPhoneNumber = !formattedPhoneNumber || formattedSalePhnNum.includes(formattedPhoneNumber);
        const matchesCategory = !this.category || this.category === 'ALL' || phnNum.sale_ctgr_cd === this.category;
        const priceMinNum = parseFloat(this.priceMin);
        const priceMaxNum = parseFloat(this.priceMax);
        const salePriceNum = parseFloat(phnNum.sale_price);
        const matchesPriceMin = isNaN(priceMinNum) || salePriceNum >= priceMinNum;
        const matchesPriceMax = isNaN(priceMaxNum) || salePriceNum <= priceMaxNum;
        const matchesStatus = ['Selling'].includes(phnNum.sale_status_cd); // 只匹配 Selling
        return matchesPhoneNumber && matchesCategory && matchesPriceMin && matchesPriceMax && matchesStatus;
      });
      this.currentPage = 1; // Reset to the first page
    },
    reset() {
      this.phoneNumber = '';
      this.category = '';
      this.priceMin = '';
      this.priceMax = '';
      this.filteredPhnNums = this.salePhnNums;
      this.currentPage = 1; // Reset to the first page
    },
    async fetchSoldCountByPrefix() {
      try {
        const response = await axios.get('http://localhost:8081/getPfxCount');
        this.soldCountByPrefix = response.data;
      } catch (error) {
        console.error('Error fetching sold count by prefix:', error);
      }
    },
    openModal() {
      this.showModal = true;
      this.sortSoldCountByPrefix(); // Sort when opening modal
    },
    closeModal() {
      this.showModal = false;
    },
    sortSoldCountByPrefix() {
      this.soldCountByPrefix.sort((a, b) => {
        if (a.phone_prefix < b.phone_prefix) return -1;
        if (a.phone_prefix > b.phone_prefix) return 1;
        return 0;
      });
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  computed: {
    paginatedPhnNums() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPhnNums.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPhnNums.length / this.itemsPerPage);
    },
    sortedSoldCountByPrefix() {
      return [...this.soldCountByPrefix].sort((a, b) => {
        if (a.phone_prefix < b.phone_prefix) return -1;
        if (a.phone_prefix > b.phone_prefix) return 1;
        return 0;
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
/* Add any additional styles here */
</style>
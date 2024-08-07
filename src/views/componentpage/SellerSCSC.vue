<template>
  <PageHeader/>

  <div class="wrap">
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub on">
            <router-link to="/seller" class="active">SELLER</router-link>
            <ul class="lnb-menu-sub" style="display: block">
              <li><router-link to="/seller">Manage Phone Number</router-link></li>
              <li><router-link to="/seller/scsc" class="active">Sales Commission Settlement Completed</router-link></li>
            </ul>
          </li>
          <li class="sub">
            <a href="/admin/scs">ADMIN</a>
            <ul class="lnb-menu-sub"></ul>
          </li>
        </ul>
      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <h2 class="tit">Sales Commission Settlement Completed</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>ADMIN</li>
            <li>Sales Commission Settlement Completed</li>
          </ul>
        </div>
        <div class="template min">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">
                <strong>Owner:</strong>
                <span class="input-style">
                  <select v-model="selectedOwner">
                    <option value="">ALL</option>
                    <option v-for="owner in owners" :key="owner" :value="owner">{{ owner }}</option>
                  </select>
                </span>
              </li>
              <li class="fix">
                <strong>Date:</strong>
                <span class="input-style">
                  <input v-model="startDate" type="date"/>
                </span>
                <em>~</em>
                <span class="input-style">
                  <input v-model="endDate" type="date" />
                </span>
              </li>
            </ul>

            <div class="search-btn">
              <button type="button" @click="fetchSalePhnNums">Search</button>
            </div>
              <div class="search-btn">
              <button type="button" class="type2" @click="resetFilters">Reset</button>
            </div>
          </div>

          <table class="table-style t-center list">
            <thead>
            <tr>
              <th>NO</th>
              <th>PREFIX <br>NUMBER</th>
              <th>CATEGORY</th>
              <th>PHONE NUMBER</th>
              <th>PRICE <br>(MYR/RM)</th>
              <th>PRICE <br>(KRW/WON)</th>
              <th>STATUS</th>
              <th>OWNER COST <br>(MYR/RM)</th>
              <th>OWNER COST <br>(KRW/WON)</th>
              <th>TRANSACTION DATE</th>
              <th>OWNER</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(salePhnNum, index) in paginatedPhnNums" :key="salePhnNum.sale_id">
              <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
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
              <td style="text-align: right;">
                {{ (salePhnNum.sale_price * settlementRate).toFixed(0) }}
              </td>
              <td style="text-align: right;">
                {{ (salePhnNum.sale_price * settlementRate * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}
              </td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
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
          <div class="btn-area">
            <a class="">Total Own: {{ totalOwnerPrice }}</a>
            <a class="">Settlement Rate: (90%)</a>
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
      salePhnNums: [],
      exchangeRate: 1,
      settlementRate: 1,
      selectedOwner: '', // 默认选择
      startDate: '', // 绑定到开始日期输入框
      endDate: '', // 绑定到结束日期输入框
      currentPage: 1,
      itemsPerPage: 20, // 每页显示20条记录
      owners: [] // 添加 owners 数组
    };
  },

  components: {
    PageHeader,
    PageFooter
  },

  created() {
    this.fetchSalePhnNums(); // 初始化时获取数据
  },

  computed: {
    filteredSalePhnNums() {
      return this.salePhnNums.filter(salePhnNum => {
        const matchesOwner = !this.selectedOwner || salePhnNum.rgst_nm === this.selectedOwner;
        const saleDate = new Date(salePhnNum.rgst_dt);
        const startDate = this.startDate ? new Date(this.startDate) : new Date(-8640000000000000); // -Infinity
        const endDate = this.endDate ? new Date(this.endDate) : new Date(8640000000000000); // +Infinity
        const matchesDateRange = saleDate >= startDate && saleDate <= endDate;
        return matchesOwner && matchesDateRange;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredSalePhnNums.length / this.itemsPerPage);
    },
    paginatedPhnNums() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSalePhnNums.slice(start, end);
    },
    totalOwnerPrice() {
      return this.filteredSalePhnNums.reduce((total, salePhnNum) => {
        return total + (salePhnNum.sale_price * this.settlementRate);
      }, 0).toFixed(0);
    }
  },

  methods: {
    async fetchSalePhnNums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/getSalePhnNum', {
          params: {
            owner: this.selectedOwner, // 传递当前选择的所有者
            startDate: this.startDate,
            endDate: this.endDate
          },
          headers: {
            token: `${token}` // 更符合实际使用的 Authorization header 格式
          }
        });

        this.salePhnNums = response.data.salePhnNums.filter(phnNum => ['SettlementCompleted'].includes(phnNum.sale_status_cd)); // 过滤状态;
        this.exchangeRate = parseFloat(response.data.exchangeRate); // 更新汇率
        this.settlementRate = parseFloat(response.data.settlementRate) / 100;

        // 提取唯一所有者
        const uniqueOwners = [...new Set(this.salePhnNums.map(item => item.rgst_nm))];
        this.owners = uniqueOwners.sort(); // 排序，如果需要
      } catch (error) {
        console.error('Error fetching sale phone numbers:', error);
      }
    },

    resetFilters() {
      this.selectedOwner = ''; // 重置为默认选择
      this.startDate = '';
      this.endDate = '';
      this.currentPage = 1;
      this.fetchSalePhnNums(); // 重置过滤条件后重新获取数据
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
/* Add any additional styles here */
</style>

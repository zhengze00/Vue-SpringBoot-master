<template>
  <PageHeader/>
  <div class="wrap">
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub ">
            <router-link to="/seller">SELLER</router-link>
          </li>
          <li class="sub">
            <a href="/admin/scs"  class="active">ADMIN</a>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a class="active">Sales Commission Settlement</a></li>
            </ul>
          </li>
        </ul>
      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <h2 class="tit">Sales Commission Settlement</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>ADMIN</li>
            <li>Sales Commission Settlement</li>
          </ul>
        </div>
        <!-- Page header and navigation -->
        <div class="template min">
          <div class="search-area">
            <!-- Search filters -->
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
                  <input v-model="startDate" type="date" />
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
              <th>BANK ACCOUNT</th>
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
              <td>{{ salePhnNum.user_bank_acc }}</td> <!-- Update this line -->
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
            <a class="">Total Own: {{ totalOwnerPrice.toFixed(0) }}</a>
            <a class="">Settlement Rate: ({{ (settlementRate * 100) }}%)</a>
          </div>
          <div class="pop-btn-area">
            <button class="pop-btn type2" @click="markSettlementCompleted">Settlement Completed</button>
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
      selectedOwner: '', // Default to empty so that ALL is the default
      startDate: '',
      endDate: '',
      currentPage: 1,
      itemsPerPage: 20, // Number of items per page
      owners: [] // List of unique owners
    };
  },

  components: {
    PageHeader,
    PageFooter
  },

  created() {
    this.fetchSalePhnNums(); // Fetch data when component is created
  },

  computed: {
    filteredSalePhnNums() {
      return this.salePhnNums.filter(salePhnNum => {
        // 处理过滤逻辑
        const isSoldOut = salePhnNum.sale_status_cd === 'SoldOut';

        const matchesOwner = !this.selectedOwner || salePhnNum.rgst_nm === this.selectedOwner;

        const saleDate = new Date(salePhnNum.rgst_dt);
        const startDate = this.startDate ? new Date(this.startDate) : new Date(-8640000000000000); // -Infinity
        const endDate = this.endDate ? new Date(this.endDate) : new Date(8640000000000000); // +Infinity

        const matchesDateRange = saleDate >= startDate && saleDate <= endDate;

        return isSoldOut && matchesOwner && matchesDateRange;
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
        return total + (parseFloat(salePhnNum.sale_price || 0) * this.settlementRate);
      }, 0);
    }
  },

  methods: {
    async markSettlementCompleted() {
      if (!this.selectedOwner) {
        alert('Please select an owner.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8081/markSettlementCompleted', {
          owner: this.selectedOwner
        }, {
          headers: {
            token: `${token}`
          }
        });

        if (response.data.code === 1) {
          alert('Settlement Completed.');
          // Fetch data again after update
          this.fetchSalePhnNums();
        } else {
          alert('Failed to mark settlement as completed.');
        }
      } catch (error) {
        console.error('Error marking settlement completed:', error);
        alert('An error occurred while marking settlement as completed.');
      }
    },

    async fetchSalePhnNums() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/getBankAccount', {
          params: {
            owner: this.selectedOwner,
            startDate: this.startDate,
            endDate: this.endDate
          },
          headers: {
            token: `${token}` // 添加 token 作为 Authorization header
          }
        });

        // 更新数据
        this.salePhnNums = response.data.bankAccount; // 从新的接口字段中提取数据
        this.exchangeRate = parseFloat(response.data.exchangeRate);
        this.settlementRate = parseFloat(response.data.settlementRate) / 100;

        // 提取唯一所有者
        const uniqueOwners = [...new Set(this.salePhnNums.map(item => item.rgst_nm))];
        this.owners = uniqueOwners.sort(); // 排序，如果需要

        // 如果没有选择所有者，则设置为空字符串（表示“所有”）
        if (!this.selectedOwner) {
          this.selectedOwner = '';
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    },

    resetFilters() {
      this.selectedOwner = ''; // Reset to empty to show "ALL"
      this.startDate = '';
      this.endDate = '';
      this.currentPage = 1;
      // Fetch data again after reset
      this.fetchSalePhnNums();
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
/* Add your styles here */
</style>

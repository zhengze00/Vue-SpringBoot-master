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
          <li class="sub on">
            <a href="/admin/scs" class="active">ADMIN</a>
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
              <td style="font-weight: 900; padding: 0.5em; border-radius: 4px;">{{ salePhnNum.sale_phn_num }}</td>
              <td style="text-align: right;">{{ salePhnNum.sale_price.toLocaleString('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('RM', '') }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.sale_status_cd }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * (1 - settlementRate)).toFixed(0) }}              </td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * settlementRate * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.user_bank_acc }}</td>
            </tr>
            </tbody>
          </table>
          <div class="summary-info">
          <h> (Settlement Rate:{{ settlementRate * 100 }}%)</h>
          <h> ( Total Own:{{ totalOwnerPrice }} )</h>
        </div>
          <div class="pageing">
            <a class="first" @click="goToPage(1)" :class="{ disabled: currentPage === 1 }"></a>
            <a class="pre" @click="goToPage(currentPage - 1)" :class="{ disabled: currentPage === 1 }"></a>
            <a v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ selected: currentPage === page }">{{ page }}</a>
            <a class="next" @click="goToPage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }"></a>
            <a class="last" @click="goToPage(totalPages)" :class="{ disabled: currentPage === totalPages }"></a>
          </div>

          <div class="pop-btn-area">
            <button class="pop-btn2 type3" @click="markSettlementCompleted">Settlement Completed</button>
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
      salePhnNums: [], // Initialize as empty array
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
      if (!Array.isArray(this.salePhnNums)) {
        return []; // Ensure salePhnNums is always an array
      }

      return this.salePhnNums.filter(salePhnNum => {
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
        return total + (salePhnNum.sale_price * (1 - this.settlementRate));
      }, 0).toFixed(0);
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
        const response = await axios.post('http://148.66.156.232:8081/markSettlementCompleted', {
          rgst_nm: this.selectedOwner
        }, {
          headers: {
            token: `${token}`
          }
        });

        if (response.data.code === 1) {
          alert('Settlement Completed.');
          this.fetchSalePhnNums(); // Fetch data again after update
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
        const response = await axios.get('http://148.66.156.232:8081/getBankAccount', {
          params: {
            owner: this.selectedOwner,
            startDate: this.startDate,
            endDate: this.endDate
          },
          headers: {
            token: `${token}` // Adding token as Authorization header
          }
        });

        // Update data
        this.salePhnNums = response.data.bankAccount || []; // Ensure it's an array
        this.exchangeRate = parseFloat(response.data.exchangeRate) || 1;
        this.settlementRate = parseFloat(response.data.settlementRate) / 100;

        // Extract unique owners
        const uniqueOwners = [...new Set(this.salePhnNums.map(item => item.rgst_nm))];
        this.owners = uniqueOwners.sort(); // Sort if needed

        // If no owner is selected, set to empty string (show "ALL")
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
      this.fetchSalePhnNums(); // Fetch data again after reset
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

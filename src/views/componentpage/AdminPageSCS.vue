<template>
  <PageHeader/>

  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub">
            <router-link to="/seller">SELLER</router-link>
          </li>
          <li class="sub on">
            <a class="active">ADMIN</a>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a class="active">Sales Commission Settlement</a></li>
              <li><router-link to="/admin/scsc">Sales Settlement Commission Completed</router-link></li>
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
        <div class="template min">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">
                <strong>Owner:</strong>
                <span class="input-style">
                  <select v-model="selectedOwner">
                    <option value="">ALL</option>
                    <option value="John">John</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                  </select>
                </span>
              </li>
              <li class="fix">
                <strong>Date:</strong>
                <span class="input-style">
                  <input v-model="startDate" type="date"  />
                </span>
                <em>~</em>
                <span class="input-style">
                  <input v-model="endDate" type="date" />
                </span>
              </li>
            </ul>

            <div class="search-btn">
              <button type="button" @click="fetchSalePhnNums">Search</button>
              <button type="button" class="type2" @click="resetFilters">Reset</button>
            </div>
          </div>
          <!-- //search-area -->

          <table class="table-style t-center list">
            <thead>
            <tr>
              <th>NO</th>
              <th>PREFIX NUMBER</th>
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
              <td style="font-weight: 900; padding: 0.5em; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                {{ salePhnNum.sale_phn_num }}
              </td>
              <td style="text-align: right;">{{ salePhnNum.sale_price }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.sale_status_cd }}</td>
              <td style="text-align: right;">{{ salePhnNum.owner_cost_myr }}</td>
              <td style="text-align: right;">{{ (salePhnNum.owner_cost_myr * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.user_bank_acc }}</td>
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
          <div class="btn-area">
            <a class="">Total Own: {{ totalOwnerPrice }}</a>
            <a class="">Settlement Rate: (90%)</a>
            <a class="next">Settlement Completed</a>
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
      selectedOwner: 'John', // 默认选择“ALL”
      startDate: '', // 绑定到开始日期输入框
      endDate: '', // 绑定到结束日期输入框
      currentPage: 1,
      itemsPerPage: 20 // 每页显示20条记录
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
        // 过滤所有者
        const matchesOwner = !this.selectedOwner || salePhnNum.rgst_nm === this.selectedOwner;

        // 过滤日期范围
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
        return total + parseFloat(salePhnNum.sale_price || 0);
      }, 0);
    }
  },

  methods: {
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://localhost:8081/getSalePhnNum', {
          params: {
            owner: this.selectedOwner, // 传递当前选择的所有者
            startDate: this.startDate,
            endDate: this.endDate
          }
        });
        this.salePhnNums = response.data.salePhnNums;
        this.exchangeRate = parseFloat(response.data.exchangeRate); // 更新汇率
      } catch (error) {
        console.error('Error fetching sale phone numbers:', error);
      }
    },

    resetFilters() {
      this.selectedOwner = 'John'; // 重置为默认选择“ALL”
      this.startDate = '';
      this.endDate = '';
      this.currentPage = 1;
      // 重置后重新获取数据
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
/* ... 样式代码保持不变 ... */
</style>

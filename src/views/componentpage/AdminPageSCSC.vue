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
              <li><router-link to="/admin/scs">Sales Commision Settlement</router-link></li>
              <li><a class="active">Settlement Commision Completed</a></li>
            </ul>
          </li>
        </ul>
      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <h2 class="tit">Sales Commision Settlement Completed</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>ADMIN</li>
            <li>Sales Commision Settlement Completed</li>
          </ul>
        </div>
        <div class="template min">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">
                <strong>Owner:</strong>
                <span class="input-style">
                  <select v-model="selectedOwner" @change="fetchSalePhnNums">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                    <option value="">ALL</option>
                  </select>
                </span>
              </li>
              <li class="fix">
                <strong>Date:</strong>
                <span class="input-style">
                  <input v-model="startDate" type="text" placeholder="2024-01-01" class="datepicker" @change="fetchSalePhnNums" />
                </span>
                <em>~</em>
                <span class="input-style">
                  <input v-model="endDate" type="text" placeholder="2024-12-31" class="datepicker" @change="fetchSalePhnNums" />
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
          <!-- //search-area -->

          <table class="table-style t-center list">
            <thead>
            <tr>
              <th>NO</th>
              <th>PREFIX NUMBER</th>
              <th>CATEGORY</th>
              <th>PHONE NUMBER</th>
              <th>PRICE (MYR/RM)</th>
              <th>PRICE (KRW/WON)</th>
              <th>STATUS</th>
              <th>OWNER COST (MYR/RM)</th>
              <th>OWNER COST (KRW/WON)</th>
              <th>TRANSACTION DATE</th>
              <th>OWNER</th>
              <th>BANK ACCOUNT</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="salePhnNum in filteredSalePhnNums" :key="salePhnNum.sale_id">
              <td>{{ salePhnNum.sale_id }}</td>
              <td>{{ salePhnNum.sale_phn_pfx_nm }}</td>
              <td>{{ salePhnNum.sale_ctgr_nm }}</td>
              <td>{{ salePhnNum.sale_phn_num }}</td>
              <td style="text-align: right;">{{ salePhnNum.sale_price }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td></td>
            </tr>
            </tbody>
          </table>
          <!-- //table-style -->

          <div class="pageing">
            <a href="#none" class="first"></a>
            <a href="#none" class="pre"></a>
            <a href="#none" class="selected">1</a>
            <a href="#none">2</a>
            <a href="#none">3</a>
            <a href="#none">4</a>
            <a href="#none">5</a>
            <a href="#none">6</a>
            <a href="#none">7</a>
            <a href="#none">8</a>
            <a href="#none">9</a>
            <a href="#none">10</a>
            <a href="#none" class="next"></a>
            <a href="#none" class="last"></a>
          </div>
          <div class="btn-area">
            <a class="">Total Own: </a>
            <a class="">Settlement Rate: %</a>
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
      selectedOwner: 'A', // 默认选择“A”
      startDate: '', // 绑定到开始日期输入框
      endDate: '' // 绑定到结束日期输入框
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
        const matchesOwner = this.selectedOwner === '' || salePhnNum.rgst_nm === this.selectedOwner;

        // 过滤日期范围
        const saleDate = new Date(salePhnNum.rgst_dt);
        const startDate = this.startDate ? new Date(this.startDate) : new Date(-8640000000000000); // -Infinity
        const endDate = this.endDate ? new Date(this.endDate) : new Date(8640000000000000); // +Infinity

        const matchesDateRange = saleDate >= startDate && saleDate <= endDate;

        return matchesOwner && matchesDateRange;
      });
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
      this.selectedOwner = 'A'; // 重置为默认选择“A”
      this.startDate = '';
      this.endDate = '';
      // 重置后重新获取数据
      this.fetchSalePhnNums();
    }
  }
};
</script>

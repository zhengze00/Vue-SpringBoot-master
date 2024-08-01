
<template>
  <PageHeader/>
  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub">
            <a  class="">GLVS</a>
          </li>
          <li class="sub">
            <a href="#none">AGENT</a>
          </li>
          <li class="sub on">
            <a  class="active">ADMIN</a>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a  class="active">Sales Settlement</a></li>
              <li><a  class="">Settlement Completed</a></li>
            </ul>
          </li>
        </ul>

      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <h2 class="tit">Sales Settlement</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>GLVS</li>
          </ul>
        </div>
        <div class="template">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">

              </li>
              <li class="fix">
                <strong>Owner:</strong>
                <span class="input-style">
                                        <select>
                                          <option>A</option>
                                          <option>B</option>
                                          <option>C</option>
                                          <option>D</option>
                                          <option>E</option>
                                          <option>F</option>
                                          <option>G</option>
                                          <option>H</option>
                                        </select>
                                    </span>
              </li>

            </ul>

            <div class="search-btn">
              <button type="button">Search</button>
              <button type="button" class="type2">Reset</button>
            </div>


          </div>
          <!-- //search-area -->

          <table class="table-style t-center list">
            <!-- <colgroup>
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                    <col style="width:100px;">
                </colgroup> -->
            <thead>
            <!-- <tr>
                <th rowspan="2">구분</th>
                <th colspan="7">EAI</th>
                <th colspan="3">EIGW</th>
            </tr> -->
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
            <tr v-for="salePhnNum in salePhnNums" :key="salePhnNum.sale_id">
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
            <a href="#none" class="">Settlement Rate: %</a>
            <a href="#none" class="next">Settlement Completed</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import axios from 'axios';

export default {
  data() {
    return {
      salePhnNums: [],
      exchangeRate: 1
    };
  },

  components: {
    PageHeader
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
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/common_new.css";
@import "@/assets/reset.css";
</style>

<template>
  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub on">
            <a  class="active">GLVS</a>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a  class="active">SEARCH NUMBER</a></li>
            </ul>
          </li>
          <li class="sub">
            <a href="#none">AGENT</a>
            <ul class="lnb-menu-sub">
              <li><a href="#none">UPLOAD</a></li>
            </ul>
          </li>
          <li class="sub">
            <a href="#none">ADMIN</a>
            <ul class="lnb-menu-sub">
              <li><a href="#none">OwnerSoldCostList</a></li>
            </ul>
          </li>
        </ul>

      </aside>
      <div class="content">
        <div class="content-tit">
          <h2 class="tit">GLVS</h2>
          <ul class="navigation">
            <li>HOME</li>
            <li>매타정보조회</li>
            <li>GLVS</li>
          </ul>
        </div>
        <div class="template">
          <div class="search-area">
            <ul class="search-list">
              <li class="fix">
                <strong>Owner:</strong>
                <span class="input-style">
                                        <input type="text" placeholder="" />
                                    </span>
              </li>

              <li class="fix">
                <strong>Date:</strong>
                <span class="input-style">
                                        <input type="text" placeholder="" />
                                    </span>
              </li>
              <li class="fix">
                <strong>Date:</strong>
                <span class="input-style">
                                        <input type="text" placeholder="" />
                                    </span>
              </li>
            </ul>

            <div class="search-btn">
              <button type="button">검색</button>
              <button type="button" class="type2">초기화</button>
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
              <th>ID</th>
              <th>PHONE NO</th>
              <th>MYR</th>
              <th>KRW</th>
              <th>OWNER COST (MYR)</th>
              <th>OWNER COST (KRW)</th>
              <th>RATE</th>
              <th>BANK ACCOUNT</th>
              <th>CONTACT NO</th>
              <th>REGISTER NAME</th>
              <th>REGISTER DATE</th>
              <th>AUDIT NAME</th>
              <th>AUDIT DATE</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="salePhnNum in salePhnNums" :key="salePhnNum.id">
              <td>{{ salePhnNum.sale_id }}</td>
              <td>{{ salePhnNum.sale_phn_num }}</td>
              <td>RM {{ salePhnNum.sale_price }}</td>
              <td>{{ (salePhnNum.sale_price * 280) }} Won</td>
              <td>RM {{ (salePhnNum.sale_price * 90/100) }}</td>
              <td>{{ (salePhnNum.sale_price * 90/100*280) }} Won</td>
              <td></td>
              <td></td>
              <td>{{ salePhnNum.sale_contact }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.rgst_dtm }}</td>
              <td>{{ salePhnNum.audit_nm }}</td>
              <td>{{ salePhnNum.audit_dtm }}</td>
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
            <a href="#none" class="type2">Sales Status</a>
            <a href="#none" class="">Agent Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      salePhnNums: []
    };
  },
  // dosjdod
  created() {
    this.fetchSalePhnNums();
  },
  methods: {
    async fetchSalePhnNums() {
      try {
        const response = await axios.get('http://localhost:8081/getSalePhnNum');
        this.salePhnNums = response.data;
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
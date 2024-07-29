
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
              <li><a  class="active">VIPNUMBER</a></li>
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
                <strong>Phone no:</strong>
                <span class="input-style">
                                        <input type="text" placeholder="" />
                                    </span>
              </li>
              <li class="fix">
                <strong>Category:</strong>
                <span class="input-style">
                                        <select>
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
                                        <input type="text" placeholder="" />
                                    </span>
              </li>
              <li class="fix">
                <strong>Price Range(Max):</strong>
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
              <th>PHONE NO</th>
              <th>CATEGORY</th>
              <th>PREFIX NUMBER</th>
              <th>MYR</th>
              <th>KRW</th>
              <th>STATUS</th>
              <th>UPLOAD DATE</th>
              <th>CONTACT US</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="PhNo in PhNos" :key="PhNo.id">
              <td>{{ PhNo.number }}</td>
              <td>{{ PhNo.category }}</td>
              <td>{{ PhNo.phone_prefix }}</td>
              <td>{{ PhNo.price_myr }}</td>
              <td>{{ PhNo.status }}</td>
              <td>{{ PhNo.status_date }}</td>
              <td>{{ PhNo.upload_date }}</td>
              <td>{{ PhNo.seller_id }}</td>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  PhNo() {
    return {
      PhNos: []
    };
  },
  // dosjdod
  created() {
    this.fetchPhNos();
  },
  methods: {
    async fetchPhNos() {
      try {
        const response = await axios.get('http://localhost:8080/getPhNo');
        this.PhNos = response.PhNo;
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    }
  }
};
</script>

<style scoped src="@/assets/common.css">
</style>
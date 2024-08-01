
<template>
  <PageHeader2/>
  <div class="wrap">
    <!-- container : S -->
    <div class="container">
      <aside class="lnb">
        <h2 class="lnb-tit">MENU</h2>
        <ul class="lnb-menu">
          <li class="sub on">
            <a  class="active">GLVS</a>
            <ul class="lnb-menu-sub" style="display: block">
              <li><a  class="active">Seach Phone Number</a></li>
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
            </tr>
            </thead>

            <tbody>
            <tr v-for="salePhnNum in filteredPhnNums" :key="salePhnNum.sale_id">
              <td>{{ salePhnNum.sale_phn_pfx_nm }}</td>
              <td>{{ salePhnNum.sale_ctgr_nm }}</td>
              <td>{{ salePhnNum.sale_phn_num }}</td>
              <td style="text-align: right;">{{ salePhnNum.sale_price }}</td>
              <td style="text-align: right;">{{ (salePhnNum.sale_price * exchangeRate).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' }).replace('₩', '') }}</td>
              <td>{{ salePhnNum.sale_status_nm }}</td>
              <td>{{ salePhnNum.rgst_dt }}</td>
              <td>{{ salePhnNum.rgst_nm }}</td>
              <td>{{ salePhnNum.sale_contact }}</td>
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

<!--   Sales Status POPUP      s-->
          <div id="app">
            <div class="btn-area">
              <a href="#none" @click="showModal = true">Sales Status</a>
              <router-link to="/account/login" class="next">Agent Login</router-link>
            </div>

            <div class="modal" :class="{ show: showModal }" @click.self="showModal = false">
              <div class="modal-content">
                 <div class="modal-header">
                   <h2>Sales Status of Each Prefix Number</h2>
                   <span class="close-btn" @click="showModal = false">&times;</span>
                 </div>
                <div class="modal-body">
                  <div class="modal-section">
                    <h3>Prefix Number:</h3>
                    <p>010:</p>
                    <p>011:</p>
                    <p>012:</p>
                    <p>013:</p>
                    <p>014:</p>
                    <p>015:</p>
                    <p>016:</p>
                    <p>017:</p>
                    <p>018:</p>
                    <p>019:</p>
                    <p>0192:</p>
                    <p>0193:</p>
                  </div>
                  <div class="modal-section">
                    <h3>Total Sales:</h3>
                    <p>1000</p>
                    <p>599</p>
                    <p>26</p>
                    <p>46</p>
                    <p>26</p>
                    <p>56</p>
                    <p>48</p>
                    <p>19</p>
                    <p>86</p>
                    <p>26</p>
                    <p>59</p>
                    <p>26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <PageFooter/>
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
      filteredPhnNums: []
    };
  },

  components: {
    PageHeader2,
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
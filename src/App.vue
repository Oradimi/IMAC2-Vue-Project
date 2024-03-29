<template>
<header>
  KanColle Glossary
</header>
<router-view v-slot="{ Component }">
  <transition name="slide-fade">
    <component :is="Component" />
  </transition>
</router-view>
<!-- <PageHeader @sort="sortShipsBy" @reverse-sort="reverseSort" @filter="filterShipsBy"/>

<LoadingScreen v-if="isLoading"/>
<div v-else class="main">
  <ShipCard
  v-for="(ship, index) in displayedShips" :key="index"
  :image="getShipPath(ship.api_id, 'ship', 'card', 'png')"
  :name="getTranslationFromJSONObject(shipNameTLs, ship.api_name)"
  :type="getTranslationFromJSONObject(shipTypeTLs, shipTypeList[ship.api_stype])"
  :health="ship.api_taik[1]"
  :firepower="ship.api_houg[1]"
  :torpedo="ship.api_raig[1]"
  :antiair="ship.api_tyku[1]"
  :armor="ship.api_souk[1]"/>
</div>

<PageFooter :currentPage="currentPage" :totalPages="totalPages" @next-page="nextPage" @prev-page="prevPage"/> -->
<footer>
  Powered by VueJS - Any issues? Contact Oradimi on the English KC Discord
</footer>
</template>

<script>
import { getApiData } from './service/api';
import { getShipNameTL } from './service/ships';
import { getShipTypeTL } from './service/ship_types';

import PageHeader from './components/PageHeader.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import ShipCard from './components/ShipCard.vue';
import PageFooter from './components/PageFooter.vue';

const sortOptions = {
  'id': (a, b) => a.api_id - b.api_id,
  'health': (a, b) => a.api_taik[1] - b.api_taik[1],
  'firepower': (a, b) => a.api_houg[1] - b.api_houg[1],
  'torpedo': (a, b) => a.api_raig[1] - b.api_raig[1],
  'anti-air': (a, b) => a.api_tyku[1] - b.api_tyku[1],
  'armor': (a, b) => a.api_souk[1] - b.api_souk[1]
};

export default {
  name: 'Gallery',
  components: {
    PageHeader,
    LoadingScreen,
    ShipCard,
    PageFooter
  },
  data() {
    return {
      apiData: {},
      shipList: [],
      shipTypeList: {}, 
      isLoading: false,
      sortOption: 'id',
      sortReverse: false,
      filterOption: 0,
      currentPage: 1,
      perPage: 20,
      shipNameTLs: {},
      shipTypeTLs: {},
    };
  },
  methods: {
    async retrieveData() {
      this.isLoading = true;
      try {
        this.apiData = await getApiData();
        this.shipList = await this.preFilterShips();
        this.shipTypeList = await this.makeShipTypeTable();
        this.shipNameTLs = await getShipNameTL();
        this.shipTypeTLs = await getShipTypeTL();
      } finally {
        this.isLoading = false;
      }
    },
    async preFilterShips() {
      // removes enemies from the list, which lack data
      return this.apiData.api_mst_ship.filter(ship => ship.api_taik !== undefined);
    },
    async makeShipTypeTable() {
      const shipTypeTable = {};
      this.apiData.api_mst_stype.forEach(stype => {
        shipTypeTable[stype.api_id] = stype.api_name;
      });
      return shipTypeTable;
    },

    sortShipsBy(option) {
      this.sortOption = option;
    },
    reverseSort() {
      this.sortReverse = !this.sortReverse;
    },
    filterShipsBy(option) {
      this.filterOption = parseInt(option);
      if (this.isLoading) return;
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      if (this.currentPage < 1 && this.totalPages !== 0) {
        this.currentPage = 1;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    getShipPath(id, eors, type, ext, filename) {
      const resource = [6657, 5699, 3371, 8909, 7719, 6229, 5449, 8561, 2987, 5501, 3127, 9319, 4365, 9811, 9927, 2423, 3439, 1865, 5925, 4409, 5509, 1517, 9695, 9255, 5325, 3691, 5519, 6949, 5607, 9539, 4133, 7795, 5465, 2659, 6381, 6875, 4019, 9195, 5645, 2887, 1213, 1815, 8671, 3015, 3147, 2991, 7977, 7045, 1619, 7909, 4451, 6573, 4545, 8251, 5983, 2849, 7249, 7449, 9477, 5963, 2711, 9019, 7375, 2201, 5631, 4893, 7653, 3719, 8819, 5839, 1853, 9843, 9119, 7023, 5681, 2345, 9873, 6349, 9315, 3795, 9737, 4633, 4173, 7549, 7171, 6147, 4723, 5039, 2723, 7815, 6201, 5999, 5339, 4431, 2911, 4435, 3611, 4423, 9517, 3243];
      const key = s => s.split("").reduce((a, e) => a + e.charCodeAt(0), 0);
      const create = (id, type) =>
        (17 * (id + 7) * resource[(key(type) + id * type.length) % 100] % 8973 + 1000).toString();
      const pad = (id, eors) => eors == "ship" ? id.toString().padStart(4, "0") : id.toString().padStart(3, "0");
      let suffix = "";
      if (type.indexOf("_d") > 0 && type.indexOf("_dmg") < 0) {
        suffix = "_d";
        type = type.replace("_d", "");
      }
      const uniqueKey = filename ? "_" + filename : "";
      return `/ship-cards/${pad(id, eors)}${suffix}_${create(id, `${eors}_${type}`)}${uniqueKey}.${ext}`;
    },
    getTranslationFromJSONObject(data, string) {
      return string.trim() in data ? data[string.trim()] : string;
    },
  },
  computed: {
    totalItems() {
      return this.filteredShips.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
  
    sortedShips() {
      return this.sortReverse? this.shipList.sort(sortOptions[this.sortOption]).reverse() : this.shipList.sort(sortOptions[this.sortOption]);
    },
    filteredShips() {
      if (this.filterOption === 0) return this.sortedShips;
      return this.sortedShips.filter(ship => ship.api_stype == this.filterOption);
    },
    displayedShips() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredShips.slice(start, start + this.perPage);
    }
  },
  created() {
    this.retrieveData();
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.6s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

header {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 10px;
  top: 0;
  left: 0;
  background-color: rgb(48, 0, 36);
  z-index: 3;
}

.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 130px 0;
}

footer {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 10px;
  bottom: 0;
  left: 0;
  background-color: rgb(48, 0, 36);
  z-index: 3;
}
</style>
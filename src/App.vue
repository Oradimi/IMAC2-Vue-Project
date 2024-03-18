<template>
<div class="top-bar">
  <p>Sort by</p>
  <select name="sort-options" class="sort-options" v-model="sortOption" @change="sortShipsBy(sortOption)">
    <option value="id">ID</option>
    <option value="health">HP</option>
    <option value="firepower">FP</option>
    <option value="torpedo">TP</option>
    <option value="anti-air">AA</option>
    <option value="armor">AR</option>
  </select>
  <div class="custom-arrow" :class="{ 'descending': !sortReverse, 'ascending': sortReverse }" @click="reverseSort" @change="sortShipsBy(sortOption)"></div>
</div>

<!-- Loading screen -->
<div v-if="isLoading" class="loading-screen">
  Loading...
</div>
<div v-else class="main">
  <div v-for="(ship, index) in displayedShips" :key="index" class="ship-card-container">
  <ShipCard
  :image="getShipPath(ship.api_id, 'ship', 'card', 'png')"
  :name="ship.api_name"
  :type="shipTypeList[ship.api_stype]"
  :health="ship.api_taik[1]"
  :firepower="ship.api_houg[1]"
  :torpedo="ship.api_raig[1]"
  :antiair="ship.api_tyku[1]"
  :armor="ship.api_souk[1]"/>
</div>
</div>

<footer>
<div class="pagination">
  <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
  <span>{{ currentPage }} / {{ totalPages }}</span>
  <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
</div>
</footer>
</template>

<script>
import { getApiData } from './service/api';
import ShipCard from './components/Ship.vue';

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
  data() {
    return {
      apiData: {},
      shipList: [],
      shipTypeList: {}, 
      isLoading: false,
      sortOption: 'id',
      sortReverse: false,
      currentPage: 1,
      perPage: 20
    };
  },
  methods: {
    async retrieveApiData() {
      this.isLoading = true;
      try {
        this.apiData = await getApiData();
        this.shipList = await this.preFilterShips;
        this.shipTypeList = await this.makeShipTypeTable;
      } finally {
        this.isLoading = false;
      }
    },
    async sortShipsBy(option) {
      this.sortOption = option;
    },
    reverseSort() {
      this.sortReverse = !this.sortReverse;
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
    }
  },
  computed: {
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
    sortedShips() {
      return this.sortReverse? this.shipList.sort(sortOptions[this.sortOption]).reverse() : this.shipList.sort(sortOptions[this.sortOption]);
    },
    totalItems() {
      return this.sortedShips.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    displayedShips() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.sortedShips.slice(start, start + this.perPage);
    }
  },
  components: {
    ShipCard
  },
  created() {
    this.retrieveApiData();
  }
}
</script>

<style scoped>
.top-bar {
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
}

select {
  color: aliceblue;
  background-color: rgb(142, 107, 133);
  border: thin solid blue;
  border-radius: 10px;
  display: inline-block;
  font: inherit;
  text-align: center;
  line-height: 1.5em;
  outline: none;

  margin: 0 10px;
  padding-block: 1px;
  padding-inline: 6px 15px;  
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.custom-arrow {
  position: relative;
  right: 25px;
  width: 0;
  height: 0;
}

.ascending {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid white;
}

.descending {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid white;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 2;
}

.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 80px 0;
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
}

button {
  color: aliceblue;
  background-color: rgb(142, 107, 133);
  border: thin solid blue;
  border-radius: 10px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;

  margin: 0 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}

button:active {
  background-color: rgb(98, 65, 90);
}
</style>
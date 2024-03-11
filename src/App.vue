<template>
<div class="top-bar">
  <p>Sort by</p>
  <select name="sort-options" class="sort-options" v-model="selectedSortOption" @change="sortShipsBy(selectedSortOption)">
    <option value="id">ID</option>
    <option value="health">HP</option>
    <option value="firepower">FP</option>
    <option value="torpedo">TP</option>
    <option value="anti-air">AA</option>
    <option value="armor">AR</option>
  </select>
</div>

<!-- Loading screen -->
<div v-if="isLoading" class="loading-screen">
  Loading...
</div>

<div v-else class="main">
  <div v-for="(ship, index) in displayedShips" :key="index" class="ship-card-container">
    <!-- <div v-if="ship.api_taik !== undefined"> -->
      <ShipCard
      :image="getShipPath(ship.api_id, 'ship', 'card', 'png')"
      :name="ship.api_name"
      :health="ship.api_taik[1]"
      :firepower="ship.api_houg[1]"
      :torpedo="ship.api_raig[1]"
      :antiair="ship.api_tyku[1]"
      :armor="ship.api_souk[1]"/>
    <!-- </div> -->
  </div>

  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
  </div>
</div>
</template>

<script>
import { getApiData } from './service/api';
import ShipCard from './components/Ship.vue'
export default {
  name: 'Gallery',
  data() {
    return {
      apiData: {},
      isLoading: false,
      selectedSortOption: 'id',
      currentPage: 1,
      perPage: 20
    };
  },
  methods: {
    async retrieveApiData() {
      this.isLoading = true;
      try {
        this.apiData = await getApiData();
      } finally {
        this.isLoading = false;
      }
    },
    async sortShipsBy(option) {
      this.isLoading = true; // Set loading state to true before sorting
      this.selectedSortOption = option;
      this.isLoading = false; // Set loading state to false after sorting

      try {
        // Simulate sorting delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Your sorting logic
      } finally {
        this.isLoading = false; // Set loading state to false after sorting
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
    }
  },
  computed: {
    sortedShips() {
      if (this.apiData.api_mst_ship === undefined) return;
      return this.apiData.api_mst_ship.slice().sort((a, b) => {
        if (a.api_taik !== undefined && b.api_taik !== undefined) {
          if (this.selectedSortOption === 'health') {
            return a.api_taik[1] - b.api_taik[1];
          } else if (this.selectedSortOption === 'firepower') {
            return a.api_houg[1] - b.api_houg[1];
          } else if (this.selectedSortOption === 'torpedo') {
            return a.api_raig[1] - b.api_raig[1];
          } else if (this.selectedSortOption === 'anti-air') {
            return a.api_tyku[1] - b.api_tyku[1];
          } else if (this.selectedSortOption === 'armor') {
            return a.api_souk[1] - b.api_souk[1];
          } else {
            return a.api_id - b.api_id;
          }
        } else {
          return this.apiData.api_mst_ship;
        }
      });
    },
    totalItems() {
      console.log(this.sortedShips.length);
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
    this.retrieveApiData()
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

.top-bar> * {
  padding: 10px;
}

select {
  /* styling */
  color: aliceblue;
  background-color: rgb(142, 107, 133);
  border: thin solid blue;
  border-radius: 10px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;

  /* reset */
  margin: 0;      
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 80px;
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
}
</style>
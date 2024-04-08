<template>
<ShipPageHeader :initialSortReverse="sortReverse" @sort="sortShipsBy" @reverse-sort="reverseSort" @filter="filterShipsBy"/>

<LoadingScreen v-if="isLoading"/>
<div v-else class="main">
  <ShipCard
  v-for="(ship, index) in displayedShips" :key="index"
  :image="getImagePath(ship.api_id, 'ship', 'card', 'png')"
  :name="getTranslationFromJSONObject(shipNameTLs, ship.api_name)"
  :type="getTranslationFromJSONObject(shipTypeTLs, shipTypeList[ship.api_stype])"
  :health="ship.api_taik[1]"
  :firepower="ship.api_houg[1]"
  :torpedo="ship.api_raig[1]"
  :antiair="ship.api_tyku[1]"
  :armor="ship.api_souk[1]"/>
</div>

<PageFooter :currentPage="currentPage" :totalPages="totalPages" @update-page="updatePage"/>
</template>

<script>
import { getApiData } from '@/service/api';
import { getShipNameTL } from '@/service/ships';
import { getShipTypeTL } from '@/service/ship_types';
import { getImagePath } from '@/service/path_parser';
import { getDefaultSortAndFilterOptions } from "@/service/query_parser";

import ShipPageHeader from '@/components/ShipPageHeader.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import ShipCard from '@/components/ShipCard.vue';
import PageFooter from '@/components/PageFooter.vue';

const sortOptions = {
  'id': (a, b) => a.api_id - b.api_id,
  'health': (a, b) => a.api_taik[1] - b.api_taik[1],
  'firepower': (a, b) => a.api_houg[1] - b.api_houg[1],
  'torpedo': (a, b) => a.api_raig[1] - b.api_raig[1],
  'anti-air': (a, b) => a.api_tyku[1] - b.api_tyku[1],
  'armor': (a, b) => a.api_souk[1] - b.api_souk[1]
};

export default {
  name: 'ShipGallery',
  components: {
    ShipPageHeader,
    LoadingScreen,
    ShipCard,
    PageFooter
  },
  props: {
    sort: String,
    reverse: String,
    filter: Number,
    page: Number
  },
  data() {
    const {
      sortOption,
      sortReverse,
      filterOption
    } = getDefaultSortAndFilterOptions(this.$route.query, 0);

    const defaultCurrentPage = parseInt(this.$route.query.page) || 1;

    return {
      apiData: {},
      shipList: [],
      shipTypeList: {}, 
      isLoading: false,
      sortOption,
      sortReverse,
      filterOption,
      searchTerm: '',
      currentPage: defaultCurrentPage,
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
        this.shipNameTLs = getShipNameTL();
        this.shipTypeTLs = getShipTypeTL();
      } finally {
        this.isLoading = false;
        this.clampCurrentPage();
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
    filterShipsBy(option, searchTerm) {
      this.filterOption = parseInt(option);
      this.searchTerm = searchTerm;
      this.clampCurrentPage();
    },

    updatePage(value) {
      this.currentPage += value;
      this.clampCurrentPage();
    },
    
    getImagePath,
    getTranslationFromJSONObject(data, string) {
      return string.trim() in data? data[string.trim()]: string;
    },

    updateRouteQueryParams() {
      const { sortOption, sortReverse, filterOption, currentPage } = this;
      this.$router.push({
        query: {
          sort: sortOption,
          reverse: sortReverse,
          filter: filterOption,
          page: currentPage,
        },
      });
    },

    clampCurrentPage() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      if (this.currentPage < 1 && this.totalPages !== 0) {
        this.currentPage = 1;
      }
    }
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
      var filtered = this.sortedShips;

      if (this.filterOption !== 0) {
        filtered = filtered.filter(ship => ship.api_stype == this.filterOption);
      }

      const searchTerm = this.searchTerm.trim().toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(ship =>
          this.getTranslationFromJSONObject(this.shipNameTLs, ship.api_name)
            .toLowerCase()
            .includes(searchTerm)
        );
      }

      return filtered;
    },
    displayedShips() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredShips.slice(start, start + this.perPage);
    }
  },
  watch: {
    sortOption: 'updateRouteQueryParams',
    sortReverse: 'updateRouteQueryParams',
    filterOption: 'updateRouteQueryParams',
    currentPage: 'updateRouteQueryParams',
  },
  created() {
    this.retrieveData();

    this.$router.push({
      query: {
        sort: this.sortOption,
        reverse: this.sortReverse,
        filter: this.filterOption,
        page: this.currentPage,
      },
    });
  }
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 130px 0;
}
</style>
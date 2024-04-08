<template>
<EquipmentPageHeader :initialSortReverse="sortReverse" @sort="sortEquipmentBy" @reverse-sort="reverseSort" @filter="filterEquipmentBy"/>

<LoadingScreen v-if="isLoading"/>
<div v-else class="main">
  <EquipmentCard
  v-for="(equipment, index) in displayedEquipment" :key="index"
  :image="getImagePath(equipment.api_id, 'slot', 'card', 'png')"
  :name="getTranslationFromJSONObject(equipmentNameTLs, equipment.api_name)"
  :type="getTranslationFromJSONObject(equipmentTypeTLs, equipmentTypeList[equipment.api_type[2]])"
  :firepower="equipment.api_houg"
  :torpedo="equipment.api_raig"
  :antiair="equipment.api_tyku"
  :armor="equipment.api_souk"
  :antisub="equipment.api_tais"
  :evasion="equipment.api_houk"
  :los="equipment.api_saku"
  :dive="equipment.api_baku"
  :precision="equipment.api_houm"
  :range="equipment.api_leng"
  :reach="equipment.api_distance"/>
</div>

<PageFooter :currentPage="currentPage" :totalPages="totalPages" @update-page="updatePage"/>
</template>

<script>
import { getApiData } from '@/service/api';
import { getEquipmentNameTL } from '@/service/equipment';
import { getEquipmentTypeTL } from '@/service/equipment_types';
import { getImagePath } from "@/service/path_parser";
import { getDefaultSortAndFilterOptions } from "@/service/query_parser";

import EquipmentPageHeader from '@/components/EquipmentPageHeader.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import EquipmentCard from '@/components/EquipmentCard.vue';
import PageFooter from '@/components/PageFooter.vue';

const sortOptions = {
  'id': (a, b) => a.api_id - b.api_id,
  'firepower': (a, b) => a.api_houg - b.api_houg,
  'torpedo': (a, b) => a.api_raig - b.api_raig,
  'anti-air': (a, b) => a.api_tyku - b.api_tyku,
  'armor': (a, b) => a.api_souk - b.api_souk,
  'antisub': (a, b) => a.api_tais - b.api_tais,
  'evasion': (a, b) => a.api_houk - b.api_houk,
  'los': (a, b) => a.api_saku - b.api_saku,
  'dive': (a, b) => a.api_baku - b.api_baku,
  'precision': (a, b) => a.api_houm - b.api_houm,
  'range': (a, b) => a.api_leng - b.api_leng,
  'reach': (a, b) => {
    const reachA = a.api_distance || -1;
    const reachB = b.api_distance || -1;

    if (reachA !== reachB) {
      return reachA - reachB;
    } else {
      const rangeA = a.api_leng || 0;
      const rangeB = b.api_leng || 0;
      return rangeA - rangeB;
    }
}
};

export default {
  name: 'EquipmentGallery',
  components: {
    EquipmentPageHeader,
    LoadingScreen,
    EquipmentCard,
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
    } = getDefaultSortAndFilterOptions(this.$route.query, 1);

    const defaultCurrentPage = parseInt(this.$route.query.page) || 1;

    return {
      apiData: {},
      equipmentList: [],
      equipmentTypeList: {}, 
      isLoading: false,
      sortOption,
      sortReverse,
      filterOption,
      searchTerm: '',
      currentPage: defaultCurrentPage,
      perPage: 20,
      equipmentNameTLs: {},
      equipmentTypeTLs: {},
    };
  },
  methods: {
    async retrieveData() {
      this.isLoading = true;
      try {
        this.apiData = await getApiData();
        this.equipmentList = await this.preFilterEquipment();
        this.equipmentTypeList = await this.makeEquipmentTypeTable();
        this.equipmentNameTLs = getEquipmentNameTL();
        this.equipmentTypeTLs = getEquipmentTypeTL();
      } finally {
        this.isLoading = false;
        this.clampCurrentPage();}
    },
    async preFilterEquipment() {
      // removes enemy equipment from the list, which lack an image
      return this.apiData.api_mst_slotitem.filter(equipment => equipment.api_id < 1501);
    },
    async makeEquipmentTypeTable() {
      const equipmentTypeTable = {};
      this.apiData.api_mst_slotitem_equiptype.forEach(type => {
        equipmentTypeTable[type.api_id] = type.api_name;
      });
      return equipmentTypeTable;
    },

    sortEquipmentBy(option) {
      this.sortOption = option;
    },
    reverseSort() {
      this.sortReverse = !this.sortReverse;
    },
    filterEquipmentBy(option, searchTerm) {
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
      return string.trim() in data ? data[string.trim()] : string;
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
      return this.filteredEquipment.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
  
    sortedEquipment() {
      return this.sortReverse? this.equipmentList.sort(sortOptions[this.sortOption]).reverse() : this.equipmentList.sort(sortOptions[this.sortOption]);
    },
    filteredEquipment() {
      var filtered = this.sortedEquipment;

      if (this.filterOption !== 0) {
        filtered = filtered.filter(equipment => equipment.api_type[2] == this.filterOption);
      }

      const searchTerm = this.searchTerm.trim().toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(equipment =>
          this.getTranslationFromJSONObject(this.equipmentNameTLs, equipment.api_name)
            .toLowerCase()
            .includes(searchTerm)
        );
      }

      return filtered;
    },
    displayedEquipment() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredEquipment.slice(start, start + this.perPage);
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
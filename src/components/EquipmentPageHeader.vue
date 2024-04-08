<template>
<div class="top-bar">
  <p>Sort by</p>
  <select name="sort-options" class="sort-options" v-model="sortOption" @change="sortEquipment">
    <option v-for="(optionLabel, optionValue) in sortOptions" :value="optionLabel" :key="optionLabel">{{ optionValue }}</option>
  </select>
  <div class="custom-arrow" :class="{ 'descending': localSortReverse, 'ascending': !localSortReverse }" @click="reverseSort"></div>
  <p>Filter by</p>
  <select name="filter-options" class="filter-options" v-model="filterOption" @change="filterEquipment">
    <option v-for="(optionLabel, optionValue) in filterOptions" :value="optionValue" :key="optionValue">{{ optionLabel }}</option>
  </select>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Search by name..."
      @input="filterEquipment"
    />
  </div>
</div>
</template>

<script>
import { getDefaultSortAndFilterOptions } from "@/service/query_parser";

export default {
  props: {
    initialSortReverse: Boolean,
  },
  data() {
    const {
      sortOption,
      sortReverse,
      filterOption
    } = getDefaultSortAndFilterOptions(this.$route.query, 1);

    return {
      sortOptions: {
        'ID': 'id',
        'FP': 'firepower',
        'TP': 'torpedo',
        'AA': 'anti-air',
        'AR': 'armor',
        'ASW': 'antisub',
        'EVA': 'evasion',
        'LoS': 'los',
        'BMB': 'dive',
        'ACC': 'precision',
        'Range': 'range',
        'Reach': 'reach',
      },
      sortOption,
      localSortReverse: sortReverse,

      // filterOptions: {0: 'All', 1: '小口径主砲', 2: '中口径主砲', 3: '大口径主砲', 4: '副砲', 5: '魚雷', 6: '艦上戦闘機', 7: '艦上爆撃機', 8: '艦上攻撃機', 9: '艦上偵察機', 10: '水上偵察機', 11: '水上爆撃機', 12: '小型電探', 13: '大型電探', 14: 'ソナー', 15: '爆雷', 16: '追加装甲', 17: '機関部強化', 18: '対空強化弾', 19: '対艦強化弾', 20: 'VT信管', 21: '対空機銃', 22: '特殊潜航艇', 23: '応急修理要員', 24: '上陸用舟艇', 25: 'オートジャイロ', 26: '対潜哨戒機', 27: '追加装甲(中型)', 28: '追加装甲(大型)', 29: '探照灯', 30: '簡易輸送部材', 31: '艦艇修理施設', 32: '潜水艦魚雷', 33: '照明弾', 34: '司令部施設', 35: '航空要員', 36: '高射装置', 37: '対地装備', 38: '大口径主砲（II）', 39: '水上艦要員', 40: '大型ソナー', 41: '大型飛行艇', 42: '大型探照灯', 43: '戦闘糧食', 44: '補給物資', 45: '水上戦闘機', 46: '特型内火艇', 47: '陸上攻撃機', 48: '局地戦闘機', 49: '陸上偵察機', 50: '輸送機材', 51: '潜水艦装備', 52: '陸戦部隊', 53: '大型陸上機', 54: '水上艦装備', 56: '噴式戦闘機', 57: '噴式戦闘爆撃機', 58: '噴式攻撃機', 59: '噴式偵察機', 93: '大型電探（II）', 94: '艦上偵察機（II）', 95: '副砲（II）'},
      filterOptions: {0: 'All', 1: 'Small Cal. Main Gun', 2: 'Medium Cal. Main Gun', 3: 'Large Cal. Main Gun', 4: 'Secondary Gun', 5: 'Torpedo', 6: 'Fighter Aircraft', 7: 'Dive Bomber', 8: 'Torpedo Bomber', 9: 'Recon Aircraft', 10: 'Recon Seaplane', 11: 'Seaplane Bomber', 12: 'Small Radar', 13: 'Large Radar', 14: 'Sonar', 15: 'Depth Charge', 16: 'Extra Armor', 17: 'Engine', 18: 'AA Shell', 19: 'AP Shell', 20: 'VT Fuze', 21: 'AA Machine Gun', 22: 'Midget Submarine', 23: 'Emergency Repair', 24: 'Landing Craft', 25: 'Autogyro', 26: 'Anti-Sub Patrol', 27: 'Armor (Medium)', 28: 'Armor (Large)', 29: 'Searchlight', 30: 'Supply Container', 31: 'Ship Repair Facility', 32: 'Submarine Torpedo', 33: 'Star Shell', 34: 'Command Facility', 35: 'Aviation Personnel', 36: 'AA Fire Director', 37: 'Anti-Ground', 38: 'Large Cal. Main Gun (2)', 39: 'Ship Personnel', 40: 'Large Sonar', 41: 'Large Flying Boat', 42: 'Large Searchlight', 43: 'Combat Ration', 44: 'Supplies', 45: 'Seaplane Fighter', 46: 'Amphibious Tank', 47: 'LB Attack Aircraft', 48: 'Interceptor', 49: 'LB Recon Aircraft', 50: 'Transport Device', 51: 'Submarine Equipment', 52: 'Landing Force', 53: 'Large LB Aircraft', 54: 'Surface Equipment', 56: 'Jet Fighter', 57: 'Jet Fighter-Bomber', 58: 'Jet Torpedo Bomber', 59: 'Jet Recon Aircraft', 93: 'Large Radar (2)', 94: 'Recon Aircraft (2)', 95: 'Secondary (2)'},
      filterOption,
      searchTerm: '',
    };
  },
  methods: {
    sortEquipment() {
      this.$emit('sort', this.sortOption);
    },
    reverseSort() {
      this.localSortReverse = !this.localSortReverse;
      this.$emit('reverse-sort');
    },
    filterEquipment() {
      this.$emit('filter', this.filterOption, this.searchTerm);
    }
  },
};
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
  top: 50px;
  left: 0;
  background-color: rgb(48, 0, 36);
  z-index: 3;
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

.search-bar input {
  width: 250px;
  padding: 5px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
}
</style>
<template>
<div class="top-bar">
  <p>Sort by</p>
  <select name="sort-options" class="sort-options" v-model="sortOption" @change="sortShips">
    <option v-for="(optionLabel, optionValue) in sortOptions" :value="optionLabel" :key="optionLabel">{{ optionValue }}</option>
  </select>
  <div class="custom-arrow" :class="{ 'descending': !sortReverse, 'ascending': sortReverse }" @click="reverseSort"></div>
  <p>Filter by</p>
  <select name="filter-options" class="filter-options" v-model="filterOption" @change="filterShips">
    <option v-for="(optionLabel, optionValue) in filterOptions" :value="optionValue" :key="optionValue">{{ optionLabel }}</option>
  </select>
</div>
</template>

<script>
export default {
  data() {
    return {
      sortOptions: {
        'ID': 'id',
        'HP': 'health',
        'FP': 'firepower',
        'TP': 'torpedo',
        'AA': 'anti-air',
        'AR': 'armor'
      },
      sortOption: 'id',
      sortReverse: false,

      // filterOptions: {0: 'All', 1: '海防艦', 2: '駆逐艦', 3: '軽巡洋艦', 4: '重雷装巡洋艦', 5: '重巡洋艦', 6: '航空巡洋艦', 7: '軽空母', 8: '高速戦艦', 9: '戦艦', 10: '航空戦艦', 11: '正規空母', 13: '潜水艦', 14: '潜水空母', 16: '水上機母艦', 17: '揚陸艦', 18: '装甲空母', 19: '工作艦', 20: '潜水母艦', 21: '練習巡洋艦', 22: '補給艦'},
      filterOptions: {0: 'All', 1: 'DE', 2: 'DD', 3: 'CL', 4: 'CLT', 5: 'CA', 6: 'CAV', 7: 'CVL', 8: 'FBB', 9: 'BB', 10: 'BBV', 11: 'CV', 13: 'SS', 14: 'SSV', 16: 'AV', 17: 'LHA', 18: 'CVB', 19: 'AR', 20: 'AS', 21: 'CT', 22: 'AO'},
      filterOption: 0,
    };
  },
  methods: {
    sortShips() {
      this.$emit('sort', this.sortOption);
    },
    reverseSort() {
      this.sortReverse = !this.sortReverse;
      this.$emit('reverse-sort');
    },
    filterShips() {
      this.$emit('filter', this.filterOption);
    }
  }
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
</style>
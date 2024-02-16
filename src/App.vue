<template>
  <div v-for="ship in apiData.api_mst_ship">
    <div v-if="ship.api_taik !== undefined">
      <!--{{ ship }}-->
      <ShipCard
      :name="ship.api_name"
      :health="ship.api_taik[1]"
      :firepower="ship.api_houg[1]"
      :torpedo="ship.api_raig[1]"
      :antiair="ship.api_tyku[1]"
      :armor="ship.api_souk[1]"/>
    </div>
  </div>
  <div>
    {{ apiData.api_mst_ship[0].api_taik[1] }}
  </div>
</template>

<script>
import { getApiData } from './service/api';
import ShipCard from './components/Ship.vue'
export default {
  name: 'Gallery',
  data() {
    return {
      apiData: []
    }
  },
  methods: {
    async retrieveApiData() {
      this.apiData = await getApiData()
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
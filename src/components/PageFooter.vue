<template>
<div class="pagination">
    <button @click="updatePage(-1)" :disabled="currentPage <= 1">Previous</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="updatePage(+1)" :disabled="currentPage >= totalPages">Next</button>
</div>
</template>
  
<script>
export default {
    name: 'PageFooter',
    props: {
        currentPage: Number,
        totalPages: Number
    },
    methods: {
        updatePage(value) {
            this.$emit('update-page', value);
        }
    }
};
</script>
  
<style scoped>
button:disabled {
    color: rgb(118, 118, 118);
    background-color: rgb(35, 35, 35);
}

button:disabled:active {
    color: rgb(118, 118, 118);
    background-color: rgb(35, 35, 35);
}

.pagination {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 10px;
  bottom: 50px;
  left: 0;
  background-color: rgb(48, 0, 36);
  z-index: 3;
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
<template>
<footer>
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
</footer>
</template>
  
<script>
export default {
    name: 'PageFooter',
    props: {
        currentPage: Number,
        totalPages: Number
    },
    methods: {
        nextPage() {
            this.$emit('next-page');
        },
        prevPage() {
            this.$emit('prev-page');
        }
    }
};
</script>
  
<style scoped>
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
<template>
<header>
  KanColle Glossary ・
  <nav>
    <p v-if="$route.name != 'ships'" class="ships">
      <router-link to="/ships">Browse the Shipgirl List</router-link>
    </p>
    <p v-if="$route.name != 'equipment'" class="equipment">
      <router-link to="/equipment">Browse the Equipment List</router-link>
    </p>
  </nav>
</header>
<router-view v-slot="{ Component }">
  <transition name="slide-fade">
    <div>
      <component :is="Component" />
    </div>
  </transition>
</router-view>
<footer>
  Powered by VueJS - Any issues? Contact Oradimi on the English KC Discord
</footer>
</template>

<script>
export default {
  name: 'KanColleGallery',
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

p > * {
  color: rgb(227, 201, 29);
}

p > *:hover {
  background-color: rgba(148, 132, 23, 0.2);
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
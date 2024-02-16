<template>
    <div class="ship-card">
        <h2 class="name">{{ name }}</h2>
        <div class="stats">
            <p class="health">HP {{ health }}</p>
            <p class="firepower">FP {{ firepower }}</p>
            <p class="torpedo">TP {{ torpedo }}</p>
            <p class="antiair">AA {{ antiair }}</p>
            <p class="armor">AR {{ armor }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShipCard',
    props: {
        name: {type: String, required: true},
        health: {type: String, required: true},
        firepower: {type: String, required: true},
        torpedo: {type: String, required: true},
        antiair: {type: String, required: true},
        armor: {type: String, required: true}
    }
}
</script>

<style scoped>
.ship-card {
    background-image:
    linear-gradient(to bottom, rgba(255, 255, 255, 0.169), rgb(48, 0, 36)),
    url('@/assets/Nagato.png');
    width: 218px;
    height: 310px;
    background-size: cover;
    color: white;
}

.name {
    padding: 20px;
    display: flex;
}

.ship-card h2 {
    align-self: flex-end;
}

.stats {
    padding: 20px;
    display: flex;
}

.stats p {
    align-self: flex-end;
    padding-left: 10px;
}
</style>
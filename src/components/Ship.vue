<template>
    <div class="ship-card"  :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.169) 30%, rgb(48, 0, 36) 100%), url(' + image + ')' }">
        <div class="content">
            <div class="info">
                <h2 class="name">{{ name }}</h2>
                <p class="type">{{ type }}</p>
            </div>
            <div class="stats">
                <p class="stat health">HP<br>{{ health }}</p>
                <p class="stat firepower">FP<br>{{ firepower }}</p>
                <p class="stat torpedo">TP<br>{{ torpedo }}</p>
                <p class="stat antiair">AA<br>{{ antiair }}</p>
                <p class="stat armor">AR<br>{{ armor }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShipCard',
    props: {
        image: {type: String, required: true},
        name: {type: String, required: true},
        type: {type: String, required: false},
        health: {type: Number, required: true},
        firepower: {type: Number, required: true},
        torpedo: {type: Number, required: true},
        antiair: {type: Number, required: true},
        armor: {type: Number, required: true}
    }
}
</script>

<style scoped>
.ship-card {
    display: flex;
    flex-direction: row;
    width: 218px;
    height: 310px;
    background-size: cover;
    color: white;
    border-radius: 10px;
    margin: 10px;
}

.content {
    width: 100%;
    padding: 10px;
    align-self: flex-end;
    align-content: center;
    margin-top: auto;
    display: flex;
    flex-direction: column;
}

.info {
    display: flex;
    align-items: center;
    padding: 10px;
}

.type::before {
    content: "・"
}

.stats {
    display: flex;
    justify-content: space-around;
}

.stat {
    text-align: center;
}
</style>
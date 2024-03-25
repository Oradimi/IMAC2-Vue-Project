<template>
    <div class="ship-card" :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.169) 30%, rgb(48, 0, 36) 100%), url(' + image + ')' }">
        <div class="content">
            <div class="info">
                <h2 class="name" ref="name_span" @mouseenter="scroll" @mouseleave="scrollBack"><span>{{ name }}</span></h2>
                <p class="type"><span>{{ type }}</span></p>
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
import { ref, onMounted } from 'vue';
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
    },
    methods: {
        scroll() {
            const transitionTimePerPixel = 0.01;
            const nameSpan = this.$refs.name_span;
            const textWidth = nameSpan.lastChild.clientWidth;
            const boxWidth = parseFloat(getComputedStyle(nameSpan).width);
            const translateVal = Math.min(boxWidth - textWidth, 0);
            const translateTime = - transitionTimePerPixel * translateVal + "s";
            nameSpan.lastChild.style.transitionDuration = translateTime;
            nameSpan.lastChild.style.transform = "translateX("+translateVal+"px)";
        },
        scrollBack() {
            const nameSpan = this.$refs.name_span;
            nameSpan.lastChild.style.transitionDuration = "0.3s";
            nameSpan.lastChild.style.transform = "translateX(0)";
        }
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
    flex-wrap: wrap;
    align-items: center;
    line-break: auto;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    mask-image: linear-gradient(to right, white 90%, transparent);
}

.name {
    max-width: 100%;
}

.name > span {
    display: inline-block;
    transition-timing-function: linear;
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
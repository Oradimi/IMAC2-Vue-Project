<template>
    <div class="ship-card"  :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.169) 30%, rgb(48, 0, 36) 100%), url(' + image + ')' }">
        <div class="content">
            <div class="info">
                <h2 class="name" ref="name_span"><span>{{ name }}</span></h2>
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
    setup() {
        const haha = 0;
        const name_span = ref(null);

        onMounted(() => {
            const transitionTimePerPixel = 0.01;
            if (name_span.value) {
                name_span.value.addEventListener('mouseenter', () => {
                    let textWidth = name_span.value.lastChild.clientWidth;
                    let boxWidth = parseFloat(getComputedStyle(name_span.value).width);
                    let translateVal = Math.min(boxWidth - textWidth, 0);
                    let translateTime = - transitionTimePerPixel * translateVal + "s";
                    name_span.value.lastChild.style.transitionDuration = translateTime;
                    name_span.value.lastChild.style.transform = "translateX("+translateVal+"px)";
                });
                name_span.value.addEventListener('mouseleave', () => {
                    name_span.value.lastChild.style.transitionDuration = "0.3s";
                    name_span.value.lastChild.style.transform = "translateX(0)";
                });
            }
        });

        return { name_span };
    },
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
    white-space: nowrap;
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
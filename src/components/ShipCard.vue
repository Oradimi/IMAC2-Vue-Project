<template>
    <div class="ship-card" :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.169) 30%, rgb(48, 0, 36) 100%), url(' + image + ')' }">
        <div class="content">
            <div class="info">
                <h2 class="name" :class="{ 'mask': nameNeedsMask }" ref="name_span" @mouseenter="scroll('name_span')" @mouseleave="scrollBack('name_span')"><span>{{ name }}</span></h2>
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
    data() {
        return {
            nameNeedsMask: false
        }
    },
    methods: {
        scroll(value) {
            const transitionTimePerPixel = 0.01;
            const span = this.$refs[value];
            const textWidth = span.lastChild.clientWidth;
            const boxWidth = parseFloat(getComputedStyle(span).width);
            const translateVal = Math.round(Math.min(boxWidth - textWidth, 0));
            if (translateVal < -6) {
                const translateTime = - transitionTimePerPixel * translateVal + "s";
                span.lastChild.style.transitionDuration = translateTime;
                const adjustedVal = translateVal - 16;
                span.lastChild.style.transform = "translateX("+adjustedVal+"px)";
            }
        },
        scrollBack(value) {
            const span = this.$refs[value];
            span.lastChild.style.transitionDuration = "0.3s";
            span.lastChild.style.transform = "translateX(0)";
        },
        needsMask(value, maskBool) {
            const span = this.$refs[value];
            const textWidth = span.lastChild.clientWidth;
            const boxWidth = parseFloat(getComputedStyle(span).width);
            const translateVal = Math.round(Math.min(boxWidth - textWidth, 0));
            this[maskBool] = translateVal < -6;
        },
        checkOverflow() {
            this.$nextTick(() => {
                this.needsMask('name_span', 'nameNeedsMask');
            });
        }
    },
    watch: {
        name: 'checkOverflow',
    },
    mounted() {
        this.checkOverflow();
    }
}
</script>

<style scoped>
.ship-card {
    display: flex;
    flex-direction: row;
    width: 218px;
    height: 300px;
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

.mask {
    mask-image: linear-gradient(to right, white 90%, transparent);
}
</style>
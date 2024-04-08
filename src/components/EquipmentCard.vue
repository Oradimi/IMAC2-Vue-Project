<template>
    <div class="equipment-card" :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.169) 30%, rgb(48, 0, 36) 100%), url(' + image + ')' }">
        <div class="content">
            <div class="info">
                <h2 class="name" :class="{ 'mask': nameNeedsMask }" ref="name_span" @mouseenter="scroll('name_span')" @mouseleave="scrollBack('name_span')"><span>{{ name }}</span></h2>
                <p class="type"><span>{{ type }}</span></p>
            </div>
            <div class="stats" :class="{ 'mask': statsNeedsMask }" ref="stats_span" @mouseenter="scroll('stats_span')" @mouseleave="scrollBack('stats_span')">
                <span>
                    <div>
                    <p v-if="firepower != 0" class="stat firepower">FP<br>{{ firepower }}</p>
                    <p v-if="torpedo != 0"class="stat torpedo">TP<br>{{ torpedo }}</p>
                    <p v-if="antiair != 0"class="stat antiair">AA<br>{{ antiair }}</p>
                    <p v-if="armor != 0"class="stat armor">AR<br>{{ armor }}</p>
                    <p v-if="antisub != 0" class="stat antisub">ASW<br>{{ antisub }}</p>
                    <p v-if="evasion != 0"class="stat evasion">EVA<br>{{ evasion }}</p>
                    <p v-if="los != 0"class="stat los">LoS<br>{{ los }}</p>
                    <p v-if="dive != 0"class="stat dive">BMB<br>{{ dive }}</p>
                    <p v-if="precision != 0" class="stat precision">ACC<br>{{ precision }}</p>
                    <p v-if="range != 0"class="stat range">Range<br>{{ range }}</p>
                    <p v-if="reach != undefined && reach != 0"class="stat reach">Reach<br>{{ reach }}</p>
                    </div>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
export default {
    name: 'EquipmentCard',
    props: {
        image: {type: String, required: true},
        name: {type: String, required: true},
        type: {type: String, required: false},
        firepower: {type: Number, required: false},
        torpedo: {type: Number, required: false},
        antiair: {type: Number, required: false},
        armor: {type: Number, required: false},
        antisub: {type: Number, required: false},
        evasion: {type: Number, required: false},
        los: {type: Number, required: false},
        dive: {type: Number, required: false},
        precision: {type: Number, required: false},
        range: {type: Number, required: false},
        reach: {type: Number, required: false},
    },
    data() {
        return {
            nameNeedsMask: false,
            statsNeedsMask: false
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
                this.needsMask('stats_span', 'statsNeedsMask');
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
.equipment-card {
    display: flex;
    flex-direction: row;
    width: 218px;
    height: 218px;
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
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.name {
    max-width: 100%;
    line-height: 28px;
}

.name > span {
    display: inline-block;
    transition-timing-function: linear;
}

.type {
    line-height: 24px;
}

.type::before {
    content: "・"
}

.stats {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.stats > span {
    display: inline-block;
    min-width: 100%;
    transition-timing-function: linear;
}

.stats > span > div {
    display: flex;
    justify-content: space-around;
}

.stats > span > div * {
    justify-content: space-around;
}

.stat {
    flex: 1;
    text-align: center;
    line-height: 16px;
    padding: 0 2px;
    max-width: calc(100% / 3);
    box-sizing: border-box;
}

.mask {
    mask-image: linear-gradient(to right, white 90%, transparent);
}
</style>
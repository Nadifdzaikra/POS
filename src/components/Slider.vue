<script setup>
import { ref } from 'vue'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  sliderWidth: { type: String, default: '392px' }
})
const emits = defineEmits(['update:targetValue'])

const value = ref(props.min)
const fillWidth = ref('0%')
const tooltipLeft = ref('0px')
const show = ref(false)

const updateTooltip = (event) => {
  const percent = ((event.target.value - props.min) / (props.max - props.min)) * 100
  fillWidth.value = `${percent}%`
  tooltipLeft.value = `${percent}%`
  emits('update:targetValue', value.value)
}

const showTooltip = () => {
  show.value = true
}

const hideTooltip = () => {
  show.value = false
}
</script>

<template>
  <div class="slider__container flex fd-row align-items-center">
    <span class="fw-500">{{ props.min }}%</span>
    <div
      class="slider__input-container"
      @mousedown="showTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
    >
      <input
        type="range"
        v-model="value"
        :min="props.min"
        :max="props.max"
        @input="updateTooltip"
        @mouseup="hideTooltip"
        class="slider__input"
        :style="{
          width: props.sliderWidth
        }"
      />
      <div class="slider__fill" :style="{ width: fillWidth }"></div>
      <div v-if="show" class="slider__tooltip" :style="{ left: tooltipLeft }">{{ value }}</div>
    </div>
    <span class="fw-500">{{ props.max }}%</span>
  </div>
</template>

<style scoped>
.slider__container {
  position: relative;
}

.slider__input-container {
  position: relative;
  top: -4px;
  margin: 1rem 0.4rem;
}

.slider__input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(214, 212, 212, 1);
  outline: none;
  opacity: 1;
  position: relative;
}

.slider__fill {
  position: absolute;
  top: 13.5px;
  left: 0;
  height: 4px;
  background-color: rgba(102, 102, 102, 0.6);
  border-radius: 2px;
}

.slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(102, 102, 102, 1);
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.slider__input::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(102, 102, 102, 1);
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.slider__tooltip {
  position: absolute;
  bottom: calc(100% - 0.25rem);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
}
</style>

<script setup>
// Any element with a hand-drawn, boiling border and a tone fill behind its content.
import { computed, ref } from 'vue'
import Boil from './Boil.vue'
import { rectFrames, TONES } from './geometry'
import { useSize } from './useSize'

const props = defineProps({
  as: { type: String, default: 'div' },
  tone: { type: String, default: 'paper' },
  amp: { type: Number, default: 1.6 },
  seed: { type: Number, default: 3 },
  step: { type: Number, default: 180 },
  still: { type: Boolean, default: false },
  overshoot: { type: Number, default: 4 },
  strokeWidth: { type: String, default: 'var(--stroke-ink)' },
  bodyClass: { type: [String, Array, Object], default: '' },
})

const el = ref(null)
const { width, height } = useSize(el)
const tone = computed(() => TONES[props.tone] || TONES.paper)
const frames = computed(() =>
  width.value ? rectFrames(width.value, height.value, props.amp, props.seed, props.overshoot) : [],
)
</script>

<template>
  <component :is="as" ref="el" class="sk-box" :style="{ color: tone.text }">
    <svg class="sk-box-svg" aria-hidden="true" focusable="false">
      <Boil v-if="frames.length" v-slot="{ frame }" :frames="frames" :step="step" :still="still">
        <path v-if="tone.fill !== 'none'" :d="frame.fill" :style="{ fill: tone.fill }" />
        <path :d="frame.stroke" class="sk-stroke" :style="{ strokeWidth }" />
      </Boil>
    </svg>
    <span class="sk-box-body" :class="bodyClass"><slot /></span>
  </component>
</template>

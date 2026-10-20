<script setup>
// Messy hand-drawn squared paper behind the page.
import { computed, ref } from 'vue'
import Boil from './Boil.vue'
import { gridFrames } from './geometry'
import { useSize } from './useSize'

const props = defineProps({
  cell: { type: Number, default: 40 },
  messiness: { type: Number, default: 0.6 },
  seed: { type: Number, default: 7 },
  strays: { type: Number, default: undefined },
  step: { type: Number, default: 180 },
  fixed: { type: Boolean, default: false },
  still: { type: Boolean, default: false },
})

const layer = ref(null)
const { width, height } = useSize(layer)
const frames = computed(() =>
  width.value ? gridFrames(width.value, height.value, props.cell, props.messiness, props.seed, props.strays) : [],
)
</script>

<template>
  <div class="sk-grid">
    <div ref="layer" class="sk-grid-layer" :class="{ 'sk-grid-fixed': fixed }" aria-hidden="true">
      <svg v-if="width" :width="width" :height="height" class="sk-grid-svg">
        <Boil v-slot="{ frame }" :frames="frames" :step="step" :still="still">
          <path :d="frame.thin" style="stroke-width: 0.9" />
          <path :d="frame.mid" style="stroke-width: 1.3" />
          <path :d="frame.thick" style="stroke-width: 1.9" />
          <path :d="frame.faint" style="stroke-width: 1; opacity: 0.55" />
        </Boil>
      </svg>
    </div>
    <div class="sk-grid-content"><slot /></div>
  </div>
</template>

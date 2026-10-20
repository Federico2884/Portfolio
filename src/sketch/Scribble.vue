<script setup>
// An accent scribble around a word: double underline, circle or strike.
import { computed, ref } from 'vue'
import Boil from './Boil.vue'
import { scribbleFrames } from './geometry'
import { useSize } from './useSize'

const props = defineProps({
  kind: { type: String, default: 'underline' },
  seed: { type: Number, default: 9 },
  step: { type: Number, default: 180 },
  still: { type: Boolean, default: false },
})

const el = ref(null)
const { width, height } = useSize(el)
const frames = computed(() => (width.value ? scribbleFrames(width.value, height.value, props.kind, props.seed) : []))
</script>

<template>
  <span ref="el" class="sk-scribble" :class="'sk-scribble-' + kind">
    <svg class="sk-scribble-svg" aria-hidden="true">
      <Boil v-if="frames.length" v-slot="{ frame }" :frames="frames" :step="step" :still="still">
        <path :d="frame" class="sk-scribble-stroke" />
      </Boil>
    </svg>
    <span class="sk-scribble-text"><slot /></span>
  </span>
</template>

<script setup>
// A hand-drawn box, like a dialog box in a sketchbook. Optional tab title.
import SketchBox from './SketchBox.vue'

defineProps({
  as: { type: String, default: 'section' },
  title: { type: String, default: '' },
  tone: { type: String, default: 'paper' },
  seed: { type: Number, default: 11 },
  amp: { type: Number, default: 1.6 },
  still: { type: Boolean, default: false },
})
</script>

<template>
  <SketchBox :as="as" :tone="tone" :seed="seed" :amp="amp" :still="still" class="sk-frame">
    <span v-if="title" class="sk-frame-title">{{ title }}</span>
    <slot />
  </SketchBox>
</template>

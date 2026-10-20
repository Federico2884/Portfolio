<script setup>
// Small hand-drawn label for categories and tags.
import SketchBox from './SketchBox.vue'

defineProps({
  tone: { type: String, default: 'paper' },
  seed: { type: Number, default: 2 },
  still: { type: Boolean, default: false },
})
</script>

<template>
  <SketchBox as="span" :tone="tone" :amp="0.9" :seed="seed" :step="200" :overshoot="2" :still="still" stroke-width="1.6px" class="sk-tag">
    <slot />
  </SketchBox>
</template>

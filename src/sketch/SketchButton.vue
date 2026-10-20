<script setup>
// Hand-drawn button or link. Still at rest; boils and shows a scribbled arrow on hover/focus.
import SketchBox from './SketchBox.vue'

defineProps({
  variant: { type: String, default: 'plain' }, // plain | primary
  href: { type: String, default: '' },
  type: { type: String, default: 'button' },
  seed: { type: Number, default: 5 },
  pressed: { type: Boolean, default: undefined },
})
</script>

<template>
  <SketchBox
    :as="href ? 'a' : 'button'"
    :href="href || undefined"
    :type="href ? undefined : type"
    :aria-pressed="pressed"
    :tone="variant === 'primary' || pressed ? 'ink' : 'paper'"
    :amp="1.3"
    :seed="seed"
    :step="120"
    :overshoot="3"
    class="sk-btn"
    :class="'sk-btn-' + variant"
    body-class="sk-btn-body"
  >
    <svg class="sk-btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 3.2 Q8 6 13.2 8.1 Q7.6 10.4 2.8 12.9 Q4.4 8 2.5 3.2 Z" />
    </svg>
    <span class="sk-btn-label"><slot /></span>
  </SketchBox>
</template>

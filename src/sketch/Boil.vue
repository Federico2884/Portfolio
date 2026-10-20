<script setup>
// Three frames of the same drawing shown one after another: the "boil".
defineProps({
  frames: { type: Array, required: true },
  step: { type: Number, default: 180 },
  still: { type: Boolean, default: false },
})
</script>

<template>
  <g class="sk-boil" :class="{ 'sk-still': still }">
    <g
      v-for="(frame, i) in frames"
      :key="i"
      class="sk-f"
      :style="{ animationDuration: step * 3 + 'ms', animationDelay: step * i + 'ms' }"
    >
      <slot :frame="frame" />
    </g>
  </g>
</template>

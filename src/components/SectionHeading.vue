<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
})
</script>

<template>
  <div v-reveal class="mb-12 text-center">
    <p
      v-if="eyebrow"
      class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400"
    >
      {{ eyebrow }}
    </p>
    <h2 class="text-3xl font-bold text-white sm:text-4xl">{{ title }}</h2>
    <div
      class="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
    ></div>
  </div>
</template>

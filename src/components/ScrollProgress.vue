<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)

function onScroll() {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? (el.scrollTop / max) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="fixed left-0 top-0 z-[60] h-0.5 w-full">
    <div
      class="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

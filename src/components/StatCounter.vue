<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  duration: { type: Number, default: 1600 },
})

const display = ref(0)
const root = ref(null)
let observer

function animate() {
  const start = performance.now()
  function frame(now) {
    const progress = Math.min((now - start) / props.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(eased * props.value)
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 },
  )
  observer.observe(root.value)
})
onUnmounted(() => observer && observer.disconnect())
</script>

<template>
  <div ref="root" class="text-center">
    <p class="text-4xl font-bold text-white sm:text-5xl">
      <span class="text-gradient">{{ display }}{{ suffix }}</span>
    </p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const glow = ref(null)
const active = ref(false)
let raf
let running = false
let tx = -400
let ty = -400
let cx = -400
let cy = -400

function startLoop() {
  if (running) return
  running = true
  raf = requestAnimationFrame(loop)
}

function onMove(e) {
  tx = e.clientX
  ty = e.clientY
  startLoop()
}

function loop() {
  // Ease toward the cursor so the glow trails smoothly instead of snapping.
  cx += (tx - cx) * 0.12
  cy += (ty - cy) * 0.12
  if (glow.value) {
    glow.value.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
  }
  // Stop the loop once it settles so we don't keep painting while idle.
  if (Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5) {
    running = false
    return
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch = window.matchMedia('(pointer: coarse)').matches
  if (reduce || touch) return
  active.value = true
  window.addEventListener('mousemove', onMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    v-if="active"
    ref="glow"
    aria-hidden="true"
    class="pointer-events-none fixed left-0 top-0 z-30 h-[22rem] w-[22rem] rounded-full opacity-60 blur-[80px]"
    style="
      background: radial-gradient(
        circle,
        rgba(139, 92, 246, 0.35),
        rgba(34, 211, 238, 0.12) 45%,
        transparent 70%
      );
      will-change: transform;
    "
  ></div>
</template>

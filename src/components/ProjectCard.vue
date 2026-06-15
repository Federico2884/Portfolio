<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  project: { type: Object, required: true },
})

const imgOk = ref(true)
const card = ref(null)
let enabled = false

function onMove(e) {
  if (!enabled || !card.value) return
  const rect = card.value.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  const rotateX = (py - 0.5) * -10
  const rotateY = (px - 0.5) * 10
  card.value.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  card.value.style.setProperty('--mx', `${px * 100}%`)
  card.value.style.setProperty('--my', `${py * 100}%`)
}

function onLeave() {
  if (!card.value) return
  card.value.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
}

onMounted(() => {
  enabled =
    !window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<template>
  <article
    ref="card"
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:border-violet-400/40 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.45)]"
    style="
      transform-style: preserve-3d;
      transition:
        transform 0.2s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease;
    "
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <!-- Cursor spotlight -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style="
        background: radial-gradient(
          18rem 18rem at var(--mx, 50%) var(--my, 50%),
          rgba(139, 92, 246, 0.18),
          transparent 60%
        );
      "
    ></div>

    <div class="relative aspect-video overflow-hidden">
      <img
        v-if="project.image && imgOk"
        :src="project.image"
        :alt="project.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        @error="imgOk = false"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-cyan-500/20"
      >
        <span class="text-4xl font-bold text-white/60">{{
          project.title.charAt(0)
        }}</span>
      </div>
      <span
        class="absolute left-3 top-3 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-violet-200 backdrop-blur"
      >
        {{ project.category }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3 class="text-lg font-semibold text-white">{{ project.title }}</h3>
      <p class="mt-2 flex-1 text-sm text-slate-400">{{ project.description }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="rounded-md bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-300"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-5 flex gap-4 text-sm font-medium">
        <a
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener"
          class="relative z-20 text-violet-300 transition hover:text-violet-200"
        >
          Live demo &rarr;
        </a>
        <a
          :href="project.code"
          target="_blank"
          rel="noopener"
          class="relative z-20 text-slate-400 transition hover:text-white"
        >
          Code
        </a>
      </div>
    </div>
  </article>
</template>

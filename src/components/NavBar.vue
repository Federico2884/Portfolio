<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const open = ref(false)
const scrolled = ref(false)

const links = [
  { to: '#home', label: 'Home' },
  { to: '#about', label: 'About' },
  { to: '#projects', label: 'Projects' },
  { to: '#education', label: 'Education' },
]

const activeSection = ref('#home')

function onScroll() {
  scrolled.value = window.scrollY > 20
}

let observer
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Track sections for active state highlight
  const sectionIds = ['home', 'about', 'projects', 'education']
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = `#${entry.target.id}`
        }
      })
    },
    {
      rootMargin: '-30% 0px -60% 0px', // Trigger active when section occupies middle 10% of viewport
    }
  )

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="
      scrolled
        ? 'border-b border-white/10 bg-[#08080c]/80 shadow-lg shadow-black/20 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent backdrop-blur-none'
    "
  >
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a
        href="#home"
        class="text-lg font-bold tracking-tight text-white transition hover:opacity-80"
      >
        &lt;Fe<span class="text-gradient">de</span>/&gt;
      </a>

      <!-- Desktop links -->
      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="link in links" :key="link.to">
          <a
            :href="link.to"
            class="nav-link group relative text-sm font-medium text-slate-400 transition hover:text-white"
            :class="{ 'exact-match': activeSection === link.to }"
          >
            {{ link.label }}
            <span
              class="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 group-hover:w-full"
              :class="{ 'w-full': activeSection === link.to }"
            ></span>
          </a>
        </li>
      </ul>

      <!-- Mobile toggle -->
      <button
        class="text-slate-300 md:hidden"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <svg
          class="h-6 w-6 transition-transform duration-300"
          :class="{ 'rotate-90': open }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
          />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition name="slide">
      <ul
        v-if="open"
        class="flex flex-col gap-1 border-t border-white/10 bg-[#08080c]/95 backdrop-blur-xl px-6 py-3 md:hidden"
      >
        <li v-for="(link, i) in links" :key="link.to">
          <a
            :href="link.to"
            class="block py-2 text-sm font-medium text-slate-400 transition-all"
            :class="{ 'text-violet-400 font-semibold': activeSection === link.to }"
            :style="{ transitionDelay: `${i * 50}ms` }"
            @click="open = false"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </Transition>
  </header>
</template>

<style scoped>
.nav-link.exact-match {
  color: white;
}
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

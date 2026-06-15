<script setup>
// NOTE: Tambahkan baris berikut di index.html bagian <head> agar devicons berfungsi:
// 

import { ref, computed } from 'vue'
import { useTypewriter } from '../composables/useTypewriter'
import ProjectCard from '../components/ProjectCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { projects } from '../data/projects'

const { text: typed } = useTypewriter([
  'Computer Science Student',
  'Data Analyst',
  'AI Enthusiast',
])

const featured = projects.slice(0, 3)

/* ── Skills data ── */
const skillCategories = [
  {
    label: 'Languages',
    items: [
      {
        name: 'C',
        color: '#A8B9CC',
        icon: 'devicon-c-plain colored',
        description: 'A low-level systems programming language that provides direct control over memory and hardware. Used to build operating systems, embedded systems, and high-performance applications.',
      },
      {
        name: 'C++',
        color: '#00599C',
        icon: 'devicon-cplusplus-plain colored',
        description: 'An extension of C with OOP (Object-Oriented Programming) support. It is very popular for game development, real-time systems, and applications that require maximum performance.',
      },
      {
        name: 'Python',
        color: '#3776AB',
        icon: 'devicon-python-plain colored',
        description: "A versatile language with clean, easy-to-learn syntax. It's a top choice for data science, machine learning, automation, and scripting thanks to its rich library ecosystem.",
      },
      {
        name: 'Java',
        color: '#E76F00',
        icon: 'devicon-java-plain colored',
        description: "An object-oriented language that runs on the JVM (Java Virtual Machine), making it cross-platform. It's widely used for enterprise applications, web backends, and Android development.",
      },
      {
        name: 'JavaScript',
        color: '#F7DF1E',
        icon: 'devicon-javascript-plain colored',
        description: 'The primary language for web development that runs directly in the browser. It enables the creation of interactive interfaces and can now also be used server-side via Node.js.',
      },
    ],
  },
  {
    label: 'Frameworks & Tools',
    items: [
      {
        name: 'Laravel',
        color: '#FF2D20',
        icon: 'devicon-laravel-plain colored',
        description: 'An elegant PHP framework for building web applications. It provides comprehensive features such as routing, an ORM (Eloquent), authentication, and the Blade templating system, accelerating the development process.',
      },
      {
        name: 'Android Studio',
        color: '#3DDC84',
        icon: 'devicon-androidstudio-plain colored',
        description: "Google's official IDE for Android app development. It includes an emulator, profiler, and integration with the Android SDK to efficiently build and debug mobile apps.",
      },
      {
        name: 'Vite',
        color: '#646CFF',
        icon: 'devicon-vitejs-plain colored',
        description: 'A next-generation build tool for blazing-fast front-end development. Utilizes native ES modules in the browser during development, resulting in instant Hot Module Replacement (HMR).',
      },
      {
        name: 'MySQL',
        color: '#4479A1',
        icon: 'devicon-mysql-plain colored',
        description: 'The most popular open-source relational database management system (RDBMS). Widely used for web applications, it supports standard SQL and is known for its reliability and performance.',
      },
      {
        name: 'Jupyter',
        color: '#F37626',
        icon: 'devicon-jupyter-plain colored',
        description: 'An interactive, web-based computing environment for writing and running code directly. It is very popular among data scientists for data exploration, visualization, and analysis documentation.',
      },
      {
        name: 'Anaconda',
        color: '#44A833',
        icon: 'devicon-anaconda-original colored',
        description: 'A Python/R distribution for scientific computing and data science. It simplifies package and environment management through conda, and comes with hundreds of pre-installed libraries for data analysis.',
      },
      {
        name: 'PyTorch',
        color: '#EE4C2C',
        icon: 'devicon-pytorch-original colored',
        description: "Open-source machine learning framework focuses on flexibility and iteration speed. Popular in AI research thanks to its dynamic computation graph and robust GPU support.",
      },
    ],
  },
]

const activeCategory = ref('all')
const selectedSkill = ref(null)

const displayedCategories = computed(() => {
  if (activeCategory.value === 'all') return skillCategories
  return skillCategories.filter((c) => c.label === activeCategory.value)
})

function selectSkill(skill) {
  selectedSkill.value = selectedSkill.value?.name === skill.name ? null : skill
}

/* ── Marquee items for Tilted Marquee on Hero ── */
const marqueeItemsCol1 = [
  'C', 'Python', 'JavaScript', 'Vite', 'PyTorch', 'MySQL',
  'C', 'Python', 'JavaScript', 'Vite', 'PyTorch', 'MySQL',
]
const marqueeItemsCol2 = [
  'C++', 'Java', 'Laravel', 'Android Studio', 'Jupyter', 'Anaconda',
  'C++', 'Java', 'Laravel', 'Android Studio', 'Jupyter', 'Anaconda',
]

// Nambah foto nanti
// /* ── About Me / Experience ── */
// const photoOk = ref(true)
// const profileSrc = '/profile.jpg'

/* ── Projects Category Filter ── */
const projectCategories = ['All', ...new Set(projects.map((p) => p.category))]
const activeProjectCategory = ref('All')

const filteredProjects = computed(() =>
  activeProjectCategory.value === 'All'
    ? projects
    : projects.filter((p) => p.category === activeProjectCategory.value),
)

/* ── Education ── */
const education = [
  {
    degree: 'S1 Computer Science',
    institution: 'Bina Nusantara University',
    period: '2024',
    description: 'Currently at semester 4, enthusiastic about Artificial Intelligence, Data Science, and their practical applications in solving real-world problems.',
    achievements: ['GPA 3.83/4.0'],
  },
  {
    degree: 'SMA',
    institution: 'SMA Talenta',
    period: '2021 - 2024',
    description: 'Science major with a strong aptitude for mathematics and analytical problem-solving',
    achievements: [],
  }
]

/* ── Connection Hub ── */
const emailCopied = ref(false)
function copyEmail() {
  navigator.clipboard.writeText('rikomarlian123@gmail.com')
  emailCopied.value = true
  setTimeout(() => {
    emailCopied.value = false
  }, 2000)
}
</script>

<template>
  <!-- Hero Section (#home) -->
  <section id="home" class="relative overflow-hidden min-h-[92vh] flex items-center scroll-mt-24">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div
        class="absolute left-1/4 top-12 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl animate-float-slow"
      ></div>
      <div
        class="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl animate-float-slower"
      ></div>
    </div>

    <div
      class="mx-auto max-w-5xl px-6 py-20 w-full grid md:grid-cols-[1.15fr_0.85fr] items-center gap-12"
    >
      <!-- Left aligned intro text -->
      <div class="text-left space-y-6">
        <h1
          v-reveal="{ delay: 100 }"
          class="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          Hi, I'm <span class="text-gradient">Federico Alex Marlian</span>
        </h1>

        <p
          v-reveal="{ delay: 200 }"
          class="text-xl text-slate-300 sm:text-2xl"
        >
          I'm a
          <span class="font-semibold text-violet-300">{{ typed }}</span
          ><span class="animate-blink text-violet-300">|</span>
        </p>

        <p
          v-reveal="{ delay: 300 }"
          class="max-w-lg text-base text-slate-400 sm:text-lg leading-relaxed"
        >
          I'm a Computer Science student, eager to learn and gain knowledge. Currently i'm passionate about Artificial Intelligence and related field such as Data Science, Deep Learning and Machine Learning.
        </p>

        <div
          v-reveal="{ delay: 400 }"
          class="flex flex-wrap gap-4 pt-2"
        >
          <a
            href="#projects"
            class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-medium text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.03] hover:shadow-violet-700/50"
          >
            View My Work
          </a>
          <!-- <a
            href="/cv.pdf"
            download
            class="rounded-lg border border-white/15 px-7 py-3 font-medium text-slate-200 transition hover:border-violet-400/50 hover:text-white"
          >
            Download CV
          </a> -->
        </div>
      </div>

      <!-- Right column: Dual Tilted Vertical Marquees -->
      <div 
        v-reveal="{ delay: 250 }"
        class="relative hidden md:flex items-center justify-center h-[520px] overflow-hidden tilted-marquee-container"
      >
        <div class="flex gap-4 transform -rotate-12 scale-105">
          <!-- Column A: Scrolls up -->
          <div class="flex flex-col gap-4 animate-scroll-up shrink-0 w-28">
            <div 
              v-for="(item, idx) in marqueeItemsCol1" 
              :key="item + '-' + idx" 
              class="px-3 py-4 rounded-2xl border border-white/10 bg-[#0c0c14]/40 backdrop-blur-md text-slate-300 text-sm font-semibold tracking-wide text-center shadow-lg shadow-black/10 select-none"
            >
              {{ item }}
            </div>
          </div>
          <!-- Column B: Scrolls down -->
          <div class="flex flex-col gap-4 animate-scroll-down shrink-0 w-28">
            <div 
              v-for="(item, idx) in marqueeItemsCol2" 
              :key="item + '-' + idx" 
              class="px-3 py-4 rounded-2xl border border-white/10 bg-[#0c0c14]/40 backdrop-blur-md text-slate-300 text-sm font-semibold tracking-wide text-center shadow-lg shadow-black/10 select-none"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 animate-bob"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>

  <!-- Skills & Tools Section -->
  <section id="skills" class="mx-auto max-w-5xl px-6 py-16 scroll-mt-24">
    <SectionHeading eyebrow="What I use" title="Skills & Tools" />

    <!-- Category filter -->
    <div v-reveal class="mb-8 flex flex-wrap justify-center gap-3">
      <button
        v-for="cat in ['all', 'Languages', 'Frameworks & Tools']"
        :key="cat"
        class="rounded-full border px-5 py-2 text-sm font-medium transition"
        :class="
          activeCategory === cat
            ? 'border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
            : 'border-white/15 text-slate-400 hover:border-violet-400/50 hover:text-white'
        "
        @click="activeCategory = cat"
      >
        {{ cat === 'all' ? 'All' : cat }}
      </button>
    </div>

    <!-- Skills grid per category -->
    <div v-for="category in displayedCategories" :key="category.label" class="mb-10 last:mb-0">
      <h3
        v-reveal
        class="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-slate-500"
      >
        <span class="h-px flex-1 bg-white/10"></span>
        {{ category.label }}
        <span class="h-px flex-1 bg-white/10"></span>
      </h3>

      <div
        class="grid gap-4"
        :class="category.items.length <= 5 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7'"
      >
        <button
          v-for="(skill, i) in category.items"
          :key="skill.name"
          v-reveal="{ delay: i * 70 }"
          class="skill-card group flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1"
          :class="{ 'ring-2': selectedSkill?.name === skill.name }"
          :style="{
            '--glow': skill.color,
            'ring-color': selectedSkill?.name === skill.name ? skill.color : 'transparent',
          }"
          @click="selectSkill(skill)"
        >
          <i
            :class="[skill.icon, 'text-4xl transition-transform duration-300 group-hover:scale-110']"
          ></i>
          <span class="text-sm font-medium text-slate-200">{{ skill.name }}</span>
        </button>
      </div>
    </div>

    <!-- Skill detail panel -->
    <Transition name="fade">
      <div
        v-if="selectedSkill"
        class="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
        :style="{ borderColor: `color-mix(in srgb, ${selectedSkill.color} 30%, transparent)` }"
      >
        <div class="flex items-start gap-4">
          <i
            :class="[selectedSkill.icon, 'text-5xl shrink-0 mt-0.5']"
          ></i>
          <div>
            <h4 class="text-lg font-bold text-white mb-1">{{ selectedSkill.name }}</h4>
            <p class="text-sm text-slate-400 leading-relaxed">{{ selectedSkill.description }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </section>

  <!-- Projects Section (#projects) -->
  <section id="projects" class="mx-auto max-w-5xl px-6 py-20 scroll-mt-24">
    <SectionHeading eyebrow="My work" title="Projects" />

    <!-- Filter tabs -->
    <div v-reveal class="mb-10 flex flex-wrap justify-center gap-3">
      <button
        v-for="cat in projectCategories"
        :key="cat"
        class="rounded-full border px-5 py-2 text-sm font-medium transition"
        :class="
          activeProjectCategory === cat
            ? 'border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
            : 'border-white/15 text-slate-400 hover:border-violet-400/50 hover:text-white'
        "
        @click="activeProjectCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Grid -->
    <TransitionGroup
      tag="div"
      name="card"
      class="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.title"
        :project="project"
      />
    </TransitionGroup>
  </section>

  <!-- Education Section (#education) -->
  <section id="education" class="mx-auto max-w-5xl px-6 py-20 scroll-mt-24">
    <SectionHeading eyebrow="Academic Journey" title="Education" />

    <!-- Timeline -->
    <div class="relative border-l border-white/10 pl-8">
      <div
        v-for="(edu, i) in education"
        :key="edu.degree"
        v-reveal="{ delay: i * 140 }"
        class="relative mb-14 last:mb-0"
      >
        <!-- Dot marker — cyan-to-violet gradient (inverse of Experience) -->
        <span
          class="absolute -left-[2.6rem] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 ring-4 ring-[#08080c]"
        ></span>

        <!-- Period -->
        <p class="text-sm font-medium text-cyan-400">{{ edu.period }}</p>

        <!-- Degree & Institution -->
        <h4 class="mt-1 text-lg font-semibold text-white">
          {{ edu.degree }}
          <span class="font-normal text-slate-400">- {{ edu.institution }}</span>
        </h4>

        <!-- Description -->
        <p class="mt-2 leading-relaxed text-slate-400">{{ edu.description }}</p>

        <!-- Achievement badges -->
        <div v-if="edu.achievements.length" class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="badge in edu.achievements"
            :key="badge"
            class="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-0.5 text-xs font-medium text-cyan-300"
          >
            {{ badge }}
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- Bento Connection Section -->
  <section id="connect" class="mx-auto max-w-5xl px-6 py-20 scroll-mt-24">
    <SectionHeading eyebrow="Let's connect" title="Get in Touch" />
    
    <div class="grid gap-6 md:grid-cols-3 md:grid-rows-2 max-w-5xl mx-auto mt-10">
      
      <!-- Card 1: Direct Contact (Double Width) -->
      <div 
        v-reveal 
        class="md:col-span-2 md:row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-8 relative overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all duration-300 shadow-md"
      >
        <!-- Glow background on hover -->
        <div 
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
          style="background: radial-gradient(circle at 30% 50%, rgba(167, 139, 250, 0.08), transparent 70%);"
        ></div>
        
        <div class="flex flex-col gap-4 relative z-10">
          <div class="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full w-fit border border-green-400/20">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
            </span>
            SYSTEM STATUS: ONLINE
          </div>
          <h4 class="text-3xl font-bold text-white tracking-tight">Contact</h4>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-wrap gap-3 mt-6 relative z-10">
          <button 
            @click="copyEmail" 
            class="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-violet-400/50 hover:bg-white/[0.08] px-5 py-3 text-sm font-medium text-white transition-all cursor-pointer"
          >
            <!-- Checkmark SVG when copied, otherwise copy icon -->
            <svg v-if="emailCopied" class="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="h-4 w-4 text-violet-300" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>{{ emailCopied ? 'Email Copied!' : 'Copy Email' }}</span>
          </button>
          
          <a 
            href="https://wa.me/6285724989305" 
            target="_blank" 
            rel="noopener"
            class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-[1.02] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-green-950/20 transition-all cursor-pointer"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.3 0-.5s-.7-1.6-.9-2.2c-.3-.6-.5-.5-.7-.5H8.4c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.5-.3M12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.6 15.6 2 13.8 2 12 2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9.8-10 9.8m8.5-18.3A11.9 11.9 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.2 1.6 6L0 24l6.2-1.6c1.8.9 3.8 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5"/>
            </svg>
            <span>WhatsApp Me</span>
          </a>
        </div>
      </div>
      
      <!-- Card 2: GitHub (Tall Card) -->
      <a 
        href="https://github.com/Federico2884" 
        target="_blank" 
        rel="noopener"
        v-reveal="{ delay: 100 }" 
        class="md:col-span-1 md:row-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-8 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300 shadow-md"
      >
        <!-- Glow background -->
        <div 
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
          style="background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08), transparent 70%);"
        ></div>
        
        <div class="flex items-center justify-between relative z-10 w-full">
          <span class="text-sm font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">Code Vault</span>
          <svg class="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 4.7 18 5 18 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12C24 5.4 18.6 0 12 0z"/>
          </svg>
        </div>
        
        <!-- Interactive Git Tree Visual -->
        <div class="my-6 flex justify-center items-center relative z-10 py-4">
          <svg class="h-28 w-28 text-emerald-500/60 group-hover:text-emerald-400 transition-colors" viewBox="0 0 100 100" fill="none">
            <!-- Branch lines -->
            <path d="M20 90 V10" stroke="currentColor" stroke-width="2" />
            <path class="git-line git-line-animated" d="M20 60 C 40 60, 45 40, 65 40 V10" stroke="#10B981" stroke-width="2" />
            <path class="git-line" d="M65 40 C 75 40, 80 30, 80 20 V10" stroke="#34D399" stroke-width="1.5" />
            
            <!-- Nodes -->
            <circle cx="20" cy="80" r="5" fill="#1e1e2d" stroke="currentColor" stroke-width="2" />
            <circle cx="20" cy="60" r="5" fill="#1e1e2d" stroke="currentColor" stroke-width="2" />
            <circle cx="20" cy="30" r="5" fill="#1e1e2d" stroke="currentColor" stroke-width="2" />
            
            <!-- Branch Nodes -->
            <circle cx="65" cy="40" r="4" fill="#10B981" />
            <circle cx="65" cy="20" r="4" fill="#10B981" />
            <circle cx="80" cy="20" r="3" fill="#34D399" />
          </svg>
        </div>
        
        <div class="relative z-10 w-full mt-auto">
          <p class="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">GitHub</p>
          <p class="text-xs text-slate-500 mt-1">Explore my open-source code and projects.</p>
        </div>
      </a>
      
      <!-- Card 3: LinkedIn (Square Card) -->
      <a 
        href="https://linkedin.com/in/federico-alex-marlian-017b22325" 
        target="_blank" 
        rel="noopener"
        v-reveal="{ delay: 150 }" 
        class="md:col-span-1 md:row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-6 relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300 shadow-md"
      >
        <!-- Glow background -->
        <div 
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
          style="background: radial-gradient(circle at 50% 50%, rgba(10, 102, 194, 0.08), transparent 70%);"
        ></div>
        
        <div class="flex items-start justify-between relative z-10 w-full">
          <div>
            <p class="text-base font-bold text-white group-hover:text-blue-300 transition-colors">LinkedIn</p>
            <p class="text-xs text-slate-500 mt-0.5">Professional Network</p>
          </div>
          <svg class="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8.3 18.3H5.5V9.7h2.8v8.6zM6.9 8.5a1.6 1.6 0 1 1 0-3.3 1.6 1.6 0 0 1 0 3.3zm11.4 9.8h-2.8v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.8V9.7h2.7v1.2h0a3 3 0 0 1 2.7-1.5c2.9 0 3.4 1.9 3.4 4.3v4.6z"/>
          </svg>
        </div>
        
        <!-- Ripple graphic -->
        <div class="my-3 flex justify-center items-center relative z-10">
          <svg class="h-16 w-16 text-blue-500/40 group-hover:text-blue-400 transition-colors" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="6" fill="currentColor" />
            <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="1.5" class="animate-ping opacity-30" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="1" class="animate-ping opacity-20" style="animation-delay: 0.5s" />
            <line x1="50" y1="50" x2="20" y2="20" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="80" cy="20" r="3" fill="currentColor" />
          </svg>
        </div>
      </a>
      
      <!-- Card 4: Instagram (Square Card) -->
      <a 
        href="https://instagram.com/fdrco_valvet" 
        target="_blank" 
        rel="noopener"
        v-reveal="{ delay: 200 }" 
        class="md:col-span-1 md:row-span-1 rounded-3xl border border-white/10 bg-white/[0.02] p-6 relative overflow-hidden flex flex-col justify-between group hover:border-pink-500/30 transition-all duration-300 shadow-md"
      >
        <!-- Glow background -->
        <div 
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
          style="background: radial-gradient(circle at 50% 50%, rgba(228, 64, 95, 0.08), transparent 70%);"
        ></div>
        
        <div class="flex items-start justify-between relative z-10 w-full">
          <div>
            <p class="text-base font-bold text-white group-hover:text-pink-300 transition-colors">Instagram</p>
            <p class="text-xs text-slate-500 mt-0.5">Feed</p>
          </div>
          <svg class="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9C5.4 2.5 6 2.3 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.3 2.6.8 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.2 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.7.5 3 .6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.2 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.7.6-3C24 15.7 24 15.3 24 12s0-3.7-.1-4.9c-.1-1.3-.2-2.2-.6-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1.1-2.2-1.4C18.9.3 18 .1 16.7.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.8-10.4a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z"/>
          </svg>
        </div>
        
        <!-- Interactive Feed grid mockup -->
        <div class="my-3 flex justify-center items-center relative z-10">
          <div class="grid grid-cols-3 gap-1.5 w-24 h-24">
            <div 
              v-for="i in 9" 
              :key="i" 
              class="rounded bg-gradient-to-br from-pink-500/10 to-violet-500/10 border border-white/5 transition-all duration-300 hover:scale-105 hover:from-pink-500/30 hover:to-violet-500/30 hover:border-pink-500/30"
              :style="{ transitionDelay: `${i * 20}ms` }"
            ></div>
          </div>
        </div>
      </a>
      
    </div>
  </section>
</template>

<style scoped>
.skill-card {
  position: relative;
}
.skill-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--glow) 12%, transparent),
    transparent 70%
  );
}
.skill-card:hover::before {
  opacity: 1;
}
.skill-card:hover {
  border-color: color-mix(in srgb, var(--glow) 40%, transparent);
  box-shadow: 0 0 24px -6px color-mix(in srgb, var(--glow) 25%, transparent);
}

/* Tilted Marquee styles */
.tilted-marquee-container {
  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
}

@keyframes scroll-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@keyframes scroll-down {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

.animate-scroll-up {
  animation: scroll-up 24s linear infinite;
}

.animate-scroll-down {
  animation: scroll-down 24s linear infinite;
}

.tilted-marquee-container:hover .animate-scroll-up,
.tilted-marquee-container:hover .animate-scroll-down {
  animation-play-state: paused;
}

/* GitHub Node Branch visual styling */
.git-line {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
}
.group:hover .git-line {
  animation: git-pulse 2.2s ease-out forwards;
}
@keyframes git-pulse {
  to {
    stroke-dashoffset: 0;
  }
}

.git-line-animated {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: git-pulse-infinite 6s linear infinite;
}
@keyframes git-pulse-infinite {
  0% {
    stroke-dashoffset: 200;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
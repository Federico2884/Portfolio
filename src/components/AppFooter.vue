<script setup>
const year = new Date().getFullYear()

// const socials = [
//   { label: 'GitHub', href: 'https://github.com' },
//   { label: 'LinkedIn', href: 'https://linkedin.com' },
//   { label: 'Twitter', href: 'https://twitter.com' },
//   { label: 'Email', href: 'mailto:youremail@example.com' },
// ]
</script>

<template>
  <footer class="border-t border-white/10">
    <div
      class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:justify-between"
    >
      <p>&copy; {{ year }} Federico Alex Marlian. All rights reserved.</p>
      <!-- <div class="flex gap-5">
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.href"
          target="_blank"
          rel="noopener"
          class="transition hover:text-violet-400"
        >
          {{ social.label }}
        </a>
      </div> -->
    </div>
  </footer>
</template>

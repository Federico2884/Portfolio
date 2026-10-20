<script setup>
// Maps CMS content onto the sketchbook house's rooms.
import { computed } from 'vue'
import { content } from '../data/content'
import { assetUrl } from '../lib/supabase'
import SketchHouse from '../house/SketchHouse.vue'
import '../house/house.css'

const PHOTO_TONES = ['mint', 'lav', 'pink', 'butter', 'sky']
const BOOK_TONES = ['pink', 'butter', 'sky', 'mint', 'lav']

// "https://github.com/x" -> "github.com/x"
const shortUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

const houseData = computed(() => {
  const p = content.profile

  const groups = []
  for (const s of content.skills) {
    let g = groups.find((x) => x.group === s.category)
    if (!g) groups.push((g = { group: s.category, items: [] }))
    g.items.push({ name: s.name, desc: s.description })
  }

  const links = [
    p.github && { name: 'GitHub', handle: shortUrl(p.github), href: p.github },
    p.linkedin && { name: 'LinkedIn', handle: shortUrl(p.linkedin), href: p.linkedin },
    p.instagram && { name: 'Instagram', handle: '@' + shortUrl(p.instagram).split('/').pop(), href: p.instagram },
    p.whatsapp && { name: 'WhatsApp', handle: '+' + p.whatsapp, href: `https://wa.me/${p.whatsapp}` },
  ].filter(Boolean)

  return {
    name: p.name,
    logo: (p.name.split(' ')[0] || 'home').toLowerCase() + '.',
    firstName: p.name.split(' ')[0] || '',
    kicker: (p.roles || []).join(' · '),
    // words wrapped in *asterisks* get the underline scribble
    intro: (p.intro || '').split(/\*([^*]+)\*/).map((text, i) => ({ text, mark: i % 2 === 1 })),
    skills: groups.map((g, i) => ({ ...g, tone: BOOK_TONES[i % BOOK_TONES.length], page: i % 2 ? 'right' : 'left' })),
    projects: content.projects.map((proj, i) => ({
      title: proj.title,
      kind: proj.category,
      tone: PHOTO_TONES[i % PHOTO_TONES.length],
      glyph: proj.title.charAt(0),
      image: proj.image_url ? assetUrl(proj.image_url) : '',
      desc: proj.description,
      stack: proj.tags || [],
      live: proj.demo_url || '',
      code: proj.code_url || '',
    })),
    // the round stickers drifting through the album only fit short names
    stickers: content.skills.map((s) => s.name).filter((n) => n.length <= 7).slice(0, 10),
    education: content.education.map((e) => ({
      when: e.period,
      title: e.degree,
      where: e.institution,
      text: e.description,
      gpa: e.gpa,
      achievements: e.achievements || [],
    })),
    email: p.email,
    links,
  }
})

// Remount the house whenever the content it was built from changes.
const houseKey = computed(() => `${content.status}-${content.version}`)
</script>

<template>
  <p v-if="content.status === 'loading'" class="house-loading" role="status">sketching…</p>
  <SketchHouse v-else :key="houseKey" :data="houseData" />
</template>

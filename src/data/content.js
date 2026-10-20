import { reactive } from 'vue'
import { supabase } from '../lib/supabase'
import { seed } from './seed'

// One shared store for the public site and the admin page.
export const content = reactive({
  status: supabase ? 'loading' : 'seed', // loading | ready | seed | error
  error: null,
  version: 0, // bumps on every successful load so views can rebuild
  profile: { ...seed.profile },
  projects: [...seed.projects],
  skills: [...seed.skills],
  education: [...seed.education],
})

const byOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

export async function loadContent() {
  if (!supabase) return
  // Don't keep visitors waiting on a slow or paused database: show the seed, swap in data if it arrives.
  const slow = setTimeout(() => {
    if (content.status === 'loading') content.status = 'seed'
  }, 4000)
  const [profile, projects, skills, education] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
  ])
  clearTimeout(slow)
  const failed = [profile, projects, skills, education].find((r) => r.error)
  if (failed) {
    console.error('Supabase load failed, showing seed content:', failed.error)
    content.status = 'error'
    content.error = failed.error.message
    return
  }
  if (profile.data) content.profile = profile.data
  content.projects = projects.data.sort(byOrder)
  content.skills = skills.data.sort(byOrder)
  content.education = education.data.sort(byOrder)
  content.status = 'ready'
  content.error = null
  content.version++
}

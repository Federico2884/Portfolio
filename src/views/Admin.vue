<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { content, loadContent } from '../data/content'
import { collections, profileFields } from '../admin/schemas'
import '../style.css'
import SketchGrid from '../sketch/SketchGrid.vue'
import SketchFrame from '../sketch/SketchFrame.vue'
import SketchButton from '../sketch/SketchButton.vue'
import Scribble from '../sketch/Scribble.vue'
import RecordForm from '../admin/RecordForm.vue'
import CollectionEditor from '../admin/CollectionEditor.vue'

const session = ref(null)
const checking = ref(!!supabase)
const email = ref('')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const tabs = [
  { id: 'profile', label: 'Profil' },
  { id: 'projects', label: 'Proyek' },
  { id: 'skills', label: 'Skill' },
  { id: 'education', label: 'Pendidikan' },
]
const tab = ref('projects')
const notice = ref(null)
let noticeTimer
function showNotice(n) {
  notice.value = n
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => (notice.value = null), n.type === 'error' ? 8000 : 2500)
}

let sub
onMounted(async () => {
  if (!supabase) return
  const { data } = await supabase.auth.getSession()
  session.value = data.session
  checking.value = false
  sub = supabase.auth.onAuthStateChange((_event, s) => (session.value = s)).data.subscription
})
onUnmounted(() => sub?.unsubscribe())

async function login() {
  loggingIn.value = true
  loginError.value = ''
  const { error } = await supabase.auth.signInWithPassword({ email: email.value.trim(), password: password.value })
  loggingIn.value = false
  password.value = ''
  if (error) loginError.value = error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message
}
async function logout() {
  await supabase.auth.signOut()
}

const savingProfile = ref(false)
async function saveProfile(values) {
  savingProfile.value = true
  const { data, error } = await supabase
    .from('profile')
    .upsert({ id: 1, ...values, updated_at: new Date().toISOString() })
    .select()
  savingProfile.value = false
  if (error || !data?.length) {
    return showNotice({ type: 'error', text: error?.message || 'Tidak punya izin menulis. Pastikan email login ada di tabel admins.' })
  }
  await loadContent()
  showNotice({ type: 'ok', text: 'Profil tersimpan.' })
}
</script>

<template>
  <SketchGrid fixed :cell="40" :messiness="0.3" :seed="11">
  <div class="wrap admin">
    <header class="admin-head">
      <div>
        <p class="label muted">Portfolio CMS</p>
        <h1><Scribble :seed="4">ruang kerja</Scribble></h1>
      </div>
      <div class="admin-head-actions">
        <SketchButton :href="$router.resolve('/').href" :seed="12" class="sk-btn-small">Lihat situs</SketchButton>
        <SketchButton v-if="session" :seed="13" class="sk-btn-small" @click="logout">Keluar</SketchButton>
      </div>
    </header>

    <!-- Not configured -->
    <SketchFrame v-if="!supabase" title="Belum terhubung" tone="butter" :seed="5">
      <p>Database belum disambungkan, jadi situs memakai isi bawaan dari <code>src/data/seed.js</code>.</p>
      <p>Isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env.local</code>, lalu jalankan ulang <code>npm run dev</code>. Langkah lengkapnya ada di <code>supabase/README.md</code>.</p>
    </SketchFrame>

    <p v-else-if="checking" class="muted">memeriksa sesi…</p>

    <!-- Login -->
    <SketchFrame v-else-if="!session" title="Masuk" :seed="6" class="login">
      <form class="login-form" @submit.prevent="login">
        <label class="label" for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required />
        <label class="label" for="password">Password</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" required />
        <p v-if="loginError" class="error">{{ loginError }}</p>
        <SketchButton type="submit" variant="primary" :disabled="loggingIn">{{ loggingIn ? 'Masuk…' : 'Masuk' }}</SketchButton>
      </form>
    </SketchFrame>

    <!-- Editor -->
    <template v-else>
      <p class="muted signed-in">Masuk sebagai {{ session.user.email }}</p>
      <p v-if="content.status === 'error'" class="error">Gagal memuat data: {{ content.error }}</p>

      <nav class="tabs" aria-label="Bagian">
        <SketchButton
          v-for="(t, i) in tabs"
          :key="t.id"
          :seed="i + 20"
          :pressed="tab === t.id"
          @click="tab = t.id"
        >
          {{ t.label }}
        </SketchButton>
      </nav>

      <SketchFrame v-if="tab === 'profile'" title="Profil" :seed="7">
        <RecordForm
          :key="content.profile.updated_at || 'profile'"
          :fields="profileFields"
          :record="content.profile"
          :saving="savingProfile"
          :cancelable="false"
          @save="saveProfile"
        />
      </SketchFrame>

      <CollectionEditor v-else :key="tab" :table="tab" :config="collections[tab]" @notice="showNotice" />
    </template>

    <Transition name="toast">
      <div v-if="notice" class="toast" role="status">
        <SketchFrame as="div" :tone="notice.type === 'error' ? 'pink' : 'mint'" :seed="44">{{ notice.text }}</SketchFrame>
      </div>
    </Transition>
  </div>
  </SketchGrid>
</template>

<style scoped>
.admin {
  max-width: 820px;
  padding-top: var(--space-8);
  padding-bottom: var(--space-16);
}
.admin-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}
.admin-head h1 {
  font-size: 48px;
  line-height: 1;
}
.admin-head-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
code {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 15px;
}
.login {
  max-width: 420px;
}
.login-form {
  display: grid;
  gap: var(--space-2);
}
.login-form input {
  font: inherit;
  color: var(--ink);
  background: var(--paper);
  border: 0;
  border-bottom: var(--stroke-ink) solid var(--line);
  padding: 6px 8px;
  margin-bottom: var(--space-2);
}
.login-form .sk-btn {
  justify-self: start;
  margin-top: var(--space-2);
}
.error {
  color: var(--accent);
}
.signed-in {
  margin-bottom: var(--space-4);
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 100;
  max-width: min(90vw, 520px);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>

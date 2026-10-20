<script setup>
// Edits one record. Works on a local copy; emits `save` with the cleaned values.
import { reactive, ref } from 'vue'
import { supabase, BUCKET, assetUrl } from '../lib/supabase'
import SketchButton from '../sketch/SketchButton.vue'

const props = defineProps({
  fields: { type: Array, required: true },
  record: { type: Object, required: true },
  saving: { type: Boolean, default: false },
  cancelable: { type: Boolean, default: true },
})
const emit = defineEmits(['save', 'cancel'])

// Arrays are edited as text, converted back on save.
const draft = reactive(
  Object.fromEntries(
    props.fields.map((f) => {
      const v = props.record[f.key]
      if (f.type === 'list') return [f.key, (v || []).join(', ')]
      if (f.type === 'lines') return [f.key, (v || []).join('\n')]
      return [f.key, v ?? '']
    }),
  ),
)

const uploading = ref(false)
const uploadError = ref('')

async function upload(field, event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
  const path = `projects/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000' })
  uploading.value = false
  if (error) {
    uploadError.value = error.message
    return
  }
  draft[field.key] = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function submit() {
  const out = {}
  for (const f of props.fields) {
    const v = draft[f.key]
    if (f.type === 'list') out[f.key] = v.split(',').map((s) => s.trim()).filter(Boolean)
    else if (f.type === 'lines') out[f.key] = v.split('\n').map((s) => s.trim()).filter(Boolean)
    else out[f.key] = typeof v === 'string' ? v.trim() || (f.nullable ? null : '') : v
  }
  emit('save', out)
}
</script>

<template>
  <form class="record-form" @submit.prevent="submit">
    <div v-for="f in fields" :key="f.key" class="field">
      <label :for="'f-' + f.key" class="label">{{ f.label }}<span v-if="f.required" aria-hidden="true"> *</span></label>

      <textarea v-if="f.type === 'textarea' || f.type === 'lines'" :id="'f-' + f.key" v-model="draft[f.key]" :rows="f.type === 'lines' ? 3 : 4"></textarea>

      <template v-else-if="f.type === 'image'">
        <div class="image-field">
          <img v-if="draft[f.key]" :src="assetUrl(draft[f.key])" alt="" class="image-preview" />
          <div class="image-inputs">
            <input :id="'f-' + f.key" v-model="draft[f.key]" type="text" placeholder="URL gambar, atau unggah →" />
            <input type="file" accept="image/*" :disabled="uploading" @change="upload(f, $event)" />
            <p v-if="uploading" class="hint">Mengunggah…</p>
            <p v-if="uploadError" class="error">{{ uploadError }}</p>
          </div>
        </div>
      </template>

      <div v-else-if="f.type === 'icon'" class="icon-field">
        <input :id="'f-' + f.key" v-model="draft[f.key]" type="text" />
        <i v-if="draft[f.key]" :class="draft[f.key]" class="icon-preview" aria-hidden="true"></i>
      </div>

      <input v-else :id="'f-' + f.key" v-model="draft[f.key]" :type="f.type === 'url' ? 'url' : 'text'" :required="f.required" />

      <p v-if="f.hint" class="hint">{{ f.hint }}</p>
    </div>

    <div class="form-actions">
      <SketchButton type="submit" variant="primary" :disabled="saving || uploading">{{ saving ? 'Menyimpan…' : 'Simpan' }}</SketchButton>
      <SketchButton v-if="cancelable" :seed="8" @click="emit('cancel')">Batal</SketchButton>
    </div>
  </form>
</template>

<style scoped>
.record-form {
  display: grid;
  gap: var(--space-4);
}
.field {
  display: grid;
  gap: var(--space-1);
}
input[type='text'],
input[type='url'],
textarea {
  width: 100%;
  font: inherit;
  font-size: 18px;
  color: var(--ink);
  background: var(--paper);
  border: 0;
  border-bottom: var(--stroke-ink) solid var(--line);
  padding: 6px 8px;
  border-radius: 0;
}
textarea {
  resize: vertical;
  line-height: 25px;
}
input:focus,
textarea:focus {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
input[type='file'] {
  font: inherit;
  font-size: 15px;
}
.hint {
  font-size: 15px;
  line-height: 20px;
  color: var(--ink-muted);
}
.error {
  color: var(--accent);
}
.image-field {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}
.image-inputs {
  flex: 1;
  display: grid;
  gap: var(--space-2);
}
.image-preview {
  width: 120px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.icon-field {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}
.icon-preview {
  font-size: 36px;
}
.form-actions {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-2);
}
</style>

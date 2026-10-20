<script setup>
// List + add/edit/delete/reorder for one table (projects, skills, education).
import { computed, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { content, loadContent } from '../data/content'
import SketchFrame from '../sketch/SketchFrame.vue'
import SketchButton from '../sketch/SketchButton.vue'
import RecordForm from './RecordForm.vue'

const props = defineProps({
  table: { type: String, required: true },
  config: { type: Object, required: true },
})
const emit = defineEmits(['notice'])

const rows = computed(() => content[props.table])
const editing = ref(null) // a row, or { _new: true, ...blank }
const saving = ref(false)
const busyId = ref(null)

// RLS turns a forbidden update/delete into "0 rows", not an error, so check the rows that came back.
const NO_ACCESS = 'Tidak punya izin menulis. Pastikan email login ada di tabel admins (lihat supabase/README.md).'
function check({ data, error }) {
  if (error) return error.message
  if (Array.isArray(data) && data.length === 0) return NO_ACCESS
  return null
}

function startNew() {
  editing.value = { _new: true, ...props.config.blank() }
}

async function save(values) {
  saving.value = true
  let result
  if (editing.value._new) {
    const maxOrder = Math.max(0, ...rows.value.map((r) => r.sort_order ?? 0))
    result = await supabase.from(props.table).insert({ ...values, sort_order: maxOrder + 1 }).select()
  } else {
    result = await supabase.from(props.table).update(values).eq('id', editing.value.id).select()
  }
  saving.value = false
  const error = check(result)
  if (error) return emit('notice', { type: 'error', text: error })
  editing.value = null
  await loadContent()
  emit('notice', { type: 'ok', text: 'Tersimpan.' })
}

async function remove(row) {
  const name = row[props.config.titleKey]
  if (!window.confirm(`Hapus "${name}"? Ini tidak bisa dibatalkan.`)) return
  busyId.value = row.id
  const error = check(await supabase.from(props.table).delete().eq('id', row.id).select())
  busyId.value = null
  if (error) return emit('notice', { type: 'error', text: error })
  await loadContent()
  emit('notice', { type: 'ok', text: `"${name}" dihapus.` })
}

// Swap with the neighbour, then renumber everything 1..n so orders stay unique.
async function move(index, dir) {
  const list = [...rows.value]
  const j = index + dir
  if (j < 0 || j >= list.length) return
  ;[list[index], list[j]] = [list[j], list[index]]
  busyId.value = list[j].id
  const updates = list
    .map((r, i) => ({ id: r.id, sort_order: i + 1, changed: r.sort_order !== i + 1 }))
    .filter((u) => u.changed)
  const results = await Promise.all(
    updates.map((u) => supabase.from(props.table).update({ sort_order: u.sort_order }).eq('id', u.id).select()),
  )
  busyId.value = null
  const error = results.map(check).find(Boolean)
  if (error) emit('notice', { type: 'error', text: error })
  await loadContent()
}
</script>

<template>
  <div>
    <SketchFrame v-if="editing" :title="editing._new ? `${config.label} baru` : `Edit ${config.label.toLowerCase()}`" :seed="31" class="editor-frame">
      <RecordForm :key="editing.id || 'new'" :fields="config.fields" :record="editing" :saving="saving" @save="save" @cancel="editing = null" />
    </SketchFrame>

    <template v-else>
      <div class="list-head">
        <p class="muted">{{ rows.length }} item · urutan di sini = urutan di website</p>
        <SketchButton variant="primary" @click="startNew">+ Tambah</SketchButton>
      </div>

      <ul class="rows">
        <li v-for="(row, i) in rows" :key="row.id">
          <SketchFrame as="div" :seed="i + 90" still class="row" :class="{ busy: busyId === row.id }">
            <div class="row-inner">
              <div class="row-order">
                <button type="button" :disabled="i === 0" :aria-label="'Naikkan ' + row[config.titleKey]" @click="move(i, -1)">▲</button>
                <button type="button" :disabled="i === rows.length - 1" :aria-label="'Turunkan ' + row[config.titleKey]" @click="move(i, 1)">▼</button>
              </div>
              <div class="row-text">
                <p class="row-title">{{ row[config.titleKey] }}</p>
                <p class="muted row-sub">{{ config.subtitle(row) }}</p>
              </div>
              <div class="row-actions">
                <SketchButton class="sk-btn-small" :seed="i + 3" @click="editing = row">Edit</SketchButton>
                <SketchButton class="sk-btn-small" :seed="i + 5" @click="remove(row)">Hapus</SketchButton>
              </div>
            </div>
          </SketchFrame>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-4);
}
.row {
  padding: var(--space-3) var(--space-4);
}
.row.busy {
  opacity: 0.5;
}
.row-inner {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.row-order {
  display: flex;
  flex-direction: column;
}
.row-order button {
  border: 0;
  background: none;
  color: var(--ink);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
}
.row-order button:disabled {
  opacity: 0.25;
  cursor: default;
}
.row-order button:not(:disabled):hover {
  color: var(--accent);
}
.row-text {
  flex: 1;
  min-width: 0;
}
.row-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.1;
}
.row-sub {
  font-size: 16px;
  line-height: 22px;
}
.row-actions {
  display: flex;
  gap: var(--space-2);
}
@media (max-width: 600px) {
  .row-inner {
    flex-wrap: wrap;
  }
  .row-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

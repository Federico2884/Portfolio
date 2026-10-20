import { ref, onMounted, onBeforeUnmount } from 'vue'

// Tracks an element's offset size; the hand-drawn shapes are redrawn when it changes.
export function useSize(el) {
  const width = ref(0)
  const height = ref(0)
  let ro

  function measure() {
    if (!el.value) return
    const w = el.value.offsetWidth
    const h = el.value.offsetHeight
    if (w !== width.value) width.value = w
    if (h !== height.value) height.value = h
  }

  onMounted(() => {
    measure()
    ro = new ResizeObserver(measure)
    if (el.value) ro.observe(el.value)
  })
  onBeforeUnmount(() => ro?.disconnect())

  return { width, height }
}

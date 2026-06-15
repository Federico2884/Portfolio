import { ref, onMounted, onUnmounted } from 'vue'

// Cycles through `words`, typing and deleting each one for a typewriter effect.
export function useTypewriter(words, options = {}) {
  const { typeSpeed = 95, deleteSpeed = 45, pause = 1500 } = options
  const text = ref('')
  let wordIndex = 0
  let charIndex = 0
  let deleting = false
  let timer

  function tick() {
    const current = words[wordIndex]
    charIndex += deleting ? -1 : 1
    text.value = current.slice(0, charIndex)

    let delay = deleting ? deleteSpeed : typeSpeed
    if (!deleting && charIndex === current.length) {
      delay = pause
      deleting = true
    } else if (deleting && charIndex === 0) {
      deleting = false
      wordIndex = (wordIndex + 1) % words.length
      delay = typeSpeed
    }
    timer = setTimeout(tick, delay)
  }

  onMounted(() => {
    timer = setTimeout(tick, typeSpeed)
  })
  onUnmounted(() => clearTimeout(timer))

  return { text }
}

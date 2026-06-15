// v-reveal: fades/slides an element in when it scrolls into view.
// Optional binding value: { delay } in ms for staggered reveals.
export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const delay = binding.value && binding.value.delay
    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    if (el._revealObserver) el._revealObserver.disconnect()
  },
}

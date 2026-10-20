// Hand-drawn line geometry, ported from the Rico Sketchbook design system bundle.
// Every shape is drawn three times with different wobble; <Boil> cycles the frames.

export function rng(seed) {
  let s = (Math.floor(seed) * 2654435761) >>> 0
  if (s === 0) s = 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

const f = (n) => Math.round(n * 10) / 10

export function smooth(pts) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`
  }
  const l = pts[pts.length - 1]
  return `${d} L${f(l[0])} ${f(l[1])}`
}

// A wobbly hand-drawn line from (x1,y1) to (x2,y2).
export function sketchLine(r, x1, y1, x2, y2, amp, seg = 36) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const n = Math.max(2, Math.round(len / seg))
  const bend = (r() - 0.5) * amp * 2.2
  const phase = r() * Math.PI * 2
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    let off = Math.sin(t * Math.PI) * bend + Math.sin(t * Math.PI * 2 + phase) * amp * 0.5 + (r() - 0.5) * amp * 0.9
    if (i === 0 || i === n) off = (r() - 0.5) * amp
    pts.push([x1 + dx * t + nx * off, y1 + dy * t + ny * off])
  }
  return smooth(pts)
}

// Wobbly rectangle: a fill polygon plus four overshooting strokes, per frame.
export function rectFrames(w, h, amp, seed, overshoot = 4) {
  const out = []
  for (let k = 0; k < 3; k++) {
    const r = rng(seed * 31 + k * 7919 + 1)
    const c = [[0, 0], [w, 0], [w, h], [0, h]].map((p) => [p[0] + (r() - 0.5) * amp * 2, p[1] + (r() - 0.5) * amp * 2])
    const fill = `M${c.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L')} Z`
    let stroke = ''
    for (let e = 0; e < 4; e++) {
      const a = c[e]
      const b = c[(e + 1) % 4]
      const dx = b[0] - a[0]
      const dy = b[1] - a[1]
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const o1 = overshoot * (0.3 + r())
      const o2 = overshoot * (0.3 + r())
      stroke += ` ${sketchLine(r, a[0] - (dx / len) * o1, a[1] - (dy / len) * o1, b[0] + (dx / len) * o2, b[1] + (dy / len) * o2, amp, 40)}`
    }
    out.push({ fill, stroke })
  }
  return out
}

// Messy squared-paper grid: shifted, tilted, broken and doubled lines plus stray marks.
export function gridFrames(w, h, cell, mess, seed, strays) {
  const L = rng(seed)
  const lines = []
  const ext = cell
  const base = (dir, pos) => ({
    dir,
    pos: pos + (L() - 0.5) * cell * 0.22 * mess,
    tilt: (L() - 0.5) * cell * 0.4 * mess,
    s0: -ext * (0.2 + L() * 0.8),
    s1: ext * (0.2 + L() * 0.8),
    wb: L() < 0.15 ? 2 : L() < 0.55 ? 1 : 0,
    dbl: L() < 0.35 * mess,
    gap: L() < 0.2 * mess ? [0.1 + L() * 0.75, 0.03 + L() * 0.09] : null,
    amp: 0.5 + (0.6 + L() * 1.6) * mess * 2,
  })
  for (let x = 0; x <= w + cell; x += cell) lines.push(base('v', x))
  for (let y = 0; y <= h + cell; y += cell) lines.push(base('h', y))

  const strayList = []
  const nStray = strays ?? Math.round(((mess * (w * h)) / (cell * cell)) * 0.035)
  for (let i = 0; i < nStray; i++) {
    const sx = L() * w
    const sy = L() * h
    const ang = (L() < 0.5 ? 0 : Math.PI / 2) + (L() - 0.5) * 0.9
    const ln = cell * (0.3 + L() * 0.9)
    strayList.push({ x1: sx, y1: sy, x2: sx + Math.cos(ang) * ln, y2: sy + Math.sin(ang) * ln, amp: 0.6 + L() * 1.2 })
  }

  const frames = []
  for (let k = 0; k < 3; k++) {
    const r = rng(seed * 977 + k * 131 + 3)
    const buckets = ['', '', '']
    let faint = ''
    for (const ln of lines) {
      const segs = ln.gap ? [[0, ln.gap[0]], [ln.gap[0] + ln.gap[1], 1]] : [[0, 1]]
      const length = (ln.dir === 'v' ? h : w) - ln.s0 + ln.s1
      for (const sg of segs) {
        const a = ln.s0 + length * sg[0]
        const b = ln.s0 + length * sg[1]
        const pa = ln.pos - ln.tilt / 2 + ln.tilt * sg[0] + (r() - 0.5) * 1.2
        const pb = ln.pos - ln.tilt / 2 + ln.tilt * sg[1] + (r() - 0.5) * 1.2
        buckets[ln.wb] += ` ${ln.dir === 'v' ? sketchLine(r, pa, a, pb, b, ln.amp, cell * 0.9) : sketchLine(r, a, pa, b, pb, ln.amp, cell * 0.9)}`
        if (ln.dbl) {
          const o = 1.5 + r() * 2
          faint += ` ${
            ln.dir === 'v'
              ? sketchLine(r, pa + o, a + cell * 0.4, pb + o, b - cell * 0.6, ln.amp * 1.3, cell)
              : sketchLine(r, a + cell * 0.5, pa + o, b - cell * 0.4, pb + o, ln.amp * 1.3, cell)
          }`
        }
      }
    }
    for (const s of strayList) faint += ` ${sketchLine(r, s.x1, s.y1, s.x2, s.y2, s.amp, 14)}`
    frames.push({ thin: buckets[0], mid: buckets[1], thick: buckets[2], faint })
  }
  return frames
}

export function scribbleFrames(w, h, kind, seed) {
  const out = []
  for (let k = 0; k < 3; k++) {
    const r = rng(seed * 53 + k * 409 + 7)
    if (kind === 'circle') {
      const cx = w / 2
      const cy = h / 2
      const rx = w / 2 + 10
      const ry = h / 2 + 8
      const pts = []
      const turns = 1.12
      const n = 28
      const start = -2.2 + (r() - 0.5) * 0.4
      for (let i = 0; i <= n; i++) {
        const t = start + (i / n) * Math.PI * 2 * turns
        const j = 1 + (r() - 0.5) * 0.07 + (i / n) * 0.06
        pts.push([cx + Math.cos(t) * rx * j, cy + Math.sin(t) * ry * j])
      }
      out.push(smooth(pts))
    } else if (kind === 'strike') {
      out.push(sketchLine(r, -4, h * 0.55, w + 4, h * 0.5, 1.6, 18))
    } else {
      out.push(`${sketchLine(r, -3, h + 3, w + 5, h + 1, 1.5, 18)} ${sketchLine(r, 6, h + 8, w - 4, h + 7, 1.8, 18)}`)
    }
  }
  return out
}

// Fill/text colours for each tone a box can take.
export const TONES = {
  paper: { fill: 'var(--paper-raised)', text: 'var(--ink)' },
  ink: { fill: 'var(--ink)', text: 'var(--on-ink)' },
  pink: { fill: 'var(--pastel-pink)', text: 'var(--on-pastel)' },
  mint: { fill: 'var(--pastel-mint)', text: 'var(--on-pastel)' },
  lavender: { fill: 'var(--pastel-lavender)', text: 'var(--on-pastel)' },
  sky: { fill: 'var(--pastel-sky)', text: 'var(--on-pastel)' },
  butter: { fill: 'var(--pastel-butter)', text: 'var(--on-pastel)' },
  none: { fill: 'none', text: 'inherit' },
}

export const PASTELS = ['pink', 'mint', 'lavender', 'sky', 'butter']

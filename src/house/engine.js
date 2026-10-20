// The sketchbook house: doors, scroll passages, sticker book, falling photo album, the cat.
// Ported from the design artifact. mountHouse() wires everything inside `root` and returns a
// cleanup function that removes every listener, observer and animation loop it started.

const NS = 'http://www.w3.org/2000/svg'
const ROOMS = ['home', 'skills', 'projects', 'education', 'connect']
const LABEL = { home: 'Home', skills: 'Skills', projects: 'Projects', education: 'Education', connect: 'Connect' }
export const TONE = { mint: 'var(--mint)', lav: 'var(--lav)', pink: 'var(--pink)', butter: 'var(--butter)', sky: 'var(--sky)' }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/* ---------- sketch geometry ---------- */
function rng(seed) {
  let s = (Math.floor(seed) * 2654435761) >>> 0 || 1
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296 }
}
const f1 = (n) => Math.round(n * 10) / 10
function smooth(pts) {
  let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1])
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ' Q' + f1(pts[i][0]) + ' ' + f1(pts[i][1]) + ' ' + f1(mx) + ' ' + f1(my)
  }
  const l = pts[pts.length - 1]
  return d + ' L' + f1(l[0]) + ' ' + f1(l[1])
}
function sketchLine(r, x1, y1, x2, y2, amp, seg = 36) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len
  const n = Math.max(2, Math.round(len / seg)), bend = (r() - 0.5) * amp * 2.2, ph = r() * 6.283, pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    let off = Math.sin(t * Math.PI) * bend + Math.sin(t * Math.PI * 2 + ph) * amp * 0.5 + (r() - 0.5) * amp * 0.9
    if (i === 0 || i === n) off = (r() - 0.5) * amp
    pts.push([x1 + dx * t + nx * off, y1 + dy * t + ny * off])
  }
  return smooth(pts)
}
function sketchRect(r, w, h, amp, over = 4) {
  const c = [[0, 0], [w, 0], [w, h], [0, h]].map((p) => [p[0] + (r() - 0.5) * amp * 2, p[1] + (r() - 0.5) * amp * 2])
  const fill = 'M' + c.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z'
  let stroke = ''
  for (let e = 0; e < 4; e++) {
    const a = c[e], b = c[(e + 1) % 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1
    const o1 = over * (0.3 + r()), o2 = over * (0.3 + r())
    stroke += ' ' + sketchLine(r, a[0] - (dx / L) * o1, a[1] - (dy / L) * o1, b[0] + (dx / L) * o2, b[1] + (dy / L) * o2, amp, 40)
  }
  return { fill, stroke }
}
function boilGroup(frames, step = 180, still = false) {
  return `<g class="boil${still ? ' still' : ''}">` + frames.map((fr, i) =>
    `<g class="f" style="animation-duration:${step * 3}ms;animation-delay:${step * i}ms">${fr}</g>`).join('') + '</g>'
}

/* ---------- messy grid ---------- */
function gridSVG(w, h, cell, mess, seed, still) {
  const L = rng(seed), lines = [], ext = cell
  const base = (dir, pos) => ({
    dir, pos: pos + (L() - 0.5) * cell * 0.22 * mess, tilt: (L() - 0.5) * cell * 0.4 * mess,
    s0: -ext * (0.2 + L() * 0.8), s1: ext * (0.2 + L() * 0.8),
    wb: L() < 0.15 ? 2 : (L() < 0.55 ? 1 : 0), dbl: L() < 0.35 * mess,
    gap: L() < 0.2 * mess ? [0.1 + L() * 0.75, 0.03 + L() * 0.09] : null,
    amp: 0.5 + (0.6 + L() * 1.6) * mess * 2,
  })
  for (let x = 0; x <= w + cell; x += cell) lines.push(base('v', x))
  for (let y = 0; y <= h + cell; y += cell) lines.push(base('h', y))
  const strays = []
  const nS = Math.round(((mess * (w * h)) / (cell * cell)) * 0.035)
  for (let i = 0; i < nS; i++) {
    const sx = L() * w, sy = L() * h, an = (L() < 0.5 ? 0 : Math.PI / 2) + (L() - 0.5) * 0.9, ln = cell * (0.3 + L() * 0.9)
    strays.push([sx, sy, sx + Math.cos(an) * ln, sy + Math.sin(an) * ln, 0.6 + L() * 1.2])
  }
  const frames = []
  for (let k = 0; k < 3; k++) {
    const r = rng(seed * 977 + k * 131 + 3), b = ['', '', '']
    let faint = ''
    for (const ln of lines) {
      const segs = ln.gap ? [[0, ln.gap[0]], [ln.gap[0] + ln.gap[1], 1]] : [[0, 1]]
      const length = (ln.dir === 'v' ? h : w) - ln.s0 + ln.s1
      for (const sg of segs) {
        const a = ln.s0 + length * sg[0], bb = ln.s0 + length * sg[1]
        const pa = ln.pos - ln.tilt / 2 + ln.tilt * sg[0] + (r() - 0.5) * 1.2
        const pb = ln.pos - ln.tilt / 2 + ln.tilt * sg[1] + (r() - 0.5) * 1.2
        b[ln.wb] += ' ' + (ln.dir === 'v' ? sketchLine(r, pa, a, pb, bb, ln.amp, cell * 0.9) : sketchLine(r, a, pa, bb, pb, ln.amp, cell * 0.9))
        if (ln.dbl) {
          const o = 1.5 + r() * 2
          faint += ' ' + (ln.dir === 'v'
            ? sketchLine(r, pa + o, a + cell * 0.4, pb + o, bb - cell * 0.6, ln.amp * 1.3, cell)
            : sketchLine(r, a + cell * 0.5, pa + o, bb - cell * 0.4, pb + o, ln.amp * 1.3, cell))
        }
      }
    }
    for (const s of strays) faint += ' ' + sketchLine(r, s[0], s[1], s[2], s[3], s[4], 14)
    frames.push(`<path d="${b[0]}" stroke-width=".9"/><path d="${b[1]}" stroke-width="1.3"/><path d="${b[2]}" stroke-width="1.9"/><path d="${faint}" stroke-width="1" opacity=".55"/>`)
  }
  return `<svg width="${w}" height="${h}" aria-hidden="true">${boilGroup(frames, 180, still)}</svg>`
}
const cellSize = () => (innerWidth < 600 ? 32 : 40)

/* ---------- the pencil book ---------- */
function cubicPts(p0, c1, c2, p3, n = 18) {
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, m = 1 - t
    out.push([m * m * m * p0[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * p3[0],
      m * m * m * p0[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t * t * t * p3[1]])
  }
  return out
}
const linePts = (a, b, n = 10) => cubicPts(a, a, b, b, n)
function pencil(r, pts, amp = 0.7) { return smooth(pts.map((p) => [p[0] + (r() - 0.5) * amp * 2, p[1] + (r() - 0.5) * amp * 2])) }
/* one half of an open book. side: 1 = left page (outer edge at xo, gutter to the right), -1 = right page */
function halfBook(side, xo, xg, H, r) {
  const D = Math.abs(xg - xo), X = (u) => xo + side * u, P = (u, y) => [X(u), y]
  const fo = 18, top = 22, gTop = 36, bot = H - 64, gBot = H - 34
  const topEdge = cubicPts(P(fo, top), P(fo + D * 0.22, 4), P(D * 0.72, 2), P(D, gTop))
  const botEdge = cubicPts(P(fo, bot), P(D * 0.38, bot + 2), P(D * 0.78, bot + 14), P(D, gBot))
  const face = 'M' + [...topEdge, ...[...botEdge].reverse()].map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z'
  let pen = '', soft = '', cover = ''
  const sw = (d, w, cls = 'pen', o = 1) => `<path class="${cls}" d="${d}" stroke-width="${w}"${o < 1 ? ` opacity="${o}"` : ''}/>`
  const stackPoly = [...linePts(P(fo, top + 8), P(fo - 13, top + 26)), ...linePts(P(fo - 13, top + 26), P(fo - 13, bot + 18)),
    ...cubicPts(P(fo - 13, bot + 18), P(D * 0.36, bot + 22), P(D * 0.78, bot + 34), P(D, gBot + 14)), ...linePts(P(D, gBot + 14), P(D, gBot))]
  const stack = 'M' + [...stackPoly, ...[...botEdge].reverse()].map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z'
  cover += sw(pencil(r, [...linePts(P(fo - 16, top + 30), P(fo - 22, top + 36), 3), ...linePts(P(fo - 22, top + 36), P(fo - 22, bot + 30), 12),
    ...cubicPts(P(fo - 22, bot + 30), P(D * 0.34, bot + 34), P(D * 0.78, bot + 48), P(D, gBot + 24))], 0.6), 2.6, 'cover')
  cover += sw(pencil(r, [...linePts(P(fo - 18, top + 33), P(fo - 18, bot + 25), 12),
    ...cubicPts(P(fo - 18, bot + 25), P(D * 0.35, bot + 29), P(D * 0.78, bot + 42), P(D, gBot + 19))], 0.6), 1.1, 'cover', 0.7)
  for (let k = 1; k <= 4; k++) {
    const o = k * 3.1
    soft += sw(pencil(r, linePts(P(fo - o, top + 8 + o * 1.4), P(fo - o, bot + o * 0.9), 12), 0.5), k === 4 ? 1.4 : 0.8, k === 4 ? 'pen' : 'soft')
    soft += sw(pencil(r, cubicPts(P(fo - o, bot + o * 0.9), P(D * 0.37, bot + 2 + o * 1.1), P(D * 0.78, bot + 14 + o * 1.25), P(D, gBot + o * 1.15))), k === 4 ? 1.4 : 0.8, k === 4 ? 'pen' : 'soft')
  }
  for (let pass = 0; pass < 2; pass++) {
    const w = pass ? 0.8 : 1.7, o = pass ? 0.55 : 1
    pen += sw(pencil(r, topEdge, 0.7), w, 'pen', o)
    pen += sw(pencil(r, botEdge, 0.7), w, 'pen', o)
    pen += sw(pencil(r, linePts(P(fo, top), P(fo - 1, bot), 12), 0.7), w, 'pen', o)
  }
  for (let k = 0; k < 4; k++) soft += sw(pencil(r, linePts(P(D - 3 - k * 4, gTop + 6), P(D - 3 - k * 4, gBot - 6), 14), 0.6), 0.9, 'soft', 0.55 - k * 0.12)
  return { face, stack, art: cover + soft + pen }
}
function bookFrames(mode, W, H, seed) {
  return [0, 1, 2].map((k) => {
    const r = rng(seed * 41 + k * 613)
    const parts = mode === 'spread' ? [halfBook(1, 0, W / 2, H, r), halfBook(-1, W, W / 2, H, r)]
      : [halfBook(mode === 'left' ? 1 : -1, mode === 'left' ? 0 : W, mode === 'left' ? W : 0, H, r)]
    let out = parts.map((p) => `<path class="stack" d="${p.stack}"/><path class="face" d="${p.face}"/>`).join('') + parts.map((p) => p.art).join('')
    if (mode === 'spread') out += `<path class="pen" stroke-width="1.6" d="${pencil(r, linePts([W / 2, 36], [W / 2, H - 34], 14), 0.5)}"/>`
    else out += `<path class="pen" stroke-width="1.8" d="${pencil(r, linePts([mode === 'left' ? W : 0, 36], [mode === 'left' ? W : 0, H - 34], 14), 0.5)}"/>`
    return out
  })
}

/* ---------- sticker shapes ---------- */
function shapePts(type, cx, cy, rx, ry, r) {
  const n = type === 'burst' ? 28 : 48, pts = []
  const pw = type === 'pill' ? 5 : type === 'scallop' ? 3.4 : 2
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t)
    const x = rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / pw), y = ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / pw)
    let k = 1
    if (type === 'blob') k = 1 + Math.sin(t * 3 + r() * 6) * 0.045 + (r() - 0.5) * 0.03
    if (type === 'scallop') k = 1 + Math.abs(Math.sin(t * 9)) * 0.07
    if (type === 'burst') k = i % 2 ? 0.84 : 1.04
    if (type === 'pill') k = 1 + (r() - 0.5) * 0.02
    pts.push([cx + x * k, cy + y * k])
  }
  return pts
}
function closedPath(pts) {
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = pts.length
  const st = m(pts[n - 1], pts[0])
  let d = 'M' + f1(st[0]) + ' ' + f1(st[1])
  for (let i = 0; i < n; i++) { const p = pts[i], q = m(pts[i], pts[(i + 1) % n]); d += ' Q' + f1(p[0]) + ' ' + f1(p[1]) + ' ' + f1(q[0]) + ' ' + f1(q[1]) }
  return d + ' Z'
}
function paintSticker(el) {
  const w = el.offsetWidth, h = el.offsetHeight
  if (!w) return
  const type = el.dataset.shape, cx = w / 2, cy = h / 2
  const die = closedPath(shapePts(type, cx, cy, w / 2 - 2, h / 2 - 2, rng(+el.dataset.seed)))
  const face = closedPath(shapePts(type, cx, cy, w / 2 - 9, h / 2 - 9, rng(+el.dataset.seed)))
  const shine = `M${f1(cx - w * 0.32)} ${f1(cy - h * 0.2)} Q${f1(cx - w * 0.28)} ${f1(cy - h * 0.3)} ${f1(cx - w * 0.16)} ${f1(cy - h * 0.33)}`
  el.querySelector('svg').innerHTML = `<path class="die" d="${die}"/><path class="face" d="${face}" style="fill:${el.dataset.fill}"/><path class="shine" d="${shine}"/>`
}

/* ---------- doors ---------- */
function buildDoor(to, label, seed, w, h) {
  const d = document.createElement('div')
  d.className = 'door'
  if (w) { d.style.setProperty('--dw', w + 'px'); d.style.setProperty('--dh', h + 'px') }
  d.innerHTML = `<div class="door-zoom">
      <div class="hole room-${to}"><div class="grid-mini"></div></div>
      <div class="panel"><svg aria-hidden="true"></svg><span class="sign">${esc(label)}</span></div>
      <svg class="door-frame" aria-hidden="true"></svg>
    </div>`
  d._seed = seed
  return d
}
function paintDoor(d, holeCell) {
  const w = d.offsetWidth, h = d.offsetHeight
  if (!w) return
  const seed = d._seed, sw = Math.max(1.8, w / 70)
  const panelFrames = [0, 1, 2].map((k) => {
    const r = rng(seed * 13 + k * 101)
    const outer = sketchRect(r, w, h, 1.4, 3)
    const p1 = sketchRect(r, w * 0.62, h * 0.26, 1, 2), p2 = sketchRect(r, w * 0.62, h * 0.32, 1, 2)
    return `<path class="pf" d="${outer.fill}"/><path class="ps" d="${outer.stroke}" stroke-width="${sw}"/>
      <g transform="translate(${w * 0.19} ${h * 0.38})"><path class="ps" d="${p1.stroke}" stroke-width="${sw * 0.7}"/></g>
      <g transform="translate(${w * 0.19} ${h * 0.6})"><path class="ps" d="${p2.stroke}" stroke-width="${sw * 0.7}"/></g>
      <circle class="knob" cx="${w * 0.86 + (r() - 0.5)}" cy="${h * 0.53}" r="${Math.max(2.5, w * 0.035)}"/>`
  })
  d.querySelector('.panel svg').innerHTML = boilGroup(panelFrames, 200)
  const frameFrames = [0, 1, 2].map((k) => {
    const r = rng(seed * 7 + k * 59 + 2), fr = sketchRect(r, w + 8, h + 6, 1.6, 6)
    return `<g transform="translate(-4 -6)"><path class="ps" d="${fr.stroke}" stroke-width="${sw * 1.25}"/></g>`
  })
  d.querySelector('.door-frame').innerHTML = boilGroup(frameFrames, 200)
  d.querySelector('.grid-mini').innerHTML = gridSVG(w, h, holeCell || Math.max(10, w / 10), 0.5, seed + 3, true)
}

function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
// falling curve that slows down in the middle so each photo floats for a moment
function floatCurve(u) { const s = 2 * u - 1; return 0.5 + 0.5 * (0.32 * s + 0.68 * Math.sign(s) * Math.pow(Math.abs(s), 3)) }

// A photo: the screenshot if there is one, else the glyph on the pastel ground.
function photo(p) {
  // eager: polaroids start hidden, and a lazy image would still be loading as it falls into view
  return p.image ? `<img src="${esc(p.image)}" alt="">` : esc(p.glyph)
}

/* ================================================================= */
export function mountHouse(root, DATA) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (s) => root.querySelector(s)
  const $$ = (s) => root.querySelectorAll(s)
  const cleanups = []
  let alive = true
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)) }
  const observe = (el, fn) => { const ro = new ResizeObserver(fn); ro.observe(el); cleanups.push(() => ro.disconnect()); return ro }
  const timeouts = new Set()
  const later = (fn, ms) => { const id = setTimeout(() => { timeouts.delete(id); fn() }, ms); timeouts.add(id); return id }
  const cancel = (id) => { clearTimeout(id); timeouts.delete(id) }

  function attachGrid(host, seed, mess = 0.6) {
    const layer = document.createElement('div')
    layer.className = 'grid-layer'
    host.prepend(layer)
    let lastW = 0, lastH = 0, t
    const draw = () => {
      const w = layer.offsetWidth, h = layer.offsetHeight
      if (!w || (w === lastW && Math.abs(h - lastH) < 30)) return
      lastW = w; lastH = h
      layer.innerHTML = gridSVG(w, h + 40, cellSize(), mess, seed)
    }
    draw()
    observe(layer, () => { cancel(t); t = later(draw, 120) })
  }

  /* ---------- hand-drawn boxes ---------- */
  function decorate(el, i) {
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('class', 'sk-svg')
    svg.setAttribute('aria-hidden', 'true')
    el.prepend(svg)
    const seed = 5 + i * 17, fill = el.dataset.fill || ''
    let lw = 0, lh = 0
    const draw = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      if (!w || (w === lw && h === lh)) return
      lw = w; lh = h
      const amp = Math.min(1.8, 0.8 + Math.min(w, h) / 120)
      const frames = [0, 1, 2].map((k) => {
        const r = rng(seed * 31 + k * 7919 + 1), sr = sketchRect(r, w, h, amp, 4)
        return (fill ? `<path class="fillp" d="${sr.fill}" style="fill:${fill}"/>` : '') + `<path class="st" d="${sr.stroke}" stroke-width="2.2"/>`
      })
      svg.innerHTML = boilGroup(frames, 200)
    }
    draw()
    observe(el, draw)
  }

  /* ---------- scribbles ---------- */
  function scribble(el, i) {
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('aria-hidden', 'true')
    el.prepend(svg)
    const kind = el.dataset.kind
    const draw = () => {
      const w = el.offsetWidth, h = el.offsetHeight
      if (!w) return
      const frames = [0, 1, 2].map((k) => {
        const r = rng(i * 53 + k * 409 + 7)
        if (kind === 'circle') {
          const cx = w / 2, cy = h / 2 + h * 0.05, rx = w / 2 + 14, ry = h / 2 + 2, pts = [], n = 30, st = -2.3 + (r() - 0.5) * 0.4
          for (let j = 0; j <= n; j++) { const t = st + (j / n) * Math.PI * 2 * 1.12, q = 1 + (r() - 0.5) * 0.07 + (j / n) * 0.06; pts.push([cx + Math.cos(t) * rx * q, cy + Math.sin(t) * ry * q]) }
          return `<path d="${smooth(pts)}"/>`
        }
        return `<path d="${sketchLine(r, -3, h - 2, w + 5, h - 4, 1.6, 18)} ${sketchLine(r, 6, h + 5, w - 4, h + 3, 1.8, 18)}"/>`
      })
      svg.innerHTML = boilGroup(frames, 180)
    }
    draw()
    observe(el, draw)
  }

  /* ---------- content rendering ---------- */
  function renderContent() {
    renderStickers()
    $('#timeline').insertAdjacentHTML('beforeend', DATA.education.map((e) => {
      const chips = [e.gpa && `GPA ${e.gpa}`, ...(e.achievements || [])].filter(Boolean)
      return `
    <article class="entry sk" data-fill="rgba(255,255,255,.55)">
      <span class="when">${esc(e.when)}</span>
      <h3>${esc(e.title)}</h3>
      <p class="where">${esc(e.where)}</p>
      <p>${esc(e.text)}</p>
      ${chips.length ? `<div class="chips">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </article>`
    }).join(''))
    $('#email').textContent = DATA.email
    $('#links').innerHTML = DATA.links.map((l) => `<li><a class="sk" data-fill="var(--raised)" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.name)} <small>${esc(l.handle)}</small></a></li>`).join('')
    $('#year').textContent = new Date().getFullYear()
  }

  function drawBook(book) {
    const svg = book.querySelector('.book-art'), W = book.offsetWidth, H = book.offsetHeight
    if (!W || innerWidth <= 760) return
    svg.innerHTML = boilGroup(bookFrames('spread', W, H, 3), 220)
  }
  function drawPage(pg) {
    if (innerWidth > 760) return
    const svg = pg.querySelector('.page-art'), W = pg.offsetWidth, H = pg.offsetHeight
    if (!W) return
    svg.innerHTML = boilGroup(bookFrames(pg.classList.contains('left') ? 'left' : 'right', W, H, pg.classList.contains('left') ? 5 : 6), 220)
  }

  function renderStickers() {
    const shapes = ['pill', 'blob', 'scallop', 'pill', 'scallop', 'blob']
    const r = rng(77)
    let n = 0
    DATA.skills.forEach((g) => {
      const page = g.page === 'right' ? $('#pageR') : $('#pageL')
      const sec = document.createElement('section')
      sec.className = 'group'
      sec.innerHTML = `<h3><span class="scrib" data-kind="underline">${esc(g.group)}</span></h3><ul class="stickers" aria-label="${esc(g.group)} skills">` +
        g.items.map((item) => {
          const i = n++, shape = shapes[i % shapes.length]
          const rot = ((r() - 0.5) * 20).toFixed(1), tx = ((r() - 0.5) * 10).toFixed(0), ty = ((r() - 0.5) * 14).toFixed(0), fs = (22 + r() * 6).toFixed(1)
          return `<li class="stk ${shape}" tabindex="0" data-shape="${shape}" data-seed="${300 + i}" data-fill="${TONE[g.tone]}"${item.desc ? ` title="${esc(item.desc)}"` : ''} style="--rot:${rot}deg;--tx:${tx}px;--ty:${ty}px;--fs:${fs}px"><svg aria-hidden="true"></svg><b>${esc(item.name)}</b></li>`
        }).join('') + '</ul>'
      page.append(sec)
    })
    $$('.stk').forEach((el) => { paintSticker(el); observe(el, () => paintSticker(el)) })
    const book = $('#book')
    const redraw = () => { drawBook(book); $$('.page').forEach((pg) => drawPage(pg)) }
    redraw()
    observe(book, redraw)
    // drag to rearrange (mouse and pen; touch keeps scrolling)
    let z = 10
    $$('.stickers .stk').forEach((el) => {
      let sx, sy, ox = 0, oy = 0, dragging = false
      on(el, 'pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.button !== 0) return
        dragging = true; sx = e.clientX - ox; sy = e.clientY - oy
        el.setPointerCapture(e.pointerId); el.classList.add('dragging'); el.style.zIndex = ++z
        e.preventDefault()
      })
      on(el, 'pointermove', (e) => {
        if (!dragging) return
        ox = e.clientX - sx; oy = e.clientY - sy
        el.style.setProperty('--dx', ox + 'px'); el.style.setProperty('--dy', oy + 'px')
      })
      const end = () => { dragging = false; el.classList.remove('dragging') }
      on(el, 'pointerup', end)
      on(el, 'pointercancel', end)
    })
  }

  /* ---------- hallway doors (home) ---------- */
  function buildHallway() {
    const box = $('#hallDoors')
    ROOMS.slice(1).forEach((room, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'hall-door'
      b.dataset.jump = room
      b.setAttribute('aria-label', 'Open the door to ' + LABEL[room])
      b.append(buildDoor(room, LABEL[room], 40 + i * 9))
      const lab = document.createElement('span')
      lab.className = 'hall-label'
      lab.textContent = 'door ' + (i + 1)
      b.append(lab)
      box.append(b)
    })
  }

  /* ---------- passages ---------- */
  const passages = []
  function buildPassages() {
    $$('.passage').forEach((p, i) => {
      const from = p.dataset.from, to = p.dataset.to
      const stage = document.createElement('div')
      stage.className = 'stage room-' + from + ' from-' + from
      stage.innerHTML = `<div class="bg-from room-${from}"></div><div class="bg-to room-${to}"></div><div class="shadow"></div>
      <div class="cap"><span class="label">door ${p.dataset.n} of 4</span><strong>${esc(p.dataset.label)}</strong><span class="label">scroll to open</span></div>`
      const door = buildDoor(to, p.dataset.label, 100 + i * 11)
      stage.append(door)
      p.append(stage)
      attachGrid(stage.querySelector('.bg-from'), 60 + i * 5)
      attachGrid(stage.querySelector('.bg-to'), 90 + i * 5)
      passages.push({ el: p, stage, door, zoom: door.querySelector('.door-zoom'), panel: door.querySelector('.panel'),
        bgTo: stage.querySelector('.bg-to'), cap: stage.querySelector('.cap'), shadow: stage.querySelector('.shadow'), top: 0, h: 0, S: 8 })
    })
  }

  /* ---------- album ---------- */
  const album = { cards: [], stickers: [], top: 0, h: 0, vis: false }
  function buildAlbum() {
    const fall = $('#falling')
    $('#projects').style.setProperty('--n', DATA.projects.length)
    const xs = [0.64, 0.3, 0.74, 0.36, 0.68, 0.28, 0.6, 0.4]
    const rots = [-6, 5, -3, 7, -5, 3, -7, 4]
    DATA.projects.forEach((p, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'polaroid'
      b.setAttribute('aria-label', `${p.title}, ${p.kind}. Open details`)
      b.innerHTML = `<span class="tape" aria-hidden="true"></span>
      <span class="ph" style="background:${TONE[p.tone] || TONE.mint}"><span class="ph-grid"></span>${p.image ? photo(p) : `<span class="glyph" aria-hidden="true">${esc(p.glyph)}</span>`}</span>
      <span class="cap"><b>${esc(p.title)}</b><span>${esc(p.kind)}</span></span>`
      on(b, 'click', () => openDetail(i))
      fall.append(b)
      album.cards.push({ el: b, x: xs[i % xs.length], rot: rots[i % rots.length], ph: i * 1.7, wind: i % 2 ? 1 : -1 })
    })
    DATA.stickers.forEach((s, i) => {
      const el = document.createElement('span')
      el.className = 'sticker'
      el.setAttribute('aria-hidden', 'true')
      el.textContent = s
      el.style.background = Object.values(TONE)[i % 5]
      const depth = 0.55 + ((i * 37) % 10) / 22
      el.style.width = el.style.height = Math.round(64 * depth) + 'px'
      el.style.fontSize = Math.round(12 * depth) + 'px'
      el.style.opacity = (0.55 + depth * 0.35).toFixed(2)
      fall.prepend(el)
      album.stickers.push({ el, x: ((i * 0.618) % 1) * 0.9 + 0.05, rot: (i % 2 ? 1 : -1) * (10 + ((i * 7) % 20)), ph: i * 2.3, depth })
    })
    // tiny grids inside the photos
    album.cards.forEach((c, i) => {
      const g = c.el.querySelector('.ph-grid')
      const w = g.offsetWidth || 220
      g.innerHTML = gridSVG(w, w, 22, 0.5, 200 + i, true)
    })
  }
  function renderAlbum(p, vw, vh) {
    const N = DATA.projects.length, gap = 1, dur = 2.5, t0 = 0.9, t1 = (N - 1) * gap + dur
    const T = t0 + p * (t1 - t0)
    let shown = 0
    album.cards.forEach((c, i) => {
      const u = (T - i * gap) / dur, el = c.el
      if (u <= 0 || u >= 1) { el.style.visibility = 'hidden'; return }
      if (u > 0.2) shown = i + 1
      const cw = c.w || 240, ch = c.h || 320
      const y = -ch - 30 + (vh + ch + 60) * floatCurve(u)
      const sway = reduced ? 0 : Math.sin(u * Math.PI * 2 + c.ph) * Math.min(46, vw * 0.05)
      const narrow = vw < 640
      const cx = narrow ? vw * (0.5 + (c.x - 0.5) * 0.3) : vw * c.x
      const x = cx - cw / 2 + sway + (reduced ? 0 : c.wind * (u - 0.5) * 70)
      const rot = c.rot + (reduced ? 0 : Math.sin(u * Math.PI * 3 + c.ph) * 7)
      el.style.visibility = 'visible'
      el.style.zIndex = 10 + i
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`
    })
    album.stickers.forEach((s, i) => {
      const sp = 1.2 / s.depth, u = (((T * 0.9 * sp + i * 0.37) % 2.2) / 1.6), el = s.el
      if (u <= 0 || u >= 1 || p <= 0 || p >= 1) { el.style.visibility = 'hidden'; return }
      const y = -80 + (vh + 160) * u
      const x = vw * s.x + (reduced ? 0 : Math.sin(u * 6 + s.ph) * 30)
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(s.rot + u * 90 * (i % 2 ? 1 : -1)).toFixed(1)}deg)`
    })
    $('#counter').textContent = `photo ${Math.min(shown, N)} / ${N}`
    $('#albumEnd').style.opacity = T > t1 - 0.7 ? clamp((T - (t1 - 0.7)) / 0.4) : 0
  }

  /* dust motes in the void (canvas) */
  function startDust() {
    const cv = $('#dust'), ctx = cv.getContext('2d')
    let W = 0, H = 0, motes = []
    const size = () => {
      W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio
      const r = rng(9)
      motes = Array.from({ length: 46 }, () => ({ x: r() * W, y: r() * H, s: (0.6 + r() * 1.6) * devicePixelRatio, v: 0.1 + r() * 0.35, a: 0.15 + r() * 0.35 }))
    }
    size()
    on(window, 'resize', size)
    const tick = () => {
      if (!alive) return
      ctx.clearRect(0, 0, W, H)
      const visible = album.vis
      for (const m of motes) {
        if (visible && !reduced) { m.y += m.v * devicePixelRatio; m.x += Math.sin(m.y / 60) * 0.2; if (m.y > H) m.y = -4 }
        ctx.fillStyle = `rgba(241,240,234,${m.a})`
        ctx.fillRect(m.x, m.y, m.s, m.s)
      }
      requestAnimationFrame(tick)
    }
    tick()
  }

  /* ---------- scroll engine ---------- */
  let VW = innerWidth, VH = innerHeight
  const roomTops = {}
  const absTop = (el) => el.getBoundingClientRect().top + scrollY
  function measure() {
    VW = innerWidth
    VH = passages[0] ? passages[0].stage.offsetHeight : innerHeight
    passages.forEach((p) => {
      p.top = absTop(p.el); p.h = p.el.offsetHeight
      const hw = p.door.offsetWidth, hh = p.door.offsetHeight
      p.S = Math.max(VW / hw, VH / hh) * 1.12
      paintDoor(p.door, Math.max(6, (40 * 1.1) / p.S))
    })
    album.cards.forEach((c) => { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight })
    const pr = $('#projects')
    album.top = absTop(pr); album.h = pr.offsetHeight
    ROOMS.forEach((r) => (roomTops[r] = absTop(root.querySelector('#' + r))))
    onScroll()
  }
  function renderPassage(p, t) {
    const open = ease(clamp((t - 0.06) / 0.36))
    const z = clamp((t - 0.36) / 0.56), zE = z * z * z
    const fade = clamp((t - 0.9) / 0.08)
    p.panel.style.transform = `rotateY(${(open * 100).toFixed(2)}deg)`
    if (reduced) {
      p.zoom.style.transform = 'none'
      p.bgTo.style.opacity = clamp((t - 0.45) / 0.35)
      p.door.style.opacity = 1 - clamp((t - 0.45) / 0.35)
    } else {
      p.zoom.style.transform = `scale(${(1 + (p.S - 1) * zE).toFixed(4)})`
      p.bgTo.style.opacity = fade
      p.door.style.opacity = 1 - fade
    }
    p.cap.style.opacity = 1 - clamp(t / 0.28)
    p.shadow.style.opacity = 1 - clamp((t - 0.3) / 0.2)
  }
  let ticking = false
  function onScroll() {
    ticking = false
    if (!alive) return
    const y = scrollY
    for (const p of passages) {
      if (y + VH < p.top - 50 || y > p.top + p.h + 50) continue
      renderPassage(p, clamp((y - p.top) / (p.h - VH)))
    }
    const ap = (y - album.top) / (album.h - VH)
    album.vis = ap > -1 && ap < 1.2
    if (album.vis) renderAlbum(clamp(ap), VW, VH)
    let cur = 'home'
    for (const r of ROOMS) if (roomTops[r] <= y + VH * 0.5) cur = r
    $$('.nav-link').forEach((a) => a.setAttribute('aria-current', a.dataset.jump === cur ? 'true' : 'false'))
  }
  on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll) } }, { passive: true })
  let rt
  on(window, 'resize', () => { cancel(rt); rt = later(measure, 150) })

  /* ---------- door jump (nav + hallway) ---------- */
  let jumping = false
  function jumpTo(room, fromEl) {
    if (jumping) return
    const target = root.querySelector('#' + room)
    if (!target) return
    const go = () => window.scrollTo({ top: absTop(target), behavior: 'instant' })
    if (reduced) { go(); target.querySelector('h1,h2')?.focus?.(); return }
    jumping = true
    const layer = $('#jump')
    layer.innerHTML = ''
    layer.className = 'jump room-' + room
    layer.hidden = false
    let rect
    if (fromEl) rect = fromEl.getBoundingClientRect()
    else { const w = Math.min(190, Math.max(130, innerWidth * 0.17)); rect = { left: innerWidth / 2 - w / 2, top: innerHeight / 2 - w * 0.81, width: w, height: w * 1.62 } }
    const d = buildDoor(room, LABEL[room], 300 + ROOMS.indexOf(room), rect.width, rect.height)
    d.style.left = rect.left + 'px'; d.style.top = rect.top + 'px'
    const veil = document.createElement('div'); veil.className = 'veil'
    layer.append(d, veil)
    paintDoor(d)
    if (fromEl) fromEl.style.visibility = 'hidden'
    const zoom = d.querySelector('.door-zoom'), panel = d.querySelector('.panel')
    const S = Math.max(innerWidth / rect.width, innerHeight / rect.height) * 1.15
    const dx = innerWidth / 2 - (rect.left + rect.width / 2), dy = innerHeight / 2 - (rect.top + rect.height / 2)
    const D = 1500, t0 = performance.now()
    if (!fromEl) d.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 220, fill: 'backwards' })
    const step = (now) => {
      if (!alive) return
      const t = clamp((now - t0) / D)
      panel.style.transform = `rotateY(${(ease(clamp((t - 0.1) / 0.35)) * 100).toFixed(2)}deg)`
      const z = clamp((t - 0.4) / 0.52), zE = z * z * z
      zoom.style.transform = `translate(${(dx * ease(z)).toFixed(1)}px, ${(dy * ease(z)).toFixed(1)}px) scale(${(1 + (S - 1) * zE).toFixed(4)})`
      veil.style.opacity = clamp((t - 0.9) / 0.1)
      if (t < 1) return requestAnimationFrame(step)
      go()
      if (fromEl) fromEl.style.visibility = ''
      d.remove()
      veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' }).onfinish = () => { layer.hidden = true; layer.innerHTML = ''; jumping = false }
    }
    requestAnimationFrame(step)
  }
  on(document, 'click', (e) => {
    const a = e.target.closest('[data-jump]')
    if (!a || !root.contains(a)) return
    e.preventDefault()
    jumpTo(a.dataset.jump, a.classList.contains('hall-door') ? a.querySelector('.door') : null)
  })

  /* ---------- modal ---------- */
  let lastFocus = null
  function openModal(html) {
    lastFocus = document.activeElement
    $('#modalBody').innerHTML = html
    $('#modal').hidden = false
    $('#closeModal').focus()
  }
  function closeModal() { $('#modal').hidden = true; lastFocus?.focus?.() }
  function openDetail(i) {
    const p = DATA.projects[i]
    const links = [p.live && `<a class="btn dark sk" data-fill="var(--ink)" href="${esc(p.live)}" target="_blank" rel="noopener">Visit</a>`,
      p.code && `<a class="btn sk" style="--stroke:var(--ink);color:var(--ink)" href="${esc(p.code)}" target="_blank" rel="noopener">Source</a>`].filter(Boolean).join('')
    openModal(`<div class="detail">
      <div class="ph" style="background:${TONE[p.tone] || TONE.mint}" aria-hidden="true">${photo(p)}</div>
      <div><span class="meta">${esc(p.kind)}</span><h3 id="modalTitle">${esc(p.title)}</h3><p>${esc(p.desc)}</p>
      <div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div><div class="row" style="display:flex;gap:12px;flex-wrap:wrap">${links}</div></div></div>`)
    $$('#modalBody .sk').forEach((el, k) => decorate(el, 70 + k))
  }
  on($('#openIndex'), 'click', () => {
    openModal(`<h3 id="modalTitle" style="font-size:40px">All photos</h3>
    <div class="album-index">${DATA.projects.map((p, i) => `<button type="button" data-i="${i}"><span class="mini" style="background:${TONE[p.tone] || TONE.mint}" aria-hidden="true">${photo(p)}</span><b>${esc(p.title)}</b><span class="label" style="color:#555555">${esc(p.kind)}</span></button>`).join('')}</div>`)
    $$('.album-index button').forEach((b) => b.addEventListener('click', () => openDetail(+b.dataset.i)))
  })
  on($('#closeModal'), 'click', closeModal)
  on($('#modal'), 'click', (e) => { if (e.target.id === 'modal') closeModal() })
  on(window, 'keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal() })

  /* ---------- copy email ---------- */
  on($('#copyEmail'), 'click', () => {
    const done = () => { $('#copied').textContent = 'Copied.'; later(() => ($('#copied').textContent = ''), 2200) }
    const fallback = () => { const s = getSelection(), r = document.createRange(); r.selectNodeContents($('#email')); s.removeAllRanges(); s.addRange(r); $('#copied').textContent = 'Selected. Press Ctrl+C to copy.' }
    try { navigator.clipboard.writeText(DATA.email).then(done, fallback) } catch { fallback() }
  })

  /* ---------- the cat ---------- */
  function setupCat() {
    const spot = $('#catSpot'), cat = spot.querySelector('.cat'), pupils = cat.querySelector('.pupils')
    let dist = 0, lastX = null, lastY = null, idle, puffT = 0, petting = false
    const puff = () => {
      const now = performance.now()
      if (now - puffT < 260) return
      puffT = now
      const s = document.createElement('span')
      s.className = 'puff'
      s.textContent = ['prrr', '♡', '~', 'prr', '♡'][Math.floor(Math.random() * 5)]
      s.style.left = 30 + Math.random() * 45 + '%'
      s.style.top = '8%'
      s.style.setProperty('--dx', Math.random() * 40 - 20 + 'px')
      s.style.setProperty('--r', Math.random() * 30 - 15 + 'deg')
      spot.append(s)
      later(() => s.remove(), 1300)
    }
    on(cat, 'pointermove', (e) => {
      if (lastX !== null) dist += Math.hypot(e.clientX - lastX, e.clientY - lastY)
      lastX = e.clientX; lastY = e.clientY
      if (dist > 70) {
        if (!petting) { petting = true; spot.classList.add('petting', 'met') }
        puff()
      }
      cancel(idle)
      idle = later(() => { petting = false; dist = 0; spot.classList.remove('petting') }, 650)
    })
    on(cat, 'pointerleave', () => { lastX = null; dist = Math.min(dist, 40) })
    on(cat, 'click', () => {
      if (petting) return
      spot.classList.add('twitch')
      later(() => spot.classList.remove('twitch'), 250)
      const b = document.createElement('span')
      b.className = 'bubble sk'
      b.dataset.fill = 'var(--raised)'
      b.textContent = ['mrrp?', 'mew.', '...?'][Math.floor(Math.random() * 3)]
      spot.append(b)
      decorate(b, 99)
      later(() => b.remove(), 900)
    })
    // eyes follow the cursor
    on(window, 'pointermove', (e) => {
      if (petting) return
      const r = cat.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return
      const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.37
      const a = Math.atan2(e.clientY - cy, e.clientX - cx), m = Math.min(2.6, Math.hypot(e.clientX - cx, e.clientY - cy) / 60)
      pupils.setAttribute('transform', `translate(${(Math.cos(a) * m).toFixed(2)} ${(Math.sin(a) * m).toFixed(2)})`)
    }, { passive: true })
  }

  /* ---------- small hand lines ---------- */
  function drawFloor() {
    const svg = $('.hall-floor'), w = svg.getBoundingClientRect().width || 600
    svg.setAttribute('viewBox', `0 0 ${w} 8`)
    $('#floorPath').setAttribute('d', sketchLine(rng(4), 0, 4, w, 4, 1.4, 50))
  }
  function drawSpine() {
    const svg = $('.timeline .spine'), h = svg.getBoundingClientRect().height || 400
    svg.setAttribute('viewBox', `0 0 20 ${h}`)
    $('#spinePath').setAttribute('d', sketchLine(rng(8), 10, 0, 10, h, 2.2, 40))
  }

  /* ---------- boot ---------- */
  renderContent()
  buildHallway()
  buildPassages()
  buildAlbum()
  $$('.room[data-seed]').forEach((r) => attachGrid(r, +r.dataset.seed))
  attachGrid($('#albumStage'), 47, 0.5)
  $$('.sk').forEach(decorate)
  $$('.scrib').forEach(scribble)
  $$('.hall-door .door').forEach((d) => paintDoor(d))
  setupCat()
  startDust()
  drawFloor(); drawSpine()
  measure()
  on(window, 'resize', () => { drawFloor(); drawSpine(); $$('.hall-door .door').forEach((d) => paintDoor(d)) })
  // Room positions go stale whenever the page height changes without a window resize
  // (late fonts, content reflow, viewport emulation), so re-measure on any size change.
  let lastH = 0
  observe(root, () => {
    const h = root.offsetHeight
    if (Math.abs(h - lastH) < 2) return
    lastH = h
    cancel(rt); rt = later(measure, 150)
  })
  document.fonts?.ready?.then(() => { if (alive) { measure(); drawFloor(); drawSpine() } })
  const hash = location.hash.slice(1)
  if (ROOMS.includes(hash)) later(() => window.scrollTo({ top: absTop(root.querySelector('#' + hash)), behavior: 'instant' }), 60)

  return () => {
    alive = false
    cleanups.forEach((fn) => fn())
    timeouts.forEach((id) => clearTimeout(id))
  }
}

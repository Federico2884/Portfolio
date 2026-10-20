<script setup>
// The page markup from the sketchbook house design. Static once mounted:
// the engine draws into it, and the parent remounts it (via :key) when content changes.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { mountHouse } from './engine'
import './house.css'

const props = defineProps({
  data: { type: Object, required: true },
})

const root = ref(null)
let destroy
onMounted(() => {
  destroy = mountHouse(root.value, props.data)
})
onBeforeUnmount(() => destroy?.())
</script>

<template>
  <div ref="root">
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <filter id="wob1"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" /><feDisplacementMap in="SourceGraphic" scale="2.6" /></filter>
        <filter id="wob2"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="2.6" /></filter>
        <filter id="wob3"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="13" /><feDisplacementMap in="SourceGraphic" scale="2.6" /></filter>
      </defs>
    </svg>

    <nav class="topnav sk" data-fill="var(--raised)" aria-label="Rooms">
      <a class="logo" href="#home" data-jump="home">{{ data.logo }}</a>
      <ul>
        <li><a class="nav-link" href="#home" data-jump="home">Home</a></li>
        <li><a class="nav-link" href="#skills" data-jump="skills">Skills</a></li>
        <li><a class="nav-link" href="#projects" data-jump="projects">Projects</a></li>
        <li><a class="nav-link" href="#education" data-jump="education">Education</a></li>
        <li><a class="nav-link" href="#connect" data-jump="connect">Connect</a></li>
      </ul>
    </nav>

    <main>
      <!-- ROOM 1 · HOME -->
      <section id="home" class="room room-home" data-room="home" data-seed="3">
        <div class="wrap home-inner">
          <header class="hero">
            <p class="room-kicker">{{ data.kicker }}</p>
            <h1>hi, i'm <span class="scrib" data-kind="circle">{{ data.firstName }}</span>.</h1>
          </header>
          <div class="home-row">
            <p class="lede">
              <template v-for="(part, i) in data.intro" :key="i">
                <span v-if="part.mark" class="scrib" data-kind="underline">{{ part.text }}</span>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
            <div class="hallway">
              <div id="hallDoors" class="hall-doors"></div>
              <div id="catSpot" class="cat-spot">
                <span class="cat-tip">pet the cat</span>
                <svg class="cat" viewBox="0 0 140 140" role="img" aria-label="A small white doodle cat. Move your cursor over it to pet it.">
                  <g class="tail">
                    <path class="fl" d="M98 124 C126 124 136 98 124 80 C119 72 110 74 112 82 C120 96 118 112 98 114" />
                    <path class="ln" d="M121 86 L128 83 M124 98 L131 97 M118 109 L124 112" />
                  </g>
                  <g class="body-g">
                    <path class="fl" d="M38 130 C28 104 36 74 70 70 C104 74 112 104 102 130 Z" />
                    <path class="ln" d="M57 130 L57 112 M83 130 L83 112" />
                    <path class="ln" d="M50 130 Q57 124 64 130 M76 130 Q83 124 90 130" />
                    <g class="ear-l"><path class="fl" d="M40 42 L42 12 L64 30 Z" /><path class="patch" d="M44 36 L45 19 L58 30 Z" /></g>
                    <g class="ear-r"><path class="fl" d="M100 42 L98 12 L76 30 Z" /></g>
                    <path class="fl" d="M70 24 C96 24 106 40 104 56 C102 72 88 80 70 80 C52 80 38 72 36 56 C34 40 44 24 70 24 Z" />
                    <path class="patch" d="M42 40 C44 32 52 27 60 26 C56 32 54 40 48 46 C45 46 43 44 42 40 Z" />
                    <ellipse class="blush" cx="49" cy="62" rx="7" ry="4" />
                    <ellipse class="blush" cx="91" cy="62" rx="7" ry="4" />
                    <g class="eyes-open"><g class="pupils"><circle class="ink" cx="57" cy="52" r="4.2" /><circle class="ink" cx="83" cy="52" r="4.2" /></g></g>
                    <g class="eyes-closed"><path class="ln" d="M51 54 Q57 46 63 54 M77 54 Q83 46 89 54" /></g>
                    <path class="ln" d="M65 61 Q67.5 65 70 61 Q72.5 65 75 61" style="stroke-width: 2.4" />
                    <path class="ln" d="M38 60 L24 57 M38 65 L25 67 M102 60 L116 57 M102 65 L115 67" style="stroke-width: 2" />
                  </g>
                </svg>
              </div>
              <svg class="hall-floor" preserveAspectRatio="none" aria-hidden="true"><path id="floorPath" /></svg>
            </div>
          </div>
          <p class="hall-hint"><span class="arrow" aria-hidden="true">↓</span> keep scrolling to open the first door</p>
        </div>
      </section>

      <section class="passage" data-from="home" data-to="skills" data-n="1" data-label="Skills" aria-hidden="true"></section>

      <!-- ROOM 2 · SKILLS -->
      <section id="skills" class="room room-skills" data-room="skills" data-seed="11">
        <div class="wrap skills-inner">
          <div class="skills-head">
            <div>
              <p class="room-kicker">room 2 · the sticker book</p>
              <h2 class="room-title">Skills</h2>
            </div>
            <p class="lede">Everything I've practised, collected as stickers in an old book I keep.</p>
          </div>
          <div id="book" class="book">
            <svg class="book-art art" aria-hidden="true"></svg>
            <div id="pageL" class="page left">
              <svg class="page-art art" aria-hidden="true"></svg>
              <div class="page-head"><span>No. 02</span><span>Date <i>every day</i></span></div>
            </div>
            <div id="pageR" class="page right">
              <svg class="page-art art" aria-hidden="true"></svg>
              <div class="page-head"><span>Skills, so far</span><span>p. 2</span></div>
            </div>
          </div>
          <p class="board-hint">
            <span class="hint-mouse">psst · the stickers aren't glued down, try dragging one</span>
            <span class="hint-touch">psst · on a computer you can peel the stickers off and move them</span>
          </p>
        </div>
      </section>

      <section class="passage" data-from="skills" data-to="projects" data-n="2" data-label="Projects" aria-hidden="true"></section>

      <!-- ROOM 3 · PROJECTS -->
      <section id="projects" class="room room-projects" data-room="projects">
        <div id="albumStage" class="album-stage">
          <canvas id="dust" class="dust" aria-hidden="true"></canvas>
          <div class="wrap album-head">
            <div>
              <p class="room-kicker">room 3 · the photo album</p>
              <h2 class="room-title">Projects</h2>
              <p class="muted">Keep scrolling. The photos drift down one by one. Click one to look closer.</p>
            </div>
            <div class="album-side">
              <span id="counter" class="counter">photo 0 / 0</span>
              <button id="openIndex" class="btn light sk" type="button">All photos</button>
            </div>
          </div>
          <div id="falling" class="falling"></div>
          <p id="albumEnd" class="album-end">that's the whole album · one more door ahead</p>
        </div>
      </section>

      <section class="passage" data-from="projects" data-to="education" data-n="3" data-label="Education" aria-hidden="true"></section>

      <!-- ROOM 4 · EDUCATION -->
      <section id="education" class="room room-education" data-room="education" data-seed="23">
        <div class="wrap edu-inner">
          <div>
            <p class="room-kicker">room 4 · the study</p>
            <h2 class="room-title">Education</h2>
          </div>
          <div id="timeline" class="timeline">
            <svg class="spine" preserveAspectRatio="none" aria-hidden="true"><path id="spinePath" /></svg>
          </div>
        </div>
      </section>

      <section class="passage" data-from="education" data-to="connect" data-n="4" data-label="Connect" aria-hidden="true"></section>

      <!-- ROOM 5 · CONNECT -->
      <section id="connect" class="room room-connect" data-room="connect" data-seed="31">
        <div class="wrap connect-inner">
          <div class="connect-grid">
            <div>
              <p class="room-kicker">room 5 · the mailbox</p>
              <h2 class="room-title">Say <span class="scrib" data-kind="underline">hi</span>.</h2>
              <p class="lede" style="margin-top: 18px">Let's connect. Send me an email, or find me through the links.</p>
            </div>
            <div style="display: grid; gap: 26px; min-width: 0">
              <div class="letter sk" data-fill="var(--raised)">
                <span class="label">email</span>
                <span id="email" class="addr"></span>
                <div class="row">
                  <button id="copyEmail" class="btn dark sk" data-fill="var(--ink)" type="button">Copy address</button>
                  <span id="copied" class="copied" aria-live="polite"></span>
                </div>
              </div>
              <ul id="links" class="links"></ul>
            </div>
          </div>
          <div class="foot">
            <span>© <span id="year"></span> {{ data.name }}</span>
          </div>
        </div>
      </section>
    </main>

    <div id="jump" class="jump" hidden></div>
    <div id="modal" class="modal" hidden>
      <div class="modal-card sk" role="dialog" aria-modal="true" aria-labelledby="modalTitle" data-fill="#f7f5ef">
        <button id="closeModal" class="btn close sk" type="button" aria-label="Close">close ✕</button>
        <div id="modalBody"></div>
      </div>
    </div>
  </div>
</template>

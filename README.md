# Federico Alex Marlian's Portfolio

Built with Vue 3 and Vite. Content is stored in Supabase and edited at `/admin`.

## Develop

```bash
npm install
npm run dev
```

Open <http://localhost:5173/Portfolio/>. The CMS is at <http://localhost:5173/Portfolio/admin>.

Without Supabase configured, the site shows the bundled content in `src/data/seed.js`.
To connect the database, follow [`supabase/README.md`](supabase/README.md).

## Deploy (GitHub Pages)

```bash
npm run deploy
```

Content edits made in `/admin` go live immediately; deploy only when code changes.

## Where things are

| Path | What |
| --- | --- |
| `src/views/Home.vue` | Main page, passes CMS content to `src/house/` |
| `src/house/` | Main page markup (`SketchHouse.vue`), styles (`house.css`) and scroll animations (`engine.js`) |
| `src/sketch/`, `src/style.css` | Components and styles for the admin page |
| `src/views/Admin.vue`, `src/admin/` | The CMS |
| `src/data/content.js` | Loads content from Supabase (falls back to `seed.js`) |
| `supabase/schema.sql` | Tables, security rules and initial content |

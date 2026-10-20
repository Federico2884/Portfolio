# Menyambungkan database (Supabase)

Situs membaca proyek, skill, pendidikan dan profil dari Supabase, dan halaman `/admin` menulis ke sana.
Perubahan langsung tampil di situs tanpa build ulang. Selama belum disambungkan, situs memakai isi bawaan dari `src/data/seed.js`.

## 1. Buat project Supabase

1. Daftar/masuk di <https://supabase.com> lalu **New project** (paket Free cukup).
2. Tunggu sampai project siap.

## 2. Buat tabel dan isi awal

1. Buka **SQL Editor → New query**.
2. Tempel seluruh isi [`schema.sql`](schema.sql), klik **Run**.

Ini membuat tabel `profile`, `projects`, `skills`, `education`, `admins`, bucket gambar `portfolio`,
aturan keamanan (semua orang bisa membaca, hanya admin yang bisa menulis), dan mengisi data yang sama dengan situs sekarang.
Email admin awal: `rikomarlian123@gmail.com` (ganti di baris `insert into public.admins` jika perlu).

## 3. Buat akun login admin

1. **Authentication → Users → Add user → Create new user**.
2. Isi email yang sama dengan di tabel `admins`, buat password, centang **Auto Confirm User**.
3. Supaya orang lain tidak bisa mendaftar: **Authentication → Sign In / Providers → Email**, matikan **Allow new users to sign up**.
   (Walaupun ada yang mendaftar, mereka tetap tidak bisa menulis karena tidak ada di tabel `admins`.)

## 4. Sambungkan ke situs

1. **Project Settings → API**: salin **Project URL** dan **anon public key**.
2. Salin `.env.example` menjadi `.env.local` di root project, isi kedua nilai itu.
3. `npm run dev`, buka <http://localhost:5173/Portfolio/admin>, masuk dengan akun dari langkah 3.

## 5. Deploy

`npm run deploy` membaca `.env.local` saat build, jadi situs di GitHub Pages ikut tersambung.
Setelah itu, cukup edit lewat `https://federico2884.github.io/Portfolio/admin`; tidak perlu deploy lagi untuk perubahan isi.

## Catatan

- Gambar proyek yang diunggah lewat admin disimpan di bucket `portfolio`. Gambar lama di `public/projects/` tetap dipakai lewat path relatif (`projects/Sewain.jpg`).
- Ikon skill memakai class dari <https://devicon.dev>, mis. `devicon-python-plain colored`.
- Project Supabase gratis akan di-*pause* setelah sekitar seminggu tanpa aktivitas; situs tetap tampil dengan isi bawaan sampai project diaktifkan lagi dari dashboard.

-- Portfolio CMS schema for Supabase.
-- Run once in Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: tables are created only if missing; seed rows only go in when a table is empty.

-- ─────────────────────────────── Tables ───────────────────────────────

create table if not exists public.profile (
  id          int primary key default 1 check (id = 1),  -- exactly one row
  name        text not null default '',
  roles       text[] not null default '{}',              -- typewriter words in the hero
  intro       text not null default '',
  email       text not null default '',
  whatsapp    text not null default '',                  -- digits only, e.g. 6285724989305
  github      text not null default '',
  linkedin    text not null default '',
  instagram   text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null default '',
  tags        text[] not null default '{}',
  image_url   text,                                      -- full URL, or a path inside /public (projects/x.jpg)
  demo_url    text,
  code_url    text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null default 'Languages',
  name        text not null,
  icon        text not null default '',                  -- devicon class, e.g. "devicon-python-plain colored"
  description text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.education (
  id           uuid primary key default gen_random_uuid(),
  degree       text not null,
  institution  text not null default '',
  period       text not null default '',
  description  text not null default '',
  gpa          text,                                     -- shown as "GPA <value>"
  achievements text[] not null default '{}',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- Who may edit. Only emails listed here can write, even if someone else signs up.
create table if not exists public.admins (
  email text primary key
);

-- ─────────────────────────────── Security ───────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

alter table public.profile   enable row level security;
alter table public.projects  enable row level security;
alter table public.skills    enable row level security;
alter table public.education enable row level security;
alter table public.admins    enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profile', 'projects', 'skills', 'education'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Image uploads for projects: public to read, admins to write.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio public read" on storage.objects;
create policy "portfolio public read" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "portfolio admin write" on storage.objects;
create policy "portfolio admin write" on storage.objects
  for all using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

-- ─────────────────────────────── Seed ───────────────────────────────

insert into public.admins (email) values ('rikomarlian123@gmail.com')
on conflict do nothing;

insert into public.profile (id, name, roles, intro, email, whatsapp, github, linkedin, instagram)
values (
  1,
  'Federico Alex Marlian',
  array['Computer Science Student', 'Data Analyst', 'AI Enthusiast'],
  'I''m a Computer Science student, eager to learn and gain knowledge. Currently i''m passionate about *Artificial Intelligence* and related field such as Data Science, Deep Learning and Machine Learning.',
  'rikomarlian123@gmail.com',
  '6285724989305',
  'https://github.com/Federico2884',
  'https://linkedin.com/in/federico-alex-marlian-017b22325',
  'https://instagram.com/fdrco_valvet'
)
on conflict (id) do nothing;

insert into public.projects (title, description, category, tags, image_url, demo_url, code_url, sort_order)
select * from (values
  ('Sewain', 'Rental App, a Web-based Application Using Laravel', 'Web App',
    array['Laravel', 'Tailwind', 'PHP'], 'projects/Sewain.jpg', null, 'https://github.com/Federico2884/Sewain.git', 1),
  ('SmartCrave', 'A Food Recommendation Application Developed Using Java in Android Studio with a Content-Based Filtering Approach Based on Explicit User Preferences', 'Mobile App',
    array['Machine Learning', 'Python', 'Java', 'Android Studio'], 'projects/SmartCrave.jpg', null, 'https://github.com/Federico2884/SmartCrave.git', 2),
  ('WhisperJP', 'A Live Caption Translation Application, mainly focused on tuning the live caption (although responsiveness is still unreliable)', 'Mobile App',
    array['Deep Learning', 'Machine Learning', 'Artificial Intelligence', 'Java', 'Android Studio'], 'projects/WhisperJP.jpg', null, 'https://github.com/Federico2884/Whisper-JP.git', 3)
) as v(title, description, category, tags, image_url, demo_url, code_url, sort_order)
where not exists (select 1 from public.projects);

insert into public.skills (category, name, icon, description, sort_order)
select * from (values
  ('Languages', 'C', 'devicon-c-plain colored', 'A low-level systems programming language that provides direct control over memory and hardware. Used to build operating systems, embedded systems, and high-performance applications.', 1),
  ('Languages', 'C++', 'devicon-cplusplus-plain colored', 'An extension of C with OOP (Object-Oriented Programming) support. It is very popular for game development, real-time systems, and applications that require maximum performance.', 2),
  ('Languages', 'Python', 'devicon-python-plain colored', 'A versatile language with clean, easy-to-learn syntax. It''s a top choice for data science, machine learning, automation, and scripting thanks to its rich library ecosystem.', 3),
  ('Languages', 'Java', 'devicon-java-plain colored', 'An object-oriented language that runs on the JVM (Java Virtual Machine), making it cross-platform. It''s widely used for enterprise applications, web backends, and Android development.', 4),
  ('Languages', 'JavaScript', 'devicon-javascript-plain colored', 'The primary language for web development that runs directly in the browser. It enables the creation of interactive interfaces and can now also be used server-side via Node.js.', 5),
  ('Frameworks & Tools', 'Laravel', 'devicon-laravel-plain colored', 'An elegant PHP framework for building web applications. It provides comprehensive features such as routing, an ORM (Eloquent), authentication, and the Blade templating system, accelerating the development process.', 6),
  ('Frameworks & Tools', 'Android Studio', 'devicon-androidstudio-plain colored', 'Google''s official IDE for Android app development. It includes an emulator, profiler, and integration with the Android SDK to efficiently build and debug mobile apps.', 7),
  ('Frameworks & Tools', 'Vite', 'devicon-vitejs-plain colored', 'A next-generation build tool for blazing-fast front-end development. Utilizes native ES modules in the browser during development, resulting in instant Hot Module Replacement (HMR).', 8),
  ('Frameworks & Tools', 'MySQL', 'devicon-mysql-plain colored', 'The most popular open-source relational database management system (RDBMS). Widely used for web applications, it supports standard SQL and is known for its reliability and performance.', 9),
  ('Frameworks & Tools', 'Jupyter', 'devicon-jupyter-plain colored', 'An interactive, web-based computing environment for writing and running code directly. It is very popular among data scientists for data exploration, visualization, and analysis documentation.', 10),
  ('Frameworks & Tools', 'Anaconda', 'devicon-anaconda-original colored', 'A Python/R distribution for scientific computing and data science. It simplifies package and environment management through conda, and comes with hundreds of pre-installed libraries for data analysis.', 11),
  ('Frameworks & Tools', 'PyTorch', 'devicon-pytorch-original colored', 'Open-source machine learning framework focuses on flexibility and iteration speed. Popular in AI research thanks to its dynamic computation graph and robust GPU support.', 12)
) as v(category, name, icon, description, sort_order)
where not exists (select 1 from public.skills);

insert into public.education (degree, institution, period, description, gpa, achievements, sort_order)
select * from (values
  ('S1 Computer Science', 'Bina Nusantara University', '2024', 'Currently at semester 4, enthusiastic about Artificial Intelligence, Data Science, and their practical applications in solving real-world problems.', '3.83/4.0', array[]::text[], 1),
  ('SMA', 'SMA Talenta', '2021 - 2024', 'Science major with a strong aptitude for mathematics and analytical problem-solving', null, array[]::text[], 2)
) as v(degree, institution, period, description, gpa, achievements, sort_order)
where not exists (select 1 from public.education);

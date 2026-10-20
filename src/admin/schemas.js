// What the admin page can edit, table by table.
// Field types: text | textarea | list (comma separated) | lines (one per line) | image | url | icon
export const collections = {
  projects: {
    label: 'Proyek',
    titleKey: 'title',
    subtitle: (r) => r.category,
    fields: [
      { key: 'title', label: 'Judul', type: 'text', required: true },
      { key: 'category', label: 'Kategori', type: 'text', hint: 'Dipakai untuk filter, mis. Web App, Mobile App' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'tags', label: 'Tag', type: 'list', hint: 'Pisahkan dengan koma' },
      { key: 'image_url', label: 'Gambar', type: 'image', nullable: true },
      { key: 'code_url', label: 'Link kode (GitHub)', type: 'url', nullable: true },
      { key: 'demo_url', label: 'Link demo', type: 'url', nullable: true },
    ],
    blank: () => ({ title: '', category: '', description: '', tags: [], image_url: null, code_url: '', demo_url: '' }),
  },
  skills: {
    label: 'Skill',
    titleKey: 'name',
    subtitle: (r) => r.category,
    fields: [
      { key: 'name', label: 'Nama', type: 'text', required: true },
      { key: 'category', label: 'Kategori', type: 'text', hint: 'Mis. Languages, Frameworks & Tools. Kategori baru otomatis jadi filter baru.' },
      {
        key: 'icon',
        label: 'Ikon (devicon)',
        type: 'icon',
        hint: 'Class dari devicon.dev, mis. devicon-python-plain colored. Kosongkan jika tidak ada.',
      },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
    blank: () => ({ name: '', category: 'Languages', icon: '', description: '' }),
  },
  education: {
    label: 'Pendidikan',
    titleKey: 'degree',
    subtitle: (r) => [r.institution, r.gpa && `IPK ${r.gpa}`].filter(Boolean).join(' · '),
    fields: [
      { key: 'degree', label: 'Jenjang / jurusan', type: 'text', required: true },
      { key: 'institution', label: 'Institusi', type: 'text' },
      { key: 'period', label: 'Periode', type: 'text', hint: 'Mis. 2024 - sekarang' },
      { key: 'gpa', label: 'IPK', type: 'text', nullable: true, hint: 'Mis. 3.83/4.0. Kosongkan untuk menyembunyikan.' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'achievements', label: 'Pencapaian', type: 'list', hint: 'Pisahkan dengan koma' },
    ],
    blank: () => ({ degree: '', institution: '', period: '', gpa: '', description: '', achievements: [] }),
  },
}

export const profileFields = [
  { key: 'name', label: 'Nama lengkap', type: 'text', required: true },
  { key: 'roles', label: 'Peran (baris kecil di atas nama)', type: 'lines', hint: 'Satu per baris' },
  { key: 'intro', label: 'Perkenalan', type: 'textarea', hint: 'Apit satu frasa dengan *bintang* untuk diberi coretan garis bawah merah.' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'text', hint: 'Angka saja dengan kode negara, mis. 6285724989305' },
  { key: 'github', label: 'GitHub', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn', type: 'url' },
  { key: 'instagram', label: 'Instagram', type: 'url' },
]

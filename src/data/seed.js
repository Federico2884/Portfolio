// Fallback content, shaped like the Supabase tables (see supabase/schema.sql).
// Shown when Supabase isn't configured or can't be reached.
export const seed = {
  profile: {
    name: 'Federico Alex Marlian',
    roles: ['Computer Science Student', 'Data Analyst', 'AI Enthusiast'],
    intro:
      "I'm a Computer Science student, eager to learn and gain knowledge. Currently i'm passionate about *Artificial Intelligence* and related field such as Data Science, Deep Learning and Machine Learning.",
    email: 'rikomarlian123@gmail.com',
    whatsapp: '6285724989305',
    github: 'https://github.com/Federico2884',
    linkedin: 'https://linkedin.com/in/federico-alex-marlian-017b22325',
    instagram: 'https://instagram.com/fdrco_valvet',
  },

  projects: [
    {
      id: 'seed-sewain',
      title: 'Sewain',
      description: 'Rental App, a Web-based Application Using Laravel',
      category: 'Web App',
      tags: ['Laravel', 'Tailwind', 'PHP'],
      image_url: 'projects/Sewain.jpg',
      demo_url: null,
      code_url: 'https://github.com/Federico2884/Sewain.git',
      sort_order: 1,
    },
    {
      id: 'seed-smartcrave',
      title: 'SmartCrave',
      description:
        'A Food Recommendation Application Developed Using Java in Android Studio with a Content-Based Filtering Approach Based on Explicit User Preferences',
      category: 'Mobile App',
      tags: ['Machine Learning', 'Python', 'Java', 'Android Studio'],
      image_url: 'projects/SmartCrave.jpg',
      demo_url: null,
      code_url: 'https://github.com/Federico2884/SmartCrave.git',
      sort_order: 2,
    },
    {
      id: 'seed-whisperjp',
      title: 'WhisperJP',
      description:
        'A Live Caption Translation Application, mainly focused on tuning the live caption (although responsiveness is still unreliable)',
      category: 'Mobile App',
      tags: ['Deep Learning', 'Machine Learning', 'Artificial Intelligence', 'Java', 'Android Studio'],
      image_url: 'projects/WhisperJP.jpg',
      demo_url: null,
      code_url: 'https://github.com/Federico2884/Whisper-JP.git',
      sort_order: 3,
    },
  ],

  skills: [
    ['Languages', 'C', 'devicon-c-plain colored', 'A low-level systems programming language that provides direct control over memory and hardware. Used to build operating systems, embedded systems, and high-performance applications.'],
    ['Languages', 'C++', 'devicon-cplusplus-plain colored', 'An extension of C with OOP (Object-Oriented Programming) support. It is very popular for game development, real-time systems, and applications that require maximum performance.'],
    ['Languages', 'Python', 'devicon-python-plain colored', "A versatile language with clean, easy-to-learn syntax. It's a top choice for data science, machine learning, automation, and scripting thanks to its rich library ecosystem."],
    ['Languages', 'Java', 'devicon-java-plain colored', "An object-oriented language that runs on the JVM (Java Virtual Machine), making it cross-platform. It's widely used for enterprise applications, web backends, and Android development."],
    ['Languages', 'JavaScript', 'devicon-javascript-plain colored', 'The primary language for web development that runs directly in the browser. It enables the creation of interactive interfaces and can now also be used server-side via Node.js.'],
    ['Frameworks & Tools', 'Laravel', 'devicon-laravel-plain colored', 'An elegant PHP framework for building web applications. It provides comprehensive features such as routing, an ORM (Eloquent), authentication, and the Blade templating system, accelerating the development process.'],
    ['Frameworks & Tools', 'Android Studio', 'devicon-androidstudio-plain colored', "Google's official IDE for Android app development. It includes an emulator, profiler, and integration with the Android SDK to efficiently build and debug mobile apps."],
    ['Frameworks & Tools', 'Vite', 'devicon-vitejs-plain colored', 'A next-generation build tool for blazing-fast front-end development. Utilizes native ES modules in the browser during development, resulting in instant Hot Module Replacement (HMR).'],
    ['Frameworks & Tools', 'MySQL', 'devicon-mysql-plain colored', 'The most popular open-source relational database management system (RDBMS). Widely used for web applications, it supports standard SQL and is known for its reliability and performance.'],
    ['Frameworks & Tools', 'Jupyter', 'devicon-jupyter-plain colored', 'An interactive, web-based computing environment for writing and running code directly. It is very popular among data scientists for data exploration, visualization, and analysis documentation.'],
    ['Frameworks & Tools', 'Anaconda', 'devicon-anaconda-original colored', 'A Python/R distribution for scientific computing and data science. It simplifies package and environment management through conda, and comes with hundreds of pre-installed libraries for data analysis.'],
    ['Frameworks & Tools', 'PyTorch', 'devicon-pytorch-original colored', 'Open-source machine learning framework focuses on flexibility and iteration speed. Popular in AI research thanks to its dynamic computation graph and robust GPU support.'],
  ].map(([category, name, icon, description], i) => ({
    id: `seed-skill-${i}`,
    category,
    name,
    icon,
    description,
    sort_order: i + 1,
  })),

  education: [
    {
      id: 'seed-binus',
      degree: 'S1 Computer Science',
      institution: 'Bina Nusantara University',
      period: '2024',
      description:
        'Currently at semester 4, enthusiastic about Artificial Intelligence, Data Science, and their practical applications in solving real-world problems.',
      gpa: '3.83/4.0',
      achievements: [],
      sort_order: 1,
    },
    {
      id: 'seed-sma',
      degree: 'SMA',
      institution: 'SMA Talenta',
      period: '2021 - 2024',
      description: 'Science major with a strong aptitude for mathematics and analytical problem-solving',
      gpa: null,
      achievements: [],
      sort_order: 2,
    },
  ],
}

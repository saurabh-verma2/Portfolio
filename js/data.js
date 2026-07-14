
const RESUME_PREVIEW_URL = APP_CONFIG.links.resume;
const GITHUB_URL = APP_CONFIG.links.github;
const LINKEDIN_URL = APP_CONFIG.links.linkedin;
const INSTAGRAM_URL = APP_CONFIG.links.instagram;
const WHATSAPP_URL = APP_CONFIG.links.whatsapp;
const MAPS_URL = APP_CONFIG.links.maps;

const TAGLINES = [
  "I'm an Android Developer",
  "I build native apps with Kotlin & Jetpack Compose",
  "I'm also a Flutter Developer",
  "I build scalable mobile apps",
  "I create clean & modern UI",
  "I love solving real-world problems",
  "I'm an AI-powered app developer",
];

const ABOUT_TAGS = [
  'Kotlin',
  'Jetpack Compose',
  'Android App Developer',
  'MVVM Architecture',
  'Java',
  'Flutter',
  'Dart',
  'Cross-Platform Apps',
  'REST API Integration',
  'Firebase',
  'Room Database',
  'Google Play Deployment',
  'Data Structures & Algorithms',
  'Problem Solver',
  'Responsive UI',
  'Open Source Enthusiast',
];

// About info cards
const INFO_CARDS = [
  {
    title: "My Story",
    icon: "fa-history",
    points: [
      "Started programming with Java during graduation.",
      "Discovered a passion for Android and Flutter development.",
      "Built real-world applications using Kotlin, Jetpack Compose and Flutter.",
      "Currently working as a Software Engineer developing production Android applications.",
      "Always exploring modern Android architecture and AI-powered applications."
    ]
  },
  {
    title: 'My Craft',
    icon: 'fa-tools',
    points: [
      "Native Android app development with Kotlin & Jetpack Compose",
      'MVVM, Clean, and maintainable code architecture',
      'Attention to UI/UX details',
      'Seamless API & third-party integration',
      'Robust state management',
      'Performance optimization',
      'Cross-platform development with Flutter',
    ],
  },
  {
    title: 'My Vision',
    icon: 'fa-lightbulb',
    points: [
      'Fueled by "Passion and Purpose"',
      "Build software that solves real-world problems.",
      'Transform innovative ideas into quality products',
      "Contribute to impactful products.",
      "Learn modern Android technologies continuously.",
      "Leverage AI to build smarter applications."
    ],
  },
  {
    title: 'My Principle',
    icon: 'fa-flag',
    points: [
      'Quality over quantity',
      'User experience comes first',
      'Continuous improvement',
      'Every bug is a puzzle waiting to be solved',
      'Small progress every day builds mastery',
    ],
  },
];

// Skill categories 
const SKILL_CATEGORIES = [
  {
    name: "Android",
    icon: "fab fa-android",
    color: COLORS.android,
    skills: [
      { name: "Kotlin", icon: "fa fa-code", color: "#7b1fa2", level: 90 },
      { name: "Jetpack Compose", icon: "fa fa-mobile-alt", color: "#2e7d32", level: 88 },
      { name: "Android SDK", icon: "fab fa-android", color: "#2e7d32", level: 85 },
      { name: "Java", icon: "fab fa-java", color: "#c62828", level: 75 },
    ]
  },
  {
    name: "Mobile (Cross-Platform)",
    icon: "fa-mobile-alt",
    color: COLORS.blue,
    skills: [
      { name: "Flutter", icon: "fa fa-mobile-alt", color: "#1976d2", level: 85 },
      { name: "Dart", icon: "fa fa-code", color: "#7b1fa2", level: 80 },
      { name: "Riverpod", icon: "fa fa-layer-group", color: "#7b1fa2", level: 85 },
    ]
  },
  {
    name: "Backend",
    icon: "fa-server",
    color: COLORS.orange,
    skills: [
      { name: "Firebase", icon: "fa fa-fire", color: "#e65100", level: 85 },
      { name: "REST APIs", icon: "fa fa-plug", color: "#0288d1", level: 80 },
      { name: "Retrofit2 / OkHttp", icon: "fa fa-exchange-alt", color: "#0288d1", level: 82 },
    ]
  },
  {
    name: "Frontend",
    icon: "fa-globe",
    color: "#f57c00",
    skills: [
      { name: "HTML", icon: "fab fa-html5", color: "#e64a19", level: 82 },
      { name: "CSS", icon: "fab fa-css3-alt", color: "#1565c0", level: 78 },
      { name: "JavaScript", icon: "fab fa-js", color: "#f9a825", level: 70 },
    ]
  },
  {
    name: "Tools",
    icon: "fa-tools",
    color: "#455a64",
    skills: [
      { name: "Git", icon: "fab fa-git-alt", color: "#e64a19", level: 85 },
      { name: "GitHub", icon: "fab fa-github", color: "#333", level: 83 },
      { name: "VS Code", icon: "fa fa-code", color: "#1565c0", level: 90 },
      { name: "Android Studio", icon: "fab fa-android", color: "#2e7d32", level: 90 },
      { name: "Postman", icon: "fa fa-paper-plane", color: "#ef6c00", level: 72 },
    ]
  },
  {
    name: "Architecture",
    icon: "fa-layer-group",
    color: COLORS.purple,
    skills: [
      { name: "MVVM", icon: "fa fa-sitemap", color: "#7b1fa2", level: 90 },
      { name: "Clean Architecture", icon: "fa fa-layer-group", color: "#5e35b1", level: 82 },
      { name: "Repository Pattern", icon: "fa fa-database", color: "#3949ab", level: 82 },
      { name: "Hilt (DI)", icon: "fa fa-syringe", color: "#8e24aa", level: 78 },
    ]
  },
  {
    name: "AI / ML",
    icon: "fa-brain",
    color: "#6a1b9a",
    skills: [
      { name: "TensorFlow Lite", icon: "fa fa-brain", color: "#ef6c00", level: 75 },
      { name: "Gemini API", icon: "fa fa-robot", color: "#1e88e5", level: 82 },
    ]
  },
  {
    name: "Deployment",
    icon: "fa-cloud-upload-alt",
    color: "#00838f",
    skills: [
      { name: "Google Play Console", icon: "fab fa-google-play", color: "#00897b", level: 88 },
      { name: "Product Flavors", icon: "fa fa-code-branch", color: "#0277bd", level: 85 },
      { name: "AAB", icon: "fa fa-box", color: "#6d4c41", level: 85 },
      { name: "Google App Signing", icon: "fa fa-key", color: "#fb8c00", level: 82 },
      { name: "Build Variants", icon: "fa fa-cogs", color: "#546e7a", level: 85 },
      { name: "Keystore Management", icon: "fa fa-lock", color: "#c0392b", level: 80 },
    ]
  }
];

// Projects
const PROJECTS = [
  {
    title: "mEinstein – AI Personal Assistant",
    label: "Live on Play Store",
    icon: "fa-robot",
    gradient: "linear-gradient(135deg,#2e7d32,#66bb6a)",
    image: "assets/images/projects/meinstein-ai-assistant.webp",
    desc: "An AI-powered personal assistant app live on Google Play Store, built natively with Kotlin & Jetpack Compose.",
    github: GITHUB_URL,
    details: "A production Android app built with Kotlin, Jetpack Compose, MVVM, Room, and Retrofit. Features an offline-first data layer, Stripe-powered subscriptions, and a fully managed Google Play release lifecycle across multiple build environments.",
    features: [
      "Native Android UI built with Jetpack Compose",
      "MVVM architecture with Room offline-first data layer",
      "Stripe SDK integration for in-app subscriptions",
      "Retrofit2 + OkHttp with Coroutines & Flow for reactive networking",
      "Multi-environment build variants (dev / staging / production)",
      "Full Play Store release lifecycle: keystore, App Signing, AAB, staged rollouts",
    ],
    techs: [
      { name: "Kotlin", icon: "fa fa-code", color: "#7b1fa2" },
      { name: "Jetpack Compose", icon: "fa fa-mobile-alt", color: "#2e7d32" },
      { name: "Retrofit", icon: "fa fa-plug", color: "#0288d1" },
    ]
  },
  {
    title: "TrashDetective – AI Waste Classifier",
    label: "Android · On-Device AI",
    icon: "fa-recycle",
    gradient: "linear-gradient(135deg,#1565c0,#42a5f5)",
    image: "assets/images/projects/trash-detective-ai.webp",
    desc: "Real-time waste classification using live camera input, TensorFlow Lite, and Gemini API for disposal guidance.",
    github: GITHUB_URL,
    details: "A native Android app that detects and classifies waste in real time using CameraX and an on-device TensorFlow Lite model, then calls the Gemini API to generate contextual disposal and recycling guidance — fully offline-first for core inference.",
    features: [
      "Real-time waste detection via CameraX + ImageAnalysis",
      "On-device TensorFlow Lite inference (offline-first)",
      "Google Gemini API for contextual disposal instructions",
      "MVVM + Jetpack Compose reactive UI",
      "Quantized model & optimized Bitmap preprocessing for low latency",
    ],
    techs: [
      { name: "Kotlin", icon: "fa fa-code", color: "#7b1fa2" },
      { name: "TensorFlow Lite", icon: "fa fa-brain", color: "#7b1fa2" },
      { name: "Gemini API", icon: "fa fa-robot", color: "#2e7d32" },
    ]
  },
  {
    title: "Job Board & Freelance Marketplace",
    label: "Cross-Platform",
    icon: "fa-briefcase",
    gradient: "linear-gradient(135deg,#6a1b9a,#ce93d8)",
    image: "assets/images/projects/freelance-marketplace.webp",
    desc: "A Flutter marketplace connecting employers and freelancers with proposals, escrow payments, and real-time chat.",
    github: "https://github.com/saurabh-verma2/job_board_freelance_marketplace",
    details: "A cross-platform Flutter app with multi-role Riverpod state management across client and freelancer dashboards, end-to-end proposal/contract lifecycle with milestone tracking, real-time Firestore chat, and Razorpay escrow-style payments.",
    features: [
      "Job listings with advanced search & filtering",
      "Multi-role Riverpod state management (client & freelancer)",
      "Proposal-to-contract lifecycle with milestone tracking",
      "Real-time chat via Cloud Firestore with unread badges",
      "Razorpay escrow-style secure payments",
      "Analytics dashboards for earnings & project performance",
    ],
    techs: [
      { name: "Flutter", icon: "fa fa-mobile-alt", color: "#1976d2" },
      { name: "Riverpod", icon: "fa fa-layer-group", color: "#7b1fa2" },
      { name: "Firebase", icon: "fa fa-fire", color: "#e65100" },
    ]
  },
  {
    title: "Go To Kisan – Smart Agri Marketplace",
    label: "Cross-Platform",
    icon: "fa-seedling",
    gradient: "linear-gradient(135deg,#2e7d32,#aed581)",
    image: "assets/images/projects/go-to-kisan.webp",
    desc: "A Flutter marketplace bridging farmers and buyers with role-based dashboards and real-time chat.",
    github: "https://github.com/saurabh-verma2/Go-To-Kisan-Smart-Agricultural-Marketplace",
    details: "A cross-platform Flutter app with role-based dashboards for sellers and buyers, Riverpod state management, light/dark theming, attendance tracking with fl_chart visualizations, and multi-platform image handling.",
    features: [
      "Role-based dashboards for sellers & buyers",
      "Real-time chat powered by Cloud Firestore",
      "Riverpod state management with light/dark themes",
      "Attendance tracking with check-in/out & fl_chart visualizations",
      "Camera/gallery image picker with in-app cropping",
      "Responsive layouts across mobile & web",
    ],
    techs: [
      { name: "Flutter", icon: "fa fa-mobile-alt", color: "#1976d2" },
      { name: "Firebase", icon: "fa fa-fire", color: "#e65100" },
      { name: "fl_chart", icon: "fa fa-chart-line", color: "#f57c00" },
    ]
  },
];

// Experience & Education
const EXPERIENCES = [
  {
    type: 'work',
    icon: 'fa-briefcase',
    period: "Sep 2025 – Present",
    title: "Associate Software Developer",
    sub: "IPH Technologies, Lucknow",
    points: [
      "Developing native Android applications using Kotlin & Jetpack Compose, alongside Flutter cross-platform apps.",
      "Building mEinstein, an AI-powered assistant app live on Google Play Store, with MVVM, Room, and Retrofit.",
      "Owning the full Google Play release lifecycle: keystore, App Signing, AAB, and staged rollouts.",
      "Integrating REST APIs with Retrofit2/OkHttp and Coroutines & Flow for reactive networking.",
      "Improving application performance and UI responsiveness through structured error handling."
    ]
  },
  {
    type: 'work',
    icon: 'fa-briefcase',
    period: 'Feb 2025 – Aug 2025',
    title: 'Software Engineer Trainee',
    sub: 'IPH Technologies, Lucknow',
    score: null,
    points: [
      'Developed and maintained native Android features using Kotlin & Jetpack Compose, and cross-platform features using Flutter.',
      'Integrated RESTful APIs, handled JSON responses, and implemented error handling and state management.',
      'Assisted in debugging, testing, and optimizing application performance across device configurations.',
      'Gained hands-on experience in the mobile app development lifecycle and Git-based collaborative workflows.',
    ],
  },
  {
    type: 'edu',
    icon: 'fa-graduation-cap',
    period: '2023 – 2025',
    title: 'Master of Computer Application',
    sub: 'Maharshi University of Information & Technology, Lucknow',
    score: '8.9 CGPA',
    points: [
      "Studied core CS subjects at Master's level.",
      'Strong programming skills in Java and Kotlin.',
      'Solid understanding of DBMS and SQL optimization.',
      'Explored Automata, Algorithms & Computational Theory.',
    ],
  },
  {
    type: 'edu',
    icon: 'fa-school',
    period: '2019 – 2022',
    title: 'Bachelor of Computer Application',
    sub: 'Rajarshi School of Management & Technology, Varanasi',
    score: '8.5 CGPA',
    points: [
      'Foundation in C, C++, and Java programming.',
      'Knowledge of DBMS, SQL and Web Development.',
      'Projects in C, OOPS, Java, and DBMS.',
      'Consistently achieved strong academic performance.',
    ],
  },
];

const STATS = [
  { icon: 'fa-code-branch', value: 10, suffix: '+', label: 'Projects Built', color: '#1976d2' },
  { icon: 'fa-fire', value: 2, suffix: '+', label: 'Years of Learning', color: '#e65100' },
  { icon: 'fa-mobile-alt', value: 5, suffix: '+', label: 'Apps Published', color: '#7b1fa2' },
  { icon: 'fa-mug-hot', value: 99, suffix: '+', label: 'Cups of Coffee', color: '#f57c00' },
  { icon: 'fa-bug', value: 300, suffix: '+', label: 'Bugs Squashed', color: '#c62828' },
  { icon: 'fa-star', value: 50, suffix: '+', label: 'GitHub Stars Earned', color: '#f9a825' },
];

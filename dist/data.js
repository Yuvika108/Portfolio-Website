// Portfolio Data — Single source of truth for all content
// Edit here to update content across the site

const PORTFOLIO_DATA = {
  site: {
    title: "Srishti Mishra — AI/ML Engineer & Creative Coder",
    description: "Computer Science undergraduate specializing in Artificial Intelligence, exploring machine learning, LLM-powered applications and software development.",
    name: "Srishti Mishra",
    role: "AI/ML Engineer · Software Developer · Creative Coder",
    email: "mishrasrishti108@gmail.com",
    github: "https://github.com/Yuvika108",
    linkedin: "https://www.linkedin.com/in/mishrasrishti108/",
    education: "B.Tech CSE (Artificial Intelligence), University of Lucknow",
    cgpa: "8.93/10",
    resumeUrl: "#", // Add resume PDF URL when available
    tagline: "Building intelligent systems and thoughtful digital experiences."
  },

  hero: {
    headline: "Building intelligent systems and thoughtful digital experiences.",
    description: "Computer Science undergraduate specializing in Artificial Intelligence, exploring machine learning, LLM-powered applications and software development.",
    intro: "hey there, I'm",
    pills: ["PyTorch", "TensorFlow", "Transformers & LLMs", "Computer Vision", "MLOps", "Python"],
    ctaPrimary: { text: "Explore Projects", href: "#projects" },
    ctaSecondary: { text: "Download Resume", href: "#", download: true },
    socials: [
      { label: "GitHub", url: "https://github.com/Yuvika108", icon: "bi-github" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mishrasrishti108/", icon: "bi-linkedin" },
      { label: "Email", url: "mailto:mishrasrishti108@gmail.com", icon: "bi-envelope-fill" }
    ]
  },

  about: {
    label: "01 — About Me",
    heading: "Technology as a Form<br>of Creativity",
    lead: "Bachelor of Technology in Computer Science (Artificial Intelligence), focused on developing intelligent systems and data-driven solutions for real-world challenges.",
    body: "I specialize in building predictive models, optimizing machine learning pipelines, and creating applications that blend advanced AI capabilities with user-centered design. My work bridges the gap between technical depth and accessible, intuitive experiences.",
    details: [
      { label: "focus", value: "Artificial Intelligence & Machine Learning" },
      { label: "education", value: "B.Tech, Computer Science & Engineering (AI)" },
      { label: "cgpa", value: "8.93/10" },
      { label: "interests", value: "Neural Networks, Computer Vision, Algorithms & Applied Mathematics" }
    ],
    cards: [
      { icon: "bi-cpu", label: "Systems", color: "text-purple-300" },
      { icon: "bi-code-slash", label: "Engineering", color: "text-purple-300" },
      { icon: "bi-palette", label: "Design", color: "text-purple-300" },
      { icon: "bi-compass", label: "Explore", color: "text-purple-300" }
    ]
  },

  projects: {
    label: "02 — Projects",
    heading: "Featured Technical Work",
    intro: "Selected projects spanning AI/ML, Generative AI, and full-stack development. Each represents a real problem solved with code.",
    items: [
      {
        id: "multi-agent",
        number: "01",
        title: "Multi-Agent AI Research System",
        stack: ["LangChain", "FAISS", "Streamlit", "Tavily", "LLM APIs"],
        stackShort: "LangChain · FAISS · Streamlit",
        problem: "Researchers spend hours manually synthesizing information from multiple sources. An autonomous agent system can retrieve, reason, and compile research findings without constant human oversight.",
        description: "A multi-agent orchestration system that autonomously researches topics across the web, retrieves relevant documents via vector search, and synthesizes findings into structured reports.",
        features: [
          "Agent orchestration with LangChain for task decomposition",
          "Vector similarity search using FAISS for document retrieval",
          "Web research integration via Tavily search API",
          "Model fallback logic for LLM API resilience",
          "Streamlit interface for interactive research sessions"
        ],
        contribution: "Designed agent architecture, implemented retrieval-augmented generation pipeline, built Streamlit frontend.",
        github: "https://github.com/Yuvika108",
        live: null,
        image: null
      },
      {
        id: "rag-suite",
        number: "02",
        title: "RAG Experimentation Suite",
        stack: ["Python", "Embeddings", "Vector Databases", "RAG", "Scikit-learn"],
        stackShort: "Python · RAG · Vector DBs",
        problem: "Standard LLMs lack access to private or recent data. Retrieval-Augmented Generation bridges this gap by grounding responses in external documents.",
        description: "An experimentation suite for RAG pipelines, testing different embedding models, chunking strategies, and vector databases to optimize retrieval quality.",
        features: [
          "Document processing and chunking pipeline",
          "Embedding generation and vector storage",
          "Retrieval experiments across multiple strategies",
          "RAG pipeline evaluation and comparison",
          "Python-based modular architecture"
        ],
        contribution: "Built end-to-end RAG pipeline, experimented with embedding models, optimized retrieval parameters.",
        github: "https://github.com/Yuvika108",
        live: null,
        image: null
      },
      {
        id: "whatsapp-analyser",
        number: "03",
        title: "WhatsApp Chat Analyser",
        stack: ["Python", "Pandas", "Regex", "Matplotlib", "Streamlit"],
        stackShort: "Python · Pandas · Streamlit",
        problem: "Raw WhatsApp chat exports are unstructured text. Converting them into visual analytics reveals communication patterns and interaction rhythms.",
        description: "A data analytics utility that transforms raw WhatsApp chat exports into interactive visual reports, showing activity heatmaps, message distributions, and word frequency graphs.",
        features: [
          "Raw chat export parsing with Regex",
          "Message processing and statistics with Pandas",
          "Activity heatmaps and emoji tracking",
          "Word frequency and visual analytics",
          "Streamlit dashboard for interactive exploration"
        ],
        contribution: "Built chat parser, implemented visualization pipeline, deployed Streamlit app.",
        github: "https://github.com/Yuvika108",
        live: "https://whatsinurchat.streamlit.app/",
        image: null
      },
      {
        id: "cancer-detection",
        number: "04",
        title: "Cancer Detection using Deep Learning",
        stack: ["Python", "Computer Vision", "Deep Learning", "TensorFlow/Keras"],
        stackShort: "Python · Deep Learning · Computer Vision",
        problem: "Early cancer detection from medical imagery can significantly improve outcomes, but requires robust deep learning models trained on large datasets.",
        description: "A computer vision project using deep learning architectures to process medical imagery and identify malignant cellular patterns.",
        features: [
          "Dataset processing and image augmentation",
          "Deep learning model architecture (CNN)",
          "Training pipeline with validation",
          "Model evaluation and metrics",
          "Python and TensorFlow/Keras implementation"
        ],
        contribution: "Processed medical image dataset, designed CNN architecture, trained and evaluated model.",
        github: "https://github.com/Yuvika108",
        live: null,
        image: null
      }
    ]
  },

  skills: {
    label: "03 — Technical Skills",
    heading: "The Craft & The Tools",
    intro: "Technical capabilities organized by domain. Each represents hands-on project experience, not just exposure.",
    categories: [
      {
        title: "Programming",
        color: "orange",
        items: [
          { name: "Python", context: "Data & ML" },
          { name: "C++", context: "OOP & Logic" },
          { name: "SQL", context: "Databases" },
          { name: "JavaScript", context: "Web Frontend" }
        ]
      },
      {
        title: "AI / Machine Learning",
        color: "pink",
        items: [
          { name: "NumPy", context: "Numerical computing" },
          { name: "Pandas", context: "Data manipulation" },
          { name: "Scikit-learn", context: "Classical ML" },
          { name: "Deep Learning", context: "Neural networks" },
          { name: "NLP", context: "Text processing" }
        ]
      },
      {
        title: "Generative AI",
        color: "purple",
        items: [
          { name: "LangChain", context: "Agent orchestration" },
          { name: "RAG", context: "Retrieval systems" },
          { name: "FAISS", context: "Vector search" },
          { name: "ChromaDB", context: "Vector database" },
          { name: "LLM APIs", context: "Model integration" },
          { name: "Prompt Engineering", context: "Prompt design" }
        ]
      },
      {
        title: "Development Tools",
        color: "yellow",
        items: [
          { name: "HTML/CSS", context: "UI Layouts" },
          { name: "React", context: "Frontend" },
          { name: "Streamlit", context: "ML apps" },
          { name: "Git", context: "Version control" },
          { name: "GitHub", context: "Collaboration" }
        ]
      }
    ],
    currentlyLearning: [
      "Machine Learning model evaluation",
      "LLMs, RAG and agentic workflows",
      "Software engineering and full-stack development"
    ]
  },

  experience: {
    label: "04 — Experience & Leadership",
    heading: "Experience & Leadership",
    intro: "Professional experience, internships, and leadership roles in reverse chronological order.",
    items: [
      {
        role: "Student Coordinator / Co-lead",
        org: "TPC FoET, University of Lucknow",
        dates: "April 2026 – Present",
        type: "Leadership",
        bullets: [
          "Recruiter and HR outreach for campus hiring",
          "Internship and placement opportunity coordination",
          "Student-industry liaison for placement drives"
        ]
      },
      {
        role: "Graphic Design Intern",
        org: "Multiventrix",
        dates: "Internship",
        type: "Internship",
        bullets: [
          "Visual design and creative asset production",
          "Brand identity and marketing material design",
          "Collaborative design workflow with cross-functional teams"
        ]
      },
      {
        role: "Frontend Development",
        org: "Dotfle.UI",
        dates: "Contract",
        type: "Contract",
        bullets: [
          "Website development and UI implementation",
          "Frontend component design and integration",
          "Responsive layout implementation"
        ]
      },
      {
        role: "Smart India Hackathon",
        org: "Internal Selection Round",
        dates: "2026",
        type: "Competition",
        bullets: [
          "Top 50 in internal selection round",
          "AI/ML problem statement development",
          "Team collaboration and rapid prototyping"
        ]
      }
    ]
  },

  achievements: {
    label: "05 — Achievements & Learning",
    heading: "Achievements & Learning",
    intro: "Academic recognition, technical progress, and current learning trajectories.",
    currentlyExploring: [
      "Machine Learning and model evaluation",
      "LLMs, RAG and agentic workflows",
      "Software engineering and full-stack development"
    ],
    items: [
      { label: "CGPA", value: "8.93/10", context: "B.Tech CSE (AI), University of Lucknow" },
      { label: "DSA", value: "Problem Solving", context: "Active practice and skill development" },
      { label: "SIH", value: "Top 50", context: "Smart India Hackathon internal selection" },
      { label: "Certifications", value: "In Progress", context: "AI/ML and software development" }
    ]
  },

  creative: {
    label: "06 — Creative Side",
    heading: "Creative Coding & Visual Experiments",
    intro: "Personal creative projects, visual experiments, and interests outside of core engineering.",
    items: [
      { title: "Generative Art", desc: "Creative coding experiments with neural networks and algorithmic visuals." },
      { title: "Interface Design", desc: "UI/UX explorations blending aesthetics with functionality." },
      { title: "Music & Cinema", desc: "Personal interests in film, music, and storytelling." },
      { title: "Books & Literature", desc: "Reading and creative writing influences." }
    ]
  },

  contact: {
    label: "07 — Get In Touch",
    heading: "Let's Connect",
    sub: "Have an interesting opportunity or project in mind? I'd love to connect.",
    items: [
      { label: "Email", url: "mailto:mishrasrishti108@gmail.com", icon: "bi-envelope-fill", text: "mishrasrishti108@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mishrasrishti108/", icon: "bi-linkedin", text: "mishrasrishti108" },
      { label: "GitHub", url: "https://github.com/Yuvika108", icon: "bi-github", text: "Yuvika108" },
      { label: "Resume", url: "#", icon: "bi-file-earmark-pdf", text: "Download Resume" }
    ]
  }
};

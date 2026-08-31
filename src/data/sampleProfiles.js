// Pre-built developer profiles for 1-click demo loads and landing page simulator

export const SAMPLE_PROFILES = {
  nejamul: {
    id: 'sample-nejamul',
    name: 'Nejamul Haque',
    username: 'nejamulhaque',
    headline: 'Computer Science Undergraduate | DevSecOps Aspirant',
    bio: 'Motivated Computer Science undergraduate specializing in backend architecture, system administration, and infrastructure automation. Strong foundational knowledge in Linux environments, network protocols, version control workflows, and DevSecOps engineering.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    location: 'Bettiah, Bihar, India',
    theme: 'dark',
    template: 'cyberpunk',
    skills: [
      { category: 'System & Infrastructure', skills: ['Linux (Ubuntu)', 'Bash Scripting', 'System Permissions', 'Process Management'] },
      { category: 'Networking & Security', skills: ['TCP/IP Stack', 'DNS', 'HTTP/HTTPS', 'SSH Key Management', 'Ports & Firewalls', 'OSI Model'] },
      { category: 'Development & Database', skills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB (MERN)', 'REST APIs'] },
      { category: 'Tools & Version Control', skills: ['Git', 'GitHub', 'Branching & Merging Workflows', 'CI/CD'] },
      { category: 'AI & Machine Learning', skills: ['Generative AI Integration', 'Prompt Engineering', 'AI API Consumption', 'Python'] }
    ],
    experience: [
      {
        company: 'Self-Directed Systems & Infrastructure Learning',
        role: 'Systems & Security Practitioner',
        duration: 'March 2026',
        desc: 'Built a local sandbox to master Linux system administration, permissions, and CLI operations. Conducted deep dives into networking protocols (TCP/IP, DNS, SSH, Firewalls) and data routing. Managed personal project repositories independently using structured Git workflows.'
      }
    ],
    education: [
      { 
        degree: 'B.Tech in Computer Science (Honors)', 
        school: 'Teerthanker Mahaveer University (Moradabad, UP)', 
        year: '2023 – 2027' 
      },
      { 
        degree: 'Higher Secondary Education (12th Grade) - Academic Excellence Award', 
        school: 'Bihar State Education Board (Patna, Bihar)', 
        year: '2021 – 2023' 
      }
    ],
    certificates: [
      { title: 'MongoDB Associate Developer', issuer: 'MongoDB University', date: '2025' },
      { title: 'GitHub Actions Certified', issuer: 'GitHub', date: '2026' },
      { title: 'Anthropic Claude Developer', issuer: 'Anthropic', date: '2026' },
      { title: 'Introduction to Generative AI', issuer: 'Google Cloud', date: '2024' }
    ],
    projects: [
      {
        title: 'Linux System Administration & Automation Lab',
        description: 'Configured a local Linux environment to practice file system security, user privilege management, and process monitoring. Developed custom Bash automation scripts to manage local files, check system uptime, and monitor authentication logs for security awareness.',
        tags: ['Linux', 'Ubuntu', 'Bash', 'System Security', 'Automation'],
        repoLink: 'https://github.com/NejamulHaque',
        demoLink: 'https://nejamulhaque.vercel.app/'
      },
      {
        title: 'Network Security & Connectivity Lab',
        description: 'Built local networking scenarios to test port configurations, firewall rules, and secure communication lines. Configured and hardened secure remote access via SSH key pairs, eliminating password vulnerabilities on local test environments.',
        tags: ['Networking', 'TCP/IP', 'Firewalls', 'SSH Hardening', 'Security'],
        repoLink: 'https://github.com/NejamulHaque',
        demoLink: 'https://nejamulhaque.vercel.app/'
      },
      {
        title: 'AI-Powered Document Classifier (Capstone)',
        description: 'Built an AI-powered document classifier using Python and a pre-trained NLP model, deployed as a REST API integrated into a React frontend for high-accuracy categorization.',
        tags: ['Python', 'NLP', 'React', 'REST API', 'Generative AI', 'FastAPI'],
        repoLink: 'https://github.com/NejamulHaque',
        demoLink: 'https://nejamulhaque.vercel.app/'
      }
    ],
    contact: {
      email: 'nejamulhaqueruhaan86@gmail.com',
      phone: '+91-6299676007',
      website: 'https://nejamulhaque.vercel.app/',
      location: 'Bettiah, Bihar, India'
    },
    socials: [
      { platform: 'github', url: 'https://github.com/NejamulHaque' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/nejamulhaque/' },
      { platform: 'website', url: 'https://nejamulhaque.vercel.app/' }
    ],
    views: 1850
  },

  fullstack: {
    id: 'sample-fullstack',
    name: 'Alex Rivera',
    username: 'alexrivera',
    headline: 'Senior Full Stack Engineer & Cloud Architect',
    bio: 'Crafting high-scale distributed systems and pixel-perfect interactive web apps. Obsessed with performance, clean DX, and resilient architecture.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    theme: 'dark',
    template: 'minimal',
    skills: [
      { category: 'Frontend', skills: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'] },
      { category: 'Backend & Cloud', skills: ['Node.js', 'Go', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS Lambda', 'Kubernetes'] },
      { category: 'DevOps & Tooling', skills: ['CI/CD', 'Terraform', 'Vitest', 'Vite', 'Kafka', 'gRPC'] }
    ],
    experience: [
      {
        company: 'Stripe',
        role: 'Staff Infrastructure Engineer',
        duration: '2022 - Present',
        desc: 'Architected real-time payment webhook ingest pipelines processing over 45k req/sec with 99.999% uptime. Mentored 8 senior engineers.'
      },
      {
        company: 'Vercel',
        role: 'Senior Frontend Systems Engineer',
        duration: '2020 - 2022',
        desc: 'Core contributor to Next.js compiler optimizations and edge runtime streaming protocols. Decreased cold boot latency by 42%.'
      }
    ],
    education: [
      { degree: 'B.S. in Computer Science', school: 'UC Berkeley', year: '2016 - 2020' }
    ],
    certificates: [
      { title: 'AWS Certified Solutions Architect - Professional', issuer: 'Amazon Web Services', date: '2024' },
      { title: 'Kubernetes Certified Administrator (CKA)', issuer: 'Linux Foundation', date: '2023' }
    ],
    projects: [
      {
        title: 'HyperStream - Realtime Analytics Engine',
        description: 'Sub-millisecond event streaming platform capable of handling billions of daily telemetry events with zero data loss.',
        tags: ['Rust', 'Kafka', 'React', 'ClickHouse', 'Docker'],
        repoLink: 'https://github.com/alexrivera/hyperstream',
        demoLink: 'https://hyperstream.demo.dev'
      },
      {
        title: 'NeuralCanvas - AI Design Studio',
        description: 'Interactive canvas web app utilizing WebGL shaders and Gemini models for automated component generation and code export.',
        tags: ['React', 'TypeScript', 'WebGL', 'AI/LLM', 'Tailwind'],
        repoLink: 'https://github.com/alexrivera/neural-canvas',
        demoLink: 'https://neuralcanvas.ai'
      }
    ],
    contact: {
      email: 'alex.rivera@engineer.dev',
      phone: '+1 (415) 890-2341',
      website: 'https://alexrivera.dev',
      location: 'San Francisco, CA'
    },
    socials: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'website', url: 'https://alexrivera.dev' }
    ],
    views: 1420
  },

  ai: {
    id: 'sample-ai',
    name: 'Dr. Maya Lin',
    username: 'mayalin_ai',
    headline: 'AI Research Scientist & LLM Systems Architect',
    bio: 'Pioneering multimodal foundation models, retrieval-augmented systems, and autonomous agent frameworks. Passionate about ethical AI.',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    location: 'Seattle, WA',
    theme: 'dark',
    template: 'glassmorphism',
    skills: [
      { category: 'AI & ML', skills: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'vLLM', 'CUDA', 'LoRA', 'RLHF'] },
      { category: 'Data & Vector DBs', skills: ['Python', 'Pinecone', 'Qdrant', 'Milvus', 'Spark', 'DuckDB'] },
      { category: 'Web & API', skills: ['FastAPI', 'Next.js', 'TypeScript', 'Docker', 'GCP Vertex AI'] }
    ],
    experience: [
      {
        company: 'Anthropic / DeepMind Collaborator',
        role: 'Lead ML Research Engineer',
        duration: '2023 - Present',
        desc: 'Designed reasoning evaluation benchmarks and token-efficient KV-cache optimization algorithms for production LLMs.'
      }
    ],
    education: [
      { degree: 'Ph.D. in Artificial Intelligence', school: 'Stanford University', year: '2017 - 2021' }
    ],
    certificates: [
      { title: 'NeurIPS Outstanding Paper Award', issuer: 'NeurIPS', date: '2023' }
    ],
    projects: [
      {
        title: 'AgentMatrix - Autonomous Swarm Framework',
        description: 'Open-source orchestration engine for asynchronous collaborative LLM agents with tree-of-thought verification.',
        tags: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'VectorDB'],
        repoLink: 'https://github.com/mayalin/agent-matrix',
        demoLink: 'https://agentmatrix.ai'
      }
    ],
    contact: {
      email: 'maya.lin@ai-research.org',
      website: 'https://mayalin.ai',
      location: 'Seattle, WA'
    },
    socials: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'twitter', url: 'https://twitter.com' }
    ],
    views: 2840
  },

  designer: {
    id: 'sample-designer',
    name: 'Elena Rostova',
    username: 'elenarostova',
    headline: 'Principal Product Designer & Creative Technologist',
    bio: 'Designing futuristic digital products, spatial interfaces, and cohesive design systems. Bridging high aesthetics with intuitive usability.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    location: 'London, UK',
    theme: 'dark',
    template: 'bento',
    skills: [
      { category: 'Product Design', skills: ['Figma', 'Design Systems', 'Spatial UI', 'User Research', 'Prototyping', 'Micro-interactions'] },
      { category: 'Creative Tech', skills: ['React', 'CSS/Tailwind', 'Three.js', 'Spline 3D', 'GLSL Shaders', 'Framer'] }
    ],
    experience: [
      {
        company: 'Figma',
        role: 'Staff Product Designer',
        duration: '2022 - Present',
        desc: 'Spearheaded the redesign of developer mode inspection tools and component variant tokens across desktop and web.'
      }
    ],
    education: [
      { degree: 'M.A. in Interaction Design', school: 'Royal College of Art, London', year: '2017 - 2019' }
    ],
    certificates: [
      { title: 'Apple Design Award Nominee', issuer: 'Apple', date: '2023' }
    ],
    projects: [
      {
        title: 'Prism UI - Accessible 3D Design Tokens',
        description: 'Next-generation open design system with automated color contrast computation and dynamic theme compilation.',
        tags: ['Figma', 'Design Tokens', 'React', 'Three.js', 'a11y'],
        repoLink: 'https://github.com/elena/prism-ui',
        demoLink: 'https://prism.design'
      }
    ],
    contact: {
      email: 'elena@designstudio.uk',
      website: 'https://elenarostova.design',
      location: 'London, UK'
    },
    socials: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
      { platform: 'twitter', url: 'https://twitter.com' }
    ],
    views: 3190
  }
};

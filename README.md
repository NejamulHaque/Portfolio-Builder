# ⚡ Portfolio Builder — Next-Gen AI Developer Portfolio Platform

<div align="center">

![Portfolio Builder Banner](/public/logo.png)

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**The most advanced, feature-packed portfolio builder for developers, engineers, and designers.**

[Live Demo](https://builderr-ai.vercel.app/) • [Report Bug](https://github.com/NejamulHaque/Portfolio-Builder/issues) • [Request Feature](https://github.com/NejamulHaque/Portfolio-Builder/issues)

</div>

---

## 🌟 Key Features

- 🧠 **Real-Time AI Writing Engine**: Powered by IRUS AI, auto-generate recruiter-optimized bios, punchy headlines, and impactful project descriptions.
- 🎨 **6+ Designer Templates**:
  - **Minimalist**: Clean typography with monochrome elegance.
  - **Cyberpunk**: Neon magenta/cyan synthwave with glowing matrix elements.
  - **Corporate Slate**: Executive serif headlines and clean structured cards.
  - **Retro Terminal**: Hacker CLI green monospace with scanline CRT effects.
  - **Glassmorphism Luxe**: Ambient frosted glass with radiant background blurs.
  - **Creative Bento**: Vibrant grid cards with tag pills and badge pins.
- 🚀 **Interactive Live Playground**: Visitors can test drive themes and developer presets directly on the landing page before registering.
- 📄 **1-Click PDF Resume Export**: High-fidelity, print-optimized resume stylesheet generation.
- 📱 **100% Fully Responsive**: Dual-mode mobile editor, viewport preview switchers (Desktop, Tablet, Mobile), and animated navigation drawers.
- 🔗 **Instant QR Code & Social Sharing**: Generate scannable QR codes for resumes and business cards with one click.
- 📊 **Digital Identity Score & Analytics**: Real-time completeness checklist and visitor traffic insights.
- 💾 **JSON Backup & Migration**: Instant 1-click export and import of your entire portfolio.
- 💳 **UPI Payment Gateway with QR Code**: Seamless upgrade workflow with automatic admin notifications.
- 🔒 **Enterprise-Grade Auth & Security**: Powered by Supabase PostgreSQL with Row Level Security (RLS).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
- **Icons & UI**: Lucide React, React Icons
- **Database & Auth**: Supabase (PostgreSQL & Storage)
- **AI Backend**: IRUS AI LLM Integration
- **PDF Generation**: `html2pdf.js`
- **SEO & Meta**: `react-helmet-async`, OpenGraph, Twitter Cards, SVG Favicon

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/NejamulHaque/Portfolio-Builder.git
cd Portfolio-Builder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_IRUS_API_KEY=your_irus_api_key
```

### 4. Run the local development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
Portfolio-Builder/
├── public/
│   ├── favicon.svg          # Modern gradient SVG favicon
│   ├── site.webmanifest     # PWA manifest
│   └── logo.png             # Brand logo & OpenGraph banner
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Responsive top nav with mobile drawer
│   │   ├── Footer.jsx            # Rich footer with newsletter & status
│   │   ├── PortfolioRenderer.jsx # Universal 6-theme portfolio engine
│   │   ├── QRCodeModal.jsx       # Dynamic QR code & social share modal
│   │   ├── SiteNotice.jsx        # Cookie & terms banner
│   │   └── Toast.jsx             # Animated notification toasts
│   ├── context/
│   │   └── AuthContext.jsx       # Supabase session provider
│   ├── data/
│   │   └── sampleProfiles.js     # Presets for 1-click loading
│   ├── lib/
│   │   └── supabaseClient.js     # Supabase client initialization
│   ├── pages/
│   │   ├── LandingPage.jsx       # Interactive hero, live playground & bento grid
│   │   ├── Dashboard.jsx         # Dual-pane live editor with viewport switcher
│   │   ├── PublicPortfolio.jsx   # Dynamic public URL with PDF export
│   │   ├── Profile.jsx           # Identity score, checklist & analytics
│   │   ├── Pricing.jsx           # UPI checkout modal & plan comparison
│   │   ├── Admin.jsx             # Subscription verification dashboard
│   │   ├── Login.jsx             # Authentication with demo quick-fill
│   │   ├── Register.jsx          # New user registration
│   │   ├── Legal.jsx             # Privacy Policy & Terms of Service
│   │   └── NotFound.jsx          # 404 handler
│   ├── services/
│   │   └── aiService.js          # AI prompt orchestration
│   ├── App.jsx                   # Route configuration
│   ├── index.css                 # Custom scrollbars, scanlines, animations
│   └── main.jsx                  # Application root
├── index.html                    # SEO & OpenGraph meta tags
├── package.json
└── vite.config.js
```

---

## 👨‍💻 Author

**Nejamul Haque**
- GitHub: [@NejamulHaque](https://github.com/NejamulHaque)
- Twitter: [@Nejamul_Haque_](https://twitter.com/Nejamul_Haque_)

---

## 📄 License

This project is licensed under the MIT License.

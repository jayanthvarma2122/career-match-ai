# 🚀 CareerMatch AI – Resume Analyzer & Job Matcher

[![Built with React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61dafb.svg)](https://react.dev/)
[![Styling with Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38bdf8.svg)](https://tailwindcss.com/)
[![Backend Node & Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-68a063.svg)](https://expressjs.com/)
[![Database MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47a248.svg)](https://www.mongodb.com/)
[![AI Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285f4.svg)](https://aistudio.google.com/)

**CareerMatch AI** is a production-grade, full-stack AI career companion designed specifically for computer science engineering students and junior developers. It bridges the gap between academic projects and industry requirements by performing **11-point ATS readability audits**, **semantic job description matching**, and providing **24/7 AI career coaching**.

Developed as an elite portfolio project for 2nd-year B.Tech Computer Science internship applications.

---

## 🌟 Key Features

1. **📄 PDF Resume Parsing & In-Memory Extraction**:
   - Accepts PDF resumes up to 5MB.
   - Parses raw document buffers directly in-memory using `pdf-parse`, avoiding orphaned temporary files or disk latency.

2. **🎯 11-Point ATS Resume Audit**:
   - Overall Resume Score out of 100.
   - Identified Strengths & Weaknesses.
   - Categorized Technical vs. Soft Skills detection.
   - High-demand Missing Skills gap detection.
   - Education, Experience, and Project depth evaluations.
   - ATS compatibility rules and structural improvement recommendations.

3. **💼 Semantic Job Matcher**:
   - Compare candidate resumes against actual tech internship job descriptions.
   - 4-Tier objective rubric scoring: Skills (40%), Experience (30%), Education (15%), Keywords (15%).
   - Actionable tailoring advice and keyword optimization.

4. **🤖 24/7 AI Career Coach**:
   - Interactive chatbot powered by Google Gemini.
   - Specializes in STAR-method interview responses, DSA roadmaps, and project explanations.

5. **📊 Visual Analytics Dashboard**:
   - Recharts area graphs showing resume score progression across drafts.
   - Skills distribution bar charts.
   - Job match benchmark progress bars.

6. **🛡️ Resilient Architecture (Recruiter Ready)**:
   - Built-in **1-Click Instant Demo Login** for zero-friction evaluation.
   - Graceful offline fallback: if MongoDB is disconnected or if the Gemini API key is unset, the app runs smoothly with local session storage without crashing.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST API architecture, ES Modules) |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **AI Engine** | Google Gemini Generative AI SDK (`@google/generative-ai`) |
| **Authentication** | JWT (JSON Web Tokens) with `bcryptjs` password hashing |
| **File Processing** | Multer (Memory Storage) & `pdf-parse` |

---

## 📂 Project Architecture

```
career-match-ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & offline fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile, demo access
│   │   ├── resumeController.js   # PDF upload, extraction & Gemini analysis
│   │   ├── jobController.js      # Semantic job description matcher
│   │   ├── chatController.js     # AI career assistant coach
│   │   └── dashboardController.js# Statistical aggregation for charts
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── upload.js             # Multer PDF filter & memory storage
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Resume.js             # Resume audit results schema
│   │   ├── JobAnalysis.js        # Job match schema
│   │   └── Chat.js               # Chat history thread schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── chatRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── pdfService.js         # Buffer text extractor
│   │   └── geminiService.js      # Structured Gemini prompts & model cascades
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth provider, theme toggle & demo login
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx# Responsive sidebar, navbar & theme toggle
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, features, social proof & CTAs
│   │   │   ├── Login.jsx         # Sign in & 1-click demo access
│   │   │   ├── Signup.jsx        # Student registration
│   │   │   ├── Dashboard.jsx     # Recharts analytics & metrics
│   │   │   ├── ResumeAnalyzer.jsx# 11-point PDF resume audit dashboard
│   │   │   ├── JobMatcher.jsx    # Semantic job description comparison
│   │   │   ├── CareerAssistant.jsx# AI mentor chat with suggestion chips
│   │   │   ├── History.jsx       # Searchable analysis log & preview modal
│   │   │   └── Profile.jsx       # Academic & technical profile settings
│   │   ├── services/
│   │   │   └── api.js            # Modular API client
│   │   ├── App.jsx               # Protected routing
│   │   ├── index.css             # Tailwind base & custom styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   └── database_setup.md         # MongoDB Atlas step-by-step setup guide
├── INTERVIEW_GUIDE.md            # Comprehensive interview defense & Q&A guide
├── start-dev.bat                 # 1-Click Windows development launcher
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/) (Optional, has offline fallback)
- MongoDB Atlas account or local MongoDB (Optional, has in-memory fallback)

### Step 1: Clone or Navigate to Directory
```bash
cd "c:\Users\balaj\OneDrive\Desktop\resume projects(VIP)\career-match-ai"
```

### Step 2: Configure Backend Environment
Navigate to `backend/` and inspect `.env`:
```bash
cd backend
copy .env.example .env
```
Fill in your credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/careermatch_ai
JWT_SECRET=careermatch_super_secret_jwt_key_2026_vip
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Run the Application

#### Option A: Using 1-Click Launcher (Windows)
Double-click `start-dev.bat` in the project root.

#### Option B: Manual Command Line
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new student profile | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/profile` | Retrieve authenticated profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `POST` | `/api/resumes/upload` | Upload & extract text from PDF | Yes |
| `POST` | `/api/resumes/analyze`| Run 11-point Gemini ATS evaluation | Yes |
| `GET` | `/api/resumes` | Retrieve all past resume analyses | Yes |
| `DELETE`| `/api/resumes/:id` | Delete resume analysis | Yes |
| `POST` | `/api/jobs/analyze` | Perform semantic job match | Yes |
| `GET` | `/api/jobs` | Retrieve job match history | Yes |
| `DELETE`| `/api/jobs/:id` | Delete job match entry | Yes |
| `POST` | `/api/chat/message` | Send message to AI Career Coach | Yes |
| `GET` | `/api/chat/history` | Retrieve chat message history | Yes |
| `DELETE`| `/api/chat/clear` | Clear chat history thread | Yes |
| `GET` | `/api/dashboard/stats` | Retrieve aggregated charts & metrics | Yes |
| `GET` | `/api/health` | Backend status & uptime health check | No |

---

## 🎓 Why this Project Impresses Recruiters

1. **Demonstrates Full-Stack Mastery**: End-to-end integration across React, Express, MongoDB, and modern AI SDKs.
2. **Production-Ready Error Handling**: Handles corrupted PDFs, token expirations, AI model deprecation, and database connection timeouts gracefully.
3. **Structured AI Integration**: Enforces deterministic, validated JSON schemas from LLM completions rather than unconstrained plaintext.
4. **Accessible UI/UX**: Responsive modern SaaS aesthetics, dark/light themes, loading states, and smooth animations.

---

## 📄 License
Created for academic portfolio and internship demonstration purposes.


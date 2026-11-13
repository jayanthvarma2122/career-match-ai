# 🚀 CareerMatch AI – Resume Analyzer & Job Matcher

[![Built with React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-111111.svg?style=flat&logo=react)](https://react.dev/)
[![Styling with Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-111111.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Backend Node & Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-111111.svg?style=flat&logo=nodedotjs)](https://expressjs.com/)
[![Database MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-111111.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![AI Engine Gemini](https://img.shields.io/badge/AI-Google%20Gemini-111111.svg?style=flat&logo=google)](https://aistudio.google.com/)

**CareerMatch AI** is a modern, full-stack AI career platform designed to help engineering students and developers land tech internships. It performs in-memory **11-point ATS resume readability audits**, executes **semantic job description matching** against custom target companies, and provides real-time **AI career coaching** powered by Google Gemini.

Designed with a minimal monochrome SaaS interface inspired by Linear and Vercel.

---

## ✨ Features

- **📄 In-Memory PDF Parsing**: Parses raw document buffers directly in-memory using `pdf-parse` without disk overhead or storing temporary files.
- **🎯 11-Point ATS Resume Audit**: Evaluates overall ATS compatibility score, identified strengths, critical skill gaps, and actionable formatting suggestions.
- **💼 Semantic Job Matching**: Compares candidate resumes against target job descriptions and custom company profiles using a 4-tier weighted rubric (Skills, Projects, Education, Keywords).
- **🤖 24/7 AI Career Assistant**: Interactive technical interview mentor specializing in the STAR method, system design fundamentals, and project deep-dives.
- **📊 User-Scoped Analytics**: Clean Recharts graphs tracking authentic score progression, identified skills, and match history isolated per user.
- **⚡ 1-Click Instant Demo Access**: Auto-provisions a pre-configured student profile with sample evaluations for instant reviewer evaluation.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST API, ES Modules) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI Model** | Google Gemini Generative AI SDK (`@google/generative-ai`) |
| **Authentication** | JWT (JSON Web Tokens), `bcryptjs` password hashing |
| **Deployment** | Vercel (Frontend SPA), Render (Backend Web Service) |

---

## 📂 Project Structure

```text
career-match-ai/
├── backend/
│   ├── config/              # Database connection & self-healing DNS resolver
│   ├── controllers/         # Auth, Resume, Job Match, Chat, and Dashboard controllers
│   ├── middleware/          # JWT authentication and Multer PDF buffer upload
│   ├── models/              # Mongoose schemas (User, Resume, JobAnalysis, Chat)
│   ├── routes/              # Express REST API routes
│   ├── services/            # Gemini AI service and in-memory PDF parsing
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/         # AuthContext (authentication & session management)
│   │   ├── layouts/         # DashboardLayout (monochrome navigation & sidebar)
│   │   ├── pages/           # Dashboard, Analyzer, Matcher, Assistant, History, Profile
│   │   ├── services/        # Dynamic API client (supports local dev & production URLs)
│   │   ├── App.jsx          # Protected client-side routes
│   │   └── index.css        # Tailwind directives & typography styling
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json          # SPA rewrite rules for Vercel deployment
│   └── vite.config.js
│
├── .gitignore               # Strict exclusion rules (keeps credentials protected)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)
- [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/jayanthvarma2122/career-match-ai.git
cd career-match-ai
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/careermatch_ai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:
```bash
npm start
```
*The server will start at `http://localhost:5000`.*

### 3. Configure Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new student profile | No |
| `POST` | `/api/auth/login` | Sign in existing user | No |
| `POST` | `/api/auth/demo` | 1-Click Instant Demo login | No |
| `GET` | `/api/auth/profile` | Get current user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information & skills | Yes |

### Resume Analysis
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/resumes/upload` | Upload PDF and extract text buffer | Yes |
| `POST` | `/api/resumes/analyze` | Execute 11-point ATS audit | Yes |
| `GET` | `/api/resumes` | Fetch user's analyzed resumes | Yes |
| `DELETE`| `/api/resumes/:id` | Delete resume record | Yes |

### Job Matching & Coaching
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/jobs/analyze` | Benchmark resume against target Job Description | Yes |
| `GET` | `/api/jobs/history` | Fetch user's job match evaluations | Yes |
| `POST` | `/api/chat` | Chat with AI Career Coach | Yes |
| `GET` | `/api/dashboard/stats` | Aggregated dashboard analytics & charts | Yes |
| `GET` | `/api/health` | Health & uptime verification | No |

---

## 🌐 Deployment

- **Backend (Render)**: Deploy as a **Web Service** with Root Directory set to `backend`, Build Command `npm install`, and Start Command `node server.js`. Configure `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` in Render environment variables.
- **Frontend (Vercel)**: Import repository into Vercel with Root Directory set to `frontend`, Framework set to `Vite`, and set `VITE_API_URL=https://your-backend.onrender.com/api`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Briefcase,
  Bot,
  Zap,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, demoLogin } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#111111] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-xs shadow-2xs">
              <span>C</span>
            </div>
            <span className="font-semibold text-base tracking-tight text-[#111111]">
              CareerMatch AI
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs transition shadow-2xs"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-xs font-medium text-[#777777] hover:text-[#111111] transition"
                >
                  Log In
                </button>
                <button
                  onClick={handleDemoAccess}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] hover:bg-[#E5E5E5] transition"
                >
                  Instant Demo
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs transition shadow-2xs"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 sm:pt-20 sm:pb-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-[11px] font-medium text-[#111111] mb-6 shadow-2xs">
          <span>AI-Powered Career Companion</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] leading-tight max-w-3xl mx-auto">
          Your Intelligent Resume Analyzer & Job Matcher
        </h1>

        <p className="mt-4 text-xs sm:text-base text-[#777777] max-w-2xl mx-auto leading-relaxed">
          Quantify your ATS readiness, identify critical technical skill gaps, and match job descriptions in seconds with Gemini AI.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs transition"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDemoAccess}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F3F3F3] text-[#111111] font-medium text-xs transition shadow-2xs"
          >
            <span>Try 1-Click Demo</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
            <p className="text-xl sm:text-2xl font-bold text-[#111111]">11 Points</p>
            <p className="text-[11px] text-[#777777] mt-0.5">ATS Rubric Scoring</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
            <p className="text-xl sm:text-2xl font-bold text-[#111111]">100% Free</p>
            <p className="text-[11px] text-[#777777] mt-0.5">Student Friendly</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
            <p className="text-xl sm:text-2xl font-bold text-[#111111]">&lt; 3s</p>
            <p className="text-[11px] text-[#777777] mt-0.5">Analysis Latency</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
            <p className="text-xl sm:text-2xl font-bold text-[#111111]">24/7</p>
            <p className="text-[11px] text-[#777777] mt-0.5">AI Interview Coaching</p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-12 bg-[#FFFFFF] border-y border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Engineered for Modern Tech Internships
            </h2>
            <p className="text-xs text-[#777777] mt-1">
              Everything computer science students need to navigate software hiring filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] flex items-center justify-center mb-3">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#111111]">11-Point ATS Parser</h3>
              <p className="text-xs text-[#777777] mt-1 leading-relaxed">
                Direct in-memory PDF parsing extracts resume sections and benchmarks keyword density against production ATS parsers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#111111]">Semantic Job Matcher</h3>
              <p className="text-xs text-[#777777] mt-1 leading-relaxed">
                Paste any job posting to calculate match percentage across skills, experience, project depth, and role keywords.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] flex items-center justify-center mb-3">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#111111]">24/7 AI Interview Coach</h3>
              <p className="text-xs text-[#777777] mt-1 leading-relaxed">
                Practice answering system design, project deep-dives, and behavioural questions using the STAR framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E5E5E5] bg-[#FFFFFF] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#777777]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#111111] text-[#FFFFFF] flex items-center justify-center text-[10px] font-bold">
              C
            </div>
            <span>CareerMatch AI – Portfolio Project</span>
          </div>
          <p>© 2026 CareerMatch AI. Built for Computer Science Engineering students.</p>
        </div>
      </footer>
    </div>
  );
}

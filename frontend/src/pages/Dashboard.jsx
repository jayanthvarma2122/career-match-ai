import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import {
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  ArrowUpRight,
  Layers,
  Award,
  Bot,
  Clock,
  ChevronRight,
  Upload,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardAPI.getStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Dashboard stats notice:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalResumes = stats?.totalResumes ?? 0;
  const avgResumeScore = stats?.avgResumeScore ?? 0;
  const totalJobs = stats?.totalJobs ?? 0;
  const avgJobMatch = stats?.avgJobMatch ?? 0;
  const skillsCount = stats?.skillsCount ?? (Array.isArray(user?.skills) ? user.skills.length : 0);

  const scoreData = stats?.scoreHistory || [];
  const skillsData = stats?.skillsDistribution || [];
  const jobMatches = stats?.jobMatchHistory || [];

  // Elegant monochrome palette for charts
  const monochromeBars = ['#111111', '#262626', '#404040', '#737373', '#A3A3A3'];

  return (
    <div className="space-y-6">
      {/* 1. Clean White Welcome Panel */}
      <div className="rounded-xl p-6 sm:p-7 bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5] text-[11px] font-medium">
            <span>Career Dashboard</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mt-2.5 tracking-tight text-[#111111]">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'} 👋
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-[#777777] font-normal leading-relaxed">
            {totalResumes > 0 ? (
              <>
                Your current resume achieves an ATS compatibility benchmark of{' '}
                <span className="font-semibold text-[#111111]">
                  {avgResumeScore}/100
                </span>
                . Target key missing skills to maximize recruiter reach.
              </>
            ) : (
              <>
                Welcome to your workspace! Upload your first resume in the{' '}
                <span className="font-semibold text-[#111111]">Resume Analyzer</span> to get an 11-point ATS audit and custom job matching.
              </>
            )}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/analyzer')}
              className="px-3.5 py-2 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs transition shadow-2xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Analyze Resume</span>
            </button>
            <button
              onClick={() => navigate('/job-matcher')}
              className="px-3.5 py-2 rounded-lg bg-[#F3F3F3] hover:bg-[#E5E5E5] text-[#111111] font-medium text-xs transition border border-[#E5E5E5] flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#777777]" />
              <span>Match Job Description</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Compact Monochrome Metric Cards (Reflects Exact User Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Resumes */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs hover:border-[#111111] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#777777]">
              Total Resumes
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#111111]">
              {totalResumes}
            </span>
            <span className="text-[10px] font-medium text-[#111111] px-1.5 py-0.5 rounded bg-[#F3F3F3] border border-[#E5E5E5]">
              {totalResumes === 1 ? 'Audited' : 'Audited'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#777777]">
            {totalResumes > 0 ? 'Parsed & benchmarked' : 'No resumes uploaded yet'}
          </p>
        </div>

        {/* Card 2: Avg ATS Score */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs hover:border-[#111111] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#777777]">
              Avg ATS Score
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#111111]">
              {totalResumes > 0 ? avgResumeScore : '--'}
            </span>
            <span className="text-xs text-[#777777]">/ 100</span>
          </div>
          <p className="mt-1 text-[11px] text-[#777777]">
            {totalResumes > 0 ? 'Current candidate benchmark' : 'Requires audited resume'}
          </p>
        </div>

        {/* Card 3: Avg Job Match */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs hover:border-[#111111] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#777777]">
              Avg Job Match
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#111111]">
              {totalJobs > 0 ? `${avgJobMatch}%` : '--%'}
            </span>
            {totalJobs > 0 && (
              <span className="text-[10px] font-medium text-[#111111] px-1.5 py-0.5 rounded bg-[#F3F3F3] border border-[#E5E5E5]">
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-[#777777]">
            {totalJobs > 0
              ? `Across ${totalJobs} evaluated role${totalJobs > 1 ? 's' : ''}`
              : 'No job matches evaluated yet'}
          </p>
        </div>

        {/* Card 4: Skills Identified */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs hover:border-[#111111] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#777777]">
              Skills Identified
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#111111]">
              {skillsCount}
            </span>
            <span className="text-[10px] font-medium text-[#111111] px-1.5 py-0.5 rounded bg-[#F3F3F3] border border-[#E5E5E5]">
              Extracted
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#777777]">
            {skillsCount > 0 ? 'From resumes & profile' : 'Add skills or audit resume'}
          </p>
        </div>
      </div>

      {/* 3. Monochrome Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Chart 1: Monochrome Line Chart (Score History) */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#111111] text-xs sm:text-sm">
                Resume Score History
              </h3>
              <p className="text-[11px] text-[#777777]">Score progression across iterations</p>
            </div>
            {scoreData.length > 0 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{scoreData.length} Version{scoreData.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>

          <div className="h-60 w-full">
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" opacity={0.8} />
                  <XAxis dataKey="name" stroke="#777777" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#777777" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E5E5',
                      borderRadius: '0.5rem',
                      color: '#111111',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Resume Score"
                    stroke="#111111"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-[#FAFAFA] rounded-lg border border-dashed border-[#E5E5E5]">
                <FileText className="w-8 h-8 text-[#777777] mb-2" />
                <p className="text-xs font-semibold text-[#111111]">No Resume Score History Yet</p>
                <p className="text-[11px] text-[#777777] max-w-xs mt-1">
                  Upload and analyze your resume in the Resume Analyzer to track score progression over time.
                </p>
                <button
                  onClick={() => navigate('/analyzer')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] text-xs font-medium transition shadow-2xs"
                >
                  Audit First Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Monochrome Bar Chart (Top Skills Identified) */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#111111] text-xs sm:text-sm">
                Top Skills Identified
              </h3>
              <p className="text-[11px] text-[#777777]">Frequency across your profile and resumes</p>
            </div>
            {skillsData.length > 0 && (
              <button
                onClick={() => navigate('/profile')}
                className="text-[11px] text-[#111111] font-medium hover:underline flex items-center gap-0.5"
              >
                <span>Edit Profile</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="h-60 w-full">
            {skillsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#E5E5E5" opacity={0.8} />
                  <XAxis dataKey="name" stroke="#777777" fontSize={10} tickLine={false} />
                  <YAxis stroke="#777777" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E5E5',
                      borderRadius: '0.5rem',
                      color: '#111111',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar dataKey="value" name="Weight" radius={[4, 4, 0, 0]}>
                    {skillsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={monochromeBars[index % monochromeBars.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 bg-[#FAFAFA] rounded-lg border border-dashed border-[#E5E5E5]">
                <Layers className="w-8 h-8 text-[#777777] mb-2" />
                <p className="text-xs font-semibold text-[#111111]">No Skills Identified Yet</p>
                <p className="text-[11px] text-[#777777] max-w-xs mt-1">
                  Skills extracted from your audited resumes and profile settings will appear here automatically.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#F3F3F3] hover:bg-[#E5E5E5] text-[#111111] border border-[#E5E5E5] text-xs font-medium transition"
                >
                  Add Profile Skills
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Target Matches & Quick Access Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left Column: Target Job Matches */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111111] text-xs sm:text-sm">
              Target Matches
            </h3>
            <button
              onClick={() => navigate('/job-matcher')}
              className="text-[11px] text-[#111111] font-medium hover:underline flex items-center gap-0.5"
            >
              <span>New Match</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {jobMatches.length > 0 ? (
              jobMatches.map((j, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-xs text-[#111111] truncate">
                      {j.role}
                    </span>
                    <span className="font-semibold text-xs text-[#111111]">
                      {j.match}%
                    </span>
                  </div>
                  {/* Monochrome progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#E5E5E5] overflow-hidden">
                    <div
                      className="h-full bg-[#111111] rounded-full transition-all duration-300"
                      style={{ width: `${j.match}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-[#777777] mt-1">{j.company}</span>
                </div>
              ))
            ) : (
              <div className="py-7 px-4 flex flex-col items-center justify-center text-center bg-[#FAFAFA] rounded-lg border border-dashed border-[#E5E5E5]">
                <Target className="w-7 h-7 text-[#777777] mb-2" />
                <p className="text-xs font-semibold text-[#111111]">No Job Matches Yet</p>
                <p className="text-[11px] text-[#777777] max-w-xs mt-1">
                  Benchmark candidate fit and detect keyword gaps for any job description.
                </p>
                <button
                  onClick={() => navigate('/job-matcher')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] text-xs font-medium transition shadow-2xs"
                >
                  Match a Job Role
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Career Mentor & Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Mentor Banner */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#111111] border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-md">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#F3F3F3] text-[#111111] text-[10px] font-medium border border-[#E5E5E5]">
                <Bot className="w-3 h-3 text-[#111111]" />
                <span>Interview Preparation</span>
              </span>
              <h4 className="text-sm font-semibold text-[#111111]">Preparing for Technical Interviews?</h4>
              <p className="text-[11px] text-[#777777] leading-relaxed">
                Practice answering system design, OOPs, or project questions using the STAR technique with real-time feedback.
              </p>
            </div>
            <button
              onClick={() => navigate('/career-assistant')}
              className="shrink-0 px-3.5 py-2 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs transition flex items-center gap-1.5"
            >
              <span>Launch AI Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2 Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/analyzer')}
              className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] cursor-pointer shadow-2xs transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111] transition-colors" />
              </div>
              <h4 className="font-semibold text-xs text-[#111111]">
                11-Point ATS Check
              </h4>
              <p className="text-[11px] text-[#777777] mt-0.5">
                Audit strengths, weaknesses, and formatting issues.
              </p>
            </div>

            <div
              onClick={() => navigate('/history')}
              className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] cursor-pointer shadow-2xs transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#111111] transition-colors" />
              </div>
              <h4 className="font-semibold text-xs text-[#111111]">
                Audit History
              </h4>
              <p className="text-[11px] text-[#777777] mt-0.5">
                Compare previous iterations and track growth over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

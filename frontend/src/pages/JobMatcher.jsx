import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobAPI, resumeAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  BookOpen,
  Send,
  Building2,
  FileText,
  Zap,
} from 'lucide-react';

const SAMPLE_JOBS = [
  {
    role: 'Frontend Engineering Intern',
    company: 'Fintech Spark',
    level: 'Internship',
    jd: `We are seeking an enthusiastic Frontend Engineering Intern to assist in building modern web applications.
Responsibilities:
- Build responsive, accessible UI components using React.js and modern CSS / Tailwind CSS.
- Collaborate with backend engineers to integrate RESTful APIs.
- Write clean, maintainable JavaScript (ES6+) code.
- Optimize frontend web performance and cross-browser responsiveness.
Requirements:
- Strong knowledge of HTML5, CSS3, JavaScript, and React.
- Basic understanding of Git/GitHub version control.
- Good problem-solving ability and passion for learning.`,
  },
  {
    role: 'Full Stack Developer (Entry Level)',
    company: 'CloudScale AI',
    level: 'Entry Level',
    jd: `We are looking for a Junior Full Stack Developer to build full lifecycle software products.
Key Requirements:
- Hands-on proficiency with React.js, Node.js, and Express.js REST APIs.
- Experience with databases like MongoDB or PostgreSQL.
- Understanding of state management, JWT authentication, and API error handling.
- Basic familiarity with Docker, cloud deployment, and unit testing is a plus.`,
  },
];

export default function JobMatcher() {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [customResumeText, setCustomResumeText] = useState('');
  const [jobRole, setJobRole] = useState('Frontend Engineering Intern');
  const [companyName, setCompanyName] = useState('Fintech Spark');
  const [experienceLevel, setExperienceLevel] = useState('Internship');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOBS[0].jd);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState('');

  // Load existing resumes for selection dropdown
  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await resumeAPI.getResumes();
        if (res.success && res.resumes?.length > 0) {
          setResumes(res.resumes);
          if (location.state?.resumeId) {
            setSelectedResumeId(location.state.resumeId);
          } else {
            setSelectedResumeId(res.resumes[0]._id);
          }
        }
      } catch (err) {
        console.warn('Failed to load resumes for dropdown:', err.message);
      }
    }
    loadResumes();
  }, [location.state]);

  const loadSampleJob = (sample) => {
    setJobRole(sample.role);
    setCompanyName(sample.company);
    setExperienceLevel(sample.level);
    setJobDescription(sample.jd);
    setMatchResult(null);
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobRole || !jobDescription) {
      setError('Please provide both the Job Role and Job Description.');
      return;
    }

    setAnalyzing(true);
    setError('');
    try {
      const selectedResume = resumes.find((r) => String(r._id) === String(selectedResumeId));

      const payload = {
        resumeId: selectedResumeId || null,
        resumeText:
          selectedResume
            ? selectedResume.extractedText
            : customResumeText ||
              'Candidate with React, Node.js, Express, JavaScript, and MongoDB project experience.',
        jobRole,
        companyName,
        experienceLevel,
        jobDescription,
      };

      const res = await jobAPI.analyzeJobMatch(payload);
      if (res.success && res.analysis) {
        setMatchResult(res.analysis);
        if (res.analysis.matchPercentage >= 75) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Job match analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5]">
        <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
          <span>Job Matcher Engine</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
            Semantic Scoring
          </span>
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Paste any job description to benchmark candidate fit, detect keyword overlap, and receive role-specific tailoring suggestions.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#111111]" />
          <p>{error}</p>
        </div>
      )}

      {/* Input Form & Sample Selector */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs space-y-5">
        {/* Sample Templates Quick-Load */}
        <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-[#E5E5E5]">
          <span className="text-[11px] font-medium text-[#777777] flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-[#111111]" />
            Quick Test Roles:
          </span>
          {SAMPLE_JOBS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSampleJob(sample)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#F3F3F3] hover:bg-[#E5E5E5] text-[#111111] font-medium transition border border-[#E5E5E5]"
            >
              {sample.role}
            </button>
          ))}
        </div>

        <form onSubmit={handleMatch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Target Resume Picker */}
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Candidate Resume
              </label>
              {resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.filename} (Score: {r.resumeScore}/100)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[11px] text-[#777777] p-2 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5]">
                  Using default student candidate profile (React, Node.js, SQL).
                </div>
              )}
            </div>

            {/* Target Job Role */}
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Target Role
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Intern"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
              />
            </div>

            {/* Company & Experience */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Google, Startup..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1">
                  Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                >
                  <option value="Internship">Internship</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="1-3 Years">1-3 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1">
              Job Description (JD) Requirements
            </label>
            <textarea
              required
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste requirements, technologies, and role expectations here..."
              className="w-full p-3.5 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{analyzing ? 'Computing Semantic Match...' : 'Calculate Job Match Score'}</span>
          </button>
        </form>
      </div>

      {/* MATCH RESULTS DASHBOARD */}
      {matchResult && (
        <div className="space-y-5">
          {/* Main Percentage Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#F3F3F3] border-2 border-[#111111] text-[#111111] flex flex-col items-center justify-center font-bold shadow-2xs">
                <span className="text-2xl leading-none">{matchResult.matchPercentage}%</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">Match</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#777777]">
                  Target: {jobRole} ({companyName})
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] mt-0.5">
                  {matchResult.matchPercentage >= 75
                    ? 'Strong Match for this Position'
                    : matchResult.matchPercentage >= 55
                    ? 'Moderate Match — Address Skill Gaps'
                    : 'Significant Skill Alignment Needed'}
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">
                  Evaluation benchmarked for {experienceLevel} requirements.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Tier Scoring Rubric */}
          {matchResult.scoringRubric && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-center shadow-2xs">
                <span className="text-[11px] text-[#777777] block mb-0.5">Skills Match (40%)</span>
                <span className="text-lg font-bold text-[#111111]">
                  {matchResult.scoringRubric.skillsScore}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-center shadow-2xs">
                <span className="text-[11px] text-[#777777] block mb-0.5">Projects (30%)</span>
                <span className="text-lg font-bold text-[#111111]">
                  {matchResult.scoringRubric.experienceScore}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-center shadow-2xs">
                <span className="text-[11px] text-[#777777] block mb-0.5">Foundations (15%)</span>
                <span className="text-lg font-bold text-[#111111]">
                  {matchResult.scoringRubric.educationScore}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-center shadow-2xs">
                <span className="text-[11px] text-[#777777] block mb-0.5">Keywords (15%)</span>
                <span className="text-lg font-bold text-[#111111]">
                  {matchResult.scoringRubric.keywordScore}%
                </span>
              </div>
            </div>
          )}

          {/* Matching Skills vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                <span>Matching Candidate Skills</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchingSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-[#777777]" />
                <span>Missing Skills in Posting</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FFFFFF] text-[#777777] border border-[#E5E5E5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Skills to Learn & Relevant Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 text-[#111111] font-semibold text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-[#111111]" />
                <span>Skills You Should Learn</span>
              </div>
              <ul className="space-y-1.5">
                {matchResult.skillsToLearn?.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#777777] flex items-start gap-2">
                    <span className="text-[#111111] font-bold">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 text-[#111111] font-semibold text-xs sm:text-sm">
                <Layers className="w-4 h-4 text-[#111111]" />
                <span>Relevant Resume Keywords</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.relevantKeywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Tailoring Suggestions */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
            <h4 className="font-semibold text-xs sm:text-sm text-[#111111] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#111111]" />
              <span>Resume Tailoring Suggestions for this Application</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {matchResult.tailoringSuggestions?.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-xs text-[#111111] leading-relaxed"
                >
                  <span className="font-semibold text-[#111111] block mb-1">
                    Tip #{idx + 1}
                  </span>
                  {sug}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

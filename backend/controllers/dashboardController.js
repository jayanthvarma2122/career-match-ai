import Resume from '../models/Resume.js';
import JobAnalysis from '../models/JobAnalysis.js';
import { isDbConnected } from '../config/db.js';
import { localResumes } from './resumeController.js';

// In-memory fallback if offline
const localJobAnalyses = [];

/**
 * GET /api/dashboard/stats
 * Aggregates authentic, user-isolated analytical metrics for the logged-in user.
 * Strictly reflects the authenticated user's uploaded resumes and executed job matches.
 */
export async function getDashboardStats(req, res) {
  try {
    const userId = req.user._id || req.user.id;

    let resumes = [];
    let jobAnalyses = [];

    if (isDbConnected) {
      // Find only this authenticated user's records in MongoDB
      resumes = await Resume.find({ userId }).sort({ createdAt: 1 });
      jobAnalyses = await JobAnalysis.find({ userId }).sort({ createdAt: -1 });
    } else {
      resumes = Array.isArray(localResumes)
        ? localResumes.filter((r) => String(r.userId) === String(userId))
        : [];
      jobAnalyses = localJobAnalyses.filter((j) => String(j.userId) === String(userId));
    }

    const totalResumes = resumes.length;
    const totalJobs = jobAnalyses.length;

    // Calculate actual average resume score (0 if no resumes)
    const avgResumeScore =
      totalResumes > 0
        ? Math.round(resumes.reduce((acc, r) => acc + (r.resumeScore || 0), 0) / totalResumes)
        : 0;

    // Calculate actual average job match percentage (0 if no job matches)
    const avgJobMatch =
      totalJobs > 0
        ? Math.round(jobAnalyses.reduce((acc, j) => acc + (j.matchPercentage || 0), 0) / totalJobs)
        : 0;

    // Aggregate unique skills from user's actual resumes + registered profile skills
    const skillCountMap = {};
    const userProfileSkills = Array.isArray(req.user.skills) ? req.user.skills : [];

    userProfileSkills.forEach((s) => {
      if (s && typeof s === 'string' && s.trim()) {
        const cleanSkill = s.trim();
        skillCountMap[cleanSkill] = (skillCountMap[cleanSkill] || 0) + 1;
      }
    });

    resumes.forEach((r) => {
      const tech = r.skills?.technical || [];
      const soft = r.skills?.soft || [];
      [...tech, ...soft].forEach((s) => {
        if (s && typeof s === 'string' && s.trim()) {
          const cleanSkill = s.trim();
          skillCountMap[cleanSkill] = (skillCountMap[cleanSkill] || 0) + 1;
        }
      });
    });

    const uniqueSkills = Object.keys(skillCountMap);
    const skillsCount = uniqueSkills.length;

    // Actual skills distribution (empty array if user has no skills yet)
    const skillsDistribution = Object.entries(skillCountMap)
      .map(([name, count]) => ({
        name,
        value: count * 10,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    // Score history timeline: actual chronological progression of user's resumes
    const scoreHistory = resumes.map((r, i) => ({
      name: `V${i + 1} (${r.filename ? r.filename.substring(0, 10) : 'Resume'})`,
      score: r.resumeScore || 0,
      atsScore: r.atsCompatibility?.score || r.resumeScore || 0,
    }));

    // Job match comparisons: actual user analyses
    const jobMatchHistory = jobAnalyses.slice(0, 5).map((j) => ({
      role: j.jobRole.length > 18 ? j.jobRole.substring(0, 18) + '...' : j.jobRole,
      match: j.matchPercentage,
      company: j.companyName || 'Target Company',
    }));

    // Recent activities list from actual user data
    const recentActivities = [
      ...resumes.map((r) => ({
        type: 'resume',
        title: `Resume Evaluated: ${r.filename}`,
        score: r.resumeScore,
        date: r.createdAt,
      })),
      ...jobAnalyses.map((j) => ({
        type: 'job',
        title: `Job Matched: ${j.jobRole} (${j.companyName || 'Target Co'})`,
        score: j.matchPercentage,
        date: j.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    return res.json({
      success: true,
      stats: {
        totalResumes,
        avgResumeScore,
        totalJobs,
        avgJobMatch,
        skillsCount,
        scoreHistory,
        skillsDistribution,
        jobMatchHistory,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics.',
      error: error.message,
    });
  }
}

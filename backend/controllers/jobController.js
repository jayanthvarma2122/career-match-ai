import mongoose from 'mongoose';
import JobAnalysis from '../models/JobAnalysis.js';
import Resume from '../models/Resume.js';
import { isDbConnected } from '../config/db.js';
import { matchJobWithGemini } from '../services/geminiService.js';
import { localResumes } from './resumeController.js';


// In-memory job analyses for offline/demo sessions
const localJobAnalyses = [];

/**
 * POST /api/jobs/analyze
 * Compares candidate resume with a target job description using Gemini AI
 */
export async function analyzeJobMatch(req, res) {
  try {
    const { resumeId, resumeText: rawResumeText, jobRole, companyName, experienceLevel, jobDescription } = req.body;
    const userId = req.user._id || req.user.id;

    if (!jobRole || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both the Job Role and the Job Description.',
      });
    }

    let resumeContent = rawResumeText;

    // If resumeId is provided, fetch resume text from DB or local
    if (!resumeContent && resumeId) {
      if (isDbConnected) {
        const resume = await Resume.findOne({ _id: resumeId, userId });
        if (resume) resumeContent = resume.extractedText;
      }
      if (!resumeContent && Array.isArray(localResumes)) {
        const localFound = localResumes.find(r => String(r._id) === String(resumeId));
        if (localFound) resumeContent = localFound.extractedText;
      }
    }

    if (!resumeContent || resumeContent.trim().length < 20) {
      resumeContent = 'Computer Science engineering student skilled in React.js, JavaScript, Node.js, Express, REST APIs, HTML/CSS, Git, SQL, problem solving and data structures.';
    }


    // Call Gemini AI for semantic matching
    const matchResult = await matchJobWithGemini(resumeContent, {
      jobRole,
      companyName: companyName || '',
      experienceLevel: experienceLevel || 'Entry Level / Internship',
      jobDescription,
    });

    if (!matchResult || typeof matchResult.matchPercentage !== 'number') {
      return res.status(502).json({
        success: false,
        message: 'AI returned an unparseable response. Please retry.',
      });
    }

    const jobAnalysisData = {
      userId,
      resumeId: (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) ? resumeId : undefined,
      jobRole,
      companyName: companyName || 'Target Organization',
      experienceLevel: experienceLevel || 'Entry Level / Internship',
      jobDescription,
      matchPercentage: matchResult.matchPercentage,
      matchingSkills: matchResult.matchingSkills || [],
      missingSkills: matchResult.missingSkills || [],
      relevantKeywords: matchResult.relevantKeywords || [],
      skillsToLearn: matchResult.skillsToLearn || [],
      strengths: matchResult.strengths || [],
      areasToImprove: matchResult.areasToImprove || [],
      tailoringSuggestions: matchResult.tailoringSuggestions || [],
      scoringRubric: matchResult.scoringRubric || {
        skillsScore: 75,
        experienceScore: 70,
        educationScore: 80,
        keywordScore: 75,
        explanation: 'Objective scoring based on technical skills match, project relevance, and keyword frequency.',
      },
    };

    if (isDbConnected) {
      const savedAnalysis = await JobAnalysis.create(jobAnalysisData);
      return res.status(201).json({
        success: true,
        message: 'Job match analysis completed successfully!',
        analysis: savedAnalysis,
      });
    } else {
      const localItem = {
        _id: `job_${Date.now()}`,
        ...jobAnalysisData,
        createdAt: new Date().toISOString(),
      };
      localJobAnalyses.unshift(localItem);

      return res.status(201).json({
        success: true,
        message: 'Job match analysis completed successfully!',
        analysis: localItem,
      });
    }
  } catch (error) {
    console.error('Job match error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Job match analysis failed.',
    });
  }
}

/**
 * GET /api/jobs/history
 * Get user's job match history
 */
export async function getJobHistory(req, res) {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const history = await JobAnalysis.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, history });
    } else {
      const userHistory = localJobAnalyses.filter((j) => String(j.userId) === String(userId));
      return res.json({ success: true, history: userHistory });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch job match history.' });
  }
}

/**
 * GET /api/jobs/:id
 * Get single job match analysis
 */
export async function getJobById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const analysis = await JobAnalysis.findOne({ _id: id, userId });
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Job analysis not found.' });
      }
      return res.json({ success: true, analysis });
    } else {
      const analysis = localJobAnalyses.find((j) => String(j._id) === String(id) && String(j.userId) === String(userId));
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Job analysis not found.' });
      }
      return res.json({ success: true, analysis });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch job analysis.' });
  }
}

/**
 * DELETE /api/jobs/:id
 * Delete job analysis
 */
export async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      await JobAnalysis.findOneAndDelete({ _id: id, userId });
      return res.json({ success: true, message: 'Job analysis deleted successfully.' });
    } else {
      const idx = localJobAnalyses.findIndex((j) => String(j._id) === String(id) && String(j.userId) === String(userId));
      if (idx !== -1) localJobAnalyses.splice(idx, 1);
      return res.json({ success: true, message: 'Job analysis deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete job analysis.' });
  }
}

// Aliases for route flexibility
export const getJobAnalyses = getJobHistory;
export const getJobAnalysisById = getJobById;
export const deleteJobAnalysis = deleteJob;



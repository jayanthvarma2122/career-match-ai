import Resume from '../models/Resume.js';
import { isDbConnected } from '../config/db.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResumeWithGemini, generateHeuristicResumeAnalysis } from '../services/geminiService.js';

// In-memory resume store for offline/demo sessions
export const localResumes = [];


/**
 * POST /api/resumes/upload
 * Validates PDF, extracts raw text using pdf-parse, and previews file info
 */
export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please upload a PDF file.',
      });
    }

    const { originalname, size, buffer } = req.file;

    // Extract text from PDF buffer
    const extractedText = await extractTextFromPDF(buffer);

    return res.json({
      success: true,
      message: 'Resume PDF uploaded and parsed successfully!',
      filename: originalname,
      fileSize: size,
      extractedText,
      wordCount: extractedText.split(/\s+/).length,
    });
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process resume PDF.',
    });
  }
}

/**
 * POST /api/resumes/analyze
 * Analyzes extracted resume text with Gemini AI (with heuristic fallback) and stores in DB
 */
export async function analyzeResume(req, res) {
  try {
    const { filename, extractedText } = req.body;
    const userId = req.user._id || req.user.id;

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is missing or too short to analyze.',
      });
    }

    let analysis = null;

    try {
      analysis = await analyzeResumeWithGemini(extractedText);
    } catch (aiErr) {
      console.warn('AI analysis threw error, generating heuristic analysis:', aiErr.message);
      analysis = generateHeuristicResumeAnalysis(extractedText);
    }

    // Safety check
    if (!analysis || typeof analysis.resumeScore !== 'number') {
      analysis = generateHeuristicResumeAnalysis(extractedText);
    }

    const resumeData = {
      userId,
      filename: filename || 'resume.pdf',
      fileSize: req.body.fileSize || 102400,
      extractedText,
      resumeScore: analysis.resumeScore,
      skills: analysis.skills || { technical: [], soft: [], tools: [], missing: [] },
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      educationAnalysis: analysis.educationAnalysis || '',
      experienceAnalysis: analysis.experienceAnalysis || '',
      projectAnalysis: analysis.projectAnalysis || '',
      atsCompatibility: analysis.atsCompatibility || { score: 75, suggestions: [] },
      suggestions: analysis.suggestions || [],
    };

    if (isDbConnected) {
      const savedResume = await Resume.create(resumeData);
      return res.status(201).json({
        success: true,
        message: 'Resume analyzed and saved successfully!',
        resume: savedResume,
      });
    } else {
      // Local fallback for offline/demo sessions
      const localResume = {
        _id: `res_${Date.now()}`,
        ...resumeData,
        createdAt: new Date().toISOString(),
      };
      localResumes.unshift(localResume);

      return res.status(201).json({
        success: true,
        message: 'Resume analyzed successfully!',
        resume: localResume,
      });
    }
  } catch (error) {
    console.error('Analyze resume error:', error.message);
    // Fallback gracefully to heuristic analysis
    const fallback = generateHeuristicResumeAnalysis(req.body.extractedText || '');
    const fallbackData = {
      userId: req.user._id || req.user.id,
      filename: req.body.filename || 'resume.pdf',
      fileSize: req.body.fileSize || 102400,
      extractedText: req.body.extractedText || '',
      ...fallback,
    };

    if (isDbConnected) {
      try {
        const saved = await Resume.create(fallbackData);
        return res.status(201).json({
          success: true,
          message: 'Resume analyzed and saved to MongoDB!',
          resume: saved,
        });
      } catch (dbErr) {
        console.warn('MongoDB fallback save failed, using local store:', dbErr.message);
      }
    }

    const localResume = {
      _id: `res_${Date.now()}`,
      ...fallbackData,
      createdAt: new Date().toISOString(),
    };
    localResumes.unshift(localResume);

    return res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully!',
      resume: localResume,
    });
  }
}

/**
 * GET /api/resumes
 * Get all analyzed resumes for current user
 */
export async function getResumes(req, res) {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, resumes });
    } else {
      const userResumes = localResumes.filter((r) => String(r.userId) === String(userId));
      return res.json({ success: true, resumes: userResumes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resumes.' });
  }
}

/**
 * GET /api/resumes/:id
 * Get single resume details
 */
export async function getResumeById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      const resume = await Resume.findOne({ _id: id, userId });
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found.' });
      }
      return res.json({ success: true, resume });
    } else {
      const resume = localResumes.find((r) => String(r._id) === String(id) && String(r.userId) === String(userId));
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found.' });
      }
      return res.json({ success: true, resume });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume details.' });
  }
}

/**
 * DELETE /api/resumes/:id
 * Delete a resume analysis
 */
export async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDbConnected) {
      await Resume.findOneAndDelete({ _id: id, userId });
      return res.json({ success: true, message: 'Resume deleted successfully.' });
    } else {
      const idx = localResumes.findIndex((r) => String(r._id) === String(id) && String(r.userId) === String(userId));
      if (idx !== -1) localResumes.splice(idx, 1);
      return res.json({ success: true, message: 'Resume deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
}

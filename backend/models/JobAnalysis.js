import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      index: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    experienceLevel: {
      type: String,
      default: 'Entry Level / Internship',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    relevantKeywords: {
      type: [String],
      default: [],
    },
    skillsToLearn: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    areasToImprove: {
      type: [String],
      default: [],
    },
    tailoringSuggestions: {
      type: [String],
      default: [],
    },
    scoringRubric: {
      skillsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      keywordScore: { type: Number, default: 0 },
      explanation: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const JobAnalysis = mongoose.model('JobAnalysis', jobAnalysisSchema);
export default JobAnalysis;


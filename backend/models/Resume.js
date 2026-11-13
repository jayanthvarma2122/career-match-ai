import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedText: {
      type: String,
      default: '',
    },
    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    skills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      missing: { type: [String], default: [] },
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    educationAnalysis: {
      type: String,
      default: '',
    },
    experienceAnalysis: {
      type: String,
      default: '',
    },
    projectAnalysis: {
      type: String,
      default: '',
    },
    atsCompatibility: {
      score: { type: Number, default: 70 },
      suggestions: { type: [String], default: [] },
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;


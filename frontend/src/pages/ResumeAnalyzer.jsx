import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  Code2,
  Lightbulb,
  Check,
  Zap,
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Handle PDF file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setError('Only PDF documents are supported. Please select a valid .pdf file.');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        return;
      }
      setFile(selected);
      setError('');
      setExtractedData(null);
      setAnalysisResult(null);
    }
  };

  // Upload and parse PDF text
  const handleUploadAndParse = async () => {
    if (!file) return;
    setError('');

    // If text was already extracted, jump directly to AI analysis
    if (extractedData?.extractedText) {
      await runAiAnalysis(extractedData.filename, extractedData.extractedText, extractedData.fileSize);
      return;
    }

    setUploading(true);
    try {
      const res = await resumeAPI.uploadResume(file);
      if (res.success) {
        setExtractedData(res);
        // Automatically trigger AI analysis
        await runAiAnalysis(res.filename, res.extractedText, res.fileSize);
      }
    } catch (err) {
      setError(err.message || 'Failed to parse resume PDF.');
    } finally {
      setUploading(false);
    }
  };

  // Trigger Gemini AI analysis
  const runAiAnalysis = async (filename, extractedText, fileSize) => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await resumeAPI.analyzeResume({
        filename,
        extractedText,
        fileSize,
      });

      if (res.success && res.resume) {
        setAnalysisResult(res.resume);
        if (res.resume.resumeScore >= 80) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      setError(err.message || 'AI analysis failed. Please verify API key configuration.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
            <span>Resume Analyzer</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
              11-Point ATS Check
            </span>
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Upload your PDF resume to receive quantified ATS scoring, strengths, gaps, and actionable feedback.
          </p>
        </div>

        {analysisResult && (
          <button
            onClick={() =>
              navigate('/job-matcher', {
                state: { resumeId: analysisResult._id, resumeText: analysisResult.extractedText },
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs transition"
          >
            <span>Match with Job Description</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#111111]" />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="mt-0.5 text-[#777777]">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs text-center">
        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="max-w-md mx-auto p-6 sm:p-7 rounded-xl border-2 border-dashed border-[#E5E5E5] hover:border-[#111111] transition-colors bg-[#F3F3F3] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] flex items-center justify-center mb-3 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="font-semibold text-xs sm:text-sm text-[#111111]">
              {file ? file.name : 'Click to select or drag and drop your Resume PDF'}
            </p>
            <p className="text-[11px] text-[#777777] mt-1">
              Supports standard ATS single/double page PDF resumes up to 5MB
            </p>

            {file && (
              <div className="mt-3 px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] text-[11px] font-medium flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#111111]" />
                <span>Selected: {(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
        </label>

        {file && !analysisResult && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleUploadAndParse}
              disabled={uploading || analyzing}
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs flex items-center gap-2 transition disabled:opacity-50"
            >
              {(uploading || analyzing) && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {uploading
                  ? 'Extracting PDF Text...'
                  : analyzing
                  ? 'Evaluating Resume...'
                  : 'Start Resume Audit'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Extracted Text Snippet Preview */}
      {extractedData && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#111111]" />
              <span className="font-semibold text-xs text-[#111111]">
                PDF Extracted Content Preview ({extractedData.wordCount} words)
              </span>
            </div>
            <span className="text-[10px] text-[#777777]">Parsed in-memory</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F3F3F3] text-[11px] font-mono text-[#111111] max-h-32 overflow-y-auto whitespace-pre-wrap border border-[#E5E5E5] leading-relaxed">
            {extractedData.extractedText.slice(0, 800)}...
          </div>
        </div>
      )}

      {/* ANALYSIS RESULTS DASHBOARD (11-POINT REPORT) */}
      {analysisResult && (
        <div className="space-y-5">
          {/* Top Score Banner */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Circular Monochrome Score Badge */}
              <div className="w-20 h-20 rounded-2xl border-2 border-[#111111] bg-[#F3F3F3] text-[#111111] flex flex-col items-center justify-center font-bold shadow-2xs">
                <span className="text-2xl leading-none">{analysisResult.resumeScore}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">/ 100</span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#777777]">
                  Audit Verdict
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#111111] mt-0.5">
                  {analysisResult.resumeScore >= 80
                    ? 'High Recruiter Appeal'
                    : analysisResult.resumeScore >= 65
                    ? 'Good Foundation, Minor Gaps'
                    : 'Requires Structural Optimization'}
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">
                  ATS Readability Index: {analysisResult.atsCompatibility?.score || 82}% | File: {analysisResult.filename}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setAnalysisResult(null);
                setExtractedData(null);
              }}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E5] text-[#111111] bg-[#F3F3F3] hover:bg-[#E5E5E5] transition"
            >
              Audit Another Resume
            </button>
          </div>

          {/* Section 1 & 2: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                <span>Resume Strengths</span>
              </div>
              <ul className="space-y-2">
                {analysisResult.strengths?.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#111111] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-3 text-[#111111] font-semibold text-xs sm:text-sm">
                <XCircle className="w-4 h-4 text-[#777777]" />
                <span>Identified Weaknesses</span>
              </div>
              <ul className="space-y-2">
                {analysisResult.weaknesses?.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#777777] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#777777] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3, 4, 5: Skills Inventory */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs space-y-4">
            <h4 className="font-semibold text-xs sm:text-sm text-[#111111] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#111111]" />
              <span>Skills Categorization & Gaps</span>
            </h4>

            {/* Technical Skills */}
            <div>
              <span className="text-[11px] font-medium text-[#777777] block mb-1.5">
                Technical Skills Detected
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.skills?.technical?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div>
              <span className="text-[11px] font-medium text-[#777777] block mb-1.5">
                Soft Skills Detected
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.skills?.soft?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Recommended */}
            <div>
              <span className="text-[11px] font-medium text-[#777777] block mb-1.5">
                Missing High-Demand Skills for Target Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.skills?.missing?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FFFFFF] text-[#111111] border border-[#111111] flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-[#111111]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6, 7, 8: Education, Experience & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2 text-[#111111] font-semibold text-[11px] uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education Analysis</span>
              </div>
              <p className="text-xs text-[#777777] leading-relaxed">
                {analysisResult.educationAnalysis || 'Degree coursework matches standard CS curriculum fundamentals.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2 text-[#111111] font-semibold text-[11px] uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience Analysis</span>
              </div>
              <p className="text-xs text-[#777777] leading-relaxed">
                {analysisResult.experienceAnalysis || 'Practical project work demonstrates active problem solving.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-1.5 mb-2 text-[#111111] font-semibold text-[11px] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Project Depth</span>
              </div>
              <p className="text-xs text-[#777777] leading-relaxed">
                {analysisResult.projectAnalysis || 'Projects highlight full-stack execution with modern tools.'}
              </p>
            </div>
          </div>

          {/* Section 9 & 10: ATS Suggestions & Actionable Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 text-[#111111] font-semibold text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-[#111111]" />
                <span>ATS Formatting Best Practices</span>
              </div>
              <ul className="space-y-2">
                {analysisResult.atsCompatibility?.suggestions?.map((sug, i) => (
                  <li key={i} className="text-xs text-[#777777] flex items-start gap-2">
                    <span className="text-[#111111] font-bold">›</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs">
              <div className="flex items-center gap-2 mb-2.5 text-[#111111] font-semibold text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-[#111111]" />
                <span>Strategic Improvement Suggestions</span>
              </div>
              <ul className="space-y-2">
                {analysisResult.suggestions?.map((sug, i) => (
                  <li key={i} className="text-xs text-[#777777] flex items-start gap-2">
                    <span className="text-[#111111] font-bold">›</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

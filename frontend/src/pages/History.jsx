import React, { useState, useEffect } from 'react';
import { resumeAPI, jobAPI } from '../services/api';
import {
  History as HistoryIcon,
  Search,
  FileText,
  Briefcase,
  Trash2,
  Calendar,
  X,
  Filter,
} from 'lucide-react';

export default function History() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'resumes', 'jobs'
  const [selectedItem, setSelectedItem] = useState(null); // for detail modal

  const loadData = async () => {
    setLoading(true);
    try {
      const [resumesRes, jobsRes] = await Promise.all([
        resumeAPI.getResumes().catch(() => ({ success: true, resumes: [] })),
        jobAPI.getJobAnalyses().catch(() => ({ success: true, history: [] })),
      ]);

      if (resumesRes.success) setResumes(resumesRes.resumes || []);
      if (jobsRes.success) setJobs(jobsRes.history || []);
    } catch (err) {
      console.warn('Failed to load history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this resume analysis record?')) {
      try {
        await resumeAPI.deleteResume(id);
        setResumes((prev) => prev.filter((r) => r._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  const handleDeleteJob = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this job match analysis?')) {
      try {
        await jobAPI.deleteJobAnalysis(id);
        setJobs((prev) => prev.filter((j) => j._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  // Combine items into unified timeline
  const combinedHistory = [
    ...resumes.map((r) => ({
      _id: r._id,
      type: 'resume',
      title: r.filename,
      subtitle: `Score: ${r.resumeScore}/100 | ATS: ${r.atsCompatibility?.score || 80}%`,
      score: r.resumeScore,
      date: r.createdAt,
      raw: r,
    })),
    ...jobs.map((j) => ({
      _id: j._id,
      type: 'job',
      title: `${j.jobRole} (${j.companyName || 'Target Company'})`,
      subtitle: `Match: ${j.matchPercentage}% | ${j.experienceLevel}`,
      score: j.matchPercentage,
      date: j.createdAt,
      raw: j,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Search and filter
  const filteredHistory = combinedHistory.filter((item) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'resumes' && item.type === 'resume') ||
      (filterType === 'jobs' && item.type === 'job');

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5]">
        <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
          <span>Analysis History</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
            {combinedHistory.length} Records
          </span>
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Review, search, inspect, or remove past resume evaluations and job matches.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by filename or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] text-[#777777] flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              filterType === 'all'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-2xs'
                : 'bg-[#F3F3F3] text-[#777777] hover:text-[#111111]'
            }`}
          >
            All ({combinedHistory.length})
          </button>
          <button
            onClick={() => setFilterType('resumes')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              filterType === 'resumes'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-2xs'
                : 'bg-[#F3F3F3] text-[#777777] hover:text-[#111111]'
            }`}
          >
            Resumes ({resumes.length})
          </button>
          <button
            onClick={() => setFilterType('jobs')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              filterType === 'jobs'
                ? 'bg-[#111111] text-[#FFFFFF] shadow-2xs'
                : 'bg-[#F3F3F3] text-[#777777] hover:text-[#111111]'
            }`}
          >
            Job Matches ({jobs.length})
          </button>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-10 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] text-center shadow-2xs">
          <HistoryIcon className="w-10 h-10 text-[#777777] mx-auto mb-2.5" />
          <h3 className="font-semibold text-xs sm:text-sm text-[#111111]">
            No Records Found
          </h3>
          <p className="text-[11px] text-[#777777] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No evaluations match your search query. Try adjusting keywords.'
              : 'You have not run any analyses yet. Upload a resume or match a job description!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredHistory.map((item) => {
            const isResume = item.type === 'resume';
            return (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] text-[#111111] flex items-center justify-center shrink-0">
                    {isResume ? <FileText className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-xs sm:text-sm text-[#111111] truncate">
                        {item.title}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-[#F3F3F3] text-[#111111] border border-[#E5E5E5]">
                        {isResume ? 'ATS Audit' : 'Job Match'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777777] mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-xs text-[#111111] block">
                      {item.score}%
                    </span>
                    <span className="text-[10px] text-[#777777] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) =>
                      isResume ? handleDeleteResume(item._id, e) : handleDeleteJob(item._id, e)
                    }
                    className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] rounded-lg transition"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[85vh] bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] shadow-xl flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FFFFFF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F3F3F3] text-[#111111] flex items-center justify-center border border-[#E5E5E5]">
                  {selectedItem.type === 'resume' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-[#111111]">
                    {selectedItem.title}
                  </h3>
                  <span className="text-[10px] text-[#777777]">
                    Recorded on {new Date(selectedItem.date).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-[#777777] hover:text-[#111111] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 text-xs bg-[#FFFFFF]">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5]">
                <span className="font-medium text-[#111111]">
                  Calculated Score:
                </span>
                <span className="font-bold text-xl text-[#111111]">
                  {selectedItem.score}/100
                </span>
              </div>

              {selectedItem.type === 'resume' ? (
                <>
                  <div>
                    <h4 className="font-semibold text-[#111111] mb-1.5">
                      Strengths:
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[#777777]">
                      {selectedItem.raw.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111111] mb-1.5">
                      Key Weaknesses:
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[#777777]">
                      {selectedItem.raw.weaknesses?.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold text-[#111111] mb-1.5">
                      Matching Skills:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.raw.matchingSkills?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F3F3F3] text-[#111111] text-[11px] border border-[#E5E5E5]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#111111] mb-1.5">
                      Missing Skills:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.raw.missingSkills?.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#777777] text-[11px] border border-[#E5E5E5]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

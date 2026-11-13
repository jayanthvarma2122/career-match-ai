import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  GraduationCap,
  Layers,
  Target,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    education: '',
    skills: '',
    careerInterests: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '',
        education: user.education || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        careerInterests: Array.isArray(user.careerInterests)
          ? user.careerInterests.join(', ')
          : '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const interestsArray = formData.careerInterests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await updateUserProfile({
        name: formData.name,
        college: formData.college,
        education: formData.education,
        skills: skillsArray,
        careerInterests: interestsArray,
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#E5E5E5]">
        <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
          Profile Settings
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Keep your academic and technical background up to date for personalized AI recommendations.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#111111]" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#111111]" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] shadow-2xs p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar and Basic info */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-[#E5E5E5]">
            <div className="w-12 h-12 rounded-xl bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-lg shadow-2xs">
              {formData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#111111]">
                {formData.name || 'Candidate'}
              </h3>
              <p className="text-xs text-[#777777]">{formData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Email Address (Read-Only)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#777777] text-xs cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  name="college"
                  placeholder="e.g. National Institute of Technology"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Degree & Year of Study
              </label>
              <input
                type="text"
                name="education"
                placeholder="e.g. B.Tech in CSE (2nd Year)"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1">
              Core Technical Skills (comma separated)
            </label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
              <input
                type="text"
                name="skills"
                placeholder="React, JavaScript, Node.js, Python, C++, SQL"
                value={formData.skills}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#111111] mb-1">
              Target Career Interests / Roles (comma separated)
            </label>
            <div className="relative">
              <Target className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
              <input
                type="text"
                name="careerInterests"
                placeholder="Frontend Engineer Intern, Full Stack Developer, Software Engineer"
                value={formData.careerInterests}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, GraduationCap, AlertCircle, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    education: 'B.Tech in Computer Science and Engineering (2nd Year)',
    skills: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Reset fields on load
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      college: '',
      education: 'B.Tech in Computer Science and Engineering (2nd Year)',
      skills: '',
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await signup({
        ...formData,
        skills: skillsArray,
        careerInterests: ['Software Development Engineer', 'Frontend Developer'],
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to activate demo session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F1F1F1] text-[#111111]">
      <div className="w-full max-w-lg py-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-xs shadow-2xs">
              <span>C</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-[#111111]">CareerMatch AI</span>
          </div>
          <h2 className="text-lg font-bold text-[#111111]">Create an Account</h2>
          <p className="text-xs text-[#777777] mt-0.5">Start benchmarking your resume against tech industry roles</p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-2xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#111111]" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access */}
          <div className="mb-5 p-3 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#111111]" />
              <span className="text-xs font-medium text-[#111111]">Evaluating this project?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-xs bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium px-3 py-1 rounded-md transition shadow-2xs"
            >
              Demo Access
            </button>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  spellCheck="false"
                  required
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#777777] hover:text-[#111111] transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">College / Institution Name</label>
              <div className="relative">
                <GraduationCap className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="text"
                  name="college"
                  autoComplete="off"
                  placeholder="e.g. National Institute of Technology"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Technical Skills <span className="text-[#777777] font-normal">(Comma-separated)</span>
              </label>
              <input
                type="text"
                name="skills"
                autoComplete="off"
                placeholder="e.g. React, Node.js, Python, SQL, Git"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 mt-2"
            >
              <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#777777]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#111111] underline hover:opacity-80">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, User, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savedAccount, setSavedAccount] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  // Check for saved user account in browser storage on load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('saved_account') || localStorage.getItem('last_account');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.email && !parsed.email.includes('demo.student')) {
          setSavedAccount(parsed);
        }
      }
    } catch (e) {
      // Ignore parse error
    }
  }, []);

  const handleUseSavedAccount = (account) => {
    setEmail(account.email);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handleDismissSavedAccount = (e) => {
    e.stopPropagation();
    setSavedAccount(null);
    localStorage.removeItem('saved_account');
    localStorage.removeItem('last_account');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-xs shadow-2xs">
              <span>C</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-[#111111]">
              CareerMatch AI
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#111111]">Sign In</h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Access your resume evaluations and job matches
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] p-6 shadow-2xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FFFFFF] border border-[#111111] text-[#111111] text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#111111]" />
              <span>{error}</span>
            </div>
          )}

          {/* Smart Saved Account Suggestion (When Browser / Device has a recognized user) */}
          {savedAccount && (
            <div className="mb-4 p-3 rounded-xl bg-[#FAFAFA] border border-[#111111] shadow-2xs flex items-center justify-between transition">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#111111] text-[#FFFFFF] font-bold text-xs flex items-center justify-center">
                  {savedAccount.name ? savedAccount.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#111111] truncate">
                      {savedAccount.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFFFFF] border border-[#E5E5E5] text-[#777777] font-medium shrink-0">
                      Saved Account
                    </span>
                  </div>
                  <span className="text-[11px] text-[#777777] block truncate">
                    {savedAccount.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => handleUseSavedAccount(savedAccount)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] text-xs font-medium flex items-center gap-1 transition shadow-2xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleDismissSavedAccount}
                  title="Dismiss saved account suggestion"
                  className="p-1 rounded-md text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 1-Click Demo Login Banner */}
          <div className="mb-5 p-3.5 rounded-lg bg-[#F3F3F3] border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#111111]">
                Quick Demo Access
              </span>
              <span className="text-[10px] bg-[#FFFFFF] text-[#111111] border border-[#E5E5E5] font-medium px-1.5 py-0.5 rounded">
                Instant
              </span>
            </div>
            <p className="text-[11px] text-[#777777] mb-2.5">
              One click loads a pre-configured student profile with sample evaluations.
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={submitting}
              className="w-full py-2 px-3 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1-Click Instant Demo Login</span>
            </button>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E5E5]" />
            </div>
            <span className="relative px-2 bg-[#FFFFFF] text-[11px] text-[#777777] uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  spellCheck="false"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#E5E5E5] bg-[#F3F3F3] text-[#111111] text-xs focus:outline-none focus:border-[#111111] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-3" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] font-medium text-xs shadow-2xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 mt-1"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#777777]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#111111] underline hover:opacity-80">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

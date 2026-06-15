import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../../services/authApi';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCw
} from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  // If already authenticated as admin, redirect to panel
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'Admin' || user.role === 'Super Admin';
      if (isAdmin) {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setAccessDenied(true);
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAccessDenied(false);
    if (!email || !password) {
      toast.error('Please enter your credentials.');
      return;
    }
    try {
      const response = await login({ email, password }).unwrap();
      const loggedUser = response.data.user;
      const isAdmin = loggedUser.role === 'Admin' || loggedUser.role === 'Super Admin';

      if (!isAdmin) {
        setAttempts(prev => prev + 1);
        setAccessDenied(true);
        toast.error('Access denied. Admin privileges required.', { duration: 5000 });
        return;
      }

      setLoginSuccess(true);
      toast.success('Welcome, Administrator.');
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }, 1800);

    } catch (err) {
      setAttempts(prev => prev + 1);
      toast.error(err.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden">

      {/* ===== LEFT PANEL: Branding ===== */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-14 border-r border-white/5">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,124,0.06),transparent_60%)]" />

        {/* Content */}
        <div className="relative z-10">
          {/* Back to store */}
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-12 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to store
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#C9A87C]/10 border border-[#C9A87C]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#C9A87C]" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Admin Panel</p>
              <h1 className="text-base font-bold text-white tracking-wider uppercase">BHONDU Console</h1>
            </div>
          </div>

          {/* Info blocks */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-luxury-serif text-white leading-snug">
              Secure<br /><span className="text-[#C9A87C]">Management</span><br />Console
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Access the BHONDU admin dashboard to manage products, orders, customers, inventory, and more.
            </p>
          </div>
        </div>

        {/* Bottom restriction notice */}
        <div className="relative z-10">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-900/30 bg-amber-500/5">
            <AlertTriangle className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-amber-500/70 uppercase tracking-wider">Restricted Access</p>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                This console is for authorized administrators only. All access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Form ===== */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile header */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-6 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to store
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#C9A87C]/10 border border-[#C9A87C]/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#C9A87C]" />
              </div>
              <span className="font-bold text-white uppercase tracking-wider">BHONDU Admin</span>
            </div>
          </div>

          {/* Access denied banner */}
          <AnimatePresence>
            {accessDenied && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900/40 bg-red-500/5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-400">Access Denied</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                      Your account does not have admin privileges. Contact a Super Admin for access.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state */}
          <AnimatePresence>
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                >
                  <CheckCircle className="w-14 h-14 text-[#C9A87C]" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg">Welcome back, Admin</h3>
                  <p className="text-xs text-zinc-600 mt-1">Loading your dashboard...</p>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#C9A87C]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!loginSuccess && (
            <>
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h2>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Enter your administrator credentials below.
                  {attempts > 0 && (
                    <span className="ml-2 text-amber-500/80 font-semibold">
                      {attempts} failed attempt{attempts > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Admin Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@bhondu.com"
                    autoComplete="username"
                    className="w-full text-sm py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-[#C9A87C]/40 focus:ring-1 focus:ring-[#C9A87C]/20 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full text-sm py-3 px-4 pr-11 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-[#C9A87C]/40 focus:ring-1 focus:ring-[#C9A87C]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-3.5 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="admin-signin-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#C9A87C] hover:bg-[#b8966a] text-zinc-900 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C9A87C]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><RotateCw className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Access Admin Console
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-zinc-900 space-y-3 text-center">
                <p className="text-[11px] text-zinc-700">
                  Not an admin?{' '}
                  <Link to="/login" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
                    Customer login
                  </Link>
                  {' '}·{' '}
                  <Link to="/" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
                    Browse store
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-800 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Secure encrypted connection
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  RotateCw
} from 'lucide-react';

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminRole, setIsAdminRole] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      alert("Please fill in all credentials.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (isAdminRole) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    }, 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = registerForm;
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsLogin(true); // switch to login after registering successfully
      }, 1500);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (isAdminRole) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    }, 1200);
  };


  return (
    <div className="min-h-screen flex bg-[#F8F7F4] dark:bg-zinc-950 transition-colors duration-300 font-sans overflow-hidden">
      
      {/* Left visual half (Desktop/Laptop split view) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden select-none">
        {/* Background lookbook cover image */}
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
          alt="Bhondu Lookbook"
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-10000 ease-out"
        />
        
        {/* Glass overlay with luxury gold branding details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-12">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-zinc-900 flex items-center justify-center font-bold text-lg">
              B
            </div>
            <span className="font-bold text-xl uppercase tracking-widest text-white font-logo">
              BHONDU
            </span>
          </div>

          {/* Inspirational block quotes */}
          <div className="space-y-4 max-w-lg text-left">
            <span className="px-3 py-1 border border-[#C9A87C] rounded-full text-[9px] uppercase tracking-wider text-[#C9A87C] font-semibold">
              Esports Atelier
            </span>
            <h1 className="text-4xl xl:text-5xl font-bold font-luxury-serif text-white leading-tight">
              Structured Street Armor & Gaming Performance.
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Sign in to manage catalog curations, fulfillment logistics, and subscriber lists on the BHONDU core console.
            </p>
          </div>

          {/* Slogan */}
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
            &copy; 2026 BHONDU Fashion Studio
          </p>
        </div>
      </div>

      {/* Right form half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Success Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-[#F8F7F4]/90 dark:bg-zinc-950/95 flex flex-col items-center justify-center z-15 text-center p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle className="w-16 h-16 text-[#C9A87C] mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold font-luxury-serif">Access Granted</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {isLogin ? "Redirecting to your console session..." : "Account created! Loading login module..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile logo layout */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">
                B
              </div>
              <span className="font-bold text-lg uppercase tracking-widest font-logo">
                BHONDU
              </span>
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold font-luxury-serif tracking-tight">
              {isLogin ? "Consoles Sign In" : "Register Account"}
            </h2>
            <p className="text-xs text-zinc-500">
              {isLogin ? "Select your credentials role key to verify profile access." : "Fill in your personal coordinates to register."}
            </p>
          </div>

          {/* Mode Switcher slide tabs */}
          <div className="bg-zinc-200/50 dark:bg-zinc-900 p-1 rounded-xl flex text-xs font-semibold relative">
            <div className="grid grid-cols-2 w-full relative z-10">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-2 rounded-lg transition-all ${
                  isLogin ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`py-2 rounded-lg transition-all ${
                  !isLogin ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'
                }`}
              >
                Register
              </button>
            </div>
            
            {/* Sliding backdrop */}
            <motion.div
              layoutId="authTabSlider"
              animate={{ x: isLogin ? '2%' : '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="absolute top-1 bottom-1 left-1 w-[48%] bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
            />
          </div>

          {/* Form panels with animation wrapper */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4 text-xs text-left"
              >
                {/* Role selection tab pills */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Select Access Key</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAdminRole(true)}
                      className={`py-2 border rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isAdminRole
                          ? 'border-[#C9A87C] bg-white dark:bg-zinc-900 text-[#C9A87C] ring-1 ring-[#C9A87C]'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-400'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Console
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdminRole(false)}
                      className={`py-2 border rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                        !isAdminRole
                          ? 'border-[#C9A87C] bg-white dark:bg-zinc-900 text-[#C9A87C] ring-1 ring-[#C9A87C]'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 text-zinc-400'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Storefront Customer
                    </button>
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Verify Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-450 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="admin@bhondu.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full text-xs pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Security Password</label>
                    <button
                      type="button"
                      onClick={() => alert("Simulated: Forgot password flow.")}
                      className="text-[10px] hover:underline text-[#C9A87C] font-semibold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-450 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full text-xs pl-9 pr-10 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Accept terms */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-zinc-900 focus:ring-zinc-900 border-zinc-200 dark:border-zinc-800" />
                    <span className="text-zinc-500 font-medium">Keep console signed in</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 flex items-center justify-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      Authenticating token key...
                    </>
                  ) : (
                    <>
                      Enter Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-4 text-xs text-left"
              >
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-450 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Indrajit Padhiyar"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-450 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="owner@bhondu.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full text-xs pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Create Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full text-xs p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Accept terms and privacy */}
                <label className="flex items-start gap-2 cursor-pointer pt-1 text-[11px]">
                  <input type="checkbox" required className="rounded text-zinc-900 focus:ring-zinc-900 mt-0.5 border-zinc-200 dark:border-zinc-800" />
                  <span className="text-zinc-500 leading-normal font-medium">
                    I accept the administrative console <span className="text-[#C9A87C] hover:underline">security terms</span> and privacy protocols.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:bg-zinc-850 dark:hover:bg-zinc-100 flex items-center justify-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      Creating console token...
                    </>
                  ) : (
                    <>
                      Register Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social login separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-850" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-[#F8F7F4] dark:bg-zinc-950 px-3 text-zinc-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-sm bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 disabled:opacity-50 text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.354 0 3.373 2.736 1.5 6.7L5.266 9.765z"
              />
              <path
                fill="#FBBC05"
                d="M16.04 15.34c-1.045.69-2.38 1.1-4.04 1.1a7.07 7.07 0 0 1-6.734-4.855L1.5 14.45c1.873 3.964 5.854 6.7 10.5 6.7 3.127 0 5.964-1.027 8.036-2.81l-4-3z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.818-.082-1.609-.227-2.364H12v4.51h6.464c-.29 1.482-1.145 2.736-2.427 3.564l4 3c2.345-2.155 3.454-5.327 3.454-8.71z"
              />
              <path
                fill="#34A853"
                d="M5.266 14.236A7.07 7.07 0 0 1 4.91 12c0-.79.136-1.545.356-2.235L1.5 6.7A11.956 11.956 0 0 0 0 12c0 1.927.455 3.755 1.255 5.39l4.01-3.154z"
              />
            </svg>
            Continue with Google
          </button>

        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } from '../../services/authApi';
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
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [success, setSuccess] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const loading = isLoginLoading || isRegisterLoading;

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, checks: { length: false, lowercase: false, uppercase: false, number: false, special: false } };
    
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks };
  };

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'Empty', color: 'bg-zinc-200 dark:bg-zinc-850', textColor: 'text-zinc-400' };
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-550 dark:text-red-400' };
    if (score <= 4) return { label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-550 dark:text-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-550 dark:text-emerald-400' };
  };

  const pwdStrength = checkPasswordStrength(registerForm.password);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    try {
      const response = await login({ email: loginForm.email, password: loginForm.password }).unwrap();
      toast.success("Logged in successfully!");
      setSuccess(true);
      
      const user = response.data.user;
      const userIsAdmin = user.role === 'Admin' || user.role === 'Super Admin';
      
      setTimeout(() => {
        setSuccess(false);
        if (userIsAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = registerForm;
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (pwdStrength.score < 5) {
      toast.error("Please ensure your password meets all strength criteria.");
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      toast.success("Registration successful! You can now log in.");
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setIsLogin(true);
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Registration failed.');
    }
  };

  const googleBtnRef = useRef(null);
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const handleCredentialResponse = async (response) => {
    try {
      const result = await googleLogin({ idToken: response.credential }).unwrap();
      toast.success("Logged in with Google successfully!");
      setSuccess(true);
      
      const user = result.data.user;
      const userIsAdmin = user.role === 'Admin' || user.role === 'Super Admin';
      
      setTimeout(() => {
        setSuccess(false);
        if (userIsAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Google authentication failed.');
    }
  };

  useEffect(() => {
    // Dynamically load Google Client library script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(
            googleBtnRef.current,
            {
              theme: document.documentElement.classList.contains('dark') ? "filled_black" : "outline",
              size: "large",
              width: googleBtnRef.current.offsetWidth || 380,
              text: "continue_with",
              shape: "rectangular"
            }
          );
        }
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isLogin]);


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
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full text-xs pl-3 pr-8 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2.5 top-3.5 text-zinc-455 hover:text-zinc-700 dark:hover:text-zinc-300"
                      >
                        {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full text-xs pl-3 pr-8 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-2.5 top-3.5 text-zinc-455 hover:text-zinc-700 dark:hover:text-zinc-300"
                      >
                        {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  <AnimatePresence>
                    {registerForm.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-2 space-y-2 pt-1 overflow-hidden"
                      >
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                          <span className="text-zinc-450 dark:text-zinc-500">Password Strength</span>
                          <span className={getStrengthLabel(pwdStrength.score).textColor}>
                            {getStrengthLabel(pwdStrength.score).label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((index) => (
                            <div
                              key={index}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                index <= pwdStrength.score
                                  ? getStrengthLabel(pwdStrength.score).color
                                  : 'bg-zinc-250 dark:bg-zinc-850'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            {pwdStrength.checks.length ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0 animate-pulse">1</div>
                            )}
                            <span className={pwdStrength.checks.length ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                              Min 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {pwdStrength.checks.uppercase ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0 animate-pulse">2</div>
                            )}
                            <span className={pwdStrength.checks.uppercase ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                              At least one uppercase
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {pwdStrength.checks.lowercase ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0 animate-pulse">3</div>
                            )}
                            <span className={pwdStrength.checks.lowercase ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                              At least one lowercase
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {pwdStrength.checks.number ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0 animate-pulse">4</div>
                            )}
                            <span className={pwdStrength.checks.number ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                              At least one number
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            {pwdStrength.checks.special ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-350 dark:border-zinc-750 flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600 shrink-0 animate-pulse">5</div>
                            )}
                            <span className={pwdStrength.checks.special ? 'text-zinc-800 dark:text-zinc-200 transition-colors font-medium' : 'text-zinc-400'}>
                              At least one symbol (!@#$%^& etc.)
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

          {/* Google Login Button Container */}
          <div className="w-full flex justify-center">
            <div ref={googleBtnRef} className="w-full min-h-[40px] flex justify-center"></div>
          </div>

        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } from '../../services/authApi';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  RotateCw,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function UserAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const loading = isLoginLoading || isRegisterLoading;

  const googleBtnRef = useRef(null);
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'Admin' || user.role === 'Super Admin';
      const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Password strength
  const checkStrength = (pwd) => {
    if (!pwd) return { score: 0, checks: {} };
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
    return { score: Object.values(checks).filter(Boolean).length, checks };
  };

  const strength = checkStrength(registerForm.password);
  const strengthColor = strength.score <= 2 ? 'bg-red-500' : strength.score <= 4 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel = strength.score <= 2 ? 'Weak' : strength.score <= 4 ? 'Moderate' : 'Strong';
  const strengthText = strength.score <= 2 ? 'text-red-500' : strength.score <= 4 ? 'text-amber-500' : 'text-emerald-500';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      const response = await login(loginForm).unwrap();
      toast.success('Welcome back!');
      setSuccess(true);
      const loggedUser = response.data.user;
      const isAdmin = loggedUser.role === 'Admin' || loggedUser.role === 'Super Admin';
      setTimeout(() => {
        setSuccess(false);
        const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/');
        navigate(from);
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = registerForm;
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (strength.score < 3) {
      toast.error('Please choose a stronger password.');
      return;
    }
    try {
      await register({ name, email, password }).unwrap();
      toast.success('Account created! Please sign in.');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsLogin(true);
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Registration failed.');
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      const result = await googleLogin({ idToken: response.credential }).unwrap();
      toast.success('Signed in with Google!');
      setSuccess(true);
      const loggedUser = result.data.user;
      const isAdmin = loggedUser.role === 'Admin' || loggedUser.role === 'Super Admin';
      setTimeout(() => {
        setSuccess(false);
        const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/');
        navigate(from);
      }, 1500);
    } catch (err) {
      toast.error(err.data?.message || 'Google sign-in failed.');
    }
  };

  useEffect(() => {
    let script;
    const init = () => {
      if (window.google && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleBtnRef.current.offsetWidth || 380,
            text: 'continue_with',
            shape: 'rectangular',
          });
        } catch (e) {
          console.warn('Google Sign-In init error:', e);
        }
      }
    };
    if (window.google) {
      init();
    } else {
      script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', init);
    }
    return () => { if (script) script.removeEventListener('load', init); };
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8F7F4] dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">

      {/* ===== LEFT PANEL: Brand visual ===== */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-zinc-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
          alt="BHONDU Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105 hover:scale-100 transition-transform duration-[8000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-9 h-9 rounded-lg bg-white text-zinc-900 flex items-center justify-center font-bold text-lg">
              B
            </div>
            <span className="font-bold text-xl uppercase tracking-widest text-white">BHONDU</span>
          </Link>

          {/* Quote */}
          <div className="space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C9A87C]/60 rounded-full text-[9px] uppercase tracking-widest text-[#C9A87C] font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              Premium Esports Apparel
            </span>
            <h1 className="text-4xl xl:text-5xl font-bold font-luxury-serif text-white leading-[1.15]">
              Wear What<br />Champions Wear.
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Join the BHONDU community. Get access to limited drops, exclusive member pricing, and order tracking.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['Free Returns', '100% Authentic', 'Secure Checkout', '24h Support'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                  <CheckCircle className="w-3 h-3 text-[#C9A87C]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-700 uppercase tracking-widest">© 2026 BHONDU Fashion Studio</p>
        </div>
      </div>

      {/* ===== RIGHT PANEL: Auth Form ===== */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">

        {/* Success overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#F8F7F4]/95 dark:bg-zinc-950/95 flex flex-col items-center justify-center z-20 text-center p-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-[#C9A87C] mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold font-luxury-serif">
                {isLogin ? 'Welcome Back!' : 'Account Created!'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5">
                {isLogin ? 'Redirecting you now...' : 'Switching to sign in...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-[400px] space-y-7">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold">B</div>
            <span className="font-bold text-lg uppercase tracking-widest font-logo">BHONDU</span>
          </div>

          {/* Header text */}
          <div>
            <h2 className="text-2xl font-bold font-luxury-serif tracking-tight text-zinc-900 dark:text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isLogin
                ? 'Sign in to track orders, save wishlist & more.'
                : 'Join BHONDU and get exclusive member benefits.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="relative bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl flex text-xs font-semibold">
            <div className="grid grid-cols-2 w-full relative z-10">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`py-2.5 rounded-lg transition-colors duration-200 ${isLogin ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`py-2.5 rounded-lg transition-colors duration-200 ${!isLogin ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Register
              </button>
            </div>
            <motion.div
              layoutId="tab-bg"
              animate={{ x: isLogin ? '2%' : '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className="absolute top-1 bottom-1 left-1 w-[48%] bg-white dark:bg-zinc-800 rounded-lg shadow-sm pointer-events-none"
            />
          </div>

          {/* Form area */}
          <AnimatePresence mode="wait">

            {/* ========== LOGIN FORM ========== */}
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full text-sm pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Password</label>
                    <button type="button" className="text-[11px] text-[#C9A87C] hover:underline font-semibold">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full text-sm pl-9 pr-10 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-500 font-medium select-none">
                  <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900" />
                  Keep me signed in
                </label>

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <><RotateCw className="w-4 h-4 animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {/* Admin link */}
                <div className="pt-1 text-center">
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C9A87C] transition-colors" />
                    Are you an admin?
                    <span className="text-[#C9A87C] font-semibold underline underline-offset-2">Sign in to console →</span>
                  </Link>
                </div>
              </motion.form>
            ) : (

              /* ========== REGISTER FORM ========== */
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={registerForm.name}
                      onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full text-sm pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={registerForm.email}
                      onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full text-sm pl-9 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Password</label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPwd ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                        className="w-full text-sm pl-3 pr-8 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPwd(v => !v)}
                        className="absolute right-2.5 top-3.5 text-zinc-400 hover:text-zinc-600"
                      >
                        {showRegPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Confirm</label>
                    <div className="relative">
                      <input
                        id="reg-confirm"
                        type={showRegPwd ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={e => setRegisterForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        className="w-full text-sm pl-3 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Strength bar */}
                {registerForm.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
                      <span className="text-zinc-400">Strength</span>
                      <span className={strengthText}>{strengthLabel}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${i <= strength.score ? strengthColor : 'bg-zinc-200 dark:bg-zinc-800'}`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      {[
                        ['length', '8+ characters'],
                        ['uppercase', 'Uppercase letter'],
                        ['lowercase', 'Lowercase letter'],
                        ['number', 'Number'],
                        ['special', 'Special character'],
                      ].map(([key, label]) => (
                        <div key={key} className={`flex items-center gap-1 ${strength.checks[key] ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}>
                          <CheckCircle className={`w-3 h-3 ${strength.checks[key] ? 'opacity-100' : 'opacity-25'}`} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-500 font-medium select-none">
                  <input type="checkbox" required className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 mt-0.5 shrink-0" />
                  <span>I agree to BHONDU's <span className="text-[#C9A87C] hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#C9A87C] hover:underline cursor-pointer">Privacy Policy</span>.</span>
                </label>

                {/* Submit */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <><RotateCw className="w-4 h-4 animate-spin" /> Creating account...</>
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {/* Admin link */}
                <div className="pt-1 text-center">
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#C9A87C] transition-colors" />
                    Are you an admin?
                    <span className="text-[#C9A87C] font-semibold underline underline-offset-2">Sign in to console →</span>
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Google sign-in divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F8F7F4] dark:bg-zinc-950 px-3 text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google button */}
          <div className="w-full flex justify-center">
            <div ref={googleBtnRef} className="w-full min-h-[42px] flex justify-center" />
          </div>

          {/* Back to store */}
          <p className="text-center text-[11px] text-zinc-400">
            <Link to="/" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors underline underline-offset-2">
              ← Continue browsing without account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

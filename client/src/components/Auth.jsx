import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Github, Chrome, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });
    
    let strength = 0;
    if (val.length > 5) strength++;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    setPasswordStrength(strength);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setIsEmailValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !termsAccepted) {
      setError('Please accept the Terms of Service');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await login({ email: formData.email, password: formData.password });
      } else {
        res = await signup({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password
        });
      }

      if (res.success) {
        alert(isLogin ? 'User logged in successfully!' : 'Account created successfully!');
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2.5 text-slate-500 no-underline font-medium transition-colors duration-300 z-[100] hover:text-blue-600">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-[480px] p-5 relative z-10">
        <div className="bg-white p-10 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 w-full box-border">
          <div className="text-left mb-7">
            <div className="flex items-center gap-2.5 mb-4.5">
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="text-xl font-bold text-slate-900 leading-none">Healify</span>
            </div>
            <h1 className="text-[1.6rem] font-bold text-slate-900 m-0 mb-1.5 leading-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-slate-500 text-sm m-0 font-medium">{isLogin ? 'Enter your details to access your health dashboard' : 'Free forever · No credit card needed'}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[0.85rem] font-medium p-2.5 px-3.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button type="button" className="flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-[0.875rem] font-semibold cursor-pointer transition-[background,border-color] duration-150 w-full hover:bg-slate-50 hover:border-slate-300">
                  <Chrome size={20} />
                  <span>Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-[0.875rem] font-semibold cursor-pointer transition-[background,border-color] duration-150 w-full hover:bg-slate-50 hover:border-slate-300">
                  <Github size={20} />
                  <span>GitHub</span>
                </button>
              </div>
              <div className="relative text-center my-5 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-full before:h-px before:bg-slate-200">
                <span className="relative z-[2] bg-white px-3 text-slate-400 text-[0.8rem] font-medium">or with email</span>
              </div>
            </>
          )}

          <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-[14px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[0.8rem] font-semibold text-slate-700">First Name</label>
                  <div className="relative flex items-center w-full">
                    <User className="absolute left-[13px] text-slate-400 pointer-events-none flex-shrink-0" size={18} />
                    <input 
                      type="text" 
                      placeholder="John"
                      required 
                      disabled={isLoading}
                      className="w-full box-border py-[11px] px-3.5 pl-10 rounded-xl border border-slate-200 text-sm text-slate-800 transition-[border-color,background-color] duration-200 outline-none bg-white placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[0.8rem] font-semibold text-slate-700">Last Name</label>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="text" 
                      placeholder="Doe"
                      required 
                      disabled={isLoading}
                      className="w-full box-border py-[11px] px-[14px] rounded-xl border border-slate-200 text-sm text-slate-800 transition-[border-color,background-color] duration-200 outline-none bg-white placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.8rem] font-semibold text-slate-700">Email Address</label>
              <div className="relative flex items-center w-full">
                <Mail className="absolute left-[13px] text-slate-400 pointer-events-none flex-shrink-0" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required 
                  disabled={isLoading}
                  className={`w-full box-border py-[11px] px-3.5 pl-10 rounded-xl border transition-[border-color,background-color] duration-200 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] ${isEmailValid ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
                  value={formData.email}
                  onChange={handleEmailChange}
                />
                {!isLogin && isEmailValid && <div className="absolute right-3 text-emerald-500 flex items-center pointer-events-none"><CheckCircle2 size={16} /></div>}
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.8rem] font-semibold text-slate-700">Password</label>
              <div className="relative flex items-center w-full">
                <Lock className="absolute left-[13px] text-slate-400 pointer-events-none flex-shrink-0" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required 
                  disabled={isLoading}
                  className="w-full box-border py-[11px] px-3.5 pl-10 rounded-xl border border-slate-200 text-sm text-slate-800 transition-[border-color,background-color] duration-200 outline-none bg-white placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                  value={formData.password}
                  onChange={handlePasswordChange}
                />
                <button 
                  type="button" 
                  className="absolute right-3 bg-none border-none text-slate-400 cursor-pointer p-0 flex items-center hover:text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && formData.password.length > 0 && (
                <>
                  <div className="flex justify-end mt-0.5 h-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      passwordStrength === 1 ? 'text-red-500' :
                      passwordStrength === 2 ? 'text-amber-500' :
                      passwordStrength === 3 ? 'text-emerald-500' :
                      passwordStrength === 4 ? 'text-emerald-600' : ''
                    }`}>
                      {['','Weak','Fair','Good','Strong'][passwordStrength]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div 
                        key={s} 
                        className={`h-1 rounded-sm transition-colors duration-300 ${
                          passwordStrength >= s ? (
                            passwordStrength === 1 ? 'bg-red-500' :
                            passwordStrength === 2 ? 'bg-amber-500' :
                            passwordStrength === 3 ? 'bg-emerald-500' :
                            'bg-emerald-600'
                          ) : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {isLogin ? (
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-[7px] text-[0.85rem] text-slate-500 cursor-pointer font-medium">
                  <input type="checkbox" className="w-[15px] h-[15px] accent-blue-600 cursor-pointer flex-shrink-0" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" title="Forgot Password?" className="text-[0.85rem] text-blue-600 no-underline font-semibold whitespace-nowrap hover:underline">Forgot Password?</Link>
              </div>
            ) : (
              <div className="mt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-[0.825rem] text-slate-500 font-medium leading-relaxed">
                  <input 
                    type="checkbox" 
                    required 
                    className="w-[15px] h-[15px] accent-blue-600 cursor-pointer flex-shrink-0 mt-0.5"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>
                    I agree to the <Link to="/terms" className="text-blue-600 no-underline font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 no-underline font-semibold hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              className="bg-blue-600 text-white p-[13px] rounded-xl font-bold text-[1rem] border-none cursor-pointer transition-[background,transform] duration-200 flex items-center justify-center gap-2 w-full mt-1 hover:enabled:bg-blue-700 active:enabled:scale-[0.99] disabled:opacity-[0.65] disabled:cursor-not-allowed" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create account'}
                  {!isLogin && <ArrowLeft className="rotate-180" size={18} />}
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-500 text-[0.875rem] m-0">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                type="button" 
                className="bg-none border-none text-blue-600 font-bold cursor-pointer p-0 text-[0.875rem] ml-1 hover:underline outline-none"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute blur-[80px] opacity-[0.35] z-[1] top-[-10%] right-[-5%] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(37,99,235,0.35)_0%,transparent_70%)] animate-[float1_20s_infinite_alternate]"></div>
        <div className="absolute blur-[80px] opacity-[0.35] z-[1] bottom-[-10%] left-[-5%] w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(77,182,172,0.25)_0%,transparent_70%)] animate-[float2_15s_infinite_alternate]"></div>
      </div>

      <style>{`
        @keyframes float1 {
          from { transform: translate(0, 0); }
          to   { transform: translate(-80px, 40px); }
        }
        @keyframes float2 {
          from { transform: translate(0, 0); }
          to   { transform: translate(80px, -40px); }
        }
      `}</style>
    </div>
  );
};

export default Auth;

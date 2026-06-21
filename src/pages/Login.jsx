import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Shield } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:"", password:"", remember:false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const result = await login(form.email, form.password);
    if (result.success) navigate("/dashboard");
    else setError(result.message || "Login failed");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-16 text-white relative overflow-hidden" style={{background: "linear-gradient(135deg, #1e3a8a 0%, #2563EB 60%, #3B82F6 100%)"}}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"/>
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur">
            <Shield size={36}/>
          </div>
          <h1 className="text-4xl font-bold mb-4">SkillShare<br/>Admin Portal</h1>
          <p className="text-blue-100 text-lg leading-relaxed">Manage your entire platform from one powerful dashboard.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[["1,240+","Skill Seekers"],["324+","Providers"],["2,436","Total Bookings"],["$295K","Revenue"]].map(([v,l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold">{v}</p><p className="text-blue-100 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><Zap size={18} className="text-white"/></div>
            <span className="font-bold text-xl text-primary">SkillShare Admin</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your admin account</p>

          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-xs text-blue-700">
            <strong>Demo credentials:</strong> admin@skillshare.com / admin123
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl mb-4">
              <AlertCircle size={16}/>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="admin@skillshare.com" required className="input pl-10 h-11"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPw?"text":"password"} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" required className="input pl-10 pr-10 h-11"/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember} onChange={e=>setForm(p=>({...p,remember:e.target.checked}))} className="w-4 h-4 rounded accent-primary"/>
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary font-semibold hover:underline">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-base mt-2">
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

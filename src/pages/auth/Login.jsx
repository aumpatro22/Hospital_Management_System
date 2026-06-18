import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope, Activity, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' }[user.role] || '/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@hospital.com', password: 'admin123' },
      doctor: { email: 'sarah@hospital.com', password: 'doctor123' },
      patient: { email: 'patient@hospital.com', password: 'patient123' }
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24, position: 'relative' }}>
      
      {/* Back to Home Link */}
      <Link to="/" style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14 }}>
        <Heart size={16} color="var(--primary)" /> <span>MedCare Home</span>
      </Link>

      <div className="glass-card animate-scale-in" style={{ width: '100%', maxWidth: 460, padding: 40, background: 'rgba(15, 22, 42, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}>
        
        {/* Brand Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)' }}>
            <Heart size={30} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome Back</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Sign in to continue to MedCare HMS</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="login-email" type="email" className="form-input" style={{ paddingLeft: 44, borderRadius: 10, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="login-password">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="login-password" type={showPassword ? 'text' : 'password'} className="form-input" style={{ paddingLeft: 44, paddingRight: 44, borderRadius: 10, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontSize: 15, padding: '14px 24px', borderRadius: 10, marginTop: 8, boxShadow: 'var(--shadow-glow)' }} disabled={loading} id="login-submit-btn">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Quick Demo Roles</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { role: 'admin', label: 'Admin', color: 'var(--secondary-light)' },
              { role: 'doctor', label: 'Doctor', color: 'var(--primary-light)' },
              { role: 'patient', label: 'Patient', color: 'var(--accent-light)' }
            ].map(({ role, label, color }) => (
              <button key={role} onClick={() => fillDemo(role)} className="btn btn-ghost btn-sm" style={{ flex: 1, borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: color, borderRadius: 8, fontSize: 12 }} id={`demo-${role}-btn`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Link */}
        <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginTop: 28 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Register here</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient', gender: '', dateOfBirth: '', bloodGroup: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      
      {/* Back to Home Link */}
      <Link to="/" style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14 }}>
        <Heart size={16} color="var(--primary)" /> <span>MedCare Home</span>
      </Link>

      <div className="glass-card animate-scale-in" style={{ width: '100%', maxWidth: 540, padding: 40, background: 'rgba(15, 22, 42, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 15, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)' }}>
            <Heart size={28} color="white" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Create Account</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Join MedCare Hospital Management System</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="name" className="form-input" style={{ paddingLeft: 38, borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="Your name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="phone" className="form-input" style={{ paddingLeft: 38, borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="+91-XXXXX" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="email" type="email" className="form-input" style={{ paddingLeft: 38, borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="password" type={showPassword ? 'text' : 'password'} className="form-input" style={{ paddingLeft: 38, borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="Min 6 chars" value={formData.password} onChange={handleChange} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-input" style={{ borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} placeholder="Re-enter" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" style={{ borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input name="dateOfBirth" type="date" className="form-input" style={{ borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Blood</label>
              <select name="bloodGroup" className="form-select" style={{ borderRadius: 8, background: 'rgba(15, 22, 42, 0.5)' }} value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg=><option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8, borderRadius: 8, boxShadow: 'var(--shadow-glow)' }} disabled={loading} id="register-submit-btn">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;

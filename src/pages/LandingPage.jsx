import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Stethoscope, Calendar, Users, Shield, Activity, Clock, ChevronRight, Star, Plus, Check, Search, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import api from '../services/api';

const LandingPage = () => {
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const defaultFeatures = [
    { icon: <Calendar size={28} />, title: 'Easy Booking', desc: 'Schedule appointments with your preferred doctors in just a few clicks' },
    { icon: <Stethoscope size={28} />, title: 'Expert Doctors', desc: 'Access our network of experienced specialists across all departments' },
    { icon: <Shield size={28} />, title: 'Secure Records', desc: 'Your medical records are encrypted and stored securely' },
    { icon: <Activity size={28} />, title: 'Real-time Tracking', desc: 'Track appointments, prescriptions, and health metrics in real-time' },
    { icon: <Clock size={28} />, title: '24/7 Support', desc: 'Round-the-clock assistance for all your healthcare needs' },
    { icon: <Users size={28} />, title: 'Family Profiles', desc: 'Manage health records for your entire family from one account' }
  ];

  const defaultDepartments = [
    { name: 'Cardiology', icon: '❤️', doctorCount: 5, description: 'Heart and cardiovascular system care' },
    { name: 'Neurology', icon: '🧠', doctorCount: 3, description: 'Brain and nervous system disorders' },
    { name: 'Orthopedics', icon: '🦴', doctorCount: 4, description: 'Bone, joint, and muscle care' },
    { name: 'Pediatrics', icon: '👶', doctorCount: 6, description: 'Medical care for infants and children' },
    { name: 'Dermatology', icon: '🧴', doctorCount: 3, description: 'Skin, hair, and nail care' },
    { name: 'Ophthalmology', icon: '👁️', doctorCount: 2, description: 'Eye care and vision' },
    { name: 'ENT', icon: '👂', doctorCount: 3, description: 'Ear, nose, and throat care' },
    { name: 'General Medicine', icon: '🏥', doctorCount: 8, description: 'Primary and general healthcare' }
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data?.success && res.data.data?.length > 0) {
          setDepartmentsList(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, []);

  const displayDepartments = departmentsList.length > 0 ? departmentsList : defaultDepartments;
  const stats = [
    { value: '25+', label: 'Specialist Doctors' },
    { value: '4.9★', label: 'Patient Rating' },
    { value: '99.9%', label: 'Uptime & Security' },
    { value: '15 Min', label: 'Avg. Response Time' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      
      {/* HEADER / NAVIGATION */}
      <header className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)' }}>
            <Heart size={22} color="white" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #FFF 0%, #CBD5E1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MedCare</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/login" className="btn btn-ghost" style={{ borderRadius: 'var(--radius-md)', padding: '10px 24px' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)', padding: '10px 24px', boxShadow: '0 8px 20px rgba(14, 165, 233, 0.25)' }}>Get Started <ArrowRight size={16} /></Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ paddingTop: 180, paddingBottom: 120, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          
          {/* Left Text */}
          <div className="animate-fade-in-left">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.15)', marginBottom: 28, fontSize: 13, color: 'var(--primary-light)', fontWeight: 600 }}>
              <Sparkles size={14} fill="currentColor" /> Premium Digital Healthcare Platform
            </div>
            <h1 style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1.5px', color: 'var(--text-primary)' }}>
              Streamlined Clinic & <br />
              <span className="gradient-text" style={{ fontWeight: 800 }}>Hospital Operations</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.7, maxWidth: 580 }}>
              Experience the future of healthcare management. Connect patients, doctors, and administrators through a beautiful, integrated glassmorphic dashboard built for maximum speed and efficiency.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-md)', fontSize: 16, padding: '16px 36px', boxShadow: 'var(--shadow-glow)' }}>
                Start Booking Now <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-md)', fontSize: 16, padding: '16px 36px' }}>
                Explore Admin Demo
              </Link>
            </div>
          </div>

          {/* Right Preview (CSS Glassmorphism Mockup) */}
          <div className="animate-fade-in-right" style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            {/* Main Mockup Portal Card */}
            <div className="glass-card" style={{ width: '100%', maxWidth: 460, padding: 24, boxShadow: '0 24px 50px rgba(0,0,0,0.4)', position: 'relative', zIndex: 2, background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              
              {/* Header inside mockup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}></span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, fontWeight: 500 }}>MedCare Portal v1.2</span>
                </div>
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Stat card inside mockup */}
              <div className="glass-card" style={{ padding: 16, marginBottom: 16, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Appointments</p>
                  <h4 style={{ fontSize: 24, fontWeight: 800, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    142 <span style={{ fontSize: 12, color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 2 }}><TrendingUp size={12} /> +12%</span>
                  </h4>
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                  <Calendar size={20} />
                </div>
              </div>

              {/* Patient List inside mockup */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Upcoming Schedule</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'John Doe', time: '10:30 AM', type: 'Cardiology', color: 'var(--primary-light)' },
                    { name: 'Alice Smith', time: '11:45 AM', type: 'Dermatology', color: 'var(--secondary-light)' },
                    { name: 'Mark Wilson', time: '02:15 PM', type: 'Pediatrics', color: 'var(--accent-light)' }
                  ].map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{p.name[0]}</div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.type}</p>
                        </div>
                      </div>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: p.color, fontSize: 11, padding: '2px 8px' }}>{p.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Mockup */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Activity Chart</p>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
                </div>
                <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 8px' }}>
                  {[40, 25, 60, 45, 80, 55, 95, 70, 85].map((val, i) => (
                    <div key={i} style={{ flex: 1, height: `${val}%`, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Glowing Backdrop Circle behind Mockup */}
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', top: '-20px', right: '-20px', zIndex: 1, filter: 'blur(30px)' }} />
            <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)', bottom: '-30px', left: '-20px', zIndex: 1, filter: 'blur(35px)' }} />
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '60px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="gradient-text" style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{stat.value}</div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16, color: 'var(--text-primary)' }}>Everything You Need</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>Comprehensive suite of utilities designed to optimize medical administrative tasks.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {defaultFeatures.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 32, background: 'rgba(15, 23, 42, 0.4)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', marginBottom: 24, border: '1px solid rgba(14, 165, 233, 0.15)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section style={{ padding: '100px 48px', background: 'rgba(15, 23, 42, 0.35)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>Medical Departments</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Providing state-of-the-art care across multiple expert fields</p>
          </div>
          
          {loadingDepts ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {displayDepartments.map((d, i) => (
                <div key={i} className="glass-card animate-fade-in" style={{ padding: '28px 24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.45)' }}>
                  <div style={{ fontSize: 40, marginBottom: 16, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{d.icon || '🏥'}</div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{d.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', height: 40, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 12 }}>{d.description || 'Medical care and specialization services.'}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', background: 'rgba(14,165,233,0.1)', padding: '4px 12px', borderRadius: 20 }}>
                    {d.doctorCount || 0} Doctors
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px 48px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto', padding: '64px 48px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', top: '-50%', left: '-20%', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom: '-50%', right: '-20%', filter: 'blur(30px)' }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>Ready to Experience Modern Healthcare?</h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Join the clinic system today as a Patient to book your first appointment, or explore our Admin and Doctor dashboards.</p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-md)', fontSize: 16, padding: '16px 48px', boxShadow: 'var(--shadow-glow)' }}>
              Create Your Account <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 48px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7, 10, 19, 0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>© 2026 MedCare HMS. Made with 🤍 for Modern Healthcare.</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Contact Support</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

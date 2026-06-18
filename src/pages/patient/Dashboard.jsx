import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const [stats, setStats] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r = await api.get('/dashboard/stats'); setStats(r.data.data); } catch(e){} finally { setLoading(false); } })(); }, []);
  const getStatusBadge = (s) => ({pending:'badge-warning',confirmed:'badge-primary','in-progress':'badge-info',completed:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Patient Dashboard</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>Your health overview</p></div>
        <Link to="/patient/book" className="btn btn-primary"><Plus size={18}/> Book Appointment</Link>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:32 }}>
        <StatsCard icon={<Calendar size={22}/>} label="Total Appointments" value={stats?.totalAppointments||0} color="blue"/>
        <StatsCard icon={<Clock size={22}/>} label="Upcoming" value={stats?.upcomingAppointments||0} color="purple" delay={100}/>
        <StatsCard icon={<CheckCircle size={22}/>} label="Completed" value={stats?.completedAppointments||0} color="green" delay={200}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>
        <Link to="/patient/book" className="glass-card" style={{ padding:32, textDecoration:'none', textAlign:'center' }}>
          <div style={{ width:56, height:56, borderRadius:14, background:'rgba(14,165,233,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'var(--primary-light)' }}><Plus size={28}/></div>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>Book New Appointment</h3><p style={{ fontSize:13, color:'var(--text-muted)' }}>Schedule a visit with our specialists</p>
        </Link>
        <Link to="/patient/appointments" className="glass-card" style={{ padding:32, textDecoration:'none', textAlign:'center' }}>
          <div style={{ width:56, height:56, borderRadius:14, background:'rgba(139,92,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'var(--secondary-light)' }}><Calendar size={28}/></div>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>View Appointments</h3><p style={{ fontSize:13, color:'var(--text-muted)' }}>Check your history</p>
        </Link>
      </div>
      <div className="glass-card" style={{ padding:24 }}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Recent Appointments</h3>
        <table className="data-table"><thead><tr><th>Doctor</th><th>Department</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{stats?.recentAppointments?.length>0 ? stats.recentAppointments.map(a => (
            <tr key={a._id}><td style={{fontWeight:500}}>{a.doctor?.user?.name||'N/A'}</td><td>{a.department?.name||'N/A'}</td><td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</td><td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td></tr>
          )) : <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)',padding:40}}>No appointments yet</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
};
export default PatientDashboard;

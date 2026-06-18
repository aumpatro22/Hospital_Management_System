import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Activity } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const r = await api.get('/dashboard/stats'); setStats(r.data.data); } catch(e){} finally { setLoading(false); } })(); }, []);
  const getStatusBadge = (s) => ({pending:'badge-warning',confirmed:'badge-primary','in-progress':'badge-info',completed:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:32 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Doctor Dashboard</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>Your practice overview</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:32 }}>
        <StatsCard icon={<Calendar size={22}/>} label="Total Appointments" value={stats?.totalAppointments||0} color="blue"/>
        <StatsCard icon={<Clock size={22}/>} label="Today" value={stats?.todayAppointments||0} color="purple" delay={100}/>
        <StatsCard icon={<Activity size={22}/>} label="Pending" value={stats?.pendingAppointments||0} color="orange" delay={200}/>
        <StatsCard icon={<Users size={22}/>} label="Patients" value={stats?.totalPatients||0} color="green" delay={300}/>
      </div>
      <div className="glass-card" style={{ padding:24 }}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Recent Appointments</h3>
        <table className="data-table"><thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
          <tbody>{stats?.recentAppointments?.length>0 ? stats.recentAppointments.map(a => (
            <tr key={a._id}><td style={{fontWeight:500}}>{a.patient?.user?.name||'N/A'}</td><td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</td><td>{a.timeSlot}</td><td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td></tr>
          )) : <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)',padding:40}}>No appointments</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
};
export default DoctorDashboard;

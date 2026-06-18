import { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, Building2, TrendingUp, DollarSign, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { format } from 'date-fns';

const COLORS = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#14B8A6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try { const r = await api.get('/dashboard/stats'); setStats(r.data.data); } catch(e){} finally { setLoading(false); } })(); }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyData = stats?.monthlyTrends?.map(t => ({ name: monthNames[t._id.month - 1], appointments: t.count })) || [];
  const deptData = stats?.departmentStats?.map(d => ({ name: d.name, value: d.count })) || [];
  const getStatusBadge = (s) => ({ pending:'badge-warning', confirmed:'badge-primary', 'in-progress':'badge-info', completed:'badge-success', cancelled:'badge-danger' }[s] || 'badge-secondary');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1><p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Overview of hospital operations</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatsCard icon={<Users size={22}/>} label="Total Patients" value={stats?.totalPatients||0} color="blue"/>
        <StatsCard icon={<Stethoscope size={22}/>} label="Total Doctors" value={stats?.totalDoctors||0} color="green" delay={100}/>
        <StatsCard icon={<Calendar size={22}/>} label="Appointments" value={stats?.totalAppointments||0} color="purple" delay={200}/>
        <StatsCard icon={<DollarSign size={22}/>} label="Total Revenue" value={stats?.totalRevenue||0} color="orange" prefix="₹" delay={300}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatsCard icon={<Clock size={22}/>} label="Today's Appointments" value={stats?.todayAppointments||0} color="blue" delay={400}/>
        <StatsCard icon={<Activity size={22}/>} label="Pending" value={stats?.pendingAppointments||0} color="orange" delay={500}/>
        <StatsCard icon={<Building2 size={22}/>} label="Departments" value={stats?.totalDepartments||0} color="green" delay={600}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}><TrendingUp size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--primary-light)' }}/>Appointment Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12}/><YAxis stroke="var(--text-muted)" fontSize={12}/>
              <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-primary)', fontSize:13 }}/>
              <Bar dataKey="appointments" fill="url(#barGrad)" radius={[6,6,0,0]}/>
              <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Department Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
              {deptData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie>
              <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-primary)', fontSize:13 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px', marginTop:8 }}>
            {deptData.slice(0,6).map((d,i) => <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}><div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }}/><span style={{ color:'var(--text-secondary)' }}>{d.name}</span></div>)}
          </div>
        </div>
      </div>
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Appointments</h3>
        <table className="data-table"><thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{stats?.recentAppointments?.length > 0 ? stats.recentAppointments.map((a,i) => (
            <tr key={a._id||i}><td style={{fontWeight:500}}>{a.patient?.user?.name||'N/A'}</td><td>{a.doctor?.user?.name||'N/A'}</td><td>{a.department?.name||'N/A'}</td>
              <td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'N/A'}</td><td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td></tr>
          )) : <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:40}}>No appointments yet</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDashboard;

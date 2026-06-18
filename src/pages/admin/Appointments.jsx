import { useState, useEffect } from 'react';
import { Calendar, Search, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true); const [statusFilter, setStatusFilter] = useState(''); const [search, setSearch] = useState('');
  useEffect(() => { fetchAppts(); }, [statusFilter]);
  const fetchAppts = async () => { try { const p = {}; if(statusFilter) p.status=statusFilter; const r = await api.get('/appointments',{params:p}); setAppointments(r.data.data); } catch(e){} finally { setLoading(false); } };
  const updateStatus = async (id, status) => { try { await api.put(`/appointments/${id}`,{status}); toast.success(`Appointment ${status}`); fetchAppts(); } catch(e) { toast.error('Failed'); } };
  const getStatusBadge = (s) => ({pending:'badge-warning',confirmed:'badge-primary','in-progress':'badge-info',completed:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
  const filtered = appointments.filter(a => { if(!search) return true; const s=search.toLowerCase(); return a.patient?.user?.name?.toLowerCase().includes(s)||a.doctor?.user?.name?.toLowerCase().includes(s); });
  if (loading) return <LoadingSpinner text="Loading appointments..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Appointments</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>{appointments.length} total</p></div>
      <div style={{ display:'flex', gap:16, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'10px 16px', flex:1, maxWidth:400 }}><Search size={18} style={{ color:'var(--text-muted)' }}/><input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:14, fontFamily:'var(--font-family)' }}/></div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}><Filter size={16} style={{ color:'var(--text-muted)' }}/>
          {['','pending','confirmed','completed','cancelled'].map(s => <button key={s||'all'} onClick={()=>setStatusFilter(s)} className={`btn btn-sm ${statusFilter===s?'btn-primary':'btn-ghost'}`}>{s||'All'}</button>)}
        </div>
      </div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table"><thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(a => (
            <tr key={a._id}><td style={{fontWeight:500}}>{a.patient?.user?.name||'N/A'}</td><td>{a.doctor?.user?.name||'N/A'}</td><td>{a.department?.name||'N/A'}</td>
              <td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</td><td>{a.timeSlot}</td>
              <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
              <td><div style={{display:'flex',gap:4}}>
                {a.status==='pending' && <><button className="btn btn-sm btn-accent" onClick={()=>updateStatus(a._id,'confirmed')}>Confirm</button><button className="btn btn-sm btn-danger" onClick={()=>updateStatus(a._id,'cancelled')}>Cancel</button></>}
                {a.status==='confirmed' && <button className="btn btn-sm btn-primary" onClick={()=>updateStatus(a._id,'completed')}>Complete</button>}
              </div></td></tr>
          ))}</tbody>
        </table>
        {filtered.length===0 && <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><Calendar size={48} style={{ marginBottom:16, opacity:0.3 }}/><p>No appointments</p></div>}
      </div>
    </div>
  );
};
export default AdminAppointments;

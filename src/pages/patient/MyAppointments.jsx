import { useState, useEffect } from 'react';
import { Calendar, Eye, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true); const [sel, setSel] = useState(null);
  useEffect(() => { fetchAppts(); }, []);
  const fetchAppts = async () => { try { const r = await api.get('/appointments'); setAppointments(r.data.data); } catch(e){} finally { setLoading(false); } };
  const cancel = async (id) => { if(!confirm('Cancel?')) return; try { await api.delete(`/appointments/${id}`); toast.success('Cancelled'); fetchAppts(); } catch(e) { toast.error('Failed'); } };
  const getStatusBadge = (s) => ({pending:'badge-warning',confirmed:'badge-primary','in-progress':'badge-info',completed:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
  if (loading) return <LoadingSpinner text="Loading..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>My Appointments</h1></div>
      {appointments.length>0 ? <div style={{ display:'grid', gap:16 }}>{appointments.map(a => (
        <div key={a._id} className="glass-card" style={{ padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div style={{ display:'flex', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary), var(--secondary))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'white', flexShrink:0 }}>{a.doctor?.user?.name?.charAt(0)||'D'}</div>
              <div><h3 style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{a.doctor?.user?.name||'N/A'}</h3><p style={{ fontSize:13, color:'var(--primary-light)' }}>{a.doctor?.specialization||''} • {a.department?.name}</p>
                <div style={{ display:'flex', gap:16, marginTop:8, fontSize:13, color:'var(--text-secondary)' }}><span>📅 {a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</span><span>🕐 {a.timeSlot}</span></div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span>
              {a.status==='completed' && <button className="btn btn-ghost btn-sm" onClick={()=>setSel(a)}><Eye size={14}/> Details</button>}
              {['pending','confirmed'].includes(a.status) && <button className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} onClick={()=>cancel(a._id)}><X size={14}/> Cancel</button>}
            </div>
          </div>
        </div>
      ))}</div> : <div style={{ textAlign:'center', padding:80, color:'var(--text-muted)' }}><Calendar size={56} style={{ marginBottom:20, opacity:0.3 }}/><p style={{ fontSize:18, fontWeight:500 }}>No appointments yet</p></div>}
      <Modal isOpen={!!sel} onClose={()=>setSel(null)} title="Details" size="lg">
        {sel && <div style={{ display:'grid', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}><div><p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:4 }}>Doctor</p><p style={{ fontWeight:600 }}>{sel.doctor?.user?.name}</p></div><div><p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:4 }}>Date</p><p>{format(new Date(sel.date),'MMMM dd, yyyy')}</p></div></div>
          {sel.diagnosis && <div style={{ padding:16, background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.1)', borderRadius:'var(--radius-sm)' }}><p style={{ fontSize:11, color:'var(--accent)', textTransform:'uppercase', marginBottom:8, fontWeight:600 }}>Diagnosis</p><p style={{ fontSize:14, lineHeight:1.6 }}>{sel.diagnosis}</p></div>}
          {sel.prescription && <div style={{ padding:16, background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:'var(--radius-sm)' }}><p style={{ fontSize:11, color:'var(--primary)', textTransform:'uppercase', marginBottom:8, fontWeight:600 }}>Prescription</p><p style={{ fontSize:14, lineHeight:1.6 }}>{sel.prescription}</p></div>}
        </div>}
      </Modal>
    </div>
  );
};
export default MyAppointments;

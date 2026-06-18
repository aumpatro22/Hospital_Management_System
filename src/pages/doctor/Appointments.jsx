import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true); const [statusFilter, setStatusFilter] = useState('');
  const [sel, setSel] = useState(null); const [diagnosis, setDiagnosis] = useState(''); const [prescription, setPrescription] = useState('');
  useEffect(() => { fetchAppts(); }, [statusFilter]);
  const fetchAppts = async () => { try { const p={}; if(statusFilter) p.status=statusFilter; const r=await api.get('/appointments',{params:p}); setAppointments(r.data.data); } catch(e){} finally { setLoading(false); } };
  const updateStatus = async (id, status) => { try { await api.put(`/appointments/${id}`,{status}); toast.success(`${status}`); fetchAppts(); } catch(e) { toast.error('Failed'); } };
  const saveDiagnosis = async () => { try { await api.put(`/appointments/${sel._id}`,{diagnosis,prescription,status:'completed'}); toast.success('Saved'); setSel(null); fetchAppts(); } catch(e) { toast.error('Failed'); } };
  const getStatusBadge = (s) => ({pending:'badge-warning',confirmed:'badge-primary','in-progress':'badge-info',completed:'badge-success',cancelled:'badge-danger'}[s]||'badge-secondary');
  if (loading) return <LoadingSpinner text="Loading..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>My Appointments</h1></div>
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['','pending','confirmed','completed','cancelled'].map(s => <button key={s||'all'} onClick={()=>setStatusFilter(s)} className={`btn btn-sm ${statusFilter===s?'btn-primary':'btn-ghost'}`}>{s||'All'}</button>)}
      </div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table"><thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Symptoms</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{appointments.map(a => (
            <tr key={a._id}><td style={{fontWeight:500}}>{a.patient?.user?.name||'N/A'}</td><td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</td><td>{a.timeSlot}</td>
              <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-secondary)'}}>{a.symptoms||'—'}</td>
              <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
              <td><div style={{display:'flex',gap:4}}>
                {a.status==='pending' && <button className="btn btn-sm btn-accent" onClick={()=>updateStatus(a._id,'confirmed')}>Confirm</button>}
                {(a.status==='confirmed'||a.status==='in-progress') && <button className="btn btn-sm btn-primary" onClick={()=>{setSel(a);setDiagnosis(a.diagnosis||'');setPrescription(a.prescription||'');}}>Diagnose</button>}
              </div></td></tr>
          ))}</tbody>
        </table>
        {appointments.length===0 && <div style={{textAlign:'center',padding:60,color:'var(--text-muted)'}}><Calendar size={48} style={{marginBottom:16,opacity:0.3}}/><p>No appointments</p></div>}
      </div>
      <Modal isOpen={!!sel} onClose={()=>setSel(null)} title="Add Diagnosis" size="lg"
        footer={<><button className="btn btn-secondary" onClick={()=>setSel(null)}>Cancel</button><button className="btn btn-accent" onClick={saveDiagnosis}>Complete & Save</button></>}>
        {sel && <div>
          <div style={{padding:16,background:'var(--bg-primary)',borderRadius:'var(--radius-sm)',marginBottom:20}}>
            <p style={{fontSize:13,color:'var(--text-muted)'}}>Patient: <strong style={{color:'var(--text-primary)'}}>{sel.patient?.user?.name}</strong></p>
            <p style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>Symptoms: <span style={{color:'var(--text-secondary)'}}>{sel.symptoms||'Not specified'}</span></p>
          </div>
          <div className="form-group" style={{marginBottom:16}}><label className="form-label">Diagnosis</label><textarea className="form-textarea" value={diagnosis} onChange={e=>setDiagnosis(e.target.value)} style={{minHeight:100}}/></div>
          <div className="form-group"><label className="form-label">Prescription</label><textarea className="form-textarea" value={prescription} onChange={e=>setPrescription(e.target.value)} style={{minHeight:100}}/></div>
        </div>}
      </Modal>
    </div>
  );
};
export default DoctorAppointments;

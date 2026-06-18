import { useState, useEffect } from 'react';
import { ClipboardList, Search, Eye } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { format } from 'date-fns';

const DoctorPatientRecords = () => {
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [sel, setSel] = useState(null);
  useEffect(() => { (async () => { try { const r = await api.get('/appointments',{params:{status:'completed'}}); setAppointments(r.data.data); } catch(e){} finally { setLoading(false); } })(); }, []);
  const filtered = appointments.filter(a => a.patient?.user?.name?.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <LoadingSpinner text="Loading records..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Patient Records</h1></div>
      <div style={{ marginBottom:24 }}><div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'10px 16px', maxWidth:400 }}><Search size={18} style={{color:'var(--text-muted)'}}/><input type="text" placeholder="Search patients..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,background:'transparent',border:'none',outline:'none',color:'var(--text-primary)',fontSize:14,fontFamily:'var(--font-family)'}}/></div></div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table"><thead><tr><th>Patient</th><th>Date</th><th>Diagnosis</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(a => (<tr key={a._id}><td style={{fontWeight:500}}>{a.patient?.user?.name||'N/A'}</td><td style={{color:'var(--text-secondary)'}}>{a.date?format(new Date(a.date),'MMM dd, yyyy'):'—'}</td><td style={{maxWidth:250,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.diagnosis||'—'}</td><td><button className="btn btn-ghost btn-sm" onClick={()=>setSel(a)}><Eye size={14}/> View</button></td></tr>))}</tbody>
        </table>
        {filtered.length===0 && <div style={{textAlign:'center',padding:60,color:'var(--text-muted)'}}><ClipboardList size={48} style={{marginBottom:16,opacity:0.3}}/><p>No records</p></div>}
      </div>
      <Modal isOpen={!!sel} onClose={()=>setSel(null)} title="Record Details" size="lg">
        {sel && <div style={{display:'grid',gap:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}><div><p style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',marginBottom:4}}>Patient</p><p style={{fontWeight:600}}>{sel.patient?.user?.name}</p></div><div><p style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',marginBottom:4}}>Date</p><p>{format(new Date(sel.date),'MMMM dd, yyyy')}</p></div></div>
          {sel.diagnosis && <div style={{padding:16,background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.1)',borderRadius:'var(--radius-sm)'}}><p style={{fontSize:11,color:'var(--accent)',textTransform:'uppercase',marginBottom:8,fontWeight:600}}>Diagnosis</p><p style={{fontSize:14,lineHeight:1.6}}>{sel.diagnosis}</p></div>}
          {sel.prescription && <div style={{padding:16,background:'rgba(14,165,233,0.05)',border:'1px solid rgba(14,165,233,0.1)',borderRadius:'var(--radius-sm)'}}><p style={{fontSize:11,color:'var(--primary)',textTransform:'uppercase',marginBottom:8,fontWeight:600}}>Prescription</p><p style={{fontSize:14,lineHeight:1.6}}>{sel.prescription}</p></div>}
        </div>}
      </Modal>
    </div>
  );
};
export default DoctorPatientRecords;

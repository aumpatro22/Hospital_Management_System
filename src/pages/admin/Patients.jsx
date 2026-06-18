import { useState, useEffect } from 'react';
import { Users, Search, Eye } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { format } from 'date-fns';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [sel, setSel] = useState(null);
  useEffect(() => { (async () => { try { const r = await api.get('/patients'); setPatients(r.data.data); } catch(e){} finally { setLoading(false); } })(); }, []);
  const filtered = patients.filter(p => p.user?.name?.toLowerCase().includes(search.toLowerCase()) || p.user?.email?.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <LoadingSpinner text="Loading patients..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Patients</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>{patients.length} registered</p></div>
      <div style={{ marginBottom:24 }}><div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'10px 16px', maxWidth:400 }}><Search size={18} style={{ color:'var(--text-muted)' }}/><input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:14, fontFamily:'var(--font-family)' }}/></div></div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table"><thead><tr><th>Patient</th><th>Email</th><th>Phone</th><th>Gender</th><th>Blood</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map(p => (
            <tr key={p._id}><td><div style={{ display:'flex', alignItems:'center', gap:12 }}><div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), var(--info))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white' }}>{p.user?.name?.charAt(0)||'P'}</div><span style={{ fontWeight:600 }}>{p.user?.name}</span></div></td>
              <td style={{ color:'var(--text-secondary)' }}>{p.user?.email}</td><td>{p.user?.phone||'—'}</td><td style={{ textTransform:'capitalize' }}>{p.gender||'—'}</td>
              <td><span className="badge badge-danger">{p.bloodGroup||'—'}</span></td><td style={{ color:'var(--text-secondary)' }}>{format(new Date(p.createdAt),'MMM dd, yyyy')}</td>
              <td><button className="btn btn-ghost btn-sm" onClick={()=>setSel(p)}><Eye size={14}/> View</button></td></tr>
          ))}</tbody>
        </table>
        {filtered.length===0 && <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><Users size={48} style={{ marginBottom:16, opacity:0.3 }}/><p>No patients</p></div>}
      </div>
      <Modal isOpen={!!sel} onClose={()=>setSel(null)} title="Patient Details" size="lg">
        {sel && <div style={{ display:'grid', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:'var(--bg-primary)', borderRadius:'var(--radius-md)' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), var(--info))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'white' }}>{sel.user?.name?.charAt(0)}</div>
            <div><h3 style={{ fontSize:18, fontWeight:700 }}>{sel.user?.name}</h3><p style={{ fontSize:13, color:'var(--text-muted)' }}>{sel.user?.email}</p></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[{l:'Phone',v:sel.user?.phone||'—'},{l:'Gender',v:sel.gender||'—'},{l:'Blood Group',v:sel.bloodGroup||'—'},{l:'Date of Birth',v:sel.dateOfBirth?format(new Date(sel.dateOfBirth),'MMM dd, yyyy'):'—'}].map((item,i) => (
              <div key={i}><p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{item.l}</p><p style={{ fontSize:14, fontWeight:500, textTransform:'capitalize' }}>{item.v}</p></div>
            ))}
          </div>
          {sel.emergencyContact?.name && <div style={{ padding:16, background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.1)', borderRadius:'var(--radius-sm)' }}>
            <p style={{ fontSize:11, color:'var(--danger)', textTransform:'uppercase', marginBottom:8, fontWeight:600 }}>Emergency Contact</p>
            <p style={{ fontSize:14, fontWeight:500 }}>{sel.emergencyContact.name} ({sel.emergencyContact.relationship})</p>
            <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{sel.emergencyContact.phone}</p>
          </div>}
        </div>}
      </Modal>
    </div>
  );
};
export default AdminPatients;

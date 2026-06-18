import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]); const [departments, setDepartments] = useState([]); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); const [showModal, setShowModal] = useState(false); const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', specialization:'', qualification:'', experience:'', fees:'', department:'', bio:'', password:'doctor123' });

  useEffect(() => { fetchDoctors(); fetchDepartments(); }, []);
  const fetchDoctors = async () => { try { const r = await api.get('/doctors'); setDoctors(r.data.data); } catch(e){} finally { setLoading(false); } };
  const fetchDepartments = async () => { try { const r = await api.get('/departments'); setDepartments(r.data.data); } catch(e){} };
  const handleSubmit = async (e) => { e?.preventDefault(); try { if(editingDoctor) { await api.put(`/doctors/${editingDoctor._id}`, formData); toast.success('Updated'); } else { await api.post('/doctors', formData); toast.success('Added'); } setShowModal(false); resetForm(); fetchDoctors(); } catch(e) { toast.error(e.response?.data?.message||'Failed'); } };
  const handleDelete = async (id) => { if(!confirm('Remove this doctor?')) return; try { await api.delete(`/doctors/${id}`); toast.success('Removed'); fetchDoctors(); } catch(e) { toast.error('Failed'); } };
  const openEdit = (d) => { setEditingDoctor(d); setFormData({ name:d.user?.name||'', email:d.user?.email||'', phone:d.user?.phone||'', specialization:d.specialization, qualification:d.qualification, experience:d.experience, fees:d.fees, department:d.department?._id||'', bio:d.bio||'', password:'' }); setShowModal(true); };
  const resetForm = () => { setEditingDoctor(null); setFormData({ name:'', email:'', phone:'', specialization:'', qualification:'', experience:'', fees:'', department:'', bio:'', password:'doctor123' }); };
  const filtered = doctors.filter(d => d.user?.name?.toLowerCase().includes(search.toLowerCase()) || d.specialization?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner text="Loading doctors..." />;

  return (
    <div className="animate-fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Doctors</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>{doctors.length} total</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}><Plus size={18}/> Add Doctor</button>
      </div>
      <div style={{ marginBottom:24 }}><div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'10px 16px', maxWidth:400 }}>
        <Search size={18} style={{ color:'var(--text-muted)' }}/><input type="text" placeholder="Search doctors..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text-primary)', fontSize:14, fontFamily:'var(--font-family)' }}/>
      </div></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
        {filtered.map(d => (
          <div key={d._id} className="glass-card" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary), var(--secondary))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'white', flexShrink:0 }}>{d.user?.name?.charAt(0)||'D'}</div>
              <div style={{ flex:1, minWidth:0 }}><h3 style={{ fontSize:16, fontWeight:700 }}>{d.user?.name}</h3><p style={{ fontSize:13, color:'var(--primary-light)' }}>{d.specialization}</p></div>
              <span className={`badge ${d.status==='active'?'badge-success':'badge-danger'}`}>{d.status}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[{l:'Department',v:d.department?.name||'N/A'},{l:'Experience',v:`${d.experience} years`},{l:'Qualification',v:d.qualification},{l:'Fees',v:`₹${d.fees}`}].map((item,i) => (
                <div key={i}><p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{item.l}</p><p style={{ fontSize:13, fontWeight:500 }}>{item.v}</p></div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}><button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={()=>openEdit(d)}><Edit size={14}/> Edit</button><button className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} onClick={()=>handleDelete(d._id)}><Trash2 size={14}/></button></div>
          </div>
        ))}
      </div>
      {filtered.length===0 && <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><Stethoscope size={48} style={{ marginBottom:16, opacity:0.3 }}/><p>No doctors found</p></div>}
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editingDoctor?'Edit Doctor':'Add New Doctor'} size="lg"
        footer={<><button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit}>{editingDoctor?'Update':'Add Doctor'}</button></>}>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[{l:'Full Name',n:'name',t:'text',r:true},{l:'Email',n:'email',t:'email',r:true,dis:!!editingDoctor},{l:'Phone',n:'phone',t:'text'},{l:'Specialization',n:'specialization',t:'text',r:true},{l:'Qualification',n:'qualification',t:'text',r:true},{l:'Experience (yrs)',n:'experience',t:'number',r:true},{l:'Fee (₹)',n:'fees',t:'number',r:true}].map((f,i) => (
              <div key={i} className="form-group"><label className="form-label">{f.l}</label><input className="form-input" type={f.t||'text'} value={formData[f.n]} onChange={e=>setFormData({...formData,[f.n]:e.target.value})} required={f.r} disabled={f.dis}/></div>
            ))}
            <div className="form-group"><label className="form-label">Department</label><select className="form-select" value={formData.department} onChange={e=>setFormData({...formData,department:e.target.value})} required><option value="">Select</option>{departments.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          </div>
          <div className="form-group" style={{ marginTop:16 }}><label className="form-label">Bio</label><textarea className="form-textarea" value={formData.bio} onChange={e=>setFormData({...formData,bio:e.target.value})} placeholder="Brief description..."/></div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminDoctors;

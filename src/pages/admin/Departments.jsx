import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]); const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false); const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name:'', description:'', icon:'🏥' });
  const icons = ['🏥','❤️','🧠','🦴','👶','🧴','👁️','👂','🫁','🦷','💊','🩺'];
  useEffect(() => { fetchDepts(); }, []);
  const fetchDepts = async () => { try { const r = await api.get('/departments'); setDepartments(r.data.data); } catch(e){} finally { setLoading(false); } };
  const handleSubmit = async (e) => { e?.preventDefault(); try { if(editing) { await api.put(`/departments/${editing._id}`, formData); toast.success('Updated'); } else { await api.post('/departments', formData); toast.success('Created'); } setShowModal(false); setEditing(null); setFormData({ name:'', description:'', icon:'🏥' }); fetchDepts(); } catch(e) { toast.error(e.response?.data?.message||'Failed'); } };
  const handleDelete = async (id) => { if(!confirm('Are you sure?')) return; try { await api.delete(`/departments/${id}`); toast.success('Deactivated'); fetchDepts(); } catch(e) { toast.error('Failed'); } };
  if (loading) return <LoadingSpinner text="Loading departments..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Departments</h1><p style={{ color:'var(--text-muted)', fontSize:14 }}>Manage hospital departments</p></div>
        <button className="btn btn-primary" onClick={()=>{ setEditing(null); setFormData({ name:'', description:'', icon:'🏥' }); setShowModal(true); }}><Plus size={18}/> Add Department</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
        {departments.map(d => (
          <div key={d._id} className="glass-card" style={{ padding:28, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>{d.icon}</div><h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{d.name}</h3>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:16, lineHeight:1.5 }}>{d.description||'No description'}</p>
            <div style={{ display:'flex', justifyContent:'center', gap:8 }}><button className="btn btn-ghost btn-sm" onClick={()=>{ setEditing(d); setFormData({ name:d.name, description:d.description||'', icon:d.icon||'🏥' }); setShowModal(true); }}><Edit size={14}/> Edit</button><button className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} onClick={()=>handleDelete(d._id)}><Trash2 size={14}/></button></div>
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Department':'Add Department'}
        footer={<><button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit}>{editing?'Update':'Create'}</button></>}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom:16 }}><label className="form-label">Icon</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{icons.map(icon => (
              <button key={icon} type="button" onClick={()=>setFormData({...formData,icon})} style={{ width:44, height:44, fontSize:22, borderRadius:'var(--radius-sm)', border:formData.icon===icon?'2px solid var(--primary)':'1px solid var(--border)', background:formData.icon===icon?'rgba(14,165,233,0.1)':'var(--bg-primary)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</button>
            ))}</div>
          </div>
          <div className="form-group" style={{ marginBottom:16 }}><label className="form-label">Name</label><input className="form-input" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})}/></div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminDepartments;

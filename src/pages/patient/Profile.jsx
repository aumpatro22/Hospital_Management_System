import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { user } = useAuth(); const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name:'', phone:'', dateOfBirth:'', gender:'', bloodGroup:'', street:'', city:'', state:'', zipCode:'', emergencyName:'', emergencyRelationship:'', emergencyPhone:'' });
  useEffect(() => { (async () => { try { const r = await api.get('/patients/me'); const p=r.data.data; setProfile(p); setFormData({ name:p.user?.name||'', phone:p.user?.phone||'', dateOfBirth:p.dateOfBirth?new Date(p.dateOfBirth).toISOString().split('T')[0]:'', gender:p.gender||'', bloodGroup:p.bloodGroup||'', street:p.address?.street||'', city:p.address?.city||'', state:p.address?.state||'', zipCode:p.address?.zipCode||'', emergencyName:p.emergencyContact?.name||'', emergencyRelationship:p.emergencyContact?.relationship||'', emergencyPhone:p.emergencyContact?.phone||'' }); } catch(e){} finally { setLoading(false); } })(); }, []);
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await api.put(`/patients/${profile._id}`,{ name:formData.name, phone:formData.phone, dateOfBirth:formData.dateOfBirth, gender:formData.gender, bloodGroup:formData.bloodGroup, address:{street:formData.street,city:formData.city,state:formData.state,zipCode:formData.zipCode}, emergencyContact:{name:formData.emergencyName,relationship:formData.emergencyRelationship,phone:formData.emergencyPhone} }); toast.success('Updated'); } catch(e) { toast.error('Failed'); } finally { setSaving(false); } };
  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});
  if (loading) return <LoadingSpinner text="Loading profile..." />;
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom:32 }}><h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>My Profile</h1></div>
      <div className="glass-card" style={{ padding:32, maxWidth:700 }}>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:32 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg, var(--primary), var(--secondary))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'white' }}>{formData.name?.charAt(0)?.toUpperCase()||'P'}</div>
          <div><h2 style={{ fontSize:22, fontWeight:700 }}>{formData.name}</h2><p style={{ fontSize:14, color:'var(--text-muted)' }}>{user?.email}</p></div>
        </div>
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Personal Information</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
            <div className="form-group"><label className="form-label">Name</label><input name="name" className="form-input" value={formData.name} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">Phone</label><input name="phone" className="form-input" value={formData.phone} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">DOB</label><input name="dateOfBirth" type="date" className="form-input" value={formData.dateOfBirth} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">Gender</label><select name="gender" className="form-select" value={formData.gender} onChange={handleChange}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div className="form-group"><label className="form-label">Blood Group</label><select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg=><option key={bg} value={bg}>{bg}</option>)}</select></div>
          </div>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Address</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
            <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Street</label><input name="street" className="form-input" value={formData.street} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">City</label><input name="city" className="form-input" value={formData.city} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">State</label><input name="state" className="form-input" value={formData.state} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">ZIP</label><input name="zipCode" className="form-input" value={formData.zipCode} onChange={handleChange}/></div>
          </div>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--danger)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Emergency Contact</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:28 }}>
            <div className="form-group"><label className="form-label">Name</label><input name="emergencyName" className="form-input" value={formData.emergencyName} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">Relation</label><input name="emergencyRelationship" className="form-input" value={formData.emergencyRelationship} onChange={handleChange}/></div>
            <div className="form-group"><label className="form-label">Phone</label><input name="emergencyPhone" className="form-input" value={formData.emergencyPhone} onChange={handleChange}/></div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving?<div className="spinner" style={{width:20,height:20,borderWidth:2}}/>:<><Save size={18}/> Save Changes</>}</button>
        </form>
      </div>
    </div>
  );
};
export default PatientProfile;

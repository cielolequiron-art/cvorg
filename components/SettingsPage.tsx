import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Database, 
  Smartphone, 
  Mail, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Lock,
  UserPlus,
  Users,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    supabase_url: 'https://xyz.supabase.co',
    supabase_service_role: '••••••••••••••••••••••••••••••••',
    twilio_sid: 'ACxxxxxxxxxxxxxxxxxxxxxxxx',
    twilio_token: '••••••••••••••••••••••••••••••••',
    resend_key: 're_xxxxxxxxxxxxxxxxxxxxxxxx'
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@cjcarrental.com', role: 'Super Admin' },
    { id: 2, name: 'Support Agent', email: 'support@cjcarrental.com', role: 'Agent' }
  ]);

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newUser = {
      id: Date.now(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string
    };
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 mt-1">Manage API integrations, users, and secure credentials.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">User Management</h3>
                <p className="text-xs text-slate-500">Add and manage administrative users</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <UserPlus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button 
                          onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Key className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Admin Credentials</h3>
              <p className="text-xs text-slate-500">Update your login email and password</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput label="Admin Email" value="admin@cjcarrental.com" onChange={() => {}} />
            <SettingInput label="New Password" value="" isSecret showSecret={showSecrets['pass']} onToggleSecret={() => toggleSecret('pass')} onChange={() => {}} />
            <SettingInput label="Confirm Password" value="" isSecret showSecret={showSecrets['pass-confirm']} onToggleSecret={() => toggleSecret('pass-confirm')} onChange={() => {}} />
          </div>
        </section>
        {/* Supabase Config */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Database className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Supabase Infrastructure</h3>
              <p className="text-xs text-slate-500">Database and Authentication</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput 
              label="Project URL" 
              value={settings.supabase_url} 
              onChange={(v) => setSettings({...settings, supabase_url: v})} 
            />
            <SettingInput 
              label="Service Role Key" 
              value={settings.supabase_service_role} 
              isSecret 
              showSecret={showSecrets['supabase']}
              onToggleSecret={() => toggleSecret('supabase')}
              onChange={(v) => setSettings({...settings, supabase_service_role: v})} 
            />
          </div>
        </section>

        {/* Twilio Config */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Twilio SMS</h3>
              <p className="text-xs text-slate-500">Automated SMS Notifications</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput 
              label="Account SID" 
              value={settings.twilio_sid} 
              onChange={(v) => setSettings({...settings, twilio_sid: v})} 
            />
            <SettingInput 
              label="Auth Token" 
              value={settings.twilio_token} 
              isSecret 
              showSecret={showSecrets['twilio']}
              onToggleSecret={() => toggleSecret('twilio')}
              onChange={(v) => setSettings({...settings, twilio_token: v})} 
            />
          </div>
        </section>

        {/* Resend Config */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Resend Email</h3>
              <p className="text-xs text-slate-500">Transactional Email Service</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput 
              label="API Key" 
              value={settings.resend_key} 
              isSecret 
              showSecret={showSecrets['resend']}
              onToggleSecret={() => toggleSecret('resend')}
              onChange={(v) => setSettings({...settings, resend_key: v})} 
            />
          </div>
        </section>

        {/* Security Info */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl">Security Protocol</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              All API keys are stored in a dedicated <b>PostgreSQL</b> table with <b>AES-256 encryption</b>. Access is restricted to service-role level operations only.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
              <Lock className="w-4 h-4" /> End-to-End Encrypted
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-10">
            <Shield className="w-48 h-48" />
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Add New User</h3>
                <button onClick={() => setShowAddUser(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</label>
                  <select 
                    name="role"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold appearance-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                  Create User Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingInput = ({ label, value, onChange, isSecret, showSecret, onToggleSecret }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <input 
        type={isSecret && !showSecret ? 'password' : 'text'} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-mono text-sm"
      />
      {isSecret && (
        <button 
          onClick={onToggleSecret}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-lg transition-all"
        >
          {showSecret ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
        </button>
      )}
    </div>
  </div>
);

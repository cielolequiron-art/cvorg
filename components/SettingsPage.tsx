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
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    supabase_url: 'https://xyz.supabase.co',
    supabase_service_role: '••••••••••••••••••••••••••••••••',
    twilio_sid: 'ACxxxxxxxxxxxxxxxxxxxxxxxx',
    twilio_token: '••••••••••••••••••••••••••••••••',
    resend_key: 're_xxxxxxxxxxxxxxxxxxxxxxxx'
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-slate-500 mt-1">Manage API integrations and secure credentials.</p>
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

      <div className="grid grid-cols-2 gap-8">
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

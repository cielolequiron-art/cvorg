import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Save, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Bot,
  MessageSquare,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppSettings } from '../types';

export const AISettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    supabase_url: '',
    supabase_service_role: '',
    twilio_sid: '',
    twilio_token: '',
    resend_key: '',
    gemini_api_key: '••••••••••••••••••••••••••••••••',
    openai_api_key: ''
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
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Intelligence Settings</h2>
          <p className="text-slate-500 mt-1">Configure the brains behind your automated rental operations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : saved ? 'Saved' : 'Save AI Config'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Gemini Config */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Google Gemini AI</h3>
              <p className="text-xs text-slate-500">Primary reasoning & analysis engine</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput 
              label="Gemini API Key" 
              value={settings.gemini_api_key} 
              isSecret 
              showSecret={showSecrets['gemini']}
              onToggleSecret={() => toggleSecret('gemini')}
              onChange={(v: string) => setSettings({...settings, gemini_api_key: v})} 
            />
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">
                Used for: Driver risk forensic analysis, automated SMS drafting, and document verification assistance.
              </p>
            </div>
          </div>
        </section>

        {/* OpenAI Config */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Brain className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">OpenAI (GPT-4)</h3>
              <p className="text-xs text-slate-500">Secondary fallback & complex reasoning</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <SettingInput 
              label="OpenAI API Key" 
              value={settings.openai_api_key || ''} 
              isSecret 
              showSecret={showSecrets['openai']}
              onToggleSecret={() => toggleSecret('openai')}
              onChange={(v: string) => setSettings({...settings, openai_api_key: v})} 
            />
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">
                Used for: Complex legal document parsing and advanced customer sentiment analysis.
              </p>
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <div className="col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-3 gap-12">
            <CapabilityItem 
              icon={ShieldCheck} 
              title="Forensic Analysis" 
              desc="AI automatically flags high-risk applications based on historical data and document integrity."
            />
            <CapabilityItem 
              icon={MessageSquare} 
              title="Smart CRM" 
              desc="Drafts personalized follow-ups that match the user's specific application context and tone."
            />
            <CapabilityItem 
              icon={Zap} 
              title="Auto-Pilot" 
              desc="Automatically approves low-risk applications that meet 100% of your defined criteria."
            />
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-5">
            <Cpu className="w-96 h-96" />
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

const CapabilityItem = ({ icon: Icon, title, desc }: any) => (
  <div className="space-y-4">
    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-indigo-400" />
    </div>
    <h4 className="font-bold text-xl">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

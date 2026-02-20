import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Send, 
  Mail, 
  MessageSquare, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Campaign } from '../types';

interface CampaignManagerProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Partial<Campaign>) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, onAddCampaign }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Campaign Manager</h2>
          <p className="text-slate-500 mt-1">Schedule automated follow-ups and marketing blasts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Scheduled Campaigns</h3>
          {campaigns.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No campaigns scheduled yet.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Start your first campaign
              </button>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <motion.div 
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    campaign.channel === 'email' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {campaign.channel === 'email' ? <Mail className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{campaign.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" /> {new Date(campaign.target_datetime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" /> {new Date(campaign.target_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    campaign.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                    campaign.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {campaign.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Campaign Assistant</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Based on your current data, a <b>"Re-engagement SMS"</b> for incomplete applications could increase conversion by <b>24%</b>.
            </p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
              Generate Campaign <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" /> Audience Segments
            </h3>
            <div className="space-y-3">
              <SegmentItem label="Incomplete Apps" count={12} color="amber" />
              <SegmentItem label="High-Risk Drivers" count={5} color="rose" />
              <SegmentItem label="Repeat Customers" count={48} color="emerald" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Campaign Modal (Simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 bg-slate-50 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">New Campaign</h3>
              <p className="text-slate-500 text-sm">Configure your automated message blast.</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign Name</label>
                <input type="text" placeholder="e.g., Weekend Special Blast" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channel</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all">
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Date</label>
                  <input type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Template</label>
                <textarea rows={4} placeholder="Write your message here..." className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all resize-none" />
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onAddCampaign({ name: 'New Campaign', channel: 'sms', status: 'scheduled', target_datetime: new Date().toISOString() });
                  setShowAddModal(false);
                }}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
              >
                Schedule
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const SegmentItem = ({ label, count, color }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
    <span className="text-xs font-bold text-slate-600">{label}</span>
    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold text-white ${
      color === 'amber' ? 'bg-amber-500' : color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
    }`}>
      {count} users
    </span>
  </div>
);

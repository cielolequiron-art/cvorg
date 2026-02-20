import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Maximize2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  UserCheck,
  Scan,
  Fingerprint,
  Upload,
  FileUp,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission } from '../types';

interface IDAnalystProps {
  submissions: Submission[];
}

export const IDAnalyst: React.FC<IDAnalystProps> = ({ submissions }) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const pendingAnalyses = submissions.filter(s => s.completion_status === 'complete');

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Forensic ID Analyst</h2>
            <p className="text-slate-500 mt-1">Manual verification of identity documents and biometric matches.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">{pendingAnalyses.length} Pending Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-1/3 border-r border-slate-200 overflow-auto p-6 space-y-4">
          {pendingAnalyses.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSub(sub)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedSub?.id === sub.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{sub.form_data.fullName}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  selectedSub?.id === sub.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {sub.id.slice(0, 8)}
                </span>
              </div>
              <p className={`text-xs ${selectedSub?.id === sub.id ? 'text-blue-100' : 'text-slate-500'}`}>
                Submitted {new Date(sub.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto mb-8 flex gap-4">
            <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <FileUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Manual ID Upload</h4>
                  <p className="text-xs text-slate-500">Upload a document for forensic analysis without a submission.</p>
                </div>
              </div>
              <label className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Document
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          {selectedSub ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {/* ID Documents */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Scan className="w-4 h-4 text-blue-500" /> Document Verification
                  </h3>
                  
                  <div className="space-y-4">
                    <DocumentCard 
                      label="License Front" 
                      onZoom={() => setZoomImage('License Front')}
                    />
                    <DocumentCard 
                      label="License Back" 
                      onZoom={() => setZoomImage('License Back')}
                    />
                  </div>
                </div>

                {/* Biometrics */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" /> Biometric Match
                  </h3>
                  
                  <div className="aspect-square bg-slate-200 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                    <span className="text-slate-400 font-medium">Selfie Comparison</span>
                    <button 
                      onClick={() => setZoomImage('Selfie')}
                      className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <Maximize2 className="w-8 h-8 text-white" />
                    </button>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">AI Confidence Score</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-800">98.4%</p>
                    <p className="text-xs text-emerald-600 mt-1">High probability of biometric match between ID and Selfie.</p>
                  </div>
                </div>
              </div>

              {/* Analysis Checklist */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Analyst Checklist</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ChecklistItem label="Name matches ID exactly" />
                  <ChecklistItem label="DOB matches ID exactly" />
                  <ChecklistItem label="License is not expired" />
                  <ChecklistItem label="No signs of digital tampering" />
                  <ChecklistItem label="Selfie matches ID photo" />
                  <ChecklistItem label="Address matches proof of residence" />
                </div>
                
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Confirm Identity
                  </button>
                  <button className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Flag for Review
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Fingerprint className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">Select a submission to begin forensic analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-12 cursor-zoom-out"
          >
            <div className="max-w-5xl w-full aspect-video bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center relative">
              <p className="absolute top-8 left-8 text-white font-bold text-xl">{zoomImage}</p>
              <span className="text-slate-500 font-mono">ENHANCED IMAGE VIEW PLACEHOLDER</span>
              <div className="absolute bottom-8 right-8 flex gap-4">
                <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all">
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocumentCard = ({ label, onZoom }: any) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="aspect-video bg-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
      <span className="text-slate-400 font-medium">No Document</span>
      <button 
        onClick={onZoom}
        className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <Maximize2 className="w-6 h-6 text-white" />
      </button>
    </div>
  </div>
);

const ChecklistItem = ({ label }: any) => (
  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-all">
    <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500" />
    <span className="text-sm font-semibold text-slate-700">{label}</span>
  </label>
);

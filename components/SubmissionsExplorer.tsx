import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MoreVertical,
  Clock,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronLeft,
  Download,
  FileText,
  Table as TableIcon,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission, SubmissionStatus } from '../types';

interface SubmissionsExplorerProps {
  submissions: Submission[];
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
}

export const SubmissionsExplorer: React.FC<SubmissionsExplorerProps> = ({ submissions, onUpdateStatus }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubmissions = submissions.filter(s => 
    s.form_data.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Submissions Explorer</h2>
            <p className="text-slate-500 mt-1">Manage and review all incoming rental applications.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
              <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-600" title="Export CSV">
                <FileText className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-600" title="Export Excel">
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-600" title="Export PDF">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-600" title="Sync Google Sheets">
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search applicants..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total', value: submissions.length, color: 'blue' },
            { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: 'amber' },
            { label: 'Approved', value: submissions.filter(s => s.status === 'approved').length, color: 'emerald' },
            { label: 'Rejected', value: submissions.filter(s => s.status === 'rejected').length, color: 'rose' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <tr 
                  key={sub.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedSubmission(sub)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {sub.form_data.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{sub.form_data.fullName}</p>
                        <p className="text-xs text-slate-500">{sub.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {sub.status === 'pending' && <Clock className="w-3 h-3" />}
                      {sub.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {sub.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className={`h-full transition-all duration-500 ${sub.completion_status === 'complete' ? 'bg-blue-500' : 'bg-slate-400'}`}
                          style={{ width: `${(sub.last_step_reached / 8) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">Step {sub.last_step_reached}/8</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(sub.id, 'approved'); }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(sub.id, 'rejected'); }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedSubmission(null)}
                    className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">ID: {selectedSubmission.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onUpdateStatus(selectedSubmission.id, 'approved')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(selectedSubmission.id, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-8 space-y-8">
                {/* AI Assistant Quick Action */}
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-indigo-200" />
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">AI Forensic Assistant</span>
                    </div>
                    <h4 className="text-lg font-bold mb-4">Analyze Risk & Draft Response</h4>
                    <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Run Gemini Analysis
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                  </div>
                </div>

                {/* Forensic Image Viewer */}
                <section>
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" /> Forensic Image Review
                  </h5>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'License Front', key: 'licenseFront' },
                      { label: 'License Back', key: 'licenseBack' },
                      { label: 'Selfie', key: 'selfie' },
                    ].map((img) => (
                      <div key={img.label} className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{img.label}</p>
                        <div className="aspect-[3/4] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative cursor-zoom-in">
                          <span className="text-xs text-slate-400 font-medium">No Image</span>
                          {/* In a real app, src would be the URL from Supabase Storage */}
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Personal Info */}
                <section className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" /> Personal Info
                    </h5>
                    <div className="space-y-3">
                      <InfoItem icon={User} label="Full Name" value={selectedSubmission.form_data.fullName} />
                      <InfoItem icon={Calendar} label="DOB" value={selectedSubmission.form_data.dob} />
                      <InfoItem icon={Mail} label="Email" value={selectedSubmission.user_email} />
                      <InfoItem icon={Phone} label="Phone" value={selectedSubmission.user_phone} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> Risk Factors
                    </h5>
                    <div className="space-y-3">
                      <RiskItem label="Accidents" value={selectedSubmission.form_data.historyAccidents} />
                      <RiskItem label="DUI History" value={selectedSubmission.form_data.historyDUI} />
                      <RiskItem label="Suspensions" value={selectedSubmission.form_data.historySuspension} />
                    </div>
                  </div>
                </section>

                {/* Signature */}
                <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Digital Signature</h5>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-serif italic text-slate-800">{selectedSubmission.form_data.signatureName}</p>
                      <p className="text-xs text-slate-400 mt-1">Signed on {selectedSubmission.form_data.signatureDate}</p>
                    </div>
                    {selectedSubmission.form_data.signatureImage && (
                      <img src={selectedSubmission.form_data.signatureImage} alt="Signature" className="h-12 opacity-80" />
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-slate-100 rounded-lg">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value || 'N/A'}</p>
    </div>
  </div>
);

const RiskItem = ({ label, value }: any) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
      value === 'yes' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
    }`}>
      {value || 'No'}
    </span>
  </div>
);

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Table as TableIcon, 
  FileSpreadsheet,
  ChevronRight,
  User,
  Car,
  Shield,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Check,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission, INITIAL_DATA } from '../types';

interface EntriesExplorerProps {
  submissions: Submission[];
}

export const EntriesExplorer: React.FC<EntriesExplorerProps> = ({ submissions }) => {
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions);
  const [selectedEntry, setSelectedEntry] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const filteredEntries = localSubmissions.filter(s => 
    s.form_data.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setLocalSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedEntry(null);
    }
  };

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    setLocalSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selectedEntry?.id === id) {
      setSelectedEntry(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Submission = {
      id: `man_${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'pending',
      completion_status: 'complete',
      last_step_reached: 8,
      user_email: (e.target as any).email.value,
      user_phone: (e.target as any).phone.value,
      form_data: { 
        ...INITIAL_DATA, 
        fullName: (e.target as any).fullName.value,
        carRequested: (e.target as any).carRequested.value
      }
    };
    setLocalSubmissions([newEntry, ...localSubmissions]);
    setShowManualAdd(false);
  };

  const updateSelectedEntry = (field: string, value: any, isFormData = true) => {
    if (!selectedEntry) return;
    const updated = { ...selectedEntry };
    if (isFormData) {
      updated.form_data = { ...updated.form_data, [field]: value };
    } else {
      (updated as any)[field] = value;
    }
    setSelectedEntry(updated);
    setLocalSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Form Entries</h2>
            <p className="text-slate-500 mt-1">Comprehensive view of all data captured from the frontend.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowManualAdd(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 mr-4"
            >
              <Plus className="w-5 h-5" /> Add Entry
            </button>
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
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search entries..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Car Requested</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rental Dates</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{entry.form_data.fullName}</p>
                      <p className="text-xs text-slate-500">{entry.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                    {entry.form_data.carRequested}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {entry.form_data.startDate} to {entry.form_data.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {entry.form_data.usageType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      <AnimatePresence>
        {showManualAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Add Manual Entry</h3>
                <button onClick={() => setShowManualAdd(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleManualAdd} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    name="fullName"
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                    <input 
                      name="phone"
                      type="tel" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Car Requested</label>
                  <input 
                    name="carRequested"
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold"
                    placeholder="e.g. Ford Fusion 2014"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                  Create Manual Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-8">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-6xl h-full rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedEntry.form_data.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedEntry.form_data.fullName}</h3>
                    <p className="text-slate-500 text-sm">Application ID: {selectedEntry.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 mr-4">
                    <button 
                      onClick={() => handleStatusUpdate(selectedEntry.id, 'approved')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                        selectedEntry.status === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedEntry.id, 'rejected')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                        selectedEntry.status === 'rejected' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    title="Edit Entry"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedEntry.id)}
                    className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="p-3 hover:bg-slate-200 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-10 grid grid-cols-3 gap-10">
                {/* Column 1: Personal & License */}
                <div className="space-y-10">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" /> Personal Information
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Full Name" value={selectedEntry.form_data.fullName} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('fullName', v)} />
                      <DetailField label="Date of Birth" value={selectedEntry.form_data.dob} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('dob', v)} />
                      <DetailField label="Phone" value={selectedEntry.form_data.phone} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('phone', v)} />
                      <DetailField label="Email" value={selectedEntry.user_email} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('user_email', v, false)} />
                      <DetailField label="Address" value={selectedEntry.form_data.address} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('address', v)} />
                      <div className="pt-4 border-t border-slate-100">
                        <DetailField label="Emergency Contact" value={selectedEntry.form_data.emergencyName} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('emergencyName', v)} />
                        <DetailField label="Emergency Phone" value={selectedEntry.form_data.emergencyPhone} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('emergencyPhone', v)} />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-500" /> License Details
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="License Number" value={selectedEntry.form_data.licenseNumber} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('licenseNumber', v)} />
                      <DetailField label="State" value={selectedEntry.form_data.licenseState} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('licenseState', v)} />
                      <DetailField label="Expiration" value={selectedEntry.form_data.licenseExpiration} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('licenseExpiration', v)} />
                    </div>
                  </section>
                </div>

                {/* Column 2: Rental & Insurance */}
                <div className="space-y-10">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Car className="w-4 h-4 text-emerald-500" /> Rental Details
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Vehicle Requested" value={selectedEntry.form_data.carRequested} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('carRequested', v)} />
                      <DetailField label="Start Date" value={selectedEntry.form_data.startDate} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('startDate', v)} />
                      <DetailField label="End Date" value={selectedEntry.form_data.endDate} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('endDate', v)} />
                      <DetailField label="Usage Type" value={selectedEntry.form_data.usageType} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('usageType', v)} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" /> Insurance
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Has Insurance?" value={selectedEntry.form_data.hasInsurance} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('hasInsurance', v)} />
                      {selectedEntry.form_data.hasInsurance === 'yes' && (
                        <>
                          <DetailField label="Company" value={selectedEntry.form_data.insuranceCompany} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('insuranceCompany', v)} />
                          <DetailField label="Policy #" value={selectedEntry.form_data.policyNumber} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('policyNumber', v)} />
                        </>
                      )}
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        {selectedEntry.form_data.insuranceAgreement ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                        Insurance Agreement Accepted
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-500" /> Payment
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Method" value={selectedEntry.form_data.paymentMethod} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('paymentMethod', v)} />
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        {selectedEntry.form_data.depositAgreement ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                        Deposit Agreement Accepted
                      </div>
                    </div>
                  </section>
                </div>

                {/* Column 3: History & Rules */}
                <div className="space-y-10">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" /> History & Screening
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Accidents" value={selectedEntry.form_data.historyAccidents} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('historyAccidents', v)} />
                      <DetailField label="DUI" value={selectedEntry.form_data.historyDUI} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('historyDUI', v)} />
                      <DetailField label="Suspension" value={selectedEntry.form_data.historySuspension} isEditing={isEditing} onChange={(v: any) => updateSelectedEntry('historySuspension', v)} />
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        {selectedEntry.form_data.screeningConsent ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                        Screening Consent Provided
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Rental Rules Accepted</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <RuleBadge label="No Smoking" active={selectedEntry.form_data.ruleSmoking} />
                      <RuleBadge label="No Racing" active={selectedEntry.form_data.ruleRacing} />
                      <RuleBadge label="No Crossing" active={selectedEntry.form_data.ruleCrossing} />
                      <RuleBadge label="No Sub-Rent" active={selectedEntry.form_data.ruleSubRent} />
                      <RuleBadge label="Mileage Limit" active={selectedEntry.form_data.ruleMileage} />
                      <RuleBadge label="Fuel Policy" active={selectedEntry.form_data.ruleFuel} />
                      <RuleBadge label="Report Issues" active={selectedEntry.form_data.ruleReport} />
                    </div>
                  </section>

                  <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Final Signature</h4>
                    <div className="space-y-4">
                      <p className="text-xl font-serif italic text-slate-800 border-b border-slate-200 pb-2">{selectedEntry.form_data.signatureName}</p>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                        <span>Date: {selectedEntry.form_data.signatureDate}</span>
                        <span>Consent: {selectedEntry.form_data.finalConsent ? 'YES' : 'NO'}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailField = ({ label, value, isEditing, onChange }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    {isEditing ? (
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:border-blue-500 outline-none"
      />
    ) : (
      <p className="text-sm font-semibold text-slate-700">{value || 'Not Provided'}</p>
    )}
  </div>
);

const RuleBadge = ({ label, active }: any) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
    active ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'
  }`}>
    {active ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
    {label}
  </div>
);

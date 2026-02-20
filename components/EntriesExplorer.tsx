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
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Submission } from '../types';

interface EntriesExplorerProps {
  submissions: Submission[];
}

export const EntriesExplorer: React.FC<EntriesExplorerProps> = ({ submissions }) => {
  const [selectedEntry, setSelectedEntry] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = submissions.filter(s => 
    s.form_data.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="p-3 hover:bg-slate-200 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-10 grid grid-cols-3 gap-10">
                {/* Column 1: Personal & License */}
                <div className="space-y-10">
                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" /> Personal Information
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Full Name" value={selectedEntry.form_data.fullName} />
                      <DetailField label="Date of Birth" value={selectedEntry.form_data.dob} />
                      <DetailField label="Phone" value={selectedEntry.form_data.phone} />
                      <DetailField label="Email" value={selectedEntry.user_email} />
                      <DetailField label="Address" value={`${selectedEntry.form_data.address}, ${selectedEntry.form_data.city}, ${selectedEntry.form_data.state} ${selectedEntry.form_data.zip}`} />
                      <div className="pt-4 border-t border-slate-100">
                        <DetailField label="Emergency Contact" value={selectedEntry.form_data.emergencyName} />
                        <DetailField label="Emergency Phone" value={selectedEntry.form_data.emergencyPhone} />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-500" /> License Details
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="License Number" value={selectedEntry.form_data.licenseNumber} />
                      <DetailField label="State" value={selectedEntry.form_data.licenseState} />
                      <DetailField label="Expiration" value={selectedEntry.form_data.licenseExpiration} />
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
                      <DetailField label="Vehicle Requested" value={selectedEntry.form_data.carRequested} />
                      <DetailField label="Start Date" value={selectedEntry.form_data.startDate} />
                      <DetailField label="End Date" value={selectedEntry.form_data.endDate} />
                      <DetailField label="Usage Type" value={selectedEntry.form_data.usageType} />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" /> Insurance
                    </h4>
                    <div className="space-y-4">
                      <DetailField label="Has Insurance?" value={selectedEntry.form_data.hasInsurance} />
                      {selectedEntry.form_data.hasInsurance === 'yes' && (
                        <>
                          <DetailField label="Company" value={selectedEntry.form_data.insuranceCompany} />
                          <DetailField label="Policy #" value={selectedEntry.form_data.policyNumber} />
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
                      <DetailField label="Method" value={selectedEntry.form_data.paymentMethod} />
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
                      <DetailField label="Accidents" value={selectedEntry.form_data.historyAccidents} />
                      <DetailField label="DUI" value={selectedEntry.form_data.historyDUI} />
                      <DetailField label="Suspension" value={selectedEntry.form_data.historySuspension} />
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

const DetailField = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-700">{value || 'Not Provided'}</p>
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

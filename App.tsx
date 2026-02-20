import React, { useState, useEffect } from 'react';
import { INITIAL_DATA, FormData, Submission, Campaign, SubmissionStatus } from './types';
import { StepWizard } from './components/StepWizard';
import { Input, Select, FileUpload, Checkbox, DateEntry } from './components/InputFields';
import { SignaturePad } from './components/SignaturePad';
import { AddressAutocomplete } from './components/AddressAutocomplete';
import { submitApplication } from './services/submissionService';
import { 
  Car, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  UserCheck, 
  DollarSign, 
  FastForward, 
  Play, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { SubmissionsExplorer } from './components/SubmissionsExplorer';
import { CampaignManager } from './components/CampaignManager';
import { SettingsPage } from './components/SettingsPage';
import { FormBuilder } from './components/FormBuilder';
import { IDAnalyst } from './components/IDAnalyst';
import { AISettings } from './components/AISettings';
import { EntriesExplorer } from './components/EntriesExplorer';
import { VehicleManager } from './components/VehicleManager';
import { SocialMediaManager } from './components/SocialMediaManager';
import { AIChatbot } from './components/AIChatbot';
import { Menu } from 'lucide-react';

const STEPS = [
  "Personal Info",
  "License",
  "Rental",
  "Insurance",
  "Payment",
  "History",
  "Rules",
  "Sign"
];

// Mock Submissions Data
const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    created_at: new Date().toISOString(),
    status: 'pending',
    completion_status: 'complete',
    last_step_reached: 8,
    user_email: 'john.doe@example.com',
    user_phone: '(210) 555-0123',
    form_data: { ...INITIAL_DATA, fullName: 'John Doe', dob: '1990-01-01' }
  },
  {
    id: 'sub_2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
    completion_status: 'complete',
    last_step_reached: 8,
    user_email: 'jane.smith@example.com',
    user_phone: '(210) 555-9876',
    form_data: { ...INITIAL_DATA, fullName: 'Jane Smith', dob: '1985-05-15' }
  },
  {
    id: 'sub_3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    status: 'pending',
    completion_status: 'incomplete',
    last_step_reached: 4,
    user_email: 'mike.jones@example.com',
    user_phone: '(210) 555-4433',
    form_data: { ...INITIAL_DATA, fullName: 'Mike Jones', dob: '1995-11-20' }
  }
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [age, setAge] = useState(0);

  // Calculate deposit and age whenever DOB changes
  useEffect(() => {
    if (formData.dob && formData.dob.includes('-')) {
      const [yearStr] = formData.dob.split('-');
      const birthYear = parseInt(yearStr, 10);
      const currentYear = new Date().getFullYear();
      let calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);
      if (calculatedAge >= 21 && calculatedAge <= 24) setDepositAmount(150);
      else if (calculatedAge >= 25) setDepositAmount(100);
      else setDepositAmount(0);
    } else {
      setAge(0);
      setDepositAmount(0);
    }
  }, [formData.dob]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Automatic 7-day minimum logic for Rental Dates
      if (field === 'startDate' && value) {
        const start = new Date(value);
        const minEnd = new Date(start);
        minEnd.setDate(start.getDate() + 7);
        const minEndStr = minEnd.toISOString().split('T')[0];
        
        // If current end date is empty or less than 7 days from new start, auto-set it
        if (!prev.endDate || new Date(prev.endDate) < minEnd) {
          newData.endDate = minEndStr;
        }
      }
      
      return newData;
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const fillTestData = () => {
    const testData: FormData = {
      ...INITIAL_DATA,
      fullName: 'John Test Driver',
      dob: '1995-05-15',
      phone: '(210) 555-0123',
      email: 'john.test@example.com',
      address: '5072 Timberhill Drive',
      city: 'San Antonio',
      state: 'TX',
      zip: '78238',
      emergencyName: 'Jane Test',
      emergencyPhone: '(210) 555-9876',
      licenseNumber: 'TX99887766',
      licenseState: 'TX',
      licenseExpiration: '2029-12-31',
      carRequested: 'Kia Sportage 2017',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageType: 'rideshare',
      hasInsurance: 'no',
      insuranceAgreement: true,
      paymentMethod: 'zelle',
      depositAgreement: true,
      historyAccidents: 'no',
      historyDUI: 'no',
      historySuspension: 'no',
      screeningConsent: true,
      ruleSmoking: true,
      ruleRacing: true,
      ruleCrossing: true,
      ruleSubRent: true,
      ruleMileage: true,
      ruleFuel: true,
      ruleReport: true,
      signatureName: 'John Test Driver',
      signatureImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      finalConsent: true,
    };
    setFormData(testData);
    setCurrentStep(7); 
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(c => c + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitApplication(formData);
      setSubmitted(true);
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, status: SubmissionStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleAddCampaign = (campaign: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name: campaign.name || 'New Campaign',
      target_datetime: campaign.target_datetime || new Date().toISOString(),
      channel: campaign.channel || 'sms',
      template: campaign.template || '',
      status: 'scheduled'
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
        <AdminSidebar 
          activeTab={activeAdminTab} 
          setActiveTab={setActiveAdminTab} 
          onExit={() => setIsAdmin(false)} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Car className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-sm tracking-tight uppercase">Command</h1>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 overflow-hidden relative">
            {activeAdminTab === 'dashboard' && (
              <div className="p-4 lg:p-8 h-full overflow-auto">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Command Dashboard</h2>
                  <p className="text-slate-500 mt-1">Real-time overview of your rental operations.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-3xl lg:text-4xl font-bold text-slate-900">$12,450</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
                      <ChevronRight className="w-4 h-4 rotate-[-90deg]" /> +12% from last week
                    </div>
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Rentals</p>
                    <p className="text-3xl lg:text-4xl font-bold text-slate-900">24</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-bold">
                      <Car className="w-4 h-4" /> 8 vehicles available
                    </div>
                  </div>
                  <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Reviews</p>
                    <p className="text-3xl lg:text-4xl font-bold text-slate-900">{submissions.filter(s => s.status === 'pending').length}</p>
                    <button 
                      onClick={() => setActiveAdminTab('submissions')}
                      className="mt-4 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      View Submissions
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 text-white relative overflow-hidden">
                  <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 leading-tight">Automate your rental workflow with AI.</h3>
                    <p className="text-slate-400 text-sm lg:text-lg mb-6 lg:mb-8">Gemini analyzes driver risk, drafts personalized responses, and schedules follow-ups so you can focus on scaling.</p>
                    <button className="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3">
                      Launch AI Assistant <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-10 hidden lg:block">
                    <ShieldCheck className="w-96 h-96" />
                  </div>
                </div>
              </div>
            )}
            {activeAdminTab === 'submissions' && (
              <SubmissionsExplorer 
                submissions={submissions} 
                onUpdateStatus={handleUpdateStatus} 
              />
            )}
            {activeAdminTab === 'entries' && (
              <EntriesExplorer submissions={submissions} />
            )}
            {activeAdminTab === 'campaigns' && (
              <CampaignManager 
                campaigns={campaigns} 
                onAddCampaign={handleAddCampaign} 
              />
            )}
            {activeAdminTab === 'id-analyst' && (
              <IDAnalyst submissions={submissions} />
            )}
            {activeAdminTab === 'vehicles' && <VehicleManager />}
            {activeAdminTab === 'social-media' && <SocialMediaManager />}
            {activeAdminTab === 'ai-settings' && <AISettings />}
            {activeAdminTab === 'settings' && <SettingsPage />}
            {activeAdminTab === 'forms' && <FormBuilder />}
          </main>
        </div>

        <AIChatbot />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center animate-fadeIn border border-slate-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Application Submitted!</h2>
          <div className="text-slate-600 mb-10 space-y-6 text-base leading-relaxed">
            <p className="text-xl">Thank you, <span className="font-bold text-slate-950">{formData.fullName || "Valued Customer"}</span>!</p>
            <div className="p-6 bg-blue-50 rounded-2xl text-blue-900 font-medium border border-blue-100 shadow-sm">
              <p className="mb-2">The DJ AUTO RENTAL team will contact you shortly at:</p>
              <span className="block text-2xl font-bold text-blue-600">{formData.phone || "(555) 000-0000"}</span>
              <p className="mt-2 text-xs opacity-75">Your application is being reviewed.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl w-full text-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Calculate minimum allowed end date (7 days from start date)
  const minEndDateValue = formData.startDate ? (() => {
    const d = new Date(formData.startDate);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })() : new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      <header className="bg-slate-900 text-white p-4 md:p-6 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase">DJ Auto Rental</h1>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">Premium Logistics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAdmin(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all border border-slate-700"
            >
              <ShieldAlert size={14} className="text-amber-400" />
              Admin Panel
            </button>
            <button 
              onClick={fillTestData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg transition-all"
            >
              <FastForward size={14} />
              Quick Test Fill
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-4 md:mt-8 px-4">
        <StepWizard 
          steps={STEPS} 
          currentStep={currentStep} 
          onStepClick={(step) => setCurrentStep(step)} 
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 transition-all relative">
          <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-end">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">{STEPS[currentStep]}</h2>
              <p className="text-slate-500 text-xs md:text-sm">Step {currentStep + 1} of 8 — <span className="text-blue-500 font-semibold italic">Navigation Unlocked</span></p>
            </div>
            <div className="text-[10px] md:text-xs text-blue-500 flex items-center gap-1 font-semibold uppercase tracking-tighter">
              <ShieldCheck size={14} />
              Verified Secure
            </div>
          </div>

          <div className="min-h-[350px]">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fadeIn">
                <Input label="Full Legal Name" placeholder="As appears on license" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} />
                <DateEntry label="Date of Birth" value={formData.dob} onChange={val => updateField('dob', val)} />
                <Input label="Phone Number" type="tel" placeholder="(555) 000-0000" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                <Input label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                <div className="md:col-span-2">
                  <AddressAutocomplete label="Street Address" value={formData.address} onChange={(val) => updateField('address', val)} onSelect={(data) => {
                    updateField('address', data.address); updateField('city', data.city); updateField('state', data.state); updateField('zip', data.zip);
                  }} />
                </div>
                <FileUpload 
                  label="Proof of Address" 
                  description="Utility bill, bank statement, or official government mail (last 30 days)."
                  currentFile={formData.proofOfAddress} 
                  onChange={f => updateField('proofOfAddress', f)} 
                />
                <FileUpload 
                  label="Proof of Income" 
                  tooltip="Screenshots must clearly show the platform name, your name, and the weekly pay cycle dates."
                  description="Acceptable proof formats include screenshots of weekly earnings from platforms like DoorDash, Amazon Flex, Uber, or Lyft, ensuring a consistent weekly income."
                  currentFile={formData.proofOfIncome} 
                  onChange={f => updateField('proofOfIncome', f)} 
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="License Number" value={formData.licenseNumber} onChange={e => updateField('licenseNumber', e.target.value)} />
                  <Input label="State of Issue" value={formData.licenseState} onChange={e => updateField('licenseState', e.target.value)} />
                  <Input label="Expiration Date" type="date" value={formData.licenseExpiration} onChange={e => updateField('licenseExpiration', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FileUpload label="License Front" currentFile={formData.licenseFront} onChange={f => updateField('licenseFront', f)} />
                  <FileUpload label="License Back" currentFile={formData.licenseBack} onChange={f => updateField('licenseBack', f)} />
                  <FileUpload label="Selfie holding License" currentFile={formData.selfie} onChange={f => updateField('selfie', f)} />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <Select label="Vehicle Requested" value={formData.carRequested} onChange={e => updateField('carRequested', e.target.value)} options={[
                  { value: 'Ford Fusion 2014 (Black)', label: 'Ford Fusion 2014 (Black)' },
                  { value: 'Kia Sportage 2017', label: 'Kia Sportage 2017' }
                ]} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Input 
                      label="Rental Start Date" 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]} 
                      value={formData.startDate} 
                      onChange={e => updateField('startDate', e.target.value)} 
                    />
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Note: 7-day minimum rental required</p>
                  </div>
                  <div className="space-y-1">
                    <Input 
                      label="Rental End Date" 
                      type="date" 
                      min={minEndDateValue} 
                      value={formData.endDate} 
                      onChange={e => updateField('endDate', e.target.value)} 
                    />
                    <p className="text-[10px] text-slate-400">Must be at least 1 week after start date.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-1">Pickup Location</p>
                    <p className="text-sm font-medium text-slate-800">5072 Timberhill Drive, San Antonio, Texas 78238</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <Select label="Do you have valid auto insurance?" value={formData.hasInsurance} onChange={e => updateField('hasInsurance', e.target.value)} options={[{value:'yes', label:'Yes'}, {value:'no', label:'No'}]} />
                
                {formData.hasInsurance === 'no' && (
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-3 animate-fadeIn">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800 leading-relaxed font-medium">
                      In the event that you do not have active coverage, we will assist you in obtaining the necessary liability insurance. This ensures you remain state-compliant and meet the approval standards for rideshare platforms like Uber and DoorDash.
                    </p>
                  </div>
                )}

                {formData.hasInsurance === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    <Input label="Insurance Company" value={formData.insuranceCompany} onChange={e => updateField('insuranceCompany', e.target.value)} />
                    <Input label="Policy Number" value={formData.policyNumber} onChange={e => updateField('policyNumber', e.target.value)} />
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <Checkbox checked={formData.insuranceAgreement} onChange={e => updateField('insuranceAgreement', e.target.checked)} label="I agree I am responsible for all tickets, tolls, and damages during the rental period." />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn text-center">
                <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl">
                  <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-bold">Security Deposit</p>
                  <p className="text-6xl font-black">${depositAmount}</p>
                  <p className="text-xs text-blue-400 mt-4 font-bold">Age: {age || "--"}</p>
                </div>
                <Select label="Payment Method" value={formData.paymentMethod} onChange={e => updateField('paymentMethod', e.target.value)} options={[
                  {value:'zelle', label:'Zelle'}, 
                  {value:'cash', label:'Cash'},
                  {value:'debit', label:'Debit Card'}
                ]} />
                <Checkbox checked={formData.depositAgreement} onChange={e => updateField('depositAgreement', e.target.checked)} label="I understand the security deposit requirement and return policy." />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <p className="font-bold text-slate-800 mb-2">Mandatory Disclosures:</p>
                {['historyAccidents', 'historyDUI', 'historySuspension'].map(k => (
                  <div key={k} className="flex justify-between items-center p-4 border rounded-2xl bg-white hover:border-blue-200 transition-colors">
                    <span className="text-sm font-semibold capitalize text-slate-700">Any {k.replace('history', '')}?</span>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600"><input type="radio" className="w-4 h-4" checked={formData[k as keyof FormData] === 'yes'} onChange={() => updateField(k as keyof FormData, 'yes')} /> Yes</label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600"><input type="radio" className="w-4 h-4" checked={formData[k as keyof FormData] === 'no'} onChange={() => updateField(k as keyof FormData, 'no')} /> No</label>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Checkbox checked={formData.screeningConsent} onChange={e => updateField('screeningConsent', e.target.checked)} label="I consent to DJ Auto Rental verifying my driving history and background." />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-red-600 font-black flex items-center gap-2 uppercase text-sm"><AlertCircle size={20} /> Strict Vehicle Rules</h3>
                  <button onClick={() => {
                    updateField('ruleSmoking', true); updateField('ruleRacing', true); updateField('ruleCrossing', true);
                    updateField('ruleSubRent', true); updateField('ruleMileage', true); updateField('ruleFuel', true); updateField('ruleReport', true);
                  }} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 font-bold uppercase transition-all">I Accept All Terms</button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Checkbox checked={formData.ruleSmoking} onChange={e => updateField('ruleSmoking', e.target.checked)} label="NO Smoking or Drugs (Strictly Enforced)" />
                  <Checkbox checked={formData.ruleRacing} onChange={e => updateField('ruleRacing', e.target.checked)} label="NO Racing / Reckless Driving" />
                  <Checkbox checked={formData.ruleCrossing} onChange={e => updateField('ruleCrossing', e.target.checked)} label="NO Crossing state lines" />
                  <Checkbox checked={formData.ruleSubRent} onChange={e => updateField('ruleSubRent', e.target.checked)} label="NO Sub-renting" />
                  <Checkbox checked={formData.ruleFuel} onChange={e => updateField('ruleFuel', e.target.checked)} label="Vehicle must be returned with full fuel tank" />
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn">
                <SignaturePad onChange={dataUrl => updateField('signatureImage', dataUrl)} />
                <Input label="Printed Name" placeholder="Full Legal Name" value={formData.signatureName} onChange={e => updateField('signatureName', e.target.value)} />
                <Checkbox checked={formData.finalConsent} onChange={e => updateField('finalConsent', e.target.checked)} label="I confirm all information provided is true and I accept the rental agreement." />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            <button onClick={handleBack} disabled={currentStep === 0 || isSubmitting} className="flex items-center px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30">
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>
            {currentStep === STEPS.length - 1 ? (
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className={`flex items-center px-10 py-3 rounded-2xl font-bold text-white transition-all shadow-lg ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Finalizing Application...</>
                ) : <><Play className="mr-2" size={18} /> Finish & Submit</>}
              </button>
            ) : (
              <button onClick={handleNext} className="flex items-center px-10 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                Continue
                <ChevronRight size={20} className="ml-1" />
              </button>
            )}
          </div>
        </div>
        <p className="text-center mt-8 text-slate-400 text-[10px] uppercase font-bold tracking-widest">&copy; {new Date().getFullYear()} DJ Auto Rental. 5072 Timberhill Drive, San Antonio, TX.</p>
      </main>
    </div>
  );
}
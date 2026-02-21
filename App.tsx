import React, { useState, useEffect } from 'react';
import { INITIAL_DATA, FormData, Submission, Campaign, SubmissionStatus, FormSchema } from './types';
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
import { AdminLogin } from './components/AdminLogin';
import { DEFAULT_SCHEMA } from './constants/defaultSchema';
import { Menu } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [activeSchema, setActiveSchema] = useState<FormSchema>(DEFAULT_SCHEMA);
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
    if (currentStep < activeSchema.schema.steps.length - 1) {
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

  if (showLogin && !isAuthenticated) {
    return (
      <AdminLogin 
        onLogin={(success) => {
          if (success) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setShowLogin(false);
          }
        }} 
        onBack={() => setShowLogin(false)} 
      />
    );
  }

  if (isAdmin && isAuthenticated) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
        <AdminSidebar 
          activeTab={activeAdminTab} 
          setActiveTab={setActiveAdminTab} 
          onExit={() => { setIsAdmin(false); setIsAuthenticated(false); }} 
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
            {activeAdminTab === 'forms' && (
              <FormBuilder 
                activeSchema={activeSchema} 
                onSaveSchema={(schema) => setActiveSchema(schema)} 
              />
            )}
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

  const currentStepData = activeSchema.schema.steps[currentStep];

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
          steps={activeSchema.schema.steps.map(s => s.label)} 
          currentStep={currentStep} 
          onStepClick={(step) => setCurrentStep(step)} 
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 transition-all relative">
          <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-end">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">{currentStepData.label}</h2>
              <p className="text-slate-500 text-xs md:text-sm">Step {currentStep + 1} of {activeSchema.schema.steps.length} — <span className="text-blue-500 font-semibold italic">Navigation Unlocked</span></p>
            </div>
            <div className="text-[10px] md:text-xs text-blue-500 flex items-center gap-1 font-semibold uppercase tracking-tighter">
              <ShieldCheck size={14} />
              Verified Secure
            </div>
          </div>

          <div className="min-h-[350px]">
            <div className={`grid grid-cols-1 md:grid-cols-${currentStepData.gridCols || 1} gap-4 md:gap-6 animate-fadeIn`}>
              {currentStepData.fields.map((field) => {
                // Specialized Components
                if (field.name === 'address') {
                  return (
                    <div key={field.id} className="md:col-span-2">
                      <AddressAutocomplete 
                        label={field.label} 
                        value={formData.address} 
                        onChange={(val) => updateField('address', val)} 
                        onSelect={(data) => {
                          updateField('address', data.address); 
                          updateField('city', data.city); 
                          updateField('state', data.state); 
                          updateField('zip', data.zip);
                        }} 
                      />
                    </div>
                  );
                }

                if (field.name === 'signatureImage') {
                  return <SignaturePad key={field.id} onChange={dataUrl => updateField('signatureImage', dataUrl)} />;
                }

                if (field.type === 'text') {
                  return <Input key={field.id} label={field.label} placeholder={field.placeholder} value={formData[field.name]} onChange={e => updateField(field.name, e.target.value)} />;
                }

                if (field.type === 'date') {
                  return <DateEntry key={field.id} label={field.label} value={formData[field.name]} onChange={val => updateField(field.name, val)} />;
                }

                if (field.type === 'select') {
                  return <Select key={field.id} label={field.label} value={formData[field.name]} onChange={e => updateField(field.name, e.target.value)} options={field.options || []} />;
                }

                if (field.type === 'checkbox') {
                  return <Checkbox key={field.id} checked={formData[field.name]} onChange={e => updateField(field.name, e.target.checked)} label={field.label} />;
                }

                if (field.type === 'file') {
                  return (
                    <FileUpload 
                      key={field.id}
                      label={field.label} 
                      description={field.description}
                      currentFile={formData[field.name]} 
                      onChange={f => updateField(field.name, f)} 
                    />
                  );
                }

                return null;
              })}

              {/* Special Logic for Payment Step */}
              {currentStepData.id === 's5' && (
                <div className="md:col-span-2 p-8 bg-slate-900 rounded-3xl text-white shadow-xl text-center">
                  <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest font-bold">Security Deposit</p>
                  <p className="text-6xl font-black">${depositAmount}</p>
                  <p className="text-xs text-blue-400 mt-4 font-bold">Age: {age || "--"}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            <button onClick={handleBack} disabled={currentStep === 0 || isSubmitting} className="flex items-center px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30">
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>
            {currentStep === activeSchema.schema.steps.length - 1 ? (
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
        <p className="text-center mt-8 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
          &copy; {new Date().getFullYear()} DJ Auto Rental. 5072 Timberhill Drive, San Antonio, TX.
          <span 
            onClick={() => setShowLogin(true)}
            className="cursor-pointer text-slate-50/10 hover:text-slate-200 transition-colors ml-1"
          >
            ..
          </span>
        </p>
      </main>
    </div>
  );
}
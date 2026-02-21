export interface FormData extends Record<string, any> {
  // 1. Personal Info
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emergencyName: string;
  emergencyPhone: string;
  proofOfAddress?: File | null;
  proofOfIncome?: File | null;

  // 2. License
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  licenseFront?: File | null;
  licenseBack?: File | null;
  selfie?: File | null;

  // 3. Rental Details
  carRequested: string;
  startDate: string;
  endDate: string;
  usageType: 'personal' | 'work' | 'rideshare' | 'delivery' | '';

  // 4. Insurance
  hasInsurance: 'yes' | 'no' | '';
  insuranceCompany: string;
  policyNumber: string;
  insuranceAgreement: boolean;

  // 5. Payment
  paymentMethod: 'cash' | 'zelle' | 'debit' | '';
  depositAgreement: boolean;

  // 6. Screening
  historyAccidents: 'yes' | 'no' | '';
  historyDUI: 'yes' | 'no' | '';
  historySuspension: 'yes' | 'no' | '';
  screeningConsent: boolean;

  // 7. Rules
  ruleSmoking: boolean;
  ruleRacing: boolean;
  ruleCrossing: boolean;
  ruleSubRent: boolean;
  ruleMileage: boolean;
  ruleFuel: boolean;
  ruleReport: boolean;

  // 8. Signature
  signatureName: string;
  signatureImage?: string | null; // Base64 Data URL
  signatureDate: string;
  finalConsent: boolean;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type CompletionStatus = 'complete' | 'incomplete';

export interface Submission {
  id: string;
  created_at: string;
  status: SubmissionStatus;
  completion_status: CompletionStatus;
  last_step_reached: number;
  form_data: FormData;
  user_email: string;
  user_phone: string;
}

export interface Campaign {
  id: string;
  name: string;
  target_datetime: string;
  channel: 'sms' | 'email';
  template: string;
  status: 'scheduled' | 'sent' | 'failed';
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
}

export interface FormStep {
  id: string;
  label: string;
  fields: FormField[];
  gridCols?: 1 | 2 | 3;
}

export interface FormSchema {
  id: string;
  name: string;
  version: string;
  is_active: boolean;
  schema: {
    steps: FormStep[];
  };
}

export interface AppSettings {
  supabase_url: string;
  supabase_service_role: string;
  twilio_sid: string;
  twilio_token: string;
  resend_key: string;
  gemini_api_key: string;
  openai_api_key?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: 'available' | 'rented' | 'maintenance';
  price_per_day: number;
  image_url?: string;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram';
  content: string;
  image_prompt: string;
  status: 'draft' | 'scheduled' | 'posted';
  scheduled_at?: string;
}

export const INITIAL_DATA: FormData = {
  fullName: '',
  dob: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  emergencyName: '',
  emergencyPhone: '',
  proofOfAddress: null,
  proofOfIncome: null,

  licenseNumber: '',
  licenseState: '',
  licenseExpiration: '',
  licenseFront: null,
  licenseBack: null,
  selfie: null,

  carRequested: '',
  startDate: '',
  endDate: '',
  usageType: '',

  hasInsurance: '',
  insuranceCompany: '',
  policyNumber: '',
  insuranceAgreement: false,

  paymentMethod: '',
  depositAgreement: false,

  historyAccidents: '',
  historyDUI: '',
  historySuspension: '',
  screeningConsent: false,

  ruleSmoking: false,
  ruleRacing: false,
  ruleCrossing: false,
  ruleSubRent: false,
  ruleMileage: false,
  ruleFuel: false,
  ruleReport: false,

  signatureName: '',
  signatureImage: null,
  signatureDate: new Date().toISOString().split('T')[0],
  finalConsent: false,
};
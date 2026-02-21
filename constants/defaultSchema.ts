import { FormSchema } from '../types';

export const DEFAULT_SCHEMA: FormSchema = {
  id: 'default-1',
  name: 'Standard Rental Application',
  version: '2.5.0',
  is_active: true,
  schema: {
    steps: [
      {
        id: 's1',
        label: 'Personal Info',
        fields: [
          { id: 'f1', name: 'fullName', label: 'Full Legal Name', type: 'text', required: true, placeholder: 'As appears on license' },
          { id: 'f2', name: 'dob', label: 'Date of Birth', type: 'date', required: true },
          { id: 'f3', name: 'phone', label: 'Phone Number', type: 'text', required: true, placeholder: '(555) 000-0000' },
          { id: 'f4', name: 'email', label: 'Email Address', type: 'text', required: true, placeholder: 'you@example.com' },
          { id: 'f5', name: 'address', label: 'Street Address', type: 'text', required: true },
          { id: 'f6', name: 'proofOfAddress', label: 'Proof of Address', type: 'file', required: true, description: 'Utility bill, bank statement, or official government mail (last 30 days).' },
          { id: 'f7', name: 'proofOfIncome', label: 'Proof of Income', type: 'file', required: true, description: 'Screenshots of weekly earnings from platforms like DoorDash, Amazon Flex, Uber, or Lyft.' }
        ]
      },
      {
        id: 's2',
        label: 'License',
        fields: [
          { id: 'f8', name: 'licenseNumber', label: 'License Number', type: 'text', required: true },
          { id: 'f9', name: 'licenseState', label: 'State of Issue', type: 'text', required: true },
          { id: 'f10', name: 'licenseExpiration', label: 'Expiration Date', type: 'date', required: true },
          { id: 'f11', name: 'licenseFront', label: 'License Front', type: 'file', required: true },
          { id: 'f12', name: 'licenseBack', label: 'License Back', type: 'file', required: true },
          { id: 'f13', name: 'selfie', label: 'Selfie holding License', type: 'file', required: true }
        ]
      },
      {
        id: 's3',
        label: 'Rental',
        fields: [
          { 
            id: 'f14', 
            name: 'carRequested', 
            label: 'Vehicle Requested', 
            type: 'select', 
            required: true,
            options: [
              { value: 'Ford Fusion 2014 (Black)', label: 'Ford Fusion 2014 (Black)' },
              { value: 'Kia Sportage 2017', label: 'Kia Sportage 2017' }
            ]
          },
          { id: 'f15', name: 'startDate', label: 'Rental Start Date', type: 'date', required: true },
          { id: 'f16', name: 'endDate', label: 'Rental End Date', type: 'date', required: true }
        ]
      },
      {
        id: 's4',
        label: 'Insurance',
        fields: [
          { 
            id: 'f17', 
            name: 'hasInsurance', 
            label: 'Do you have valid auto insurance?', 
            type: 'select', 
            required: true,
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}]
          },
          { id: 'f18', name: 'insuranceCompany', label: 'Insurance Company', type: 'text', required: false },
          { id: 'f19', name: 'policyNumber', label: 'Policy Number', type: 'text', required: false },
          { id: 'f20', name: 'insuranceAgreement', label: 'I agree I am responsible for all tickets, tolls, and damages during the rental period.', type: 'checkbox', required: true }
        ]
      },
      {
        id: 's5',
        label: 'Payment',
        fields: [
          { 
            id: 'f21', 
            name: 'paymentMethod', 
            label: 'Payment Method', 
            type: 'select', 
            required: true,
            options: [
              {value:'zelle', label:'Zelle'}, 
              {value:'cash', label:'Cash'},
              {value:'debit', label:'Debit Card'}
            ]
          },
          { id: 'f22', name: 'depositAgreement', label: 'I understand the security deposit requirement and return policy.', type: 'checkbox', required: true }
        ]
      },
      {
        id: 's6',
        label: 'History',
        fields: [
          { id: 'f23', name: 'historyAccidents', label: 'Any Accidents?', type: 'select', required: true, options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}] },
          { id: 'f24', name: 'historyDUI', label: 'Any DUI?', type: 'select', required: true, options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}] },
          { id: 'f25', name: 'historySuspension', label: 'Any Suspension?', type: 'select', required: true, options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}] },
          { id: 'f26', name: 'screeningConsent', label: 'I consent to DJ Auto Rental verifying my driving history and background.', type: 'checkbox', required: true }
        ]
      },
      {
        id: 's7',
        label: 'Rules',
        fields: [
          { id: 'f27', name: 'ruleSmoking', label: 'NO Smoking or Drugs (Strictly Enforced)', type: 'checkbox', required: true },
          { id: 'f28', name: 'ruleRacing', label: 'NO Racing / Reckless Driving', type: 'checkbox', required: true },
          { id: 'f29', name: 'ruleCrossing', label: 'NO Crossing state lines', type: 'checkbox', required: true },
          { id: 'f30', name: 'ruleSubRent', label: 'NO Sub-renting', type: 'checkbox', required: true },
          { id: 'f31', name: 'ruleFuel', label: 'Vehicle must be returned with full fuel tank', type: 'checkbox', required: true }
        ]
      },
      {
        id: 's8',
        label: 'Sign',
        fields: [
          { id: 'f32', name: 'signatureName', label: 'Printed Name', type: 'text', required: true, placeholder: 'Full Legal Name' },
          { id: 'f33', name: 'finalConsent', label: 'I confirm all information provided is true and I accept the rental agreement.', type: 'checkbox', required: true }
        ]
      }
    ]
  }
};

import { ServiceItem, AgentProfile, Industry } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Custom Engineering',
    description: '',
    icon: 'cpu'
  },
  {
    id: 's2',
    title: '24/7 Neural Interaction',
    description: '',
    icon: 'brain'
  },
  {
    id: 's3',
    title: 'Greenfield Architecture',
    description: '',
    icon: 'layers'
  },
  {
    id: 's4',
    title: 'Adaptive Scaling',
    description: '',
    icon: 'scale'
  },
  {
    id: 's5',
    title: 'Operational Autonomy',
    description: '',
    icon: 'bot'
  },
  {
    id: 's6',
    title: 'Financial Integrity',
    description: '',
    icon: 'shield'
  },
  {
    id: 's7',
    title: 'The Jarvis Academy',
    description: '',
    icon: 'book'
  }
];

export const AGENTS: AgentProfile[] = [
  {
    id: 'a1',
    name: 'The Sales Marshall',
    role: 'Revenue Operations',
    specialty: 'Quotes 24/7',
    clearanceLevel: 'L5',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'a2',
    name: 'The Ops Manager',
    role: 'Logistics',
    specialty: 'Files Paperwork',
    clearanceLevel: 'L4',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' 
  },
  {
    id: 'a3',
    name: 'The Vouching Agent',
    role: 'Finance Audit',
    specialty: 'Financial Auditing',
    clearanceLevel: 'L5',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2070&auto=format&fit=crop'
  }
];

export const INDUSTRIES: Industry[] = [
  { 
    id: 'i3',
    name: 'FINANCE', 
    detail: 'High-frequency reporting, fraud detection, and autonomous ledger management.',
    solutions: ['Smart Auditing', 'Cash Flow Alerts', 'Expense Tracking']
  },
  { 
    id: 'i2',
    name: 'HEALTHCARE', 
    detail: 'Automated patient intake, billing reconciliation, and compliance auditing.',
    solutions: ['Patient Records', '24/7 Support', 'Billing Systems']
  },
  { 
    id: 'i1',
    name: 'SUPPLY CHAIN', 
    detail: 'No room for human error in supply chains. Real-time route optimization.',
    solutions: ['Live Tracking', 'Stock Control', 'Trip Planner']
  },
  { 
    id: 'i5',
    name: 'E-COMMERCE', 
    detail: 'Dynamic pricing engines and customer service autonomy.',
    solutions: ['Customer Support', 'Returns & Refund Automation', 'Dynamic Pricing']
  },
  { 
    id: 'i4',
    name: 'REAL ESTATE', 
    detail: 'Automated property management workflows and tenant screening protocols.',
    solutions: ['Lead Qualification', 'Automated Follow-Ups', 'Document Management']
  },
  { 
    id: 'i6',
    name: 'HUMAN RESOURCES', 
    detail: 'Streamlined personnel management and automated administrative logic.',
    solutions: ['Hiring Systems', 'Auto-Payroll', 'Staff Onboarding']
  },
];
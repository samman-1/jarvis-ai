export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  clearanceLevel: string;
  image: string;
}

export interface Industry {
  id: string;
  name: string;
  detail: string;
  solutions: string[]; // For the neural network nodes
  x?: number; // Visual positioning
  y?: number;
}

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isLeadFormOpen: boolean;
  openLeadForm: () => void;
  closeLeadForm: () => void;
}
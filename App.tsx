import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AntiSaaS } from './components/AntiSaaS';
import { Services } from './components/Services';
import { AgentRoster } from './components/AgentRoster';
import { Industries } from './components/Industries';
import { OriginCode } from './components/OriginCode';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { LeadForm } from './components/LeadForm';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  return (
    <div className="bg-background min-h-screen text-white selection:bg-jarvis-orange selection:text-black font-sans rtl:font-arabic">
      <CustomCursor />
      <Navbar />
      <LeadForm />
      <main>
        <Hero />
        <AntiSaaS />
        <Services />
        <AgentRoster />
        <Industries />
        <OriginCode />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
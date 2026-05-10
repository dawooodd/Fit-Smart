import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Team from '../components/Team';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF6] font-sans text-gray-800">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Team />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
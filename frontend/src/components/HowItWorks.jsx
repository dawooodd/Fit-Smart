import React from 'react';
import { ArrowRight } from 'lucide-react';
import { stepsData } from '../data/constants';
import Reveal from './ui/Reveal';

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 max-w-7xl mx-auto px-6 md:px-8 scroll-mt-16">
      <Reveal>
        <h4 className="text-green-700 font-semibold mb-2 uppercase tracking-wider text-sm">Cara Kerja</h4>
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">Tiga langkah sederhana.</h2>
      </Reveal>

      <div className="flex flex-col md:flex-row gap-8 items-stretch relative">
        {stepsData.map((step, index) => (
          <React.Fragment key={step.id}>
            <Reveal delay={index * 140} className="flex-1 w-full">
              <div className="group lift h-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-orange-200">
                <span className="text-5xl font-light text-orange-400 block mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1 origin-left">
                  {step.id}
                </span>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
            {index < stepsData.length - 1 && (
              <div className="hidden md:flex items-center justify-center self-center text-gray-300">
                <ArrowRight className="w-8 h-8 animate-float" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

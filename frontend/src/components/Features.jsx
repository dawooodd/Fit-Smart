import React from 'react';
import { featuresData } from '../data/constants';
import Reveal from './ui/Reveal';

export default function Features() {
  return (
    <section id="fitur" className="bg-[#F5F2EA] py-20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Reveal>
          <h4 className="text-green-700 font-semibold mb-2 uppercase tracking-wider text-sm">Fitur</h4>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">Satu aplikasi untuk pola makan dan latihan.</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 100}>
              <div className="group lift h-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-green-600 group-hover:scale-110 group-hover:-rotate-6 [&_svg]:transition-colors group-hover:[&_svg]:text-white">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

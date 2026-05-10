import React from 'react';
import { featuresData } from '../data/constants';

export default function Features() {
  return (
    <section id="fitur" className="bg-[#F5F2EA] py-20">
      <div className="max-w-7xl mx-auto px-8">
        <h4 className="text-green-700 font-semibold mb-2 uppercase tracking-wider text-sm">Fitur</h4>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">Satu aplikasi untuk pola makan dan latihan.</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
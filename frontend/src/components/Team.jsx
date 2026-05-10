import React from 'react';
import { teamData } from '../data/constants';

export default function Team() {
  return (
    <section id="tim" className="bg-[#F5F2EA] py-20">
      <div className="max-w-7xl mx-auto px-8">
        <h4 className="text-green-700 font-semibold mb-2 uppercase tracking-wider text-sm">Tim Developer</h4>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">Dibangun oleh tim yang peduli pada kesehatan.</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamData.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-full flex items-center gap-4 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 overflow-hidden">
                <div className="w-full h-full bg-linear-to-br from-green-200 to-green-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{member.name}</h3>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
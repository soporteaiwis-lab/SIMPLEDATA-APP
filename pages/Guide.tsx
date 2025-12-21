import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const Guide: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary inline-block mb-2">Guía de Estudios</h2>
        <p className="text-slate-400">Hoja de ruta para tu transformación digital.</p>
      </div>

      <div className="space-y-8">
        {[
            { 
                week: 1, 
                title: "Fundamentos de IA y Productividad",
                days: [
                    "Introducción a la IA Corporativa",
                    "Dominando ChatGPT y Claude",
                    "Ingeniería de Prompts Profesional",
                    "IA para Desarrolladores I",
                    "Automatización de Tareas Diarias"
                ]
            },
            { 
                week: 2, 
                title: "IA Aplicada al Negocio",
                days: [
                    "IA en Azure Databricks",
                    "Soluciones IA con Oracle y AWS",
                    "Automatización Real con N8N",
                    "IA para el Sector Financiero",
                    "Estrategias de Venta de Soluciones IA"
                ]
            }
        ].map((section, idx) => (
            <div key={idx} className="bg-surface border border-slate-800 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl">
                        <Calendar size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Semana {section.week}: {section.title}</h3>
                </div>

                <div className="space-y-4 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>

                    {section.days.map((day, dIdx) => (
                        <div key={dIdx} className="relative z-10 flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 group-hover:border-primary group-hover:bg-primary transition-colors flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-white">
                                {dIdx + 1}
                            </div>
                            <div className="flex-1 bg-dark/50 border border-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-800 transition-colors">
                                <span className="text-slate-300 text-sm">{day}</span>
                                <ChevronRight size={16} className="text-slate-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Guide;
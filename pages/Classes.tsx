import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from '../constants';
import { ClassSession, User } from '../types';
import { Play, CheckCircle, Lock, FileText, BrainCircuit, Circle } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { saveUserProgress, VideoMap } from '../services/dataService';

interface ClassesProps {
  user: User;
  videos: VideoMap;
}

const Classes: React.FC<ClassesProps> = ({ user, videos }) => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(1); // 1 = Phase 1, 2 = Phase 2
  const [activeWeekTab, setActiveWeekTab] = useState(1);
  const [localProgress, setLocalProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load progress from localStorage on mount
    const saved = localStorage.getItem('simpledata_progress');
    if (saved) {
        try {
            setLocalProgress(JSON.parse(saved));
        } catch(e) { console.error("Error parsing local progress"); }
    }
  }, []);

  const handleMarkComplete = async (session: ClassSession, weekId: number) => {
     // Ensure we have the correct key format: "s{week}-{day}" (e.g., "s1-lunes")
     const dayName = session.day.toLowerCase().trim();
     const progressKey = `s${weekId}-${dayName}`;
     
     // Toggle status
     const currentStatus = localProgress[progressKey] || false;
     const newStatus = !currentStatus;

     const newProgress = {
         ...localProgress,
         [progressKey]: newStatus
     };

     // 1. Update Local State (Immediate UI feedback)
     setLocalProgress(newProgress);
     
     // 2. Update Local Storage
     localStorage.setItem('simpledata_progress', JSON.stringify(newProgress));
     
     // 3. Update Modal State if open
     if (selectedSession && selectedSession.id === session.id) {
         setSelectedSession({ ...selectedSession, isCompleted: newStatus });
     }
     
     // 4. Save to Cloud
     await saveUserProgress(user, newProgress);
  };
  
  const extractVideoId = (url: string) => {
      if (!url) return '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : '';
  };

  const getResourceLinks = (weekId: number, dayIndex: number) => {
      // Logic: (week - 1) * 5 + (dayIndex + 1)
      // dayIndex is 0 for Monday, 1 for Tuesday...
      const classNumber = (weekId - 1) * 5 + (dayIndex + 1);
      const formattedNum = String(classNumber).padStart(2, '0');
      
      const baseUrl = "https://raw.githack.com/soporteaiwis-lab/simpledata/main";
      
      return {
          textUrl: `${baseUrl}/clase${formattedNum}.html`,
          quizUrl: `${baseUrl}/quiz${formattedNum}.html`
      };
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Plan de Estudios</h2>
            <p className="text-slate-400">Accede a tus clases, recursos y cuestionarios.</p>
        </div>
        
        <div className="bg-slate-800/50 p-1.5 rounded-xl border border-slate-700 inline-flex">
            <button 
                onClick={() => setActiveTab(1)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 1 ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
                📅 Fase 1: Fundamentos
            </button>
            <button 
                onClick={() => setActiveTab(2)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 2 ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
                🚀 Fase 2: Proyecto
            </button>
        </div>
      </div>

      {activeTab === 1 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                {[1, 2, 3, 4].map(weekNum => (
                    <button
                        key={weekNum}
                        onClick={() => setActiveWeekTab(weekNum)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            activeWeekTab === weekNum 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-surface border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                    >
                        Semana {weekNum}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {COURSE_CONTENT
                    .filter(week => week.id === activeWeekTab)
                    .map((week) => (
                    <div key={week.id} className="relative animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{week.title}</h3>
                        </div>
                        
                        <div className="relative group">
                            <div className="flex overflow-x-auto snap-x gap-6 pb-8 px-1 scrollbar-hide">
                                {week.sessions.map((session, index) => {
                                    // 1. Resolve Data
                                    const videoMapKey = `${week.id}-${session.day.toLowerCase()}`;
                                    const realVideoUrl = videos[videoMapKey] || '';
                                    const videoId = extractVideoId(realVideoUrl);
                                    
                                    const progressKey = `s${week.id}-${session.day.toLowerCase()}`;
                                    const isCompleted = localProgress[progressKey] || false;
                                    
                                    // 2. Generate Links
                                    const { textUrl, quizUrl } = getResourceLinks(week.id, index);
                                    
                                    const sessionWithVideo = { ...session, videoUrl: videoId, isCompleted };

                                    return (
                                    <div 
                                        key={session.id} 
                                        className="snap-start flex-shrink-0 w-[300px] md:w-[340px] bg-surface border border-slate-800 rounded-2xl overflow-hidden hover:border-primary hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 group/card flex flex-col"
                                    >
                                        {/* Thumbnail Area - Click opens Modal */}
                                        <div 
                                            className="h-48 bg-slate-900 relative overflow-hidden cursor-pointer"
                                            onClick={() => {
                                                setSelectedSession(sessionWithVideo);
                                                setSelectedWeekId(week.id);
                                            }}
                                        >
                                            {videoId ? (
                                                <img 
                                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                                                    alt={session.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600">
                                                    <span className="text-4xl mb-2 opacity-50">🎬</span>
                                                    <span className="text-xs uppercase tracking-widest font-semibold">Video No Disponible</span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90"></div>
                                            
                                            {/* CHECK BUTTON ON CARD */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Stop modal from opening
                                                        handleMarkComplete(session, week.id);
                                                    }}
                                                    className={`
                                                        flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md border transition-all
                                                        ${isCompleted 
                                                            ? 'bg-green-500 text-white border-green-400 hover:bg-green-600' 
                                                            : 'bg-black/50 text-slate-300 border-slate-600 hover:bg-white hover:text-black hover:border-white'}
                                                    `}
                                                >
                                                    {isCompleted ? <CheckCircle size={12} className="fill-current" /> : <Circle size={12} />}
                                                    {isCompleted ? 'VISTO' : 'MARCAR VISTO'}
                                                </button>
                                            </div>
                                            
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">{session.day}</span>
                                                <h4 className="font-bold text-white text-lg leading-tight line-clamp-2 drop-shadow-md">{session.title}</h4>
                                            </div>

                                            {videoId && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-dark shadow-xl transform scale-75 group-hover/card:scale-100 transition-transform">
                                                        <Play size={24} fill="currentColor" className="ml-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">{session.description}</p>
                                            
                                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-800">
                                                <a 
                                                    href={textUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 py-2 text-xs font-bold bg-slate-800 hover:bg-primary/20 hover:text-primary hover:border-primary/50 text-slate-300 rounded-lg border border-slate-700 transition-all"
                                                >
                                                    <FileText size={14} /> Texto
                                                </a>
                                                <a 
                                                    href={quizUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 py-2 text-xs font-bold bg-slate-800 hover:bg-secondary/20 hover:text-secondary hover:border-secondary/50 text-slate-300 rounded-lg border border-slate-700 transition-all"
                                                >
                                                    <BrainCircuit size={14} /> Quiz
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
      ) : (
          <div className="bg-surface border border-slate-800 rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-10">
                      <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
                          <Lock size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Fase 2: Proyecto Final</h3>
                      <p className="text-slate-400">En esta fase trabajaremos en el desarrollo completo del proyecto seleccionado.</p>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="bg-dark/50 p-6 rounded-xl border border-slate-700">
                          <h4 className="text-primary font-bold mb-4">📅 Semana 5-6: Desarrollo del Prototipo</h4>
                          <ul className="space-y-3">
                              <li className="flex gap-3 text-sm text-slate-300">
                                  <span className="font-bold text-white w-16">Día 1:</span> Kick-off y Arquitectura del Proyecto
                              </li>
                              <li className="flex gap-3 text-sm text-slate-300">
                                  <span className="font-bold text-white w-16">Día 2:</span> Desarrollo Backend y APIs
                              </li>
                              <li className="flex gap-3 text-sm text-slate-300">
                                  <span className="font-bold text-white w-16">Día 3:</span> Desarrollo Frontend y UX
                              </li>
                              <li className="flex gap-3 text-sm text-slate-300">
                                  <span className="font-bold text-white w-16">Día 4:</span> Integración y Testing
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <VideoModal 
        session={selectedSession} 
        weekId={selectedWeekId || 0}
        onClose={() => setSelectedSession(null)}
        onMarkComplete={(id) => {
            // Bridge for Modal completion button
            if (selectedSession && selectedWeekId) {
                handleMarkComplete(selectedSession, selectedWeekId);
            }
        }}
      />
    </div>
  );
};

export default Classes;
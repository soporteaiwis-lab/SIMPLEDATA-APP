import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from '../constants';
import { ClassSession, User } from '../types';
import { Play, CheckCircle, Lock } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import { saveUserProgress, VideoMap } from '../services/dataService';

interface ClassesProps {
  user: User;
  videos: VideoMap;
}

const Classes: React.FC<ClassesProps> = ({ user, videos }) => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [localProgress, setLocalProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load progress from local storage (synced from App.tsx)
    const saved = localStorage.getItem('simpledata_progress');
    if (saved) {
        try {
            setLocalProgress(JSON.parse(saved));
        } catch(e) { console.error("Error parsing local progress"); }
    }
  }, []);

  const handleMarkComplete = async (sessionId: string) => {
     // SessionId is like '1-1'. We need to map it to our progress key format: "s{week}-{day}" (lowercase)
     // Wait, COURSE_CONTENT IDs are 'week-dayIndex'. e.g. '1-1'.
     // But videos map keys are 'week-dayName'.
     
     // Let's find the session object to get the day name
     let session: ClassSession | undefined;
     let weekId = 0;
     
     COURSE_CONTENT.forEach(w => {
         const found = w.sessions.find(s => s.id === sessionId);
         if (found) {
             session = found;
             weekId = w.id;
         }
     });

     if (!session) return;
     
     // Key format used in simpledata: "s{week}-{day}" (e.g. s1-lunes)
     const progressKey = `s${weekId}-${session.day.toLowerCase()}`;
     
     const newProgress = {
         ...localProgress,
         [progressKey]: !localProgress[progressKey] // Toggle
     };

     setLocalProgress(newProgress);
     localStorage.setItem('simpledata_progress', JSON.stringify(newProgress));
     
     // Save to cloud
     await saveUserProgress(user, newProgress);
  };
  
  // Helper to extract video ID from URL
  const extractVideoId = (url: string) => {
      if (!url) return '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : '';
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Plan de Estudios</h2>
            <p className="text-slate-400">Accede a tus clases, recursos y cuestionarios.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
            <button 
                onClick={() => setActiveTab(1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 1 ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
                Fase 1: Fundamentos
            </button>
            <button 
                onClick={() => setActiveTab(2)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 2 ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
                Fase 2: Proyecto
            </button>
        </div>
      </div>

      <div className="space-y-12">
        {COURSE_CONTENT.filter(week => activeTab === 1 ? week.id <= 2 : week.id > 2).map((week) => (
          <div key={week.id} className="relative">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                <h3 className="text-xl font-bold text-white">{week.title} <span className="text-slate-500 text-sm font-normal ml-2">Semana {week.id}</span></h3>
            </div>
            
            {/* Scrollable Container (Netflix style) */}
            <div className="relative group">
                <div className="flex overflow-x-auto snap-x gap-4 pb-8 -mx-4 px-4 scrollbar-hide">
                    {week.sessions.map((session) => {
                        // Resolve video URL from the fetched map
                        // Key: "week-dayName" e.g. "1-lunes"
                        const videoMapKey = `${week.id}-${session.day.toLowerCase()}`;
                        const realVideoUrl = videos[videoMapKey] || '';
                        const videoId = extractVideoId(realVideoUrl);
                        
                        // Check progress
                        const progressKey = `s${week.id}-${session.day.toLowerCase()}`;
                        const isCompleted = localProgress[progressKey] || false;

                        // Create a session object with the resolved video
                        const sessionWithVideo = { ...session, videoUrl: videoId, isCompleted };

                        return (
                        <div 
                            key={session.id} 
                            onClick={() => setSelectedSession(sessionWithVideo)}
                            className="snap-start flex-shrink-0 w-[280px] md:w-[320px] bg-surface border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group/card"
                        >
                            {/* Thumbnail Area */}
                            <div className="h-40 bg-slate-800 relative overflow-hidden">
                                {videoId ? (
                                    <img 
                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                                        alt={session.title}
                                        className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                        <span className="text-4xl opacity-30">🎬</span>
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                                
                                {isCompleted && (
                                    <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                                        <CheckCircle size={12} /> Visto
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-dark shadow-xl transform scale-75 group-hover/card:scale-100 transition-transform">
                                        <Play size={20} fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{session.day}</span>
                                    <span className="text-xs text-slate-500">60 min</span>
                                </div>
                                <h4 className="font-bold text-white mb-2 line-clamp-1">{session.title}</h4>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{session.description}</p>
                                
                                <div className="flex gap-2 mt-auto">
                                    <button className="flex-1 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors">
                                        Recursos
                                    </button>
                                    <button className="flex-1 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors">
                                        Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                    
                    {/* Placeholder for future content */}
                    <div className="snap-start flex-shrink-0 w-[280px] md:w-[320px] bg-slate-800/20 border border-slate-800/50 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-600">
                        <Lock size={32} className="mb-2" />
                        <span className="text-sm">Próximamente</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <VideoModal 
        session={selectedSession} 
        onClose={() => setSelectedSession(null)}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
};

export default Classes;
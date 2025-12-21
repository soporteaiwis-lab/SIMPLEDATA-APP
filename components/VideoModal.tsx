import React, { useState, useEffect } from 'react';
import { X, PlayCircle, FileText, CheckCircle, AlignLeft } from 'lucide-react';
import { ClassSession } from '../types';

interface VideoModalProps {
  session: ClassSession | null;
  onClose: () => void;
  onMarkComplete: (id: string) => void;
  weekId: number;
}

const VideoModal: React.FC<VideoModalProps> = ({ session, onClose, onMarkComplete, weekId }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'transcript'>('description');
  const [transcriptHtml, setTranscriptHtml] = useState<string>('');
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  useEffect(() => {
    if (session && activeTab === 'transcript') {
      loadTranscript();
    }
  }, [session, activeTab]);

  const loadTranscript = async () => {
    if (!session || !weekId) return;
    
    setLoadingTranscript(true);
    // Ensure day is lowercase and cleaned (e.g. "Lunes" -> "lunes")
    const dayName = session.day.toLowerCase().trim();
    
    // Construct URL exactly as requested: transcripts/fase1-semanaX-dia.md
    const url = `https://raw.githubusercontent.com/soporteaiwis-lab/simpledata/main/transcripts/fase1-semana${weekId}-${dayName}.md`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        // Convert Markdown to simple HTML
        const html = text
          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-primary mt-6 mb-2">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-8 mb-4 border-b border-slate-700 pb-2">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-2 mb-6">$1</h1>')
          .replace(/\*\*(.*)\*\*/gim, '<strong class="text-white">$1</strong>')
          .replace(/\n\n/g, '</p><p class="mb-4 text-slate-300 leading-relaxed">')
          .replace(/\n/g, '<br />');
        
        setTranscriptHtml(`<div class="transcript-content"><p class="mb-4 text-slate-300 leading-relaxed">${html}</p></div>`);
      } else {
        setTranscriptHtml(`
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="bg-slate-800 p-4 rounded-full mb-4">
                    <FileText size={32} class="text-slate-500" />
                </div>
                <p class="text-slate-400 text-lg font-medium">Transcripción no disponible</p>
                <p class="text-slate-500 text-sm mt-1">El archivo no se encontró en el repositorio.</p>
                <p class="text-slate-600 text-xs mt-4 font-mono">${url.split('/').pop()}</p>
            </div>
        `);
      }
    } catch (error) {
      setTranscriptHtml('<p class="text-red-400 text-center mt-8">Error de conexión al cargar la transcripción.</p>');
    } finally {
      setLoadingTranscript(false);
    }
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-5xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/90 backdrop-blur">
          <div>
            <h3 className="text-xl font-bold text-white">{session.title}</h3>
            <div className="flex gap-2 text-sm mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{session.day}</span>
                <span className="text-slate-400">Semana {weekId}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="bg-black aspect-video w-full shrink-0 max-h-[40vh] lg:max-h-[50vh] relative group">
            {session.videoUrl ? (
               <iframe 
               width="100%" 
               height="100%" 
               src={`https://www.youtube.com/embed/${session.videoUrl}`} 
               title="Video Player"
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
             ></iframe>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
                    <PlayCircle size={48} className="mb-2 opacity-30" />
                    <p>Video no disponible</p>
                </div>
            )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/80">
            <button 
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-primary text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
            >
                <div className="flex items-center justify-center gap-2">
                    <AlignLeft size={16} /> Descripción
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-primary text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
            >
                <div className="flex items-center justify-center gap-2">
                    <FileText size={16} /> Transcripción
                </div>
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
            {activeTab === 'description' ? (
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Acerca de esta clase</h4>
                        <p className="text-slate-300 leading-relaxed text-lg">{session.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-700 mt-8">
                        <button 
                            onClick={() => onMarkComplete(session.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all font-bold shadow-lg w-full md:w-auto justify-center ${
                                session.isCompleted 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20' 
                                : 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white'
                            }`}
                        >
                            <CheckCircle size={20} /> 
                            {session.isCompleted ? 'Clase Completada' : 'Marcar como Vista'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    {loadingTranscript ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <div className="w-8 h-8 border-4 border-slate-600 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p>Cargando transcripción...</p>
                        </div>
                    ) : (
                        <div 
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: transcriptHtml }}
                        />
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
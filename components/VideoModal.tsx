import React from 'react';
import { X, PlayCircle, FileText, CheckCircle } from 'lucide-react';
import { ClassSession } from '../types';

interface VideoModalProps {
  session: ClassSession | null;
  onClose: () => void;
  onMarkComplete: (id: string) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ session, onClose, onMarkComplete }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">{session.title}</h3>
            <p className="text-primary text-sm font-medium">{session.day}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative group">
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
                    <PlayCircle size={48} className="mb-2 opacity-50" />
                    <p>Video no disponible en demo</p>
                </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Descripción</h4>
              <p className="text-slate-300 leading-relaxed">{session.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all text-sm font-medium">
                 <FileText size={16} /> Ver Transcripción
               </button>
               <button 
                 onClick={() => onMarkComplete(session.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    session.isCompleted 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/50' 
                    : 'bg-primary hover:bg-blue-600 text-white'
                 }`}
               >
                 <CheckCircle size={16} /> 
                 {session.isCompleted ? 'Completada' : 'Marcar como Vista'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
import React, { useState } from 'react';
import { User } from '../types';
import { Search } from 'lucide-react';

interface StudentsProps {
  users: User[];
}

const Students: React.FC<StudentsProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Comunidad SimpleData</h2>
            <p className="text-slate-400">Conecta con otros estudiantes del programa ({users.length} activos).</p>
        </div>
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar estudiante..." 
                className="w-full bg-surface border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((student) => {
              const progress = Math.round((student.progress.completed / student.progress.total) * 100);
              return (
                  <div key={student.id} className="bg-surface border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-xl font-bold text-white">
                                  {student.avatar}
                              </div>
                          </div>
                          <div>
                              <h3 className="font-bold text-white">{student.name}</h3>
                              <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700 mt-1">
                                  {student.role}
                              </span>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-400">Habilidades IA (Prompting)</span>
                                  <span className="text-white font-medium">{student.stats.prompting}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${student.stats.prompting}%` }}></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-400">Progreso General</span>
                                  <span className="text-white font-medium">{progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full">
                                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
             No se encontraron estudiantes.
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
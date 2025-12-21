export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  stats: {
    prompting: number;
    tools: number;
    analysis: number;
  };
  progress: {
    completed: number;
    total: number;
  };
}

export interface ClassSession {
  id: string;
  day: string;
  title: string;
  description: string;
  videoUrl?: string; // YouTube ID or URL
  isCompleted: boolean;
  transcript?: string;
  resources?: {
    text: string;
    quiz: string;
  };
}

export interface WeekData {
  id: number;
  title: string;
  sessions: ClassSession[];
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
}
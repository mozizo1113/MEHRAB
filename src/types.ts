export type AppMode = 'grammar' | 'rhetoric' | 'grammar_rhetoric' | 'literature' | 'composition';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AttachedImage {
  dataUrl: string; // base64 data url
  mimeType: string;
  name?: string;
}

export interface ChatMessage {
  id: string;
  mode: AppMode;
  question: string;
  image?: AttachedImage;
  answer: string;
  createdAt: string;
  starred?: boolean;
}

export interface HistorySession {
  id: string;
  title: string;
  mode: AppMode;
  messages: ChatMessage[];
  updatedAt: string;
  userId?: string;
  starred?: boolean;
}

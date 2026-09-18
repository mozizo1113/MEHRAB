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

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'grammar' | 'rhetoric' | 'vocabulary' | 'literature';
  definition: string;
  subtext?: string;
  example?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'نحو' | 'بلاغة' | 'أدب وفصاحة' | 'معاجم وبيان';
  readTime: string;
  summary: string;
  content: string;
  author: string;
  date: string;
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

export type MainView = 'chat' | 'articles' | 'glossary' | 'terms';

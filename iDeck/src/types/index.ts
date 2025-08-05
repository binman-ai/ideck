// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  provider: 'google' | 'linkedin' | 'email';
  createdAt: Date;
  subscription?: Subscription;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Subscription and Payment Types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  expiresAt?: Date;
}

// Deck Analysis Types
export interface DeckAnalysis {
  id: string;
  userId: string;
  fileName?: string;
  fileUrl?: string;
  scores: InvestmentScores;
  insights: AnalysisInsights;
  recommendations: string[];
  createdAt: Date;
  isPremium: boolean;
}

export interface InvestmentScores {
  overall: number;
  problem: number;
  solution: number;
  market: number;
  businessModel: number;
  traction: number;
  team: number;
  financials: number;
  competition: number;
  presentation: number;
}

export interface AnalysisInsights {
  strengths: string[];
  weaknesses: string[];
  actionableItems: ActionableItem[];
  marketAnalysis: string;
  competitiveAdvantage: string;
}

export interface ActionableItem {
  category: keyof InvestmentScores;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
}

// Interactive Form Types
export interface FormQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'slider';
  question: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
  category: keyof InvestmentScores;
}

export interface FormResponse {
  questionId: string;
  answer: string | string[] | number;
}

export interface FormSubmission {
  id: string;
  userId: string;
  responses: FormResponse[];
  analysis: DeckAnalysis;
  createdAt: Date;
}

// Deck Generation Types
export interface DeckTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: 'minimal' | 'corporate' | 'creative' | 'tech' | 'modern' | 'classic';
  slides: SlideTemplate[];
}

export interface SlideTemplate {
  id: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business-model' | 'traction' | 'team' | 'financials' | 'competition' | 'ask';
  layout: 'text-only' | 'text-image' | 'chart' | 'timeline' | 'team-grid';
  content: SlideContent;
}

export interface SlideContent {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  chartData?: ChartData;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  labels: string[];
}

export interface GeneratedDeck {
  id: string;
  userId: string;
  templateId: string;
  slides: GeneratedSlide[];
  title: string;
  downloadUrl?: string;
  createdAt: Date;
}

export interface GeneratedSlide {
  id: string;
  slideTemplateId: string;
  content: SlideContent;
  isEditable: boolean;
  order: number;
}

// Investor Matching Types
export interface Investor {
  id: string;
  name: string;
  firm: string;
  website?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  email?: string;
  sectors: string[];
  stages: InvestmentStage[];
  geography: string[];
  businessModels: string[];
  averageInvestment?: string;
  description?: string;
  recentInvestments?: Investment[];
}

export interface Investment {
  company: string;
  amount?: string;
  stage: InvestmentStage;
  date: Date;
  sector: string;
}

export type InvestmentStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth' | 'late-stage';

export interface InvestorMatch {
  investor: Investor;
  matchScore: number;
  matchReasons: string[];
  contactInfo?: {
    preferredMethod: 'email' | 'linkedin' | 'website';
    message?: string;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  DeckUpload: undefined;
  InteractiveForm: undefined;
  Analysis: { analysisId: string };
  DeckBuilder: { templateId?: string; formSubmissionId?: string };
  InvestorMatching: { analysisId: string };
  Profile: undefined;
  Subscription: undefined;
  Admin: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Upload: undefined;
  MyDecks: undefined;
  Investors: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  openaiApiKey: string;
  stripePublishableKey: string;
  googleClientId: string;
  linkedinClientId: string;
  supportedLanguages: Language[];
  defaultLanguage: string;
}

export interface Language {
  code: string;
  name: string;
  rtl: boolean;
  flag: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalDecksAnalyzed: number;
  totalRevenue: number;
  conversionRate: number;
  popularTemplates: TemplateStats[];
}

export interface TemplateStats {
  templateId: string;
  templateName: string;
  usageCount: number;
  conversionRate: number;
}

export interface AdminUser extends User {
  lastLogin: Date;
  totalDecks: number;
  subscriptionStatus: string;
  totalSpent: number;
}
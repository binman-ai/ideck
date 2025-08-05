import { FormQuestion } from '../types';

export const formQuestions: FormQuestion[] = [
  // Problem Section
  {
    id: 'problem_1',
    type: 'textarea',
    question: 'What specific problem does your startup solve?',
    placeholder: 'Describe the pain point your target customers face...',
    required: true,
    category: 'problem',
  },
  {
    id: 'problem_2',
    type: 'text',
    question: 'How big is this problem? Can you quantify it?',
    placeholder: 'e.g., "Costs businesses $1B annually" or "Affects 10M people"',
    required: true,
    category: 'problem',
  },
  {
    id: 'problem_3',
    type: 'select',
    question: 'How urgent is this problem for your customers?',
    options: [
      'Critical - They need a solution immediately',
      'Important - They actively seek solutions',
      'Nice to have - They would consider solutions',
      'Low priority - They rarely think about it',
    ],
    required: true,
    category: 'problem',
  },

  // Solution Section
  {
    id: 'solution_1',
    type: 'textarea',
    question: 'How does your solution solve this problem?',
    placeholder: 'Explain your approach and why it works...',
    required: true,
    category: 'solution',
  },
  {
    id: 'solution_2',
    type: 'multiselect',
    question: 'What makes your solution unique?',
    options: [
      'Advanced technology/AI',
      'Better user experience',
      'Lower cost',
      'Faster results',
      'More comprehensive',
      'First to market',
      'Patent protection',
      'Network effects',
    ],
    required: true,
    category: 'solution',
  },
  {
    id: 'solution_3',
    type: 'select',
    question: 'What stage is your product/solution in?',
    options: [
      'Idea/Concept',
      'Prototype/MVP',
      'Beta version',
      'Launched product',
      'Scaled product',
    ],
    required: true,
    category: 'solution',
  },

  // Market Section
  {
    id: 'market_1',
    type: 'text',
    question: 'What is your Total Addressable Market (TAM)?',
    placeholder: 'e.g., "$50B global market"',
    required: true,
    category: 'market',
  },
  {
    id: 'market_2',
    type: 'textarea',
    question: 'Who is your target customer?',
    placeholder: 'Describe your ideal customer profile, demographics, behavior...',
    required: true,
    category: 'market',
  },
  {
    id: 'market_3',
    type: 'select',
    question: 'How would you describe the market timing?',
    options: [
      'Perfect timing - market is ready now',
      'Good timing - market is emerging',
      'Early - need to educate market',
      'Late - market is saturated',
    ],
    required: true,
    category: 'market',
  },

  // Business Model Section
  {
    id: 'businessModel_1',
    type: 'select',
    question: 'What is your primary revenue model?',
    options: [
      'SaaS/Subscription',
      'One-time purchase',
      'Freemium',
      'Marketplace/Commission',
      'Advertising',
      'Licensing',
      'Transaction fees',
      'Other',
    ],
    required: true,
    category: 'businessModel',
  },
  {
    id: 'businessModel_2',
    type: 'text',
    question: 'What is your pricing strategy?',
    placeholder: 'e.g., "$99/month per user" or "5% commission per transaction"',
    required: true,
    category: 'businessModel',
  },
  {
    id: 'businessModel_3',
    type: 'number',
    question: 'What is your estimated Customer Lifetime Value (CLV)?',
    placeholder: 'Enter amount in USD',
    required: false,
    category: 'businessModel',
  },

  // Traction Section
  {
    id: 'traction_1',
    type: 'select',
    question: 'What stage of traction are you at?',
    options: [
      'Pre-launch (building product)',
      'Launched (0-10 customers)',
      'Early traction (10-100 customers)',
      'Growing (100-1000 customers)',
      'Scaling (1000+ customers)',
    ],
    required: true,
    category: 'traction',
  },
  {
    id: 'traction_2',
    type: 'text',
    question: 'What is your current Monthly Recurring Revenue (MRR)?',
    placeholder: 'e.g., "$5,000" or "Not generating revenue yet"',
    required: false,
    category: 'traction',
  },
  {
    id: 'traction_3',
    type: 'textarea',
    question: 'What key milestones have you achieved?',
    placeholder: 'Product launches, partnerships, awards, press coverage, etc.',
    required: false,
    category: 'traction',
  },

  // Team Section
  {
    id: 'team_1',
    type: 'number',
    question: 'How many co-founders do you have (including yourself)?',
    placeholder: 'Enter number',
    required: true,
    category: 'team',
  },
  {
    id: 'team_2',
    type: 'textarea',
    question: 'Tell us about your founding team\'s background',
    placeholder: 'Previous experience, relevant skills, achievements...',
    required: true,
    category: 'team',
  },
  {
    id: 'team_3',
    type: 'multiselect',
    question: 'What key expertise does your team have?',
    options: [
      'Technical/Engineering',
      'Product Development',
      'Sales & Marketing',
      'Business Development',
      'Finance & Operations',
      'Industry Expertise',
      'Previous Startup Experience',
      'Large Company Experience',
    ],
    required: true,
    category: 'team',
  },

  // Financials Section
  {
    id: 'financials_1',
    type: 'text',
    question: 'How much funding are you seeking?',
    placeholder: 'e.g., "$500K" or "$2M Series A"',
    required: true,
    category: 'financials',
  },
  {
    id: 'financials_2',
    type: 'textarea',
    question: 'How will you use the funding?',
    placeholder: 'Break down the use of funds (hiring, marketing, product, etc.)',
    required: true,
    category: 'financials',
  },
  {
    id: 'financials_3',
    type: 'text',
    question: 'What revenue do you project in 2 years?',
    placeholder: 'e.g., "$2M ARR"',
    required: false,
    category: 'financials',
  },

  // Competition Section
  {
    id: 'competition_1',
    type: 'textarea',
    question: 'Who are your main competitors?',
    placeholder: 'List direct and indirect competitors...',
    required: true,
    category: 'competition',
  },
  {
    id: 'competition_2',
    type: 'textarea',
    question: 'What is your competitive advantage?',
    placeholder: 'What makes you better than existing solutions?',
    required: true,
    category: 'competition',
  },
  {
    id: 'competition_3',
    type: 'select',
    question: 'How defensible is your solution?',
    options: [
      'Very defensible (patents, network effects, etc.)',
      'Somewhat defensible (first-mover advantage)',
      'Not very defensible (easy to copy)',
      'Not sure',
    ],
    required: true,
    category: 'competition',
  },

  // Final Questions
  {
    id: 'presentation_1',
    type: 'text',
    question: 'What is your startup\'s name?',
    placeholder: 'Enter your company name',
    required: true,
    category: 'presentation',
  },
  {
    id: 'presentation_2',
    type: 'text',
    question: 'What is your one-line pitch?',
    placeholder: 'Describe your startup in one compelling sentence',
    required: true,
    category: 'presentation',
  },
  {
    id: 'presentation_3',
    type: 'select',
    question: 'Which industry best describes your startup?',
    options: [
      'Enterprise Software/SaaS',
      'Consumer Apps/Services',
      'E-commerce/Marketplace',
      'FinTech',
      'HealthTech',
      'EdTech',
      'PropTech',
      'AgTech',
      'CleanTech',
      'Hardware/IoT',
      'AI/ML',
      'Other',
    ],
    required: true,
    category: 'presentation',
  },
];

// Question flow configuration
export const questionFlow = {
  sections: [
    {
      id: 'problem',
      title: 'The Problem',
      description: 'Let\'s start with the problem you\'re solving',
      icon: 'alert-circle-outline',
      questions: formQuestions.filter(q => q.category === 'problem'),
    },
    {
      id: 'solution',
      title: 'Your Solution',
      description: 'Tell us about your unique solution',
      icon: 'bulb-outline',
      questions: formQuestions.filter(q => q.category === 'solution'),
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      description: 'Help us understand your market',
      icon: 'globe-outline',
      questions: formQuestions.filter(q => q.category === 'market'),
    },
    {
      id: 'businessModel',
      title: 'Business Model',
      description: 'How will you make money?',
      icon: 'cash-outline',
      questions: formQuestions.filter(q => q.category === 'businessModel'),
    },
    {
      id: 'traction',
      title: 'Traction & Growth',
      description: 'Show us your progress so far',
      icon: 'trending-up-outline',
      questions: formQuestions.filter(q => q.category === 'traction'),
    },
    {
      id: 'team',
      title: 'Your Team',
      description: 'Tell us about the people behind the startup',
      icon: 'people-outline',
      questions: formQuestions.filter(q => q.category === 'team'),
    },
    {
      id: 'financials',
      title: 'Financials & Funding',
      description: 'Let\'s talk numbers and funding needs',
      icon: 'calculator-outline',
      questions: formQuestions.filter(q => q.category === 'financials'),
    },
    {
      id: 'competition',
      title: 'Competition',
      description: 'How do you compare to others?',
      icon: 'flag-outline',
      questions: formQuestions.filter(q => q.category === 'competition'),
    },
    {
      id: 'presentation',
      title: 'Final Details',
      description: 'Just a few more details to wrap up',
      icon: 'checkmark-circle-outline',
      questions: formQuestions.filter(q => q.category === 'presentation'),
    },
  ],
};

// Helper function to get question by ID
export const getQuestionById = (id: string): FormQuestion | undefined => {
  return formQuestions.find(q => q.id === id);
};

// Helper function to get questions by category
export const getQuestionsByCategory = (category: string): FormQuestion[] => {
  return formQuestions.filter(q => q.category === category);
};

// Helper function to get next question
export const getNextQuestion = (currentQuestionId: string): FormQuestion | null => {
  const currentIndex = formQuestions.findIndex(q => q.id === currentQuestionId);
  if (currentIndex === -1 || currentIndex === formQuestions.length - 1) {
    return null;
  }
  return formQuestions[currentIndex + 1];
};

// Helper function to get previous question
export const getPreviousQuestion = (currentQuestionId: string): FormQuestion | null => {
  const currentIndex = formQuestions.findIndex(q => q.id === currentQuestionId);
  if (currentIndex <= 0) {
    return null;
  }
  return formQuestions[currentIndex - 1];
};

// Helper function to calculate progress
export const calculateProgress = (currentQuestionId: string): number => {
  const currentIndex = formQuestions.findIndex(q => q.id === currentQuestionId);
  return ((currentIndex + 1) / formQuestions.length) * 100;
};
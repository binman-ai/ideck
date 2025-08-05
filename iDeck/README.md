# iDeck - AI-Powered Investor Deck Analyzer & Builder

![iDeck Logo](assets/icon.png)

## 🎯 Overview

iDeck is a comprehensive React Native application designed for startup founders to analyze their investor decks, receive AI-powered feedback, and get matched with relevant investors. Built with React Native and Expo, it features a beautiful, minimalist UI inspired by modern VC aesthetics.

## ✨ Key Features

### 🔍 Deck Analysis
- **PDF Upload & Analysis**: Upload investor decks and get instant AI-powered feedback
- **Indihub Methodology**: Proprietary 9-point scoring system covering:
  - Problem validation
  - Solution differentiation
  - Market opportunity
  - Business model
  - Traction evidence
  - Team composition
  - Financial projections
  - Competitive analysis
  - Presentation quality

### 📝 Interactive Questionnaire
- **Typeform-style UX**: Fluid, conversational form experience
- **AI-Enhanced Content**: GPT-4 powered content generation and storytelling
- **6 Design Templates**: Choose from professional deck templates
- **Editable Output**: Modify generated content before download

### 🎯 Investor Matching
- **Smart Recommendations**: AI-powered investor matching based on:
  - Industry sector
  - Funding stage
  - Geographic preference
  - Business model alignment
- **Israeli Focus**: Prioritized matching with Israeli VCs and investors
- **Contact Information**: Direct links to investor websites and LinkedIn profiles

### 💳 Freemium Model
- **Free Preview**: Basic analysis and limited insights
- **Premium Features**: Full analysis, investor matching, and deck generation
- **Payment Integration**: Stripe and Apple/Google Pay support

### 🌐 Internationalization
- **Multi-language Support**: English and Hebrew
- **RTL Support**: Full right-to-left layout support for Hebrew
- **Cultural Adaptation**: Israeli startup ecosystem context

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Authentication**: Google OAuth, LinkedIn OAuth, Email/Password
- **AI Integration**: OpenAI GPT-4 API
- **File Handling**: Expo Document Picker, File System
- **Payments**: Stripe SDK (prepared)
- **Animations**: React Native Animatable, Reanimated
- **UI Components**: Custom component library
- **State Management**: React Context API
- **Storage**: AsyncStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ideck.git
   cd ideck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   EXPO_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── ...
├── screens/            # Screen components
│   ├── AuthScreen.tsx
│   ├── DeckUploadScreen.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ...
├── services/           # API and business logic
│   ├── deckAnalysisService.ts
│   └── ...
├── navigation/         # Navigation configuration
├── types/             # TypeScript type definitions
├── config/            # App configuration
├── utils/             # Utility functions
├── assets/            # Images, fonts, etc.
├── locales/           # Internationalization files
└── data/              # Static data and constants
```

## 🔧 Configuration

### Authentication Setup

1. **Google OAuth**
   - Create a project in Google Cloud Console
   - Enable Google+ API
   - Add your client ID to environment variables

2. **LinkedIn OAuth**
   - Create an app in LinkedIn Developer Portal
   - Configure redirect URIs
   - Add client ID to environment variables

### OpenAI Integration

1. Get an API key from OpenAI
2. Add to environment variables
3. Configure usage limits and monitoring

### Deep Linking

The app supports deep linking with the custom scheme `ideck://`

## 🎨 Design System

### Colors
- Primary: `#6366F1` (Indigo)
- Secondary: `#EC4899` (Pink)
- Success: `#10B981` (Emerald)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

### Typography
- Headings: Bold, modern sans-serif
- Body: Regular weight, optimized for readability
- Captions: Lighter weight for secondary information

### Components
- Consistent spacing system (4px grid)
- Rounded corners (4px, 8px, 12px, 16px)
- Subtle shadows and elevation
- Smooth animations and transitions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
expo build:web
```

## 🔒 Security & Privacy

- All API keys are stored securely in environment variables
- User data is encrypted in transit and at rest
- OAuth flows follow industry best practices
- No sensitive data is logged or tracked

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@ideck.app or join our Slack channel.

## 🗺 Roadmap

- [ ] CRM Integration
- [ ] Advanced Analytics Dashboard
- [ ] Investor Communication Tools
- [ ] Deck Collaboration Features
- [ ] API for Third-party Integrations
- [ ] Advanced AI Models
- [ ] Video Pitch Analysis

## 🙏 Acknowledgments

- [Indihub](https://indihub.co.il) for the proprietary methodology
- OpenAI for GPT-4 integration
- The React Native community
- All beta testers and early adopters

---

Built with ❤️ for the startup community
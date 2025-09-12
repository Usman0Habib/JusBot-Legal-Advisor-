# JusBot - AI Legal Assistant

## Overview

JusBot is a conversational AI legal assistant that provides both text-based and voice-based interactions. The application is designed to help users with legal questions while maintaining a casual, approachable personality. Built as a React-based single-page application, JusBot leverages Google's Gemini AI for natural language processing and ElevenLabs for text-to-speech capabilities, creating an immersive voice experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19.1.1 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom gradient backgrounds and animations
- **Component Structure**: Modular component architecture with clear separation of concerns
  - Text interface for traditional chat interactions
  - Voice call interface for audio-based conversations
  - Reusable UI components (icons, typing indicators, conversation logs)

### State Management
- **Approach**: React hooks (useState, useRef, useEffect) for local state management
- **Message Flow**: Centralized message state in App.tsx with prop drilling to child components
- **Chat Sessions**: Persistent chat sessions using Google Gemini's Chat API with system instructions

### AI Integration
- **Primary AI**: Google Gemini 2.5 Flash model for conversational responses
- **System Instructions**: Custom personality definition for legal advisory context
- **Chat Management**: Stateful conversation sessions with message history preservation

### Voice Technology Stack
- **Speech Recognition**: Browser's native Web Speech API with custom TypeScript definitions
- **Text-to-Speech**: ElevenLabs API for realistic voice synthesis
- **Audio Processing**: Blob-based audio handling with automatic cleanup
- **Voice Character**: Rachel voice (ID: 21m00Tcm4TlvDq8ikWAM) for consistent personality

### User Interface Design
- **Dual Mode Interface**: Seamless switching between text and voice interactions
- **Visual Feedback**: Status indicators, animations, and loading states
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Accessibility**: ARIA labels and keyboard navigation support

### Build and Deployment
- **Development**: Vite dev server with HMR on port 5000
- **Environment**: CDN-based module loading for core dependencies
- **Configuration**: Environment variable injection for API keys

## External Dependencies

### AI Services
- **Google Gemini API**: Core conversational AI functionality requiring GEMINI_API_KEY
- **ElevenLabs API**: Voice synthesis service requiring ELEVENLABS_API_KEY

### Frontend Libraries
- **React & React DOM**: UI framework (v19.1.1)
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Google Fonts**: Inter font family for typography

### Development Tools
- **TypeScript**: Type checking and development experience
- **Vite**: Build tool and development server
- **Node.js**: Development environment and tooling

### Browser APIs
- **Web Speech API**: Speech recognition for voice input
- **Media Devices API**: Microphone access permissions
- **Audio API**: Playback of synthesized speech

### Hosting Platform
- **AI Studio**: Deployment platform with app ID 1x96JMLn9lDvGHAyTZjdyZG_ezURTGMm2
- **Module CDN**: aistudiocdn.com for React and Gemini dependencies
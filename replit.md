# BourgeoisAI Chat & Automation Hub

## Overview

BourgeoisAI is a conversational AI sales assistant powered by OpenAI's API (note: despite README mentions of Gemini, the actual implementation uses OpenAI). The system is designed as a serverless chatbot deployed on Vercel with a single-page frontend featuring a floating chat interface. The primary purpose is to drive users toward two specific conversion actions: purchasing a $29 AI Blueprint Workshop or booking a strategy consultation call.

The application follows a minimal architecture pattern with a static frontend and serverless API endpoints, operating within free/low-cost tiers for maximum efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-Page Application (SPA)**: Static HTML/CSS/JavaScript served from `public/index.html`
- **Chat Interface**: Floating chat bubble UI with client-side rendering
- **Session Persistence**: Uses browser `localStorage` to maintain chat history across sessions
- **No Framework Dependencies**: Vanilla JavaScript implementation for minimal overhead

### Backend Architecture
- **Serverless Functions**: Vercel Edge Functions handle API requests
- **API Endpoint**: `/api/cleo-chat.js` serves as the sole backend route
- **Dual Runtime Support**: The API handler supports both Vercel's serverless environment and traditional Node.js Express server (via `server.js`) for local development
- **Request Handling**: Manual JSON body parsing fallback for compatibility across environments

### Conversational AI Design
- **Sales-Focused Persona**: Hardcoded system prompt defines "Thomas, the BourgeoisAI Sales Expert"
- **Strict Response Constraints**: 
  - Maximum two sentences per response
  - Mandatory call-to-action (CTA) in every reply
  - ROI-focused, professional tone
- **Conversion Funneling**: All conversations directed toward two outcomes:
  1. Workshop purchase ($29 via Gumroad)
  2. Strategy call booking (via Calendly)

### Routing Strategy
- **SPA Rewrites**: `vercel.json` configured to route all non-API requests to `index.html`
- **API Isolation**: `/api/*` paths preserved for serverless function execution
- **Fallback Handling**: Catch-all route ensures SPA behavior

### Development vs Production
- **Replit Environment**: Express server (`server.js`) serves static files and handles API routing
- **Server Configuration**: Runs on port 5000, bound to 0.0.0.0 for Replit compatibility
- **Environment Parity**: API handler code remains unchanged from original Vercel implementation

## External Dependencies

### AI Service Integration
- **OpenAI API**: Primary conversational AI provider
  - Model: Not explicitly specified (likely GPT-3.5/4)
  - Authentication: API key stored in `OPENAI_API_KEY` environment variable
  - Security: API key never exposed client-side, accessed only in serverless functions

### Payment & Scheduling Services
- **Gumroad**: Workshop payment processing
  - Product link: Hardcoded in system prompt
  - No backend integration required (external redirect)
- **Calendly**: Strategy call scheduling
  - Booking link: Hardcoded in system prompt
  - No backend integration required (external redirect)

### Hosting & Deployment
- **Vercel Platform**: 
  - Serverless function hosting
  - Static file serving
  - Environment variable management
  - Edge network distribution

### Runtime Dependencies
- **express** (^4.18.2): HTTP server framework for local development
- **openai** (^4.0.0): Official OpenAI Node.js SDK for API communication
- **resend** (^4.0.0): Email delivery service for contact form submissions

### Email Integration
- **Resend API**: Transactional email service for the contact/support form
  - Authentication: Managed via Replit connection settings (automatic key rotation)
  - Recipient: bourgeoisaisupport@proton.me
  - Security: HTML sanitization prevents injection attacks, server-side email validation
  - Form fields: Name, email address, message
  - API endpoint: `/api/send-email`

### Environment Variables
- `OPENAI_API_KEY`: Required for AI chat functionality
- `PORT`: Optional, defaults to 5000 for local development
- `REPLIT_CONNECTORS_HOSTNAME`: Automatically provided by Replit for connector authentication
- `REPL_IDENTITY` / `WEB_REPL_RENEWAL`: Automatically provided for Resend connection authentication

### Note on Database
No database is currently implemented. Chat history is stored client-side only via localStorage. This means:
- No server-side conversation persistence
- No user account system
- No analytics on conversation patterns
- Potential future enhancement: Add database for conversation logging and analytics
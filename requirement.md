# 📋 Healify — Project Requirements Document

> **Version:** 1.0  
> **Date:** March 5, 2026  
> **Status:** Draft  

---

## 📖 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features (Major 5 + 1)](#2-core-features)
3. [Optional Features](#3-optional-features)
4. [Tech Stack](#4-tech-stack)
5. [System Architecture](#5-system-architecture)
6. [API Specifications](#6-api-specifications)
7. [Database Schema](#7-database-schema)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [Environment & Deployment](#10-environment--deployment)

---

## 1. Project Overview

**Healify** is an AI-powered healthcare assistant web application designed to make healthcare more accessible, intelligent, and user-friendly. It leverages modern AI/ML technologies — including OCR, voice transcription, LLM-based chatbots, and web crawling — to provide features like symptom analysis, prescription reading, appointment booking, real-time medicine pricing, and an AI-based accessibility agent.

### 1.1 Problem Statement

Navigating the healthcare system can be overwhelming. Patients often struggle with:

- Understanding their symptoms and knowing when to seek medical advice.
- Deciphering handwritten or printed prescriptions and managing dosage schedules.
- Booking appointments with the right doctors quickly.
- Finding affordable medicine prices across different pharmacies.
- Accessing healthcare information in their preferred language.

### 1.2 Proposed Solution

Healify addresses these challenges by combining **AI-driven analysis**, **voice-enabled multilingual support**, and **real-time data lookup** into a single, easy-to-use platform.

### 1.3 Target Users

| User Type | Description |
|---|---|
| **Patients** | Individuals seeking symptom analysis, prescription management, and affordable medications. |
| **Caregivers** | Family members managing healthcare for elderly or dependent individuals. |
| **Doctors** | Healthcare providers managing appointments and patient interactions. |

---

## 2. Core Features

### 2.1 🩺 Symptom Analyzer with Voice Transcription

**Priority:** P0 (Must Have)

#### Description
Allows users to describe their symptoms via **text or voice input**. The system transcribes voice input using **Sarvam AI**, analyzes the symptoms using an LLM, and provides potential conditions, severity assessment, and recommended next steps.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| SA-01 | Text-based symptom input | Users can type symptoms in a text field. |
| SA-02 | Voice-based symptom input | Users can record/speak symptoms; audio is transcribed to text via Sarvam AI. |
| SA-03 | Multilingual voice support | Voice input supports multiple Indian languages (Hindi, Tamil, Telugu, Bengali, etc.) via Sarvam API. |
| SA-04 | AI symptom analysis | Transcribed/typed symptoms are sent to the GROQ AI API for analysis. |
| SA-05 | Severity assessment | The AI returns a severity level (Low / Medium / High / Critical). |
| SA-06 | Condition suggestions | The AI suggests possible conditions based on symptoms. |
| SA-07 | Next steps & recommendations | Suggest home remedies, OTC medications, or doctor visit recommendations. |
| SA-08 | Symptom history | Store past symptom analyses for logged-in users. |

#### User Flow
```
User opens Symptom Analyzer
  → Chooses Text or Voice input
  → (If Voice) Records audio → Sarvam AI transcribes to text
  → Symptoms sent to GROQ AI for analysis
  → Results displayed: Possible conditions, severity, recommendations
  → Option to book an appointment based on results
```

---

### 2.2 💊 Prescription Reader with Smart Dosage Reminder

**Priority:** P0 (Must Have)

#### Description
Users can upload a photo/scan of their prescription. The system uses **Tesseract OCR** to extract medication details and creates a **smart dosage schedule** with reminders.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| PR-01 | Prescription image upload | Support for JPEG, PNG, PDF formats. |
| PR-02 | OCR text extraction | Use Tesseract OCR to extract text from prescription images. |
| PR-03 | AI-powered parsing | Parse extracted text using GROQ AI to identify medication names, dosages, frequency, and duration. |
| PR-04 | Structured output | Display parsed prescription in a clean, readable format. |
| PR-05 | Dosage schedule generation | Auto-generate a dosage timetable based on parsed prescription. |
| PR-06 | Smart reminders | Send browser/push notifications for medication reminders. |
| PR-07 | Drug interaction warnings | Flag potential drug interactions using AI analysis. |
| PR-08 | Prescription history | Store past prescriptions for logged-in users. |

#### User Flow
```
User uploads prescription image
  → Tesseract OCR extracts text
  → GROQ AI parses medications, dosages, frequency
  → Structured prescription displayed
  → Smart dosage schedule generated
  → Reminders set (browser notifications)
```

---

### 2.3 📅 Appointment Booking (Instant Doctor & Collaborative)

**Priority:** P0 (Must Have)

#### Description
Users can book appointments with doctors. The system supports **instant booking** for available doctors and **collaborative scheduling** for specific doctor requests.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| AB-01 | Doctor listing | Display available doctors with specialization, rating, and availability. |
| AB-02 | Search & filter | Filter doctors by specialization, location, availability, and rating. |
| AB-03 | Instant booking | Book with any available doctor for immediate consultation. |
| AB-04 | Collaborative scheduling | Request a specific doctor; system coordinates availability between patient and doctor. |
| AB-05 | Time slot selection | Display available time slots for selected doctor/date. |
| AB-06 | Booking confirmation | Send confirmation via email/in-app notification. |
| AB-07 | Appointment management | View, reschedule, or cancel upcoming appointments. |
| AB-08 | Doctor dashboard | Doctors can view and manage their appointment calendar. |

#### User Flow
```
User navigates to Appointments
  → Browses doctor listings OR uses instant booking
  → Selects doctor → Views available slots
  → Confirms booking → Receives confirmation
  → (Doctor receives notification of new appointment)
```

---

### 2.4 💰 Real-Time Medicine Price Lookup (APIs)

**Priority:** P0 (Must Have)

#### Description
Users can search for medicines and compare **real-time prices** across multiple pharmacies using external APIs.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| MP-01 | Medicine search | Search by medicine name, brand, or generic name. |
| MP-02 | Real-time pricing | Fetch live prices from pharmacy APIs. |
| MP-03 | Price comparison | Compare prices across multiple pharmacies side-by-side. |
| MP-04 | Generic alternatives | Suggest cheaper generic alternatives for branded medicines. |
| MP-05 | Pharmacy locations | Show nearby pharmacies with stock availability. |
| MP-06 | Price alerts | Allow users to set price drop alerts for specific medicines. |
| MP-07 | Integration with prescription | Auto-lookup prices for medicines from parsed prescriptions. |

---

### 2.5 🤖 AI-Based Site Agent for Accessibility & Help

**Priority:** P0 (Must Have)

#### Description
An AI-powered **site-wide agent** that assists users in navigating the platform, filling forms, and accessing features. It uses **web crawling** and **LLM-based reasoning** to understand context and provide help.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| AG-01 | Floating help widget | Persistent AI assistant widget accessible from any page. |
| AG-02 | Natural language commands | Users can ask questions or give commands in natural language. |
| AG-03 | Page navigation assistance | AI can guide users to specific features or pages. |
| AG-04 | Form-filling assistance | AI can help users fill out forms by asking questions conversationally. |
| AG-05 | Contextual help | AI understands the current page context and provides relevant help. |
| AG-06 | Crawling-based knowledge | Uses web crawling to build knowledge base of site content. |
| AG-07 | LLM-powered responses | Responses generated by GROQ AI for accurate, context-aware answers. |
| AG-08 | Multilingual support | Serves assistance in multiple languages via Sarvam API. |

---

### 2.6 💬 Interactive Chat Bot

**Priority:** P0 (Must Have)

#### Description
A general-purpose healthcare chatbot powered by **GROQ AI** that users can converse with for health-related queries, general wellness tips, mental health support, and more.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| CB-01 | Real-time chat interface | Smooth, responsive chat UI with message bubbles. |
| CB-02 | Health Q&A | Answer general health and wellness questions. |
| CB-03 | Context-aware conversations | Maintain conversation history within a session for contextual responses. |
| CB-04 | Medical disclaimer | Display appropriate medical disclaimers with AI-generated advice. |
| CB-05 | Voice input/output | Support voice-based interaction via Sarvam AI (STT & TTS). |
| CB-06 | Chat history | Store chat history for logged-in users. |
| CB-07 | Quick action suggestions | Suggest relevant actions (book appointment, check prices, etc.) based on conversation. |

---

## 3. Optional Features

### 3.1 🔬 X-Ray and Blood Report Analyzer

**Priority:** P1 (Nice to Have)

#### Description
Users can upload X-ray images or blood test reports. The AI analyzes them and provides preliminary observations and recommendations.

#### Functional Requirements

| ID | Requirement | Details |
|---|---|---|
| XB-01 | X-ray image upload | Upload X-ray images (JPEG, PNG, DICOM). |
| XB-02 | AI-based X-ray analysis | Use an AI/ML model to detect anomalies in X-ray images. |
| XB-03 | Blood report upload | Upload blood test reports (PDF, image). |
| XB-04 | Blood report parsing | OCR + AI to extract and interpret blood test values. |
| XB-05 | Normal range comparison | Compare extracted values against normal reference ranges. |
| XB-06 | Preliminary observations | Provide AI-generated observations (with medical disclaimer). |
| XB-07 | Shareable report summary | Generate a shareable summary for doctor consultation. |

---

## 4. Tech Stack

### 4.1 Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | User interface and client-side logic |
| **Backend** | Express.js (Node.js) | REST API server and business logic |
| **Authentication** | JWT (JSON Web Tokens) | Secure user authentication and session management |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database for all application data |
| **AI / OCR** | Tesseract.js / Tesseract OCR | Prescription text extraction from images |
| **Voice & Translation** | Sarvam AI API | Speech-to-text, text-to-speech, and multilingual translation |
| **Chatbot / LLM** | GROQ AI API | Symptom analysis, chatbot responses, and AI reasoning |
| **Web Crawling** | Cheerio / Puppeteer | Site content crawling for AI agent knowledge base |

### 4.2 Frontend (React)

- **Framework:** React 18+ with functional components and hooks
- **Routing:** React Router v6
- **State Management:** React Context API / Redux Toolkit (as needed)
- **Styling:** CSS Modules / Styled Components
- **HTTP Client:** Axios
- **Notifications:** React Toastify / Browser Push Notifications API
- **Voice Recording:** Web Audio API / MediaRecorder API

### 4.3 Backend (Express.js)

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT with bcrypt for password hashing
- **Middleware:** CORS, Helmet (security), Morgan (logging), Multer (file uploads)
- **Validation:** Joi / express-validator
- **File Processing:** Multer for image uploads, Sharp for image optimization

### 4.4 AI & ML Setup

| Tool | Use Case |
|---|---|
| **Tesseract OCR** | Extract text from prescription images |
| **Sarvam AI API** | Voice transcription (STT), text-to-speech (TTS), multilingual support |
| **GROQ AI API** | Chatbot engine, symptom analysis, prescription parsing, general AI reasoning |

### 4.5 Database (MongoDB Atlas)

- **Hosting:** MongoDB Atlas (cloud)
- **ODM:** Mongoose
- **Key considerations:** Indexing for search performance, TTL indexes for session cleanup

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Symptom  │ │Prescriptn│ │Appointmnt│ │ Medicine │ │ ChatBot  │  │
│  │ Analyzer │ │ Reader   │ │ Booking  │ │ Prices   │ │          │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │             │            │        │
│  ┌────┴─────────────┴────────────┴─────────────┴────────────┴────┐  │
│  │                     API Service Layer (Axios)                  │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
└───────────────────────────────┼──────────────────────────────────────┘
                                │ HTTP/REST
┌───────────────────────────────┼──────────────────────────────────────┐
│                        BACKEND (Express.js)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │   Auth     │  │  Routes    │  │ Middleware  │  │  Controllers │   │
│  │  (JWT)     │  │            │  │ (CORS,etc) │  │              │   │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘   │
│        │               │               │                │           │
│  ┌─────┴───────────────┴───────────────┴────────────────┴────────┐  │
│  │                      Service Layer                             │  │
│  └──┬──────────┬──────────────┬──────────────┬───────────────────┘  │
│     │          │              │              │                      │
│  ┌──┴───┐  ┌──┴───┐   ┌─────┴─────┐  ┌────┴─────┐                │
│  │Tesser│  │Sarvam│   │  GROQ AI  │  │ External │                │
│  │ act  │  │  AI  │   │   API     │  │   APIs   │                │
│  │ OCR  │  │ API  │   │           │  │(Med Price│                │
│  └──────┘  └──────┘   └───────────┘  └──────────┘                │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    MongoDB Atlas (Mongoose)                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. API Specifications

### 6.1 Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (patient/doctor) |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `POST` | `/api/auth/logout` | Invalidate JWT token |
| `GET` | `/api/auth/profile` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |

### 6.2 Symptom Analyzer APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/symptoms/analyze` | Submit symptoms (text) for AI analysis |
| `POST` | `/api/symptoms/voice` | Upload voice recording for transcription + analysis |
| `GET` | `/api/symptoms/history` | Get past symptom analysis records |

### 6.3 Prescription APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/prescription/upload` | Upload prescription image for OCR processing |
| `GET` | `/api/prescription/:id` | Get parsed prescription details |
| `GET` | `/api/prescription/history` | Get past prescriptions |
| `POST` | `/api/prescription/:id/reminders` | Set dosage reminders for a prescription |
| `GET` | `/api/prescription/:id/schedule` | Get dosage schedule |

### 6.4 Appointment APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/doctors` | List all doctors with filters |
| `GET` | `/api/doctors/:id/slots` | Get available time slots for a doctor |
| `POST` | `/api/appointments/book` | Book an appointment |
| `GET` | `/api/appointments` | Get user's appointments |
| `PUT` | `/api/appointments/:id` | Reschedule an appointment |
| `DELETE` | `/api/appointments/:id` | Cancel an appointment |
| `POST` | `/api/appointments/instant` | Instant booking with any available doctor |

### 6.5 Medicine Price APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/medicines/search?q=` | Search medicines by name |
| `GET` | `/api/medicines/:id/prices` | Get real-time prices from multiple pharmacies |
| `GET` | `/api/medicines/:id/alternatives` | Get generic alternatives |
| `POST` | `/api/medicines/alerts` | Set price drop alert |

### 6.6 Chatbot APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat/message` | Send a message and get AI response |
| `POST` | `/api/chat/voice` | Send voice message for STT + AI response |
| `GET` | `/api/chat/history` | Get chat history |

### 6.7 AI Agent APIs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/agent/query` | Send a natural language query to the AI agent |
| `GET` | `/api/agent/context/:page` | Get contextual help for a specific page |

---

## 7. Database Schema

### 7.1 Users Collection

```javascript
{
  _id: ObjectId,
  name: String,              // Full name
  email: String,             // Unique, indexed
  password: String,          // Hashed with bcrypt
  role: String,              // "patient" | "doctor" | "admin"
  phone: String,
  dateOfBirth: Date,
  gender: String,            // "male" | "female" | "other"
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  // Doctor-specific fields
  specialization: String,
  qualifications: [String],
  experience: Number,        // Years
  consultationFee: Number,
  rating: Number,
  availableSlots: [{
    day: String,             // "Monday", "Tuesday", etc.
    startTime: String,       // "09:00"
    endTime: String          // "17:00"
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 7.2 Symptoms Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Ref: Users
  inputType: String,         // "text" | "voice"
  originalLanguage: String,  // e.g., "hi", "en", "ta"
  rawInput: String,          // Original text or transcription
  translatedInput: String,   // English translation (if needed)
  analysis: {
    possibleConditions: [{
      name: String,
      probability: String,   // "High" | "Medium" | "Low"
      description: String
    }],
    severity: String,        // "Low" | "Medium" | "High" | "Critical"
    recommendations: [String],
    shouldSeeDoctor: Boolean
  },
  createdAt: Date
}
```

### 7.3 Prescriptions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Ref: Users
  imageUrl: String,          // Stored image path/URL
  rawOcrText: String,        // Raw Tesseract output
  parsedData: {
    doctorName: String,
    patientName: String,
    date: Date,
    medications: [{
      name: String,
      dosage: String,        // e.g., "500mg"
      frequency: String,     // e.g., "Twice daily"
      duration: String,      // e.g., "7 days"
      instructions: String   // e.g., "After meals"
    }],
    diagnosis: String,
    notes: String
  },
  reminders: [{
    medicationIndex: Number,
    times: [String],         // ["08:00", "20:00"]
    isActive: Boolean
  }],
  interactions: [{
    drug1: String,
    drug2: String,
    severity: String,
    description: String
  }],
  createdAt: Date
}
```

### 7.4 Appointments Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId,       // Ref: Users
  doctorId: ObjectId,        // Ref: Users
  type: String,              // "instant" | "scheduled" | "collaborative"
  date: Date,
  timeSlot: {
    start: String,           // "10:00"
    end: String              // "10:30"
  },
  status: String,            // "pending" | "confirmed" | "completed" | "cancelled"
  reason: String,            // Reason for visit
  notes: String,             // Doctor's notes (post-appointment)
  createdAt: Date,
  updatedAt: Date
}
```

### 7.5 Chat History Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Ref: Users
  sessionId: String,         // Group messages by session
  messages: [{
    role: String,            // "user" | "assistant"
    content: String,
    inputType: String,       // "text" | "voice"
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|---|---|
| API response time | < 500ms (excluding AI processing) |
| AI analysis response | < 5 seconds |
| OCR processing time | < 10 seconds per image |
| Voice transcription | < 3 seconds for 30s audio |
| Page load time | < 2 seconds (first meaningful paint) |

### 8.2 Security

| Requirement | Implementation |
|---|---|
| Authentication | JWT tokens with expiration (24h access, 7d refresh) |
| Password storage | bcrypt hashing with salt rounds ≥ 10 |
| API security | Rate limiting, CORS, Helmet headers |
| Data encryption | HTTPS/TLS for all API communication |
| Input validation | Server-side validation on all endpoints |
| File upload security | File type validation, size limits (max 10MB), virus scanning |

### 8.3 Scalability

- MongoDB Atlas auto-scaling for database tier
- Stateless backend design for horizontal scaling
- CDN for static assets (React build)
- Image compression before storage

### 8.4 Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Voice-based interaction as an alternative to text
- Multilingual support (via Sarvam AI)

### 8.5 Reliability

- 99.5% uptime target
- Graceful error handling with user-friendly messages
- Fallback mechanisms when third-party APIs are unavailable
- Database backups via MongoDB Atlas

---

## 9. Third-Party Integrations

| Service | Purpose | Authentication |
|---|---|---|
| **Sarvam AI** | Speech-to-text, text-to-speech, translation | API Key |
| **GROQ AI** | LLM for chatbot, symptom analysis, prescription parsing | API Key |
| **Tesseract OCR** | Prescription image text extraction | N/A (local library) |
| **Medicine Price APIs** | Real-time drug pricing data | API Key (vendor-specific) |
| **MongoDB Atlas** | Cloud database hosting | Connection string with credentials |

### 9.1 API Key Management

- All API keys stored in `.env` file (never committed to Git)
- Environment-specific configs for dev/staging/production
- Keys rotated periodically for security

---

## 10. Environment & Deployment

### 10.1 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/healify

# Authentication
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Sarvam AI
SARVAM_API_KEY=<your-sarvam-api-key>
SARVAM_API_URL=https://api.sarvam.ai

# GROQ AI
GROQ_API_KEY=<your-groq-api-key>

# Medicine Price API
MED_PRICE_API_KEY=<your-api-key>
MED_PRICE_API_URL=<api-base-url>

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads
```

### 10.2 Development Setup

```bash
# Clone repository
git clone <repository-url>
cd healify

# Backend setup
cd server
npm install
cp .env.example .env   # Configure environment variables
npm run dev             # Start development server

# Frontend setup
cd ../client
npm install
npm start               # Start React development server
```

### 10.3 Project Folder Structure

```
healify/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ChatBot/
│   │   │   ├── SymptomAnalyzer/
│   │   │   ├── PrescriptionReader/
│   │   │   ├── AppointmentBooking/
│   │   │   ├── MedicinePrice/
│   │   │   ├── AIAgent/
│   │   │   └── common/         # Shared components (Navbar, Footer, etc.)
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API call functions
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                     # Express.js Backend
│   ├── config/                 # DB connection, environment config
│   ├── controllers/            # Route handler logic
│   ├── middleware/              # Auth, error handling, file upload
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic & external API calls
│   │   ├── ocrService.js       # Tesseract OCR processing
│   │   ├── sarvamService.js    # Sarvam AI integration
│   │   ├── groqService.js      # GROQ AI integration
│   │   └── medPriceService.js  # Medicine price API
│   ├── utils/                  # Helper functions
│   ├── uploads/                # Uploaded files (gitignored)
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   └── package.json
│
├── .env.example                # Environment variable template
├── .gitignore
├── README.md
└── requirement.md              # This document
```

---

## 11. Milestones & Timeline

| Phase | Features | Estimated Duration |
|---|---|---|
| **Phase 1 — Foundation** | Project setup, Auth (JWT), Database schema, Basic UI shell | 1 week |
| **Phase 2 — Core AI** | Symptom Analyzer (with voice), Prescription Reader (with OCR), Chatbot | 2 weeks |
| **Phase 3 — Booking & Pricing** | Appointment Booking system, Real-time Medicine Prices | 1.5 weeks |
| **Phase 4 — AI Agent** | Site-wide AI Agent with crawling, contextual help | 1.5 weeks |
| **Phase 5 — Polish** | UI/UX refinement, testing, bug fixes, deployment | 1 week |
| **Phase 6 — Optional** | X-Ray & Blood Report Analyzer | 1–2 weeks |

---

## 12. Acceptance Criteria

- [ ] Users can register, login, and manage their profiles.
- [ ] Symptom Analyzer accepts text and voice input and returns AI-generated analysis.
- [ ] Voice input works in at least 3 Indian languages (Hindi, Tamil, English).
- [ ] Prescription images are accurately parsed using OCR and displayed in structured format.
- [ ] Dosage reminders can be set and trigger browser notifications.
- [ ] Doctors can be searched, filtered, and appointments can be booked.
- [ ] Medicine prices are fetched in real-time and compared across pharmacies.
- [ ] AI Agent provides contextual, multilingual help across all pages.
- [ ] Chatbot maintains conversation context and provides medically relevant responses.
- [ ] All API endpoints are secured with JWT authentication.
- [ ] Application is responsive and works on mobile, tablet, and desktop.
- [ ] Medical disclaimers are displayed wherever AI-generated health advice is shown.

---

> **Note:** This is a living document. Requirements may be updated as the project evolves.

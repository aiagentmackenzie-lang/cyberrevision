# CyberRevision

An AI-powered cybersecurity study platform. Built to help anyone in the field—or anyone looking to enter it—study, test their knowledge, and get AI tutoring on critical security concepts.

## What This Is

CyberRevision is a modern study platform for the Google Cybersecurity Certificate curriculum. It combines structured content, interactive quizzes, and an AI tutor in one clean, fast interface.

**Key Features:**
- 📚 **8 Courses, 25 Modules** — Full cybersecurity curriculum coverage
- 🎯 **AI Tutor (Claude)** — Ask questions about any module, get contextual help
- 📝 **Socratic Examiner** — AI-driven practice testing with feedback
- ✅ **MCQ Quiz Engine** — 25 pre-generated question banks with explanations
- 📊 **Progress Tracking** — Module visit counter and quiz completion checkmarks
- 🔗 **Direct Linking** — Share links to any module (`#course/module-id`)

## Who It's For

- **Students** preparing for cybersecurity certifications
- **Professionals** brushing up on fundamentals
- **Career switchers** exploring the security field
- **Self-learners** building knowledge systematically

## Curriculum Coverage

### 1. Foundations of Cybersecurity
- Introduction to Cybersecurity
- Security Lifecycle
- Security Frameworks & Controls

### 2. Play It Safe: Manage Security Risks
- Security Frameworks
- Risk Management
- Security Controls

### 3. Connect and Protect: Networks & Network Security
- Network Fundamentals
- Network Protocols
- Network Security

### 4. Tools of the Trade: Linux & SQL
- Linux Fundamentals
- Linux Security
- SQL for Security

### 5. Assets, Threats, and Vulnerabilities
- Asset Management
- Threat Landscape
- Vulnerability Management

### 6. Sound the Alarm: Detection & Response
- Detection Systems
- Incident Response
- Forensics & Investigation

### 7. Automate Cybersecurity Tasks with Python
- Python Fundamentals
- Security Scripting
- Automation & Orchestration

### 8. Put It to Work: Prepare for Cybersecurity Jobs
- Job Search Strategy
- Resume & Portfolio
- Interview Prep
- Continuous Learning

## Technical Stack

| Layer | Technology |
|-------|------------|
| **Build Tool** | Vite |
| **Frontend** | Vanilla HTML5, CSS (modular), ES modules |
| **Rendering** | Marked.js for Markdown |
| **Security** | DOMPurify for sanitization |
| **AI Backend** | Vercel Serverless Functions (Node.js) |
| **AI Model** | Claude (Anthropic API) |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |

## Design

- **Dark theme** — Optimized for long study sessions
- **Split-pane layout** — Persistent navigation + content area
- **Hash-based routing** — Direct linking to any module
- **Responsive grid** — Adapts to screen size
- **Progress tracking** — Visited modules + quiz completions

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required Environment Variable:**
- `CLAUDE_API_KEY` — Your Anthropic API key

Set this in your Vercel project dashboard: **Settings → Environment Variables**

## AI Features

### Ask Claude (Tutor Mode)
Ask questions about any module's content. The AI stays contextually grounded in the module you're viewing and won't reveal quiz answers.

### Test Me (Examiner Mode)
A Socratic examiner that tests your understanding with follow-up questions. Includes "End Session" to get a performance summary.

Both features stream responses in real-time for a responsive experience.

## Quiz System

Each module has a dedicated quiz bank (25 total):
- Multiple choice questions
- Immediate feedback with explanations
- Score tracking with localStorage persistence
- "Try Again" option for review

## Philosophy

Study tools should get out of the way. This site prioritizes:

- **Speed:** Vite-optimized builds, no bloat
- **Focus:** Clean typography, minimal distractions
- **Accessibility:** Keyboard-navigable, screen-reader friendly
- **AI Integration:** Helpful, not intrusive
- **Portability:** Runs anywhere with a browser

## License

Proprietary. All rights reserved.

---

*Built while studying for the Google Cybersecurity Certificate.*

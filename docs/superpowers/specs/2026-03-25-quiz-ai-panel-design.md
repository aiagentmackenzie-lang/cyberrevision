# CyberRevision — Quiz & AI Panel Design Spec
**Date:** 2026-03-25
**Status:** Approved

---

## Overview

Add two interactive learning features to CyberRevision:

1. **MCQ Quiz** — per-module multiple-choice quizzes with pre-generated question banks
2. **AI Panel** — a persistent Claude-powered panel below each module with tutor (Ask) and examiner (Test Me) modes

Delivered via a lightweight Vite migration that preserves the existing vanilla JS architecture and enables a secure Vercel serverless API proxy.

---

## Architecture

```
cybersecurity-site/
├── index.html              (CDN script tags moved above module entry — see Vite section)
├── package.json            (new — Vite devDep)
├── vite.config.js          (new — minimal config)
├── .env                    (new — gitignored, no sensitive keys)
├── vercel.json             (new — /api/* routing, build command)
├── api/
│   └── chat.js             (new — Vercel serverless Claude proxy)
├── css/                    (unchanged)
├── js/
│   ├── app.js              (minor — import quiz.js + ai-panel.js)
│   ├── router.js           (unchanged)
│   ├── nav.js              (minor — listen for quizComplete, show ✓)
│   ├── renderer.js         (minor — enable quiz btn, fire moduleRendered)
│   ├── quiz.js             (new — MCQ engine)
│   └── ai-panel.js         (new — tutor/examiner panel)
└── content/
    ├── courses.json        (update — quiz fields with filenames)
    ├── 01-foundations/
    │   ├── 01-introduction-to-cybersecurity.md
    │   └── 01-introduction-to-cybersecurity.quiz.json
    └── ... (25 quiz JSON files total — one per module, all 25 modules covered)
```

---

## Feature 1: MCQ Quiz System

### Module Coverage

All **25 modules** across all 8 courses get a quiz file. The count is confirmed from the existing content directory. Every module in `courses.json` will have its `"quiz"` field populated.

### Quiz JSON Naming Convention

Files are named `{moduleId}.quiz.json` and co-located with the module's `.md` file:

```
content/01-foundations/01-introduction-to-cybersecurity.quiz.json
content/01-foundations/02-security-lifecycle.quiz.json
...
content/08-job-prep/04-continuous-learning.quiz.json
```

### Quiz JSON Format

```json
{
  "moduleId": "01-foundations/01-introduction-to-cybersecurity",
  "questions": [
    {
      "id": "q1",
      "question": "What does 'Defense in Depth' mean?",
      "options": [
        "A single strong firewall",
        "Multiple layered security controls",
        "Encrypting all data at rest",
        "Using antivirus software only"
      ],
      "correct": 1,
      "explanation": "Defense in Depth uses multiple overlapping layers so that if one fails, others remain."
    }
  ]
}
```

- **8–12 questions per module**, ~250 questions total
- Questions cover recall, application, and scenario-based reasoning
- Drawn directly from module Markdown content
- **Generation:** all 25 quiz JSON files are AI-generated from the existing `.md` files as part of this implementation (not hand-authored)
- `correct` is a zero-based index into `options`
- `explanation` shown after every answer (correct and incorrect)

### courses.json Update

```json
{ "id": "01-introduction-to-cybersecurity", "title": "...", "quiz": "01-introduction-to-cybersecurity.quiz.json" }
```

The `quiz` field contains only the **filename** (not a path). `quiz.js` resolves the full fetch URL as `content/{courseId}/{quizFile}` where `courseId` is the current route's course ID and `quizFile` is the value from `courses.json`.

### Quiz Flow

1. User clicks **"Quiz →"** button in module footer
2. Content panel replaces module view with quiz
3. Questions shown one at a time
4. User selects option → immediate feedback:
   - Correct: green highlight
   - Incorrect: red highlight + correct answer revealed
   - Explanation always shown
5. **Final score screen:** X/Y correct, "Review Module" link, "Try Again" button
6. Score written to `localStorage` after final question is answered
7. Sidebar ✓ indicator updated via `quizComplete` event

### Quiz Score Storage Schema

```js
// localStorage key: "quiz:{courseId}/{moduleId}"
// Value (JSON string):
{
  "score": 7,        // number correct
  "total": 10,       // total questions
  "attempted": true  // always true when key exists
}
```

"Completed" = any attempt where all questions were answered, regardless of score. No pass/fail threshold.

### quizComplete Event Contract

`quiz.js` dispatches on `document` after writing to localStorage:

```js
document.dispatchEvent(new CustomEvent('quizComplete', {
  detail: { courseId: string, moduleId: string, score: number, total: number }
}));
```

`nav.js` listens on `document` for `quizComplete` and adds a ✓ to the matching `.module-item` element using `data-course-id` + `data-module-id` attributes (already present in the DOM).

On page load, `nav.js` restores ✓ indicators after `buildSidebar()` completes (i.e., after the module DOM elements exist). The restoration loop iterates over the already-loaded `courses` array (fetched as part of `initNav()`), checks `localStorage` for each `"quiz:{courseId}/{moduleId}"` key, and adds ✓ to any matching `.module-item` element found in the DOM.

---

## Feature 2: AI Panel

### Placement

Panel rendered below module content — not a modal, not a sidebar. Visible on every module page. Two tabs at the top:

```
[ Ask Claude ]  [ Test Me ]
```

**"Persistent" defined:** The panel DOM element exists for the lifetime of the module page view. Chat history is **in-memory only** and clears on module navigation (when `moduleRendered` fires for a new module).

### Module Context Handling

Module Markdown is truncated to **6,000 characters** before being sent as context. Truncation strategy: find the last `\n\n` at or before the 6,000-char position; if none exists within the first 6,000 chars (e.g., one large unbroken block), hard-cut at exactly 6,000 characters. All current modules are under this limit; the cap protects against future content growth.

### Ask Claude (Tutor Mode)

- Chat thread scoped to the current module
- History in-memory, cleared on navigation
- Each request body:
  ```json
  {
    "messages": [/* full in-memory history */],
    "systemPrompt": "...",
    "moduleContext": "/* truncated markdown */"
  }
  ```
- Responses rendered as streaming text (arrives token by token)
- Input: single text field + Send button; Send disabled while streaming

### Test Me (Socratic Examiner Mode)

- On tab activate: `ai-panel.js` POSTs to `/api/chat` with examiner system prompt to get Claude's opening question
- User types free-text answer → POST to `/api/chat` with conversation history
- Claude responds: correctness assessment + follow-up question or new topic
- **"End Session"** button visible at all times once session starts
- On click: POST with `{ endSession: true }` flag → Claude sends one final summary (strengths + gaps)
- After summary streams in: input field and End Session button both disabled; "Start New Session" button shown
- Session state (history + active/ended flag) resets when `moduleRendered` fires for a new module
- **Tab switch behaviour:** if the user switches to "Ask Claude" and back while a Test Me session is ended, the ended state persists — disabled input and "Start New Session" button remain visible. State only resets on module navigation.

### System Prompts

**Tutor (Ask Claude) system prompt:**
```
You are a cybersecurity tutor helping a student study the following module: "{moduleTitle}".
Stay strictly on topics covered in this module. Use precise cybersecurity terminology.
Never reveal answers to quiz questions. If asked something outside this module's scope,
redirect the student back to the current topic. Be concise and clear.

Module content:
{moduleContext}
```

**Examiner (Test Me) system prompt:**
```
You are a Socratic cybersecurity examiner testing a student on: "{moduleTitle}".
Ask one clear question at a time based on the module content below. After the student answers,
assess correctness, point out any gaps, then ask a follow-up question on the same or a related topic.
When the student ends the session (indicated by endSession: true in the request), provide a brief
summary: what they demonstrated well and what needs more study. Do not go off-topic.

Module content:
{moduleContext}
```

### API Flow

```
Browser → POST /api/chat → Vercel Function → Anthropic API → chunked text stream → Browser
```

**Protocol:** The Vercel function receives Anthropic's SSE stream, **strips the SSE framing** (`data:` prefix, `[DONE]` terminator), and forwards raw text token chunks as `text/plain; charset=utf-8` with `Transfer-Encoding: chunked`. The browser consumes this via `fetch` + `response.body.getReader()` + `TextDecoder`, appending each decoded chunk to the active message bubble.

This avoids SSE parsing on the client. The proxy is responsible for the SSE→plain-text conversion; the client sees only raw text.

**Vercel function (`api/chat.js`):**
- Reads `CLAUDE_API_KEY` from Vercel env vars
- Accepts POST: `{ messages, systemPrompt, moduleContext, endSession? }`
- Calls Anthropic API with streaming enabled
- Pipes text chunks directly to response
- Error responses:
  - 401 (invalid key) → `{ "error": "Authentication failed" }`
  - 429 (rate limit) → `{ "error": "Rate limit reached — try again shortly" }`
  - 503/timeout → `{ "error": "Service unavailable — try again" }`
- **No rate limiting implemented in the function.** Vercel serverless functions are stateless and may run across multiple instances — an in-memory counter would not be shared and would silently fail. Rate limiting is explicitly out of scope for this personal-use deployment. If abuse becomes a concern, Vercel's Edge Middleware or an external service (e.g., Upstash Rate Limit) should be added as a follow-up.

**Frontend (`ai-panel.js`):**
- POSTs to `/api/chat`
- Reads stream via `response.body.getReader()`
- Appends decoded chunks to the active message bubble as they arrive
- On non-2xx response: parses `{ error }` JSON, displays inline in chat: *"Error: [message]"*
- No automatic retry

**Model:** `claude-haiku-4-5-20251001` (verified model ID per Anthropic environment — do not substitute)

### ai-panel.js Responsibilities

- Listen for `moduleRendered` on `#content-panel`; render panel below module body
- Clear in-memory chat state on new `moduleRendered` event
- Tab switching: show/hide Ask Claude vs Test Me UI; state for each tab maintained independently
- POST to `/api/chat` with correct system prompt per mode
- Stream response into DOM
- Manage End Session / Start New Session state in Test Me mode
- Display inline error messages on API failure

---

## Vite Migration

### What Changes

- `package.json` — `vite` as devDependency; scripts: `"dev": "vite"`, `"build": "vite build"`
- `vite.config.js`:
  ```js
  export default { root: '.', build: { outDir: 'dist' } }
  ```
- `vercel.json`:
  ```json
  {
    "buildCommand": "vite build",
    "outputDirectory": "dist",
    "functions": { "api/*.js": { "runtime": "nodejs22.x" } }
  }
  ```
- `index.html` — CDN `<script>` tags for Marked and DOMPurify confirmed already appear **before** the `<script type="module" src="js/app.js">` tag. No reordering needed. They remain as-is and are accessed as `window.marked` / `window.DOMPurify` in `renderer.js` (no change to existing code).

### What Stays Identical

- `router.js`, core logic of `nav.js` and `renderer.js`
- All CSS files
- All Markdown content
- Hash-based routing

### Dev Workflow

```bash
npm install
npm run dev      # Vite dev server — localhost:5173
vercel dev       # Full stack including /api/chat locally
```

### Deploy

```bash
vercel --prod
```

---

## Data Constraints

- Quiz JSON files are static — no runtime generation cost
- AI panel requires network access and `CLAUDE_API_KEY` set in Vercel env vars
- Quiz scores in `localStorage` only — no server-side persistence
- Chat history session-only — not persisted across page reloads

---

## Out of Scope

- User accounts or authentication
- Leaderboards or social features
- Server-side score persistence
- React or any UI framework
- AI-generated quiz questions at runtime
- Rate limiting (out of scope for personal use; future: Vercel Edge Middleware or Upstash)

# Quiz & AI Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MCQ quizzes (pre-generated, per-module) and a Claude-powered AI tutor/examiner panel to CyberRevision, delivered via a minimal Vite migration and Vercel serverless proxy.

**Architecture:** Vite wraps the existing vanilla JS site with zero refactoring to router/nav core logic. 25 static `.quiz.json` files are generated from existing Markdown content. A Vercel serverless function (`api/chat.js`) proxies Claude API calls, stripping SSE framing before forwarding raw text chunks to the browser.

**Tech Stack:** Vite (build only), vanilla JS ES modules, Vercel serverless (Node 22), Anthropic API (claude-haiku-4-5-20251001), localStorage, fetch ReadableStream

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `package.json` | Create | Vite devDep, dev/build scripts |
| `vite.config.js` | Create | root='.', outDir='dist' |
| `vercel.json` | Create | build command, api routing |
| `.gitignore` | Modify | add .env, dist/ |
| `api/chat.js` | Create | Claude proxy, SSE to plain-text |
| `js/quiz.js` | Create | MCQ engine, localStorage, quizComplete event |
| `js/ai-panel.js` | Create | Two-tab AI panel, streaming |
| `js/app.js` | Modify | Import ai-panel.js |
| `js/renderer.js` | Modify | Enable quiz button, wire initQuiz |
| `js/nav.js` | Modify | quizComplete listener, restore checkmarks on load |
| `content/courses.json` | Modify | Populate quiz filenames |
| `content/**/*.quiz.json` | Create | 25 quiz files (all modules) |
| `css/quiz.css` | Create | Quiz and AI panel styles |
| `index.html` | Modify | Add quiz.css link |

---

## Task 1: Vite Migration

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `vercel.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "cyberrevision",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
export default {
  root: '.',
  build: {
    outDir: 'dist'
  }
}
```

- [ ] **Step 3: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/*.js": {
      "runtime": "nodejs22.x"
    }
  }
}
```

- [ ] **Step 4: Update .gitignore**

Create or append to `.gitignore`:
```
node_modules/
dist/
.env
.env.local
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` created.

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite starts at `http://localhost:5173`. Open in browser — site looks identical to before. CDN scripts (Marked, DOMPurify) load. No console errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js vercel.json .gitignore
git commit -m "feat: add vite build tooling and vercel config"
```

---

## Task 2: Vercel API Proxy

**Files:**
- Create: `api/chat.js`

Node.js serverless function. Receives POST requests, calls Anthropic API with streaming, strips SSE framing (`data:` lines, `[DONE]` terminator), pipes raw text tokens back as `text/plain`.

- [ ] **Step 1: Create api/chat.js**

```bash
mkdir api
```

Create `api/chat.js`:

```js
// api/chat.js - Claude API proxy
// Receives: POST { messages, systemPrompt, moduleContext, endSession? }
// Returns: text/plain chunked stream of raw text tokens

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { messages = [], systemPrompt = '', moduleContext = '', endSession = false } = body;

  const fullSystem = systemPrompt.replace('{moduleContext}', moduleContext);

  const anthropicMessages = [...messages];
  if (endSession && anthropicMessages.length > 0) {
    anthropicMessages.push({
      role: 'user',
      content: '[END_SESSION] Please provide your final summary now.'
    });
  }

  let anthropicRes;
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: fullSystem,
        messages: anthropicMessages,
        stream: true
      })
    });
  } catch (err) {
    return res.status(503).json({ error: 'Service unavailable — try again' });
  }

  if (!anthropicRes.ok) {
    const status = anthropicRes.status;
    if (status === 401) return res.status(401).json({ error: 'Authentication failed' });
    if (status === 429) return res.status(429).json({ error: 'Rate limit reached — try again shortly' });
    return res.status(503).json({ error: 'Service unavailable — try again' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');

  const reader = anthropicRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        let parsed;
        try { parsed = JSON.parse(data); } catch { continue; }

        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          res.write(parsed.delta.text);
        }
      }
    }
  } catch (err) {
    // Stream interrupted — end gracefully
  }

  res.end();
}
```

- [ ] **Step 2: Test locally**

Create `.env.local` (gitignored):
```
CLAUDE_API_KEY=your_key_here
```

```bash
vercel dev
```

Test:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello in one word."}],"systemPrompt":"You are helpful. {moduleContext}","moduleContext":""}'
```

Expected: streaming plain text response, e.g. `Hello`

- [ ] **Step 3: Commit**

```bash
git add api/chat.js
git commit -m "feat: add claude api proxy serverless function"
```

---

## Task 3: Quiz and AI Panel CSS

**Files:**
- Create: `css/quiz.css`
- Modify: `index.html`

- [ ] **Step 1: Create css/quiz.css**

```css
/* quiz.css */

/* ── Quiz Engine ─────────────────────── */
.quiz-container { max-width: 720px; margin: 0 auto; padding: 2rem 1rem; }
.quiz-progress { font-size: 0.8rem; color: var(--text-muted, #888); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.04em; }
.quiz-question { font-size: 1.1rem; font-weight: 600; color: var(--text-primary, #e2e8f0); margin-bottom: 1.5rem; line-height: 1.5; }
.quiz-options { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }

.quiz-option {
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--border, #334155);
  border-radius: 6px;
  padding: 0.875rem 1rem;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary, #e2e8f0);
  font-size: 0.95rem;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
}
.quiz-option:hover:not(:disabled) { border-color: var(--accent, #60a5fa); background: var(--bg-hover, #1a2744); }
.quiz-option:disabled { cursor: default; }
.quiz-option.correct { border-color: #22c55e; background: rgba(34,197,94,0.12); color: #86efac; }
.quiz-option.incorrect { border-color: #ef4444; background: rgba(239,68,68,0.12); color: #fca5a5; }
.quiz-option.revealed { border-color: #22c55e; background: rgba(34,197,94,0.08); color: #86efac; }

.quiz-explanation {
  background: var(--bg-secondary, #1e293b);
  border-left: 3px solid var(--accent, #60a5fa);
  border-radius: 0 6px 6px 0;
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #94a3b8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.quiz-next-btn {
  background: var(--accent, #3b82f6); color: #fff; border: none;
  border-radius: 6px; padding: 0.625rem 1.25rem;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
}
.quiz-next-btn:hover { opacity: 0.88; }

.quiz-score-screen { text-align: center; padding: 3rem 1rem; }
.quiz-score-number { font-size: 3rem; font-weight: 700; color: var(--text-primary, #e2e8f0); margin-bottom: 0.5rem; }
.quiz-score-label { font-size: 1rem; color: var(--text-muted, #888); margin-bottom: 2.5rem; }
.quiz-score-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.quiz-action-btn {
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--border, #334155);
  border-radius: 6px; padding: 0.625rem 1.25rem;
  color: var(--text-primary, #e2e8f0); font-size: 0.9rem;
  cursor: pointer; text-decoration: none; display: inline-block;
  transition: border-color 0.15s;
}
.quiz-action-btn:hover { border-color: var(--accent, #60a5fa); }
.quiz-action-btn.primary { background: var(--accent, #3b82f6); border-color: transparent; color: #fff; }

/* Sidebar checkmark */
.module-item.quiz-done::after { content: ' \2713'; color: #22c55e; font-size: 0.75rem; margin-left: 4px; }

/* ── AI Panel ────────────────────────── */
.ai-panel { border-top: 1px solid var(--border, #334155); margin-top: 2rem; padding-top: 1.5rem; }
.ai-panel-tabs { display: flex; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border, #334155); }

.ai-tab-btn {
  background: none; border: none;
  border-bottom: 2px solid transparent;
  padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500;
  color: var(--text-muted, #888); cursor: pointer;
  margin-bottom: -1px; transition: color 0.15s, border-color 0.15s;
}
.ai-tab-btn:hover { color: var(--text-primary, #e2e8f0); }
.ai-tab-btn.active { color: var(--accent, #60a5fa); border-bottom-color: var(--accent, #60a5fa); }

.ai-tab-content { display: none; }
.ai-tab-content.active { display: flex; flex-direction: column; }

.ai-messages { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; max-height: 400px; overflow-y: auto; }

.ai-message { padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.6; max-width: 90%; }
.ai-message.user { background: var(--bg-secondary, #1e293b); border: 1px solid var(--border, #334155); align-self: flex-end; color: var(--text-primary, #e2e8f0); }
.ai-message.assistant { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); align-self: flex-start; color: var(--text-primary, #e2e8f0); }
.ai-message.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; align-self: flex-start; }

.ai-input-row { display: flex; gap: 0.5rem; }
.ai-input {
  flex: 1; background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--border, #334155); border-radius: 6px;
  padding: 0.625rem 0.875rem; color: var(--text-primary, #e2e8f0);
  font-size: 0.9rem; outline: none; transition: border-color 0.15s;
}
.ai-input:focus { border-color: var(--accent, #60a5fa); }
.ai-input:disabled { opacity: 0.5; cursor: not-allowed; }

.ai-send-btn, .ai-end-btn, .ai-new-session-btn {
  background: var(--accent, #3b82f6); color: #fff; border: none;
  border-radius: 6px; padding: 0.625rem 1rem;
  font-size: 0.875rem; font-weight: 500; cursor: pointer;
  white-space: nowrap; transition: opacity 0.15s;
}
.ai-send-btn:hover, .ai-end-btn:hover, .ai-new-session-btn:hover { opacity: 0.88; }
.ai-send-btn:disabled, .ai-end-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.ai-end-btn {
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--border, #334155);
  color: var(--text-muted, #888);
}
.ai-end-btn:hover { color: var(--text-primary, #e2e8f0); border-color: var(--accent, #60a5fa); }
.ai-testme-actions { display: flex; gap: 0.5rem; }
```

- [ ] **Step 2: Add to index.html**

After `<link rel="stylesheet" href="css/content.css">`, add:
```html
  <link rel="stylesheet" href="css/quiz.css">
```

- [ ] **Step 3: Verify no visual regressions**

```bash
npm run dev
```

Open browser — site unchanged, no errors.

- [ ] **Step 4: Commit**

```bash
git add css/quiz.css index.html
git commit -m "feat: add quiz and ai panel stylesheet"
```

---

## Task 4: Quiz Engine

**Files:**
- Create: `js/quiz.js`

- [ ] **Step 1: Create js/quiz.js**

```js
// quiz.js - MCQ quiz engine
// Exports: initQuiz(courseId, moduleId, quizFile)
// Dispatches: document 'quizComplete' { courseId, moduleId, score, total }

export async function initQuiz(courseId, moduleId, quizFile) {
  const panel = document.getElementById('content-panel');
  const url = `content/${courseId}/${quizFile}`;

  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    console.error('Failed to load quiz:', url, err);
    const errEl = document.createElement('div');
    errEl.className = 'content-error';
    errEl.textContent = 'Could not load quiz. Please try again.';
    const inner = document.createElement('div');
    inner.className = 'content-inner';
    inner.appendChild(errEl);
    panel.replaceChildren(inner);
    return;
  }

  const questions = data.questions || [];
  if (!questions.length) return;

  const container = document.createElement('div');
  container.className = 'quiz-container';

  let currentIndex = 0;
  let score = 0;

  function showQuestion(index) {
    container.textContent = '';
    const q = questions[index];

    const progress = document.createElement('div');
    progress.className = 'quiz-progress';
    progress.textContent = `Question ${index + 1} of ${questions.length}`;

    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.textContent = q.question;

    const optionsEl = document.createElement('div');
    optionsEl.className = 'quiz-options';

    const explanationEl = document.createElement('div');
    explanationEl.className = 'quiz-explanation';
    explanationEl.style.display = 'none';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = index < questions.length - 1 ? 'Next \u2192' : 'See Results';
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', () => {
      if (index < questions.length - 1) {
        currentIndex++;
        showQuestion(currentIndex);
      } else {
        showScore();
      }
    });

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        optionsEl.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });
        if (i === q.correct) {
          btn.classList.add('correct');
          score++;
        } else {
          btn.classList.add('incorrect');
          optionsEl.children[q.correct].classList.add('revealed');
        }
        explanationEl.textContent = q.explanation;
        explanationEl.style.display = 'block';
        nextBtn.style.display = 'inline-block';
      });
      optionsEl.appendChild(btn);
    });

    container.appendChild(progress);
    container.appendChild(questionEl);
    container.appendChild(optionsEl);
    container.appendChild(explanationEl);
    container.appendChild(nextBtn);
  }

  function showScore() {
    container.textContent = '';

    const screen = document.createElement('div');
    screen.className = 'quiz-score-screen';

    const scoreNum = document.createElement('div');
    scoreNum.className = 'quiz-score-number';
    scoreNum.textContent = `${score}/${questions.length}`;

    const label = document.createElement('div');
    label.className = 'quiz-score-label';
    const pct = score / questions.length;
    label.textContent = pct === 1
      ? 'Perfect score!'
      : pct >= 0.7 ? 'Good work — keep studying!'
      : 'Keep reviewing and try again.';

    const actions = document.createElement('div');
    actions.className = 'quiz-score-actions';

    const reviewBtn = document.createElement('a');
    reviewBtn.className = 'quiz-action-btn';
    reviewBtn.textContent = '\u2190 Review Module';
    reviewBtn.href = '#' + courseId + '/' + moduleId;

    const retryBtn = document.createElement('button');
    retryBtn.className = 'quiz-action-btn primary';
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', () => {
      score = 0;
      currentIndex = 0;
      showQuestion(0);
    });

    actions.appendChild(reviewBtn);
    actions.appendChild(retryBtn);
    screen.appendChild(scoreNum);
    screen.appendChild(label);
    screen.appendChild(actions);
    container.appendChild(screen);

    localStorage.setItem(
      `quiz:${courseId}/${moduleId}`,
      JSON.stringify({ score, total: questions.length, attempted: true })
    );

    document.dispatchEvent(new CustomEvent('quizComplete', {
      detail: { courseId, moduleId, score, total: questions.length }
    }));
  }

  showQuestion(0);

  const inner = document.createElement('div');
  inner.className = 'content-inner';
  inner.appendChild(container);
  panel.replaceChildren(inner);
  panel.scrollTop = 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add js/quiz.js
git commit -m "feat: add mcq quiz engine"
```

---

## Task 5: Update renderer.js

**Files:**
- Modify: `js/renderer.js`

- [ ] **Step 1: Add import at top of renderer.js**

After the file-top comment block, add:
```js
import { initQuiz } from './quiz.js';
```

- [ ] **Step 2: Replace the quiz button block**

Find (lines ~113-119):
```js
    const footer = document.createElement('div');
    footer.className = 'quiz-footer';
    const quizBtn = document.createElement('button');
    quizBtn.className = 'quiz-btn';
    quizBtn.disabled = true;
    quizBtn.title = 'Coming soon';
    quizBtn.textContent = 'Quiz \u2192';
    footer.appendChild(quizBtn);
```

Replace with:
```js
    const course = courses.find(c => c.id === courseId);
    const mod = course?.modules.find(m => m.id === moduleId);
    const quizFile = mod?.quiz || null;

    const footer = document.createElement('div');
    footer.className = 'quiz-footer';
    const quizBtn = document.createElement('button');
    quizBtn.className = 'quiz-btn';
    quizBtn.textContent = 'Quiz \u2192';
    if (quizFile) {
      quizBtn.disabled = false;
      quizBtn.title = 'Take the quiz for this module';
      quizBtn.addEventListener('click', () => initQuiz(courseId, moduleId, quizFile));
    } else {
      quizBtn.disabled = true;
      quizBtn.title = 'Quiz coming soon';
    }
    footer.appendChild(quizBtn);
```

- [ ] **Step 3: Confirm moduleRendered event is already present**

Check that `renderer.js` still dispatches `moduleRendered` on `#content-panel` (the `AI_HOOK` block at lines ~128-131). No change needed.

- [ ] **Step 4: Commit**

```bash
git add js/renderer.js
git commit -m "feat: wire quiz button to quiz engine"
```

---

## Task 6: Update nav.js

**Files:**
- Modify: `js/nav.js`

- [ ] **Step 1: Add to initNav() after buildSidebar() and updateProgressTotal()**

```js
  restoreQuizIndicators(courses);
  document.addEventListener('quizComplete', (e) => {
    markModuleDone(e.detail.courseId, e.detail.moduleId);
  });
```

- [ ] **Step 2: Add helper functions at bottom of nav.js**

```js
function markModuleDone(courseId, moduleId) {
  const btn = document.querySelector(
    `.module-item[data-course-id="${courseId}"][data-module-id="${moduleId}"]`
  );
  if (btn) btn.classList.add('quiz-done');
}

function restoreQuizIndicators(courses) {
  courses.forEach(course => {
    course.modules.forEach(mod => {
      if (localStorage.getItem(`quiz:${course.id}/${mod.id}`)) {
        markModuleDone(course.id, mod.id);
      }
    });
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add js/nav.js
git commit -m "feat: add quiz completion checkmarks to sidebar"
```

---

## Task 7: Create ai-panel.js and Update app.js

**Files:**
- Create: `js/ai-panel.js`
- Modify: `js/app.js`

- [ ] **Step 1: Create js/ai-panel.js**

```js
// ai-panel.js - Claude AI tutor and Socratic examiner panel
// initAiPanel() called once at startup.
// Listens for 'moduleRendered' on #content-panel, appends two-tab panel below module content.
// Tab 1: Ask Claude (streaming tutor chat)
// Tab 2: Test Me (Socratic examiner with End Session)

const TUTOR_SYSTEM = `You are a cybersecurity tutor helping a student study: "{moduleTitle}".
Stay on topics in this module only. Use precise cybersecurity terminology.
Never reveal quiz answers. Redirect off-topic questions back to the module. Be concise.

Module content:
{moduleContext}`;

const EXAMINER_SYSTEM = `You are a Socratic cybersecurity examiner testing a student on: "{moduleTitle}".
Ask one question at a time from the module content. After each answer, assess correctness,
identify gaps, and ask a follow-up. When the message [END_SESSION] appears, provide a
summary of strengths and areas needing review. Stay on-topic.

Module content:
{moduleContext}`;

function truncateContext(text) {
  if (text.length <= 6000) return text;
  const cut = text.lastIndexOf('\n\n', 6000);
  return cut > 0 ? text.slice(0, cut) : text.slice(0, 6000);
}

function freshState() {
  return {
    moduleTitle: '',
    moduleContext: '',
    ask: { messages: [], streaming: false },
    test: { messages: [], streaming: false, ended: false }
  };
}

let state = freshState();

export function initAiPanel() {
  const contentPanel = document.getElementById('content-panel');
  contentPanel.addEventListener('moduleRendered', (e) => {
    const { renderedHTML, moduleId } = e.detail;

    // Use DOMPurify (already loaded as CDN global) to safely extract text
    const tmp = document.createElement('div');
    tmp.innerHTML = DOMPurify.sanitize(renderedHTML);
    const plainText = tmp.textContent || '';
    const firstH1 = tmp.querySelector('h1');

    state = freshState();
    state.moduleTitle = firstH1 ? firstH1.textContent : moduleId;
    state.moduleContext = truncateContext(plainText);

    const inner = contentPanel.querySelector('.content-inner');
    if (!inner) return;
    const existing = inner.querySelector('.ai-panel');
    if (existing) existing.remove();
    inner.appendChild(buildPanel());
  });
}

function buildPanel() {
  const panel = document.createElement('div');
  panel.className = 'ai-panel';

  const tabs = document.createElement('div');
  tabs.className = 'ai-panel-tabs';
  const askTabBtn = makeTabBtn('Ask Claude', true);
  const testTabBtn = makeTabBtn('Test Me', false);
  tabs.appendChild(askTabBtn);
  tabs.appendChild(testTabBtn);

  const askContent = buildAskTab();
  askContent.classList.add('active');
  const testContent = buildTestTab();

  askTabBtn.addEventListener('click', () => {
    askTabBtn.classList.add('active'); testTabBtn.classList.remove('active');
    askContent.classList.add('active'); testContent.classList.remove('active');
  });
  testTabBtn.addEventListener('click', () => {
    testTabBtn.classList.add('active'); askTabBtn.classList.remove('active');
    testContent.classList.add('active'); askContent.classList.remove('active');
    if (!state.test.messages.length && !state.test.ended) {
      startTestSession(testContent._refs);
    }
  });

  panel.appendChild(tabs);
  panel.appendChild(askContent);
  panel.appendChild(testContent);
  return panel;
}

function makeTabBtn(label, active) {
  const btn = document.createElement('button');
  btn.className = 'ai-tab-btn' + (active ? ' active' : '');
  btn.textContent = label;
  return btn;
}

function buildAskTab() {
  const content = document.createElement('div');
  content.className = 'ai-tab-content';

  const messages = document.createElement('div');
  messages.className = 'ai-messages';
  const inputRow = document.createElement('div');
  inputRow.className = 'ai-input-row';
  const input = makeTextInput('Ask about this module\u2026');
  const sendBtn = makeBtn('Send', 'ai-send-btn');

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  content.appendChild(messages);
  content.appendChild(inputRow);

  async function send() {
    const text = input.value.trim();
    if (!text || state.ask.streaming) return;
    input.value = '';
    appendMsg(messages, 'user', text);
    state.ask.messages.push({ role: 'user', content: text });
    disable([input, sendBtn]);
    state.ask.streaming = true;

    const sysPrompt = TUTOR_SYSTEM
      .replace('{moduleTitle}', state.moduleTitle)
      .replace('{moduleContext}', state.moduleContext);
    const bubble = appendMsg(messages, 'assistant', '');
    const reply = await streamChat(state.ask.messages, sysPrompt, bubble);
    if (reply !== null) state.ask.messages.push({ role: 'assistant', content: reply });

    state.ask.streaming = false;
    enable([input, sendBtn]);
    input.focus();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  return content;
}

function buildTestTab() {
  const content = document.createElement('div');
  content.className = 'ai-tab-content';

  const messages = document.createElement('div');
  messages.className = 'ai-messages';
  const inputRow = document.createElement('div');
  inputRow.className = 'ai-input-row';
  const input = makeTextInput('Type your answer\u2026');
  const actionsEl = document.createElement('div');
  actionsEl.className = 'ai-testme-actions';
  const sendBtn = makeBtn('Answer', 'ai-send-btn');
  const endBtn = makeBtn('End Session', 'ai-end-btn');
  const newBtn = makeBtn('Start New Session', 'ai-new-session-btn');
  endBtn.style.display = 'none';
  newBtn.style.display = 'none';

  actionsEl.appendChild(sendBtn);
  actionsEl.appendChild(endBtn);
  actionsEl.appendChild(newBtn);
  inputRow.appendChild(input);
  inputRow.appendChild(actionsEl);
  content.appendChild(messages);
  content.appendChild(inputRow);

  const refs = { messages, input, sendBtn, endBtn, newBtn };
  content._refs = refs;

  async function sendAnswer() {
    const text = input.value.trim();
    if (!text || state.test.streaming || state.test.ended) return;
    input.value = '';
    appendMsg(messages, 'user', text);
    state.test.messages.push({ role: 'user', content: text });
    disable([input, sendBtn]);
    state.test.streaming = true;

    const sysPrompt = EXAMINER_SYSTEM
      .replace('{moduleTitle}', state.moduleTitle)
      .replace('{moduleContext}', state.moduleContext);
    const bubble = appendMsg(messages, 'assistant', '');
    const reply = await streamChat(state.test.messages, sysPrompt, bubble);
    if (reply !== null) state.test.messages.push({ role: 'assistant', content: reply });

    state.test.streaming = false;
    enable([input, sendBtn]);
    input.focus();
  }

  async function endSession() {
    if (state.test.streaming || state.test.ended) return;
    disable([input, sendBtn, endBtn]);
    state.test.streaming = true;

    const sysPrompt = EXAMINER_SYSTEM
      .replace('{moduleTitle}', state.moduleTitle)
      .replace('{moduleContext}', state.moduleContext);
    const bubble = appendMsg(messages, 'assistant', '');
    const reply = await streamChat(state.test.messages, sysPrompt, bubble, true);
    if (reply !== null) state.test.messages.push({ role: 'assistant', content: reply });

    state.test.streaming = false;
    state.test.ended = true;
    endBtn.style.display = 'none';
    newBtn.style.display = 'inline-block';
  }

  newBtn.addEventListener('click', () => {
    state.test = { messages: [], streaming: false, ended: false };
    messages.textContent = '';
    enable([input, sendBtn, endBtn]);
    endBtn.style.display = 'none';
    newBtn.style.display = 'none';
    startTestSession(refs);
  });

  sendBtn.addEventListener('click', sendAnswer);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendAnswer(); });
  endBtn.addEventListener('click', endSession);

  // Restore ended state on tab switch back
  if (state.test.ended) {
    disable([input, sendBtn, endBtn]);
    endBtn.style.display = 'none';
    newBtn.style.display = 'inline-block';
  }

  return content;
}

async function startTestSession(refs) {
  const { messages, input, sendBtn, endBtn } = refs;
  disable([input, sendBtn]);
  state.test.streaming = true;

  const sysPrompt = EXAMINER_SYSTEM
    .replace('{moduleTitle}', state.moduleTitle)
    .replace('{moduleContext}', state.moduleContext);
  const bubble = appendMsg(messages, 'assistant', '');
  const opening = await streamChat([], sysPrompt, bubble);
  if (opening !== null) state.test.messages.push({ role: 'assistant', content: opening });

  state.test.streaming = false;
  enable([input, sendBtn]);
  endBtn.style.display = 'inline-block';
  input.focus();
}

function makeTextInput(placeholder) {
  const el = document.createElement('input');
  el.type = 'text';
  el.className = 'ai-input';
  el.placeholder = placeholder;
  return el;
}

function makeBtn(label, className) {
  const btn = document.createElement('button');
  btn.className = className;
  btn.textContent = label;
  return btn;
}

function disable(els) { els.forEach(el => { el.disabled = true; }); }
function enable(els) { els.forEach(el => { el.disabled = false; }); }

function appendMsg(container, role, text) {
  const msg = document.createElement('div');
  msg.className = `ai-message ${role}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

// Returns full response text, or null on error (error shown in bubble)
async function streamChat(messages, systemPrompt, bubble, endSession = false) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt, moduleContext: '', endSession })
    });

    if (!res.ok) {
      let errMsg = 'Service unavailable — try again';
      try { const d = await res.json(); if (d.error) errMsg = d.error; } catch {}
      bubble.textContent = `Error: ${errMsg}`;
      bubble.classList.add('error');
      return null;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      bubble.textContent = full;
      bubble.parentElement.scrollTop = bubble.parentElement.scrollHeight;
    }
    return full;
  } catch {
    bubble.textContent = 'Error: Connection failed — check your network';
    bubble.classList.add('error');
    return null;
  }
}
```

- [ ] **Step 2: Update app.js**

```js
// app.js - entry point
import { initRouter }   from './router.js';
import { initNav }      from './nav.js';
import { initRenderer } from './renderer.js';
import { initAiPanel }  from './ai-panel.js';

async function init() {
  await Promise.all([initNav(), initRenderer()]);
  initRouter();
  initAiPanel();
}

init();
```

- [ ] **Step 3: Commit**

```bash
git add js/ai-panel.js js/app.js
git commit -m "feat: add claude ai tutor and examiner panel"
```

---

## Task 8: Generate All 25 Quiz JSON Files

Read each `.md` file then write 10 questions per module. Questions MUST come from actual module content — not generic cybersecurity knowledge. Verify each file is valid JSON before saving.

**Format contract:**
```json
{
  "moduleId": "{courseId}/{moduleId}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why this is correct, from the module."
    }
  ]
}
```

- [ ] **Step 1: Generate 01-foundations quizzes**

Read each `.md` then generate its `.quiz.json`:

**`content/01-foundations/01-introduction-to-cybersecurity.quiz.json`**
Topics to cover: Risk = Likelihood × Impact, Defense in Depth layers, four cyber hygiene pillars (CISA), key terms (vulnerability/threat/risk/exploit), MFA stat (99.9%), security mindset, phishing as #1 vector

**`content/01-foundations/02-security-lifecycle.quiz.json`**
Topics: NIST CSF 2.0 six functions (GOVERN added in 2024), what each function covers, lifecycle is continuous not one-time, perimeter defense obsolescence, least privilege under PROTECT

**`content/01-foundations/03-security-frameworks-controls.quiz.json`**
Topics: technical/admin/physical control types with examples, Defense in Depth layering table, NIST CSF categories, CIS Controls, ISO 27001, compliance vs security distinction

- [ ] **Step 2: Generate 02-play-it-safe quizzes**

Read each `.md` then generate:

**`content/02-play-it-safe/01-security-frameworks.quiz.json`**
Topics: NIST RMF 7 steps, HITRUST CSF, SOC 2 trust principles, framework selection criteria, compliance vs security

**`content/02-play-it-safe/02-risk-management.quiz.json`**
Topics: risk formula, qualitative vs quantitative assessment, risk register fields, four treatment options (accept/transfer/mitigate/avoid), residual risk

**`content/02-play-it-safe/03-security-controls.quiz.json`**
Topics: CIS 18 safeguard groups, compensating controls, preventive/detective/corrective, control effectiveness metrics

- [ ] **Step 3: Generate 03-network-security quizzes**

**`content/03-network-security/01-network-fundamentals.quiz.json`**
Topics: OSI 7 layers with responsibilities, TCP/IP suite, subnet masks, NAT purpose, router vs switch

**`content/03-network-security/02-network-protocols.quiz.json`**
Topics: DNS resolution process, DHCP lease lifecycle, HTTP vs HTTPS, TLS handshake steps, SSH vs Telnet, key port numbers (22/53/80/443/3389)

**`content/03-network-security/03-securing-networks.quiz.json`**
Topics: stateful vs stateless firewall, IDS vs IPS, network segmentation/VLANs, VPN types (site-to-site vs remote access), zero trust principles

- [ ] **Step 4: Generate 04-linux-sql quizzes**

**`content/04-linux-sql/01-linux-fundamentals.quiz.json`**
Topics: FHS directory structure (/etc /var /home /bin), file permission notation (rwx/octal), chmod/chown/ls -la, common commands, shell pipes and redirects

**`content/04-linux-sql/02-linux-security.quiz.json`**
Topics: sudo vs su, /etc/passwd vs /etc/shadow, auditd log locations, firewalld zones, SSH hardening (PermitRootLogin, key auth), syslog

**`content/04-linux-sql/03-sql-for-security.quiz.json`**
Topics: SELECT/WHERE/JOIN/GROUP BY, querying log tables, detecting anomalies with SQL aggregates, SQL injection mechanics and prevention

- [ ] **Step 5: Generate 05-assets-threats-vulnerabilities quizzes**

**`content/05-assets-threats-vulnerabilities/01-asset-management.quiz.json`**
Topics: asset classification levels (public/internal/confidential/restricted), data lifecycle stages, CMDB purpose, asset inventory methods, data owner vs custodian

**`content/05-assets-threats-vulnerabilities/02-threat-landscape.quiz.json`**
Topics: threat actor types (nation-state/criminal/insider/hacktivist), APT characteristics, TTPs definition, MITRE ATT&CK tactics, social engineering types (phishing/vishing/pretexting)

**`content/05-assets-threats-vulnerabilities/03-vulnerability-management.quiz.json`**
Topics: CVE vs CVSS, CVSS score ranges, patch management lifecycle, vulnerability scan vs pen test, zero-day definition, responsible disclosure

- [ ] **Step 6: Generate 06-sound-the-alarm quizzes**

**`content/06-sound-the-alarm/01-detection-systems.quiz.json`**
Topics: SIEM components (log aggregation/correlation/alerting), signature vs anomaly-based IDS, log sources (syslog/Windows Event/firewall), alert tuning, SOAR integration

**`content/06-sound-the-alarm/02-incident-response.quiz.json`**
Topics: IR lifecycle phases (Preparation/Identification/Containment/Eradication/Recovery/Lessons Learned), containment strategies, chain of custody, CIRT/CSIRT roles, escalation criteria

**`content/06-sound-the-alarm/03-forensics-investigation.quiz.json`**
Topics: forensic imaging (dd/FTK), volatile vs non-volatile evidence order of collection, hash verification (MD5/SHA), timeline analysis, legal holds, write blockers

- [ ] **Step 7: Generate 07-automate-python quizzes**

**`content/07-automate-python/01-python-fundamentals.quiz.json`**
Topics: data types (str/int/list/dict/bool), control flow (if/for/while), function definition, file I/O (open/read/write), exception handling (try/except)

**`content/07-automate-python/02-security-scripting.quiz.json`**
Topics: regex for log parsing (re module), subprocess for system commands, requests library for API calls, hashlib for hashing, reading/writing JSON

**`content/07-automate-python/03-automation-orchestration.quiz.json`**
Topics: SOAR concept and benefits, playbook structure, REST API integration patterns, scheduled tasks (cron/Task Scheduler), error handling in automation scripts

- [ ] **Step 8: Generate 08-job-prep quizzes**

**`content/08-job-prep/01-job-search-strategy.quiz.json`**
Topics: SOC analyst tiers (L1/L2/L3), entry-level cert pathways (CompTIA Security+, Google Cert), networking strategy, job board targeting, informational interviews

**`content/08-job-prep/02-resume-portfolio.quiz.json`**
Topics: ATS keyword optimization, metrics in bullet points (quantifying impact), GitHub portfolio best practices, certifications and how to list them, resume length/format

**`content/08-job-prep/03-interview-prep.quiz.json`**
Topics: technical question categories, STAR behavioral method, common security scenario questions (explain a phishing attack, what is least privilege), salary negotiation

**`content/08-job-prep/04-continuous-learning.quiz.json`**
Topics: CTF platforms (HackTheBox, TryHackMe), threat intel feeds (CISA alerts, vendor blogs), CPE requirements for CISSP/Security+, learning communities (r/netsec, Discord), cert renewal timelines

- [ ] **Step 9: Commit all quiz files**

```bash
git add content/
git commit -m "feat: add 25 pre-generated mcq quiz files"
```

---

## Task 9: Update courses.json

**Files:**
- Modify: `content/courses.json`

- [ ] **Step 1: Populate all 25 quiz fields**

Replace every `"quiz": null` with `"quiz": "{moduleId}.quiz.json"`. Pattern: the filename is always `{moduleId}.quiz.json` where `{moduleId}` matches the module's `"id"` field.

Full updated file:
```json
[
  {
    "id": "01-foundations",
    "title": "Foundations of Cybersecurity",
    "modules": [
      { "id": "01-introduction-to-cybersecurity", "title": "Introduction to Cybersecurity", "quiz": "01-introduction-to-cybersecurity.quiz.json" },
      { "id": "02-security-lifecycle", "title": "Security Lifecycle", "quiz": "02-security-lifecycle.quiz.json" },
      { "id": "03-security-frameworks-controls", "title": "Security Frameworks & Controls", "quiz": "03-security-frameworks-controls.quiz.json" }
    ]
  },
  {
    "id": "02-play-it-safe",
    "title": "Play It Safe: Manage Security Risks",
    "modules": [
      { "id": "01-security-frameworks", "title": "Security Frameworks", "quiz": "01-security-frameworks.quiz.json" },
      { "id": "02-risk-management", "title": "Risk Management", "quiz": "02-risk-management.quiz.json" },
      { "id": "03-security-controls", "title": "Security Controls", "quiz": "03-security-controls.quiz.json" }
    ]
  },
  {
    "id": "03-network-security",
    "title": "Connect and Protect: Networks & Network Security",
    "modules": [
      { "id": "01-network-fundamentals", "title": "Network Fundamentals", "quiz": "01-network-fundamentals.quiz.json" },
      { "id": "02-network-protocols", "title": "Network Protocols", "quiz": "02-network-protocols.quiz.json" },
      { "id": "03-securing-networks", "title": "Network Security", "quiz": "03-securing-networks.quiz.json" }
    ]
  },
  {
    "id": "04-linux-sql",
    "title": "Tools of the Trade: Linux & SQL",
    "modules": [
      { "id": "01-linux-fundamentals", "title": "Linux Fundamentals", "quiz": "01-linux-fundamentals.quiz.json" },
      { "id": "02-linux-security", "title": "Linux Security", "quiz": "02-linux-security.quiz.json" },
      { "id": "03-sql-for-security", "title": "SQL for Security", "quiz": "03-sql-for-security.quiz.json" }
    ]
  },
  {
    "id": "05-assets-threats-vulnerabilities",
    "title": "Assets, Threats, and Vulnerabilities",
    "modules": [
      { "id": "01-asset-management", "title": "Asset Management", "quiz": "01-asset-management.quiz.json" },
      { "id": "02-threat-landscape", "title": "Threat Landscape", "quiz": "02-threat-landscape.quiz.json" },
      { "id": "03-vulnerability-management", "title": "Vulnerability Management", "quiz": "03-vulnerability-management.quiz.json" }
    ]
  },
  {
    "id": "06-sound-the-alarm",
    "title": "Sound the Alarm: Detection & Response",
    "modules": [
      { "id": "01-detection-systems", "title": "Detection Systems", "quiz": "01-detection-systems.quiz.json" },
      { "id": "02-incident-response", "title": "Incident Response", "quiz": "02-incident-response.quiz.json" },
      { "id": "03-forensics-investigation", "title": "Forensics & Investigation", "quiz": "03-forensics-investigation.quiz.json" }
    ]
  },
  {
    "id": "07-automate-python",
    "title": "Automate Cybersecurity Tasks with Python",
    "modules": [
      { "id": "01-python-fundamentals", "title": "Python Fundamentals", "quiz": "01-python-fundamentals.quiz.json" },
      { "id": "02-security-scripting", "title": "Security Scripting", "quiz": "02-security-scripting.quiz.json" },
      { "id": "03-automation-orchestration", "title": "Automation & Orchestration", "quiz": "03-automation-orchestration.quiz.json" }
    ]
  },
  {
    "id": "08-job-prep",
    "title": "Put It to Work: Prepare for Cybersecurity Jobs",
    "modules": [
      { "id": "01-job-search-strategy", "title": "Job Search Strategy", "quiz": "01-job-search-strategy.quiz.json" },
      { "id": "02-resume-portfolio", "title": "Resume & Portfolio", "quiz": "02-resume-portfolio.quiz.json" },
      { "id": "03-interview-prep", "title": "Interview Prep", "quiz": "03-interview-prep.quiz.json" },
      { "id": "04-continuous-learning", "title": "Continuous Learning", "quiz": "04-continuous-learning.quiz.json" }
    ]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add content/courses.json
git commit -m "feat: populate quiz filenames in courses.json"
```

---

## Task 10: End-to-End Verification

- [ ] **Step 1: Start full dev stack**

```bash
vercel dev
```

- [ ] **Step 2: Verify quiz flow**

1. Navigate to `http://localhost:3000/#01-foundations/01-introduction-to-cybersecurity`
2. Click "Quiz →" — quiz loads in content panel
3. Answer all 10 questions — verify green correct / red incorrect + explanation each time
4. Reach score screen — X/10 shown, "Review Module" link goes back to module, "Try Again" restarts
5. Check sidebar — ✓ appears next to the module name
6. Reload page — ✓ still present (localStorage restored on load)

- [ ] **Step 3: Verify Ask Claude**

1. Navigate to any module — AI Panel visible below content
2. "Ask Claude" tab active by default
3. Type a question, press Enter — streaming response arrives token by token
4. Navigate to a different module — chat history cleared, fresh panel

- [ ] **Step 4: Verify Test Me**

1. Click "Test Me" tab — Claude's opening question streams in
2. Type an answer — Claude assesses and asks follow-up
3. Click "End Session" — summary streams in; input and End Session disabled; "Start New Session" appears
4. Switch to Ask Claude and back — ended state still visible (not reset)
5. Click "Start New Session" — fresh session starts

- [ ] **Step 5: Verify error handling**

Set `CLAUDE_API_KEY=invalid` in `.env.local`, restart `vercel dev`.
Send a message in Ask Claude — inline error in chat panel.
Restore correct key.

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: `dist/` built successfully, no errors.

- [ ] **Step 7: Commit docs**

```bash
git add docs/
git commit -m "docs: add quiz and ai panel implementation plan and spec"
```

---

## Deployment Checklist

Before `vercel --prod`:

- [ ] Set `CLAUDE_API_KEY` in Vercel project → Settings → Environment Variables
- [ ] Confirm `vercel.json` is committed
- [ ] `npm run build` passes locally
- [ ] Run `vercel --prod`
- [ ] Test live URL: quiz works, Ask Claude streams, Test Me works end-to-end

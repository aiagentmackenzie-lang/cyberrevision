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
      let errMsg = 'Service unavailable \u2014 try again';
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
    bubble.textContent = 'Error: Connection failed \u2014 check your network';
    bubble.classList.add('error');
    return null;
  }
}

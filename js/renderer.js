// renderer.js - content rendering
// Listens for 'route' events, fetches the markdown file, renders it via marked.js,
// sanitizes with DOMPurify, injects into #content-panel, then dispatches 'moduleRendered'.
// Home state (no courseId/moduleId) renders the landing course-card grid.

import { initQuiz } from './quiz.js';

let courses = [];
const visitedModules = new Set();

function contentInner(...children) {
  const inner = document.createElement('div');
  inner.className = 'content-inner';
  children.forEach(child => inner.appendChild(child));
  return inner;
}

export async function initRenderer() {
  try {
    const res = await fetch('content/courses.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    courses = await res.json();
  } catch (err) {
    console.error('Failed to load courses.json', err);
    const panel = document.getElementById('content-panel');
    const errEl = document.createElement('div');
    errEl.className = 'content-error';
    errEl.textContent = 'Could not load course data. Please refresh.';
    panel.replaceChildren(contentInner(errEl));
    return;
  }
  document.addEventListener('route', async (e) => {
    const { courseId, moduleId } = e.detail;
    if (!courseId || !moduleId) {
      renderLanding();
    } else {
      await renderModule(courseId, moduleId);
    }
  });
}

function renderLanding() {
  const panel = document.getElementById('content-panel');
  const wrapper = document.createElement('div');
  wrapper.id = 'landing-view';

  const heading = document.createElement('h1');
  heading.textContent = 'CyberRevision';
  wrapper.appendChild(heading);

  const subtitle = document.createElement('p');
  subtitle.className = 'landing-subtitle';
  subtitle.textContent = 'Google Cybersecurity Certificate - Select a course to begin.';
  wrapper.appendChild(subtitle);

  const grid = document.createElement('div');
  grid.className = 'course-grid';

  courses.forEach((course, i) => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.addEventListener('click', () => {
      window.location.hash = course.id + '/' + course.modules[0].id;
    });

    const num = document.createElement('div');
    num.className = 'course-card-number';
    num.textContent = 'Course ' + String(i + 1).padStart(2, '0');

    const title = document.createElement('div');
    title.className = 'course-card-title';
    title.textContent = course.title;

    const meta = document.createElement('div');
    meta.className = 'course-card-meta';
    meta.textContent = course.modules.length + ' modules';

    card.appendChild(num);
    card.appendChild(title);
    card.appendChild(meta);
    grid.appendChild(card);
  });

  wrapper.appendChild(grid);
  panel.replaceChildren(contentInner(wrapper));
}

async function renderModule(courseId, moduleId) {
  const panel = document.getElementById('content-panel');

  // Validate ID format - only allow slug-style identifiers
  if (!/^[\w-]+$/.test(courseId) || !/^[\w-]+$/.test(moduleId)) {
    const errEl = document.createElement('div');
    errEl.className = 'content-error';
    errEl.textContent = 'Could not load this module. Please try again.';
    panel.replaceChildren(contentInner(errEl));
    return;
  }

  const filePath = 'content/' + courseId + '/' + moduleId + '.md';

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const markdown = await res.text();
    const rawHTML = marked.parse(markdown);
    const safeHTML = DOMPurify.sanitize(rawHTML);

    const body = document.createElement('div');
    body.className = 'md-body';
    body.innerHTML = safeHTML; // safeHTML is DOMPurify-sanitized above

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

    panel.replaceChildren(contentInner(body, footer));
    panel.scrollTop = 0;

    visitedModules.add(courseId + '/' + moduleId);
    document.getElementById('progress-visited').textContent = visitedModules.size;

    // AI_HOOK - fired after markdown is injected into the DOM.
    // Future: ai.js listens on #content-panel for 'moduleRendered' to render AI panel below.
    panel.dispatchEvent(new CustomEvent('moduleRendered', {
      detail: { courseId, moduleId, renderedHTML: safeHTML }
    }));

  } catch (err) {
    console.error('Failed to load module: ' + filePath, err);
    const errEl = document.createElement('div');
    errEl.className = 'content-error';
    errEl.textContent = 'Could not load this module. Please try again.';
    panel.replaceChildren(contentInner(errEl));
  }
}

// renderer.js - content rendering
// Listens for 'route' events, fetches the markdown file, renders it via marked.js,
// sanitizes with DOMPurify, injects into #content-panel, then dispatches 'moduleRendered'.
// Home state (no courseId/moduleId) renders the landing course-card grid.

let courses = [];
const visitedModules = new Set();

function contentInner(...children) {
  const inner = document.createElement('div');
  inner.className = 'content-inner';
  children.forEach(child => inner.appendChild(child));
  return inner;
}

export async function initRenderer() {
  const res = await fetch('content/courses.json');
  courses = await res.json();
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

    const footer = document.createElement('div');
    footer.className = 'quiz-footer';
    const quizBtn = document.createElement('button');
    quizBtn.className = 'quiz-btn';
    quizBtn.disabled = true;
    quizBtn.title = 'Coming soon';
    quizBtn.textContent = 'Quiz \u2192';
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

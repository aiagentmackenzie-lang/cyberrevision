// nav.js - sidebar navigation
// Fetches courses.json, builds sidebar DOM, updates active states on route events.
// Computes total module count for the header progress indicator.

let courses = [];

export async function initNav() {
  const res = await fetch('content/courses.json');
  courses = await res.json();
  buildSidebar();
  updateProgressTotal();
  document.addEventListener('route', (e) => {
    updateActiveStates(e.detail.courseId, e.detail.moduleId);
  });
}

function buildSidebar() {
  const courseList = document.getElementById('course-list');
  const label = document.createElement('div');
  label.className = 'nav-section-label';
  label.textContent = 'Courses';
  courseList.appendChild(label);

  courses.forEach((course) => {
    const courseBtn = document.createElement('button');
    courseBtn.className = 'course-item';
    courseBtn.dataset.courseId = course.id;
    courseBtn.textContent = course.title;
    courseBtn.addEventListener('click', () => {
      window.location.hash = course.id + '/' + course.modules[0].id;
    });
    courseList.appendChild(courseBtn);

    const moduleList = document.createElement('div');
    moduleList.className = 'module-list';
    moduleList.dataset.courseId = course.id;

    course.modules.forEach((mod) => {
      const modBtn = document.createElement('button');
      modBtn.className = 'module-item';
      modBtn.dataset.courseId = course.id;
      modBtn.dataset.moduleId = mod.id;
      modBtn.textContent = mod.title;
      modBtn.addEventListener('click', () => {
        window.location.hash = course.id + '/' + mod.id;
      });
      moduleList.appendChild(modBtn);
    });

    courseList.appendChild(moduleList);
  });
}

function updateActiveStates(courseId, moduleId) {
  document.querySelectorAll('.course-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.module-list').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.module-item').forEach(el => el.classList.remove('active'));
  if (!courseId) return;
  const courseBtn = document.querySelector('.course-item[data-course-id="' + courseId + '"]');
  if (courseBtn) courseBtn.classList.add('active');
  const moduleList = document.querySelector('.module-list[data-course-id="' + courseId + '"]');
  if (moduleList) moduleList.classList.add('visible');
  if (moduleId) {
    const modBtn = document.querySelector('.module-item[data-course-id="' + courseId + '"][data-module-id="' + moduleId + '"]');
    if (modBtn) modBtn.classList.add('active');
  }
}

function updateProgressTotal() {
  const total = courses.reduce((sum, c) => sum + c.modules.length, 0);
  document.getElementById('progress-total').textContent = total;
}

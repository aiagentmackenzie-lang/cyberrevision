// router.js - hash-based routing
// Parses window.location.hash and dispatches a 'route' CustomEvent on document.
// Hash format: #courseId/moduleId  e.g. #01-foundations/01-introduction-to-cybersecurity
// Empty hash (home state): dispatches route with { courseId: null, moduleId: null }

export function initRouter() {
  function dispatch() {
    const hash = window.location.hash.slice(1);
    const [courseId = null, moduleId = null] = hash ? hash.split('/') : [];
    document.dispatchEvent(new CustomEvent('route', {
      detail: { courseId, moduleId }
    }));
  }
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

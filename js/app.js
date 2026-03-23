// app.js - entry point
// Initialises nav and renderer before starting the router.
// Nav and renderer must be ready to receive the first route event.

import { initRouter }   from './router.js';
import { initNav }      from './nav.js';
import { initRenderer } from './renderer.js';

async function init() {
  await Promise.all([initNav(), initRenderer()]);
  initRouter();
}

init();

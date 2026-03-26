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

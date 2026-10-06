import { steps, coordinates, add } from './gram-schmidt-math.js';

const app = document.getElementById('gs-app');
const svg = document.getElementById('gs-scene');
const content = document.getElementById('gs-step-content');
const progress = document.getElementById('gs-progress');
const legend = document.getElementById('gs-legend');
const prev = document.getElementById('gs-prev');
const next = document.getElementById('gs-next');
const namespace = 'http://www.w3.org/2000/svg';
let current = 0;
let yaw = .7;
let elevation = .65;
let drag = null;
let labelBoxes = [];

function node(tag, attrs = {}, text) {
  const element = document.createElementNS(namespace, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  if (text !== undefined) element.textContent = text;
  return element;
}

function project([x, y, z]) {
  const step = steps[current];
  const size = 300 / step.extent;
  const horizontal = x * Math.cos(yaw) - y * Math.sin(yaw);
  const depth = x * Math.sin(yaw) + y * Math.cos(yaw);
  return [270 + horizontal * size, 330 - (z * Math.cos(elevation) + depth * Math.sin(elevation)) * size];
}

function line(parent, from, to, attrs = {}) {
  const a = project(from);
  const b = project(to);
  parent.append(node('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], ...attrs }));
}

function label(parent, point, text, color, dx = 8, dy = -8) {
  const [x, y] = project(point);
  const textNode = node('text', {
    fill: color, 'font-size': 15, 'font-family': 'system-ui, sans-serif',
    'paint-order': 'stroke', stroke: '#f7f9fd', 'stroke-width': 4, 'stroke-linejoin': 'round',
  }, text);
  parent.append(textNode);
  const offsets = [[dx, dy], [8, 20], [8, -26], [-text.length * 8 - 8, -9], [8, 38], [-text.length * 8 - 8, 20], [8, -44]];
  for (const [offsetX, offsetY] of offsets) {
    textNode.setAttribute('x', x + offsetX);
    textNode.setAttribute('y', y + offsetY);
    const box = textNode.getBBox();
    const overlap = labelBoxes.some(other => box.x < other.x + other.width + 6 && box.x + box.width + 6 > other.x && box.y < other.y + other.height + 4 && box.y + box.height + 4 > other.y);
    if (!overlap && box.x >= 8 && box.x + box.width <= 612 && box.y >= 8 && box.y + box.height <= 445) break;
  }
  labelBoxes.push(textNode.getBBox());
}

function renderScene() {
  const step = steps[current];
  svg.replaceChildren();
  labelBoxes = [];
  svg.append(node('title', { id: 'gs-scene-title' }, `Step ${current + 1}: ${step.title}`));
  svg.append(node('desc', { id: 'gs-scene-desc' }, `${step.observe} Visible vectors: ${step.arrows.map(a => a.label).join(', ')}. Display axes are q₁, q₂, and the normal n in an orthonormal coordinate system for this problem.`));
  const defs = node('defs');
  svg.append(defs);
  const low = -step.extent * .25;
  const high = step.extent * 1.06;
  const corners = [[low, low, 0], [high, low, 0], [high, high * .65, 0], [low, high * .65, 0]];
  svg.append(node('polygon', { points: corners.map(project).map(v => v.join(',')).join(' '), fill: '#e8edf9', 'fill-opacity': .8, stroke: '#bdc9e1', 'stroke-width': 1 }));
  const grid = node('g', { stroke: '#ced7e8', 'stroke-width': .8 });
  svg.append(grid);
  const spacing = step.extent > 5 ? 1 : step.extent > 3 ? 1 : step.extent > 2 ? .5 : .25;
  for (let i = Math.ceil(low / spacing); i <= Math.floor(high / spacing); i++) {
    line(grid, [i * spacing, low, 0], [i * spacing, high * .65, 0]);
  }
  for (let i = Math.ceil(low / spacing); i <= Math.floor(high * .65 / spacing); i++) {
    line(grid, [low, i * spacing, 0], [high, i * spacing, 0]);
  }
  const axes = node('g');
  svg.append(axes);
  for (const [axis, axisLabel, length] of [[0, 'q₁ axis', high], [1, 'q₂ axis', high * .7], [2, 'n axis', high * .7]]) {
    const start = [0, 0, 0];
    const end = [0, 0, 0];
    start[axis] = low;
    end[axis] = length;
    line(axes, start, end, { stroke: '#8c98ac', 'stroke-width': 1.2, 'stroke-dasharray': axis === 2 ? '3 5' : 'none' });
    label(axes, end, axisLabel, '#65728b', 5, axis === 0 ? 19 : -8);
  }
  label(axes, [0, 0, 0], '0', '#65728b', -16, 20);
  label(axes, [high * .8, high * .55, 0], 'S', '#65728b');
  // Arrows use actual orthonormal coordinates, with translated starts where needed.
  const vectors = node('g');
  svg.append(vectors);
  step.arrows.forEach((arrow, i) => {
    const markerId = `gs-arrow-${i}`;
    const marker = node('marker', { id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    marker.append(node('path', { d: 'M 0 0 L 10 5 L 0 10 Z', fill: arrow.color }));
    defs.append(marker);
    const from = coordinates(arrow.start);
    const to = coordinates(add(arrow.start, arrow.vector));
    line(vectors, from, to, { stroke: arrow.color, 'stroke-width': arrow.dashed ? 2 : 3, 'stroke-dasharray': arrow.dashed ? '6 5' : 'none', 'marker-end': `url(#${markerId})`, 'data-vector': arrow.label });
    // Put component labels near their midpoint when they end at another arrow's tip.
    const textPoint = arrow.dashed ? from.map((v, j) => (v + to[j]) / 2) : to;
    label(vectors, textPoint, arrow.label, arrow.color, 8, arrow.dashed ? 18 : -9);
  });
  if (step.rightAngle) {
    const origin = coordinates(step.arrows.find(a => a.label === 'p').vector);
    const d = .12;
    const points = [origin.map((v, j) => v + (j === 0 ? d : 0)), origin.map((v, j) => v + (j === 0 || j === 2 ? d : 0)), origin.map((v, j) => v + (j === 2 ? d : 0))];
    svg.append(node('polyline', { points: points.map(project).map(v => v.join(',')).join(' '), fill: 'none', stroke: '#b33b69', 'stroke-width': 1.5 }));
  }
  svg.append(node('text', { x: 16, y: 459, fill: '#65728b', 'font-size': 12 }, `Grid spacing: ${spacing} · camera scale adjusts between steps`));
}

function showStep(index) {
  current = Math.max(0, Math.min(steps.length - 1, index));
  const step = steps[current];
  progress.textContent = `Step ${current + 1} of ${steps.length} · ${current <= 5 ? 'Part (a): the basis' : 'Part (b): the closest vector'}`;
  content.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = step.title;
  const paragraph = document.createElement('p');
  paragraph.textContent = step.text;
  const equation = document.createElement('div');
  equation.className = 'gs-equation';
  // The equations are fixed, repository-owned content; no user input is interpolated.
  equation.innerHTML = step.equation;
  const observe = document.createElement('p');
  observe.className = 'gs-observe';
  observe.textContent = `Look for: ${step.observe}`;
  content.append(heading, paragraph, equation, observe);
  prev.disabled = current === 0;
  next.disabled = current === steps.length - 1;
  for (const [i, button] of [...document.querySelectorAll('#gs-step-nav button')].entries()) {
    if (i === current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  }
  legend.replaceChildren();
  for (const arrow of step.arrows) {
    const item = document.createElement('span');
    item.className = 'gs-legend-item';
    const swatch = document.createElement('span');
    swatch.className = `gs-swatch${arrow.dashed ? ' gs-dashed' : ''}`;
    swatch.style.setProperty('--vector-color', arrow.color);
    swatch.setAttribute('aria-hidden', 'true');
    item.append(swatch, document.createTextNode(arrow.label));
    legend.append(item);
  }
  renderScene();
}

steps.forEach((step, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = i + 1;
  button.setAttribute('aria-label', `Step ${i + 1}: ${step.title}`);
  button.title = step.title;
  button.addEventListener('click', () => showStep(i));
  document.getElementById('gs-step-nav').append(button);
});
prev.addEventListener('click', () => showStep(current - 1));
next.addEventListener('click', () => showStep(current + 1));

const viewButtons = [...app.querySelectorAll('[data-view]')];
function markView(view) {
  viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  document.getElementById('gs-view-label').textContent = view === 'custom' ? 'Rotated view' : viewButtons.find(button => button.dataset.view === view).textContent;
}
viewButtons.forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.view;
  [yaw, elevation] = view === 'plane' ? [0, Math.PI / 2] : view === 'side' ? [Math.PI / 4, .05] : [.7, .65];
  markView(view);
  renderScene();
}));
svg.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  drag = { x: event.clientX, y: event.clientY, yaw, elevation };
  svg.setPointerCapture(event.pointerId);
});
svg.addEventListener('pointermove', event => {
  if (!drag) return;
  yaw = drag.yaw + (event.clientX - drag.x) * .008;
  elevation = Math.max(.05, Math.min(Math.PI / 2, drag.elevation + (event.clientY - drag.y) * .008));
  markView('custom');
  renderScene();
});
svg.addEventListener('pointerup', () => { drag = null; });
svg.addEventListener('pointercancel', () => { drag = null; });
svg.addEventListener('lostpointercapture', () => { drag = null; });
showStep(0);

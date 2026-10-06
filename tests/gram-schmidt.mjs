import assert from 'node:assert/strict';
import { a1, a2, a3, b, q1, q2, n, u2, u3, p, p1, p2, residual, projection2, dot, norm, add, scale, coordinates, steps } from '../assets/js/gram-schmidt-math.js';
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} ≠ ${expected}`);
const vectorClose = (actual, expected) => actual.forEach((v, i) => close(v, expected[i]));
for (const basis of [q1, q2, n]) close(norm(basis), 1);
close(dot(q1, q2), 0);
close(dot(q1, n), 0);
close(dot(q2, n), 0);
vectorClose(u2, [1, -1, -1, 1]);
vectorClose(u3, [0, 0, 0, 0]);
vectorClose(add(projection2, u2), a2);
vectorClose(add(scale(q1, 6), scale(q2, 2)), a3);
vectorClose(p, [.5, 0, 0, .5]);
vectorClose(add(p1, p2), p);
vectorClose(add(p, residual), b);
close(dot(residual, q1), 0);
close(dot(residual, q2), 0);
close(norm(residual), 1 / Math.sqrt(2));
// The display must preserve the full 4D geometry, including translated components.
const vectors = [a1, a2, a3, b, q1, q2, n, u2, p, residual, ...steps.flatMap(s => s.arrows.flatMap(a => [a.start, a.vector]))];
for (const v of vectors) {
  close(norm(coordinates(v)), norm(v));
  for (const w of vectors) close(dot(coordinates(v), coordinates(w)), dot(v, w));
}
// Check the closest-point identity at several other locations in S.
for (const [x, y] of [[0, 0], [1, 1], [-3, 7], [.5, .5]]) {
  const s = add(scale(q1, x), scale(q2, y));
  const difference = (a, b) => a.map((v, i) => v - b[i]);
  close(norm(difference(b, s)) ** 2, norm(residual) ** 2 + norm(difference(p, s)) ** 2);
}
assert.equal(steps.length, 10);
console.log('Passed: orthonormal basis, dependent vector, projection, closest-point identity, and exact 4D → 3D geometry.');

export const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
export const add = (a, b) => a.map((value, i) => value + b[i]);
export const sub = (a, b) => a.map((value, i) => value - b[i]);
export const scale = (a, k) => a.map(value => value * k);
export const norm = a => Math.sqrt(dot(a, a));
export const unit = a => scale(a, 1 / norm(a));
export const a1 = [1, 1, 1, 1];
export const a2 = [3, 1, 1, 3];
export const a3 = add(a1, a2);
export const b = [1, 0, 0, 0];
export const q1 = unit(a1);
export const projection2 = scale(q1, dot(a2, q1));
export const u2 = sub(a2, projection2);
export const q2 = unit(u2);
export const u3 = sub(sub(a3, scale(q1, dot(a3, q1))), scale(q2, dot(a3, q2)));
export const p1 = scale(q1, dot(b, q1));
export const p2 = scale(q2, dot(b, q2));
export const p = add(p1, p2);
export const residual = sub(b, p);
export const n = unit(residual);
export const coordinates = v => [dot(v, q1), dot(v, q2), dot(v, n)];

const color = { input: '#65728b', first: '#4059d8', second: '#087b75', projection: '#b46a09', residual: '#b33b69', target: '#7445bd' };
const arrow = (label, vector, ink, start = [0, 0, 0, 0], dashed = false) => ({ label, vector, color: ink, start, dashed });
const A1 = arrow('a₁', a1, color.input);
const A2 = arrow('a₂', a2, color.input);
const A3 = arrow('a₃', a3, color.input);
const Q1 = arrow('q₁', q1, color.first);
const Q2 = arrow('q₂', q2, color.second);
const B = arrow('b', b, color.target);
const P = arrow('p', p, color.first);

export const steps = [
  {
    title: 'Start with the spanning vectors',
    text: 'The three inputs lie in the same plane S. Before changing them, notice that a₃ = a₁ + a₂: the third vector is a combination of the first two.',
    equation: 'a₁ = (1, 1, 1, 1)<br>a₂ = (3, 1, 1, 3)<br>a₃ = (4, 2, 2, 4)',
    observe: 'The gray arrows are the original vectors. Two independent directions will be enough to describe their plane.',
    arrows: [A1, A2, A3], extent: 7,
  },
  {
    title: '1. Normalize the first vector',
    text: 'There is no earlier direction to remove. Keep u₁ = a₁ and divide by its length to make a unit vector.',
    equation: '‖a₁‖ = √(1 + 1 + 1 + 1) = 2<br>q₁ = a₁ / 2 = ½(1, 1, 1, 1)',
    observe: 'q₁ points in the same direction as a₁, with half its length. Its length is now exactly 1.',
    arrows: [A1, Q1], extent: 2.8,
  },
  {
    title: '2. Find a₂’s component along q₁',
    text: 'Because q₁ has unit length, the scalar dot product tells us how much of a₂ points along q₁. Multiply that scalar by q₁ to get the projection vector.',
    equation: 'a₂ · q₁ = ½(3 + 1 + 1 + 3) = 4<br>proj = 4q₁ = (2, 2, 2, 2)',
    observe: 'The amber arrow is the component along q₁. The dashed connector shows the part of a₂ still outside that line.',
    arrows: [A2, Q1, arrow('4q₁', projection2, color.projection), arrow('remainder', u2, color.second, projection2, true)], extent: 5,
  },
  {
    title: '3. Subtract that component',
    text: 'Remove the part parallel to q₁. What remains is u₂, a new vector perpendicular to q₁.',
    equation: 'u₂ = a₂ − 4q₁<br>= (3, 1, 1, 3) − (2, 2, 2, 2)<br>= (1, −1, −1, 1)<br>q₁ · u₂ = ½(1 − 1 − 1 + 1) = 0',
    observe: 'The teal arrow is u₂ at the origin. The dashed copy completes a₂ = 4q₁ + u₂; translating an arrow preserves its vector.',
    arrows: [A2, Q1, arrow('4q₁', projection2, color.projection), arrow('u₂', u2, color.second), arrow('u₂ translated', u2, color.second, projection2, true)], extent: 5,
  },
  {
    title: '4. Normalize the second direction',
    text: 'Orthogonal means perpendicular. Orthonormal adds one more requirement: every basis vector must have unit length.',
    equation: '‖u₂‖ = √(1 + 1 + 1 + 1) = 2<br>q₂ = u₂ / 2 = ½(1, −1, −1, 1)<br>q₁ · q₂ = 0; ‖q₁‖ = ‖q₂‖ = 1',
    observe: 'The two colored unit arrows form an orthonormal basis of S. The teal direction shrinks to length 1.',
    arrows: [Q1, arrow('u₂', u2, color.input), Q2], extent: 2.8,
  },
  {
    title: '5. Check the third input',
    text: 'Subtract the components along both accepted directions. The remainder is zero, confirming that a₃ contributes no new direction. Skip it: a zero vector cannot be normalized.',
    equation: 'a₃ · q₁ = 6; a₃ · q₂ = 2<br>u₃ = a₃ − 6q₁ − 2q₂<br>= (4, 2, 2, 4) − (3, 3, 3, 3)<br>− (1, −1, −1, 1) = (0, 0, 0, 0)',
    observe: 'The components 6q₁ and 2q₂ reach a₃ exactly. There is no leftover arrow and no q₃.',
    arrows: [A3, Q1, Q2, arrow('6q₁', scale(q1, 6), color.projection), arrow('2q₂ translated', scale(q2, 2), color.second, scale(q1, 6), true)], extent: 7,
  },
  {
    title: '6. Bring in the target b',
    text: 'Part (b) asks for the closest vector in S to b = (1, 0, 0, 0). Since b is outside the plane, we want its perpendicular projection onto S.',
    equation: 'b = (1, 0, 0, 0)<br>Display coordinates of b:<br>(b · q₁, b · q₂, b · n) = (½, ½, 1/√2)',
    observe: 'The purple arrow leaves the shaded plane. Rotate the scene or choose Side view to see its height above S.',
    arrows: [Q1, Q2, B], extent: 1.6,
  },
  {
    title: '7. Compute the two projection pieces',
    text: 'Project b separately onto the two perpendicular unit directions. No denominator is needed because each basis vector has length 1.',
    equation: 'b · q₁ = ½; b · q₂ = ½<br>p₁ = ½q₁ = (¼, ¼, ¼, ¼)<br>p₂ = ½q₂ = (¼, −¼, −¼, ¼)',
    observe: 'The two shorter arrows are the components in S. The dashed translated copy shows how to add them tip to tail.',
    arrows: [B, arrow('½q₁', p1, color.first), arrow('½q₂', p2, color.second), arrow('½q₂ translated', p2, color.second, p1, true)], extent: 1.6,
  },
  {
    title: '8. Add the pieces to get p',
    text: 'The orthogonal projection onto S is the sum of the two basis-direction projections. It lands in S because it is a combination of q₁ and q₂.',
    equation: 'p = (b · q₁)q₁ + (b · q₂)q₂<br>= ½q₁ + ½q₂<br>= (½, 0, 0, ½)',
    observe: 'The blue arrow reaches p in the plane. The dashed segment from p to b shows what the projection leaves behind.',
    arrows: [B, P, arrow('½q₁', p1, color.projection), arrow('½q₂ translated', p2, color.second, p1, true), arrow('b − p', residual, color.residual, p, true)], extent: 1.6,
  },
  {
    title: '9. Verify that p is the closest point',
    text: 'The residual is perpendicular to both basis directions, so it is perpendicular to all of S. Any other point s in the plane adds a nonzero sideways distance.',
    equation: 'r = b − p = (½, 0, 0, −½)<br>r · q₁ = 0; r · q₂ = 0<br>‖b − p‖ = ‖r‖ = 1/√2<br>‖b − s‖² = ‖r‖² + ‖p − s‖²',
    observe: 'The rose segment meets S at a right angle. The minimum distance is its length, achieved when s = p.',
    arrows: [Q1, Q2, B, P, arrow('r = b − p', residual, color.residual, p, true)], extent: 1.6, rightAngle: true,
  },
];

---
title: Gram–Schmidt · Problem 4
nav_order: 3
permalink: /docs/gram-schmidt/
---

<link rel="stylesheet" href="{{ '/assets/css/gram-schmidt.css' | relative_url }}">

# Gram–Schmidt, one step at a time

Assignment 2 · Problem 4 · Orthogonalize, normalize, then project.
{: .gs-subtitle }

## The homework problem

Find an orthonormal basis for **S ⊂ ℝ⁴**, where

**a₁ = (1, 1, 1, 1), a₂ = (3, 1, 1, 3), a₃ = a₁ + a₂ = (4, 2, 2, 4).**

Then find the closest vector **p ∈ S** to **b = (1, 0, 0, 0)**. Vectors are written as tuples here; they are column vectors in the [assignment PDF]({{ '/mfmlhw2.pdf' | relative_url }}#page=12).

<div class="gs-app" id="gs-app">
  <div class="gs-step-nav" role="group" aria-label="Choose an explanation step" id="gs-step-nav"></div>
  <div class="gs-workspace">
    <section class="gs-explanation" aria-label="Current step">
      <div class="gs-kicker" id="gs-progress"></div>
      <div id="gs-step-content" aria-live="polite" aria-atomic="true"></div>
      <div class="gs-controls">
        <button type="button" id="gs-prev">← Previous</button>
        <button type="button" id="gs-next" class="gs-primary">Next step →</button>
      </div>
    </section>
    <section class="gs-figure" aria-label="Interactive three-dimensional vector view">
      <div class="gs-figure-heading"><strong>The geometry</strong><span id="gs-view-label">3D view</span></div>
      <svg id="gs-scene" viewBox="0 0 620 480" role="img" aria-labelledby="gs-scene-title gs-scene-desc">
        <title id="gs-scene-title">Gram–Schmidt vector geometry</title>
        <desc id="gs-scene-desc">Enable JavaScript to explore the vectors step by step.</desc>
      </svg>
      <div class="gs-view-controls" role="group" aria-label="Camera views">
        <button type="button" data-view="orbit" aria-pressed="true">3D view</button>
        <button type="button" data-view="plane" aria-pressed="false">Face the plane</button>
        <button type="button" data-view="side" aria-pressed="false">Side view</button>
      </div>
      <p class="gs-orbit-help">Drag to rotate. Use the view buttons to reset the camera.</p>
      <div class="gs-legend" id="gs-legend" aria-label="Visible vectors"></div>
      <p class="gs-geometry-note">The shaded plane is S. Axes are <strong>q₁, q₂, n</strong>, not the original coordinates of ℝ⁴. All arrows start at the origin unless marked as a translated component.</p>
    </section>
  </div>
</div>

<noscript><p>Enable JavaScript for the interactive walkthrough. The method and complete answer appear below.</p></noscript>

## The method to remember

Gram–Schmidt takes each spanning vector and subtracts its projections onto the directions already accepted. Normalize each nonzero remainder to get a unit vector. A zero remainder means the input adds no independent direction; skip it rather than dividing by zero.

For an orthonormal set already constructed:

**uₖ = aₖ − Σ (aₖ · qⱼ) qⱼ**, then **qₖ = uₖ / ‖uₖ‖** if **uₖ ≠ 0**.

Here the sum is over the previously accepted basis vectors. Once those vectors are orthonormal, the projection coefficients are just dot products.

## Why a 3D view works for this ℝ⁴ problem

All the vectors in this problem lie in the three-dimensional space **T = span{q₁, q₂, n}**, where

- **q₁ = ½(1, 1, 1, 1)**
- **q₂ = ½(1, −1, −1, 1)**
- **n = (1, 0, 0, −1) / √2**

These three vectors are orthonormal. The display maps any **v ∈ T** to **(v · q₁, v · q₂, v · n)**. This preserves dot products, lengths, and angles for these vectors, so the geometry you see is exact. In this coordinate system **S** is the horizontal plane with third coordinate zero. The fourth ambient direction is unused by this problem.

For example, **a₂** appears at **(4, 2, 0)** and **b** at **(½, ½, 1/√2)**. These displayed coordinates express components along the new axes; the explanation always gives the original ℝ⁴ coordinates.

## Complete answer

**u₁ = a₁**, **‖u₁‖ = 2**, so **q₁ = ½(1, 1, 1, 1)**.

**a₂ · q₁ = 4**, hence **u₂ = a₂ − 4q₁ = (1, −1, −1, 1)**. Since **‖u₂‖ = 2**, **q₂ = ½(1, −1, −1, 1)**.

**a₃ · q₁ = 6** and **a₃ · q₂ = 2**, giving **u₃ = a₃ − 6q₁ − 2q₂ = 0**. Therefore **{q₁, q₂}** is an orthonormal basis of **S**.

For part (b): **p = (b · q₁)q₁ + (b · q₂)q₂ = ½q₁ + ½q₂ = (½, 0, 0, ½)**.

The residual **r = b − p = (½, 0, 0, −½)** is perpendicular to both basis vectors. The distance to **S** is **‖r‖ = 1/√2**. For any **s ∈ S**, Pythagoras gives **‖b − s‖² = ‖r‖² + ‖p − s‖²**, which is minimized uniquely at **s = p**.

<script type="module" src="{{ '/assets/js/gram-schmidt.js' | relative_url }}"></script>

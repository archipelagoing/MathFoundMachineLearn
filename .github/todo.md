# TODO --- Natal Axis Reader

> Build the geometry first. Make it correct. Then make it beautiful. Add
> AI last.

Reference: `PROJECT_BIBLE.md`

------------------------------------------------------------------------

# Current Goal

Build the first working GitHub Pages prototype where a user can manually
enter natal-chart data and see the chart unfolded into **six opposing
house axes**.

The MVP is successful when the app can correctly calculate and
visualize:

-   all 12 house spans
-   all signs contained within each house
-   planetary house placements
-   the six opposing house axes
-   intercepted signs
-   duplicated cusp signs
-   planetary weight across axes
-   proportional sign spans

------------------------------------------------------------------------

# Phase 0 --- Repository Setup

-   [ ] Initialize Vite + React + TypeScript project
-   [ ] Configure GitHub Pages deployment
-   [ ] Add `PROJECT_BIBLE.md`
-   [ ] Add this `todo.md`
-   [ ] Add `README.md`
-   [ ] Choose and add an open-source license
-   [ ] Create base folder structure
-   [ ] Add test framework
-   [ ] Add linting / formatting
-   [ ] Confirm local dev server runs
-   [ ] Confirm production build succeeds
-   [ ] Confirm blank app deploys successfully to GitHub Pages

## Suggested structure

``` text
src/
├── components/
├── geometry/
├── data/
├── types/
├── interpretation/
└── styles/

tests/
public/
```

------------------------------------------------------------------------

# Phase 1 --- Chart Data Model

## Zodiac

-   [ ] Define `ZodiacSign` type
-   [ ] Define canonical zodiac order
-   [ ] Define sign → starting longitude mapping
-   [ ] Add zodiac glyph metadata
-   [ ] Add readable sign names
-   [ ] Add opposite-sign mapping

## Positions

-   [ ] Define `ZodiacPosition`
-   [ ] Support degrees
-   [ ] Support minutes
-   [ ] Normalize every position to absolute longitude
-   [ ] Preserve original degree/minute values for display

## Houses

-   [ ] Define `House`
-   [ ] Store house number
-   [ ] Store exact cusp position
-   [ ] Define opposite-house mapping

## Planets / Points

-   [ ] Define `Planet`
-   [ ] Add Sun
-   [ ] Add Moon
-   [ ] Add Mercury
-   [ ] Add Venus
-   [ ] Add Mars
-   [ ] Add Jupiter
-   [ ] Add Saturn
-   [ ] Add Uranus
-   [ ] Add Neptune
-   [ ] Add Pluto
-   [ ] Add North Node
-   [ ] Add South Node
-   [ ] Add Chiron
-   [ ] Add planet glyph metadata

## Chart

-   [ ] Define `NatalChart`
-   [ ] Store house system
-   [ ] Store 12 cusps
-   [ ] Store planets / points
-   [ ] Store ASC / DSC
-   [ ] Store IC / MC
-   [ ] Add runtime validation for malformed chart data

------------------------------------------------------------------------

# Phase 2 --- Longitude Math

This is foundational. Do not build interpretation logic before these
functions are tested.

-   [ ] Implement `normalizeLongitude()`
-   [ ] Implement `getAbsoluteLongitude()`
-   [ ] Implement `getSignAtLongitude()`
-   [ ] Implement `getDegreeWithinSign()`
-   [ ] Implement `getOppositeLongitude()`
-   [ ] Implement `getOppositeSign()`

## Tests

-   [ ] Aries 0° → 0°
-   [ ] Taurus 0° → 30°
-   [ ] Gemini 0° → 60°
-   [ ] Pisces 29°59′ → just under 360°
-   [ ] 360° normalizes to 0°
-   [ ] values above 360° wrap correctly
-   [ ] negative values normalize correctly
-   [ ] opposite longitude is exactly 180° away
-   [ ] opposite signs resolve correctly

------------------------------------------------------------------------

# Phase 3 --- House Geometry Engine

## House spans

-   [ ] Implement `getHouseSpan()`
-   [ ] Calculate start from current cusp
-   [ ] Calculate end from next cusp
-   [ ] Handle House 12 → House 1 wraparound
-   [ ] Normalize spans crossing 360°

## Sign segments

-   [ ] Implement `getSignsInsideHouse()`
-   [ ] Find every zodiac boundary crossed by a house
-   [ ] Calculate degrees of each sign contained in the house
-   [ ] Preserve first partial sign
-   [ ] Preserve full internal signs
-   [ ] Preserve final partial sign

Example target:

``` text
9H
28°49′ Aries
→ 30° Taurus
→ 2°04′ Gemini
```

should become approximately:

``` json
[
  {
    "sign": "Aries",
    "degreesInsideHouse": 1.18
  },
  {
    "sign": "Taurus",
    "degreesInsideHouse": 30
  },
  {
    "sign": "Gemini",
    "degreesInsideHouse": 2.07
  }
]
```

## Tests

-   [ ] house entirely inside one sign
-   [ ] house crossing one sign boundary
-   [ ] house containing one full sign
-   [ ] house containing multiple sign boundaries
-   [ ] house crossing Pisces → Aries
-   [ ] 12th house wrapping past 360°
-   [ ] sign-segment degrees sum to total house span
-   [ ] no negative segment widths
-   [ ] no duplicated segments

------------------------------------------------------------------------

# Phase 4 --- Planet → House Assignment

-   [ ] Implement `getPlanetHouse()`
-   [ ] Assign by longitude, never by zodiac sign
-   [ ] Handle 360° wraparound
-   [ ] Define cusp-boundary convention
-   [ ] Document cusp-boundary convention in code

Recommended convention:

> A planet exactly on a house cusp belongs to the house beginning at
> that cusp.

## Tests

-   [ ] planet in middle of house
-   [ ] planet immediately before cusp
-   [ ] planet exactly on cusp
-   [ ] planet immediately after cusp
-   [ ] planet in 12H across wraparound
-   [ ] planet and cusp in different zodiac signs but same house
-   [ ] intercepted-sign planet assigned correctly

------------------------------------------------------------------------

# Phase 5 --- Interceptions

-   [ ] Implement `findInterceptedSigns()`
-   [ ] Detect a full 30° sign contained within one house
-   [ ] Verify no cusp occurs inside intercepted sign
-   [ ] Determine containing house
-   [ ] Determine opposite intercepted sign
-   [ ] Determine opposite house
-   [ ] Find planets inside intercepted signs

## Tests

-   [ ] chart with no interceptions
-   [ ] one intercepted pair
-   [ ] multiple full sign segments are handled correctly
-   [ ] intercepted planet is detected
-   [ ] partial sign is NOT called intercepted
-   [ ] sign appearing on a cusp is NOT called intercepted

------------------------------------------------------------------------

# Phase 6 --- Duplicated Cusp Signs

-   [ ] Implement `findDuplicatedCusps()`
-   [ ] Compare consecutive cusp signs
-   [ ] Handle House 12 → House 1
-   [ ] Return duplicated sign + house numbers
-   [ ] Connect duplicated cusp information to interception results

## Tests

-   [ ] no duplicated cusp signs
-   [ ] duplicated sign across two houses
-   [ ] duplicated opposite signs
-   [ ] House 12 / House 1 boundary

------------------------------------------------------------------------

# Phase 7 --- Six-Axis Engine

Create canonical axis metadata.

``` text
1 ↔ 7   Self ↔ Other
2 ↔ 8   Mine ↔ Ours
3 ↔ 9   Information ↔ Worldview
4 ↔ 10  Private Foundation ↔ Public Identity
5 ↔ 11  Individual Expression ↔ Collective Belonging
6 ↔ 12  Organization ↔ Surrender
```

-   [ ] Create `AXES` configuration
-   [ ] Implement `getAxisForHouse()`
-   [ ] Implement `getAxisData()`
-   [ ] Attach both house geometries
-   [ ] Attach planets
-   [ ] Attach sign segments
-   [ ] Attach interceptions
-   [ ] Attach angular information
-   [ ] Attach luminary information

------------------------------------------------------------------------

# Phase 8 --- Architecture Metrics

These are descriptive structural metrics, not personality scores.

-   [ ] Implement `findAxisPopulation()`
-   [ ] Count planets per side
-   [ ] Identify empty houses
-   [ ] Identify one-sided axes
-   [ ] Identify Sun axis
-   [ ] Identify Moon axis
-   [ ] Identify ASC ↔ DSC axis
-   [ ] Identify IC ↔ MC axis
-   [ ] Detect major planetary concentrations
-   [ ] Add conservative stellium detection
-   [ ] Keep stellium definition configurable/documented

Return labels such as:

``` text
heavily populated
moderately populated
one-sided
angular
contains Sun
contains Moon
contains interception
mostly empty
```

Do not generate arbitrary numerical personality scores.

------------------------------------------------------------------------

# Phase 9 --- Seed Chart Fixture

Create at least one development fixture complicated enough to expose
geometry bugs.

It should include:

-   [ ] intercepted signs
-   [ ] duplicated cusp signs
-   [ ] empty houses
-   [ ] populated houses
-   [ ] one heavily populated house
-   [ ] Sun
-   [ ] Moon
-   [ ] nodes
-   [ ] Chiron
-   [ ] outer planets
-   [ ] a house crossing Pisces → Aries
-   [ ] 360° wraparound

Use the fixture in tests and Storybook/demo-style views if useful.

**Do not hardcode fixture values into production algorithms.**

------------------------------------------------------------------------

# Phase 10 --- App Shell

-   [ ] Build top-level app layout
-   [ ] Add site title
-   [ ] Add tagline: `Unfold your birth chart.`
-   [ ] Add navigation between views
-   [ ] Add responsive container
-   [ ] Add light mode
-   [ ] Add dark mode
-   [ ] Add basic error boundary
-   [ ] Add empty state

Primary views:

``` text
Wheel | Axes | Architecture
```

For MVP, Wheel may remain disabled or marked "coming later."

------------------------------------------------------------------------

# Phase 11 --- Axes Overview

This is the first major visual milestone.

-   [ ] Create `AxisView`
-   [ ] Render all six axes
-   [ ] Show left house
-   [ ] Show right house
-   [ ] Show axis title
-   [ ] Show polarity labels
-   [ ] Show contained signs
-   [ ] Show planets
-   [ ] Show empty-house state
-   [ ] Show Sun clearly
-   [ ] Show Moon clearly
-   [ ] Show angles where relevant

Target conceptual layout:

``` text
SELF          ●━━━━━━━━━━━━━━━🌙      OTHER
1st House                            7th House
Virgo                                Pisces
```

-   [ ] Make each axis clickable
-   [ ] Make each axis keyboard accessible
-   [ ] Add hover/focus state
-   [ ] Test on narrow screens

------------------------------------------------------------------------

# Phase 12 --- Proportional House Span Component

Create `HouseSpan`.

-   [ ] Render sign segments proportional to degrees inside house
-   [ ] Label each sign
-   [ ] Show zodiac glyph
-   [ ] Show planet markers at proportional positions
-   [ ] Show cusp degree
-   [ ] Show end degree
-   [ ] Highlight intercepted full-sign segments
-   [ ] Add hover/tap details

Example:

``` text
♈│██████████████████████████████│♊
           ♉ TAURUS
              ☀
```

Detail should show:

``` text
Taurus
0° → 30°
30° inside this house
Intercepted
```

------------------------------------------------------------------------

# Phase 13 --- Expandable Axis Detail

Create `AxisCard`.

For each axis show:

-   [ ] axis number
-   [ ] axis title
-   [ ] polarity
-   [ ] House A
-   [ ] House B
-   [ ] exact cusps
-   [ ] contained signs
-   [ ] planets
-   [ ] proportional spans
-   [ ] interceptions
-   [ ] duplicated cusp notes
-   [ ] luminary flags
-   [ ] angular flags

Add educational sections:

-   [ ] What House A represents
-   [ ] What House B represents
-   [ ] What this axis represents
-   [ ] Sign polarity explanation

For MVP, these can use static educational copy rather than AI.

------------------------------------------------------------------------

# Phase 14 --- Interception UI

Create `InterceptionCard`.

-   [ ] Show intercepted pair
-   [ ] Show houses
-   [ ] Show planets inside each intercepted sign
-   [ ] Explain interception simply
-   [ ] Link/click back to corresponding axis

Example:

``` text
INTERCEPTED AXIS

♏ Scorpio
3rd House
    ↕
♉ Taurus
9th House
```

------------------------------------------------------------------------

# Phase 15 --- Duplicated Cusp UI

-   [ ] Display duplicated signs
-   [ ] Display affected houses
-   [ ] Explain what "duplicated cusp sign" means
-   [ ] Link to corresponding houses/axes

------------------------------------------------------------------------

# Phase 16 --- Architecture View

Create `ArchitectureView`.

-   [ ] Render six axes
-   [ ] Minimize sign interpretation
-   [ ] Emphasize planet distribution
-   [ ] Show empty houses
-   [ ] Show occupied houses
-   [ ] Show individual planet glyphs
-   [ ] Highlight Sun
-   [ ] Highlight Moon
-   [ ] Highlight angles
-   [ ] Add accessible text equivalent

Concept:

``` text
1H  ○ ━━━━━━━━━━━━━━━━━ ●  7H
                         🌙

2H  ○ ━━━━━━━━━━━━━━━━━ ○  8H

3H  ○ ━━━━━━━━━━━━━━━━━ ●  9H
                         ☀

4H  ● ━━━━━━━━━━━━━ ●●●●● 10H
    ♇                ☿♄♀♂☊
```

------------------------------------------------------------------------

# Phase 17 --- Manual Chart Input

Create `ChartInput`.

## House data

-   [ ] house system selector/text field
-   [ ] twelve cusp sign selectors
-   [ ] twelve cusp degree fields
-   [ ] optional minute fields

## Planet data

For each supported planet/point:

-   [ ] sign selector
-   [ ] degree
-   [ ] minute
-   [ ] optional enable/disable for points such as Chiron/Nodes

## Validation

-   [ ] degrees must be 0--29
-   [ ] minutes must be 0--59
-   [ ] exactly 12 house cusps
-   [ ] cusp order must produce valid house progression
-   [ ] show useful validation errors
-   [ ] never silently repair ambiguous chart data

## UX

-   [ ] provide sample chart button
-   [ ] provide clear/reset button
-   [ ] preserve current form during view changes

------------------------------------------------------------------------

# Phase 18 --- Chart Confirmation

After input, show normalized data before visualization.

``` text
WE READ YOUR CHART AS:

ASC     Virgo 6°12′
MC      Gemini 2°04′

Sun     Taurus 16°59′
Moon    Pisces 24°...
...

[ Looks Right ]
[ Edit Chart ]
```

-   [ ] Show angles
-   [ ] Show house cusps
-   [ ] Show planets
-   [ ] Allow editing
-   [ ] Continue to axes view

------------------------------------------------------------------------

# Phase 19 --- Local Persistence

-   [ ] Save current chart to `localStorage`
-   [ ] Restore on reload
-   [ ] Add "Forget this chart" action
-   [ ] Avoid storing unnecessary birth metadata
-   [ ] Version persisted schema so future changes do not crash old data

------------------------------------------------------------------------

# Phase 20 --- Visual Design Pass

Direction: **information visualization / scientific instrument**, not
generic mystical astrology.

-   [ ] generous whitespace
-   [ ] thin geometric lines
-   [ ] restrained typography
-   [ ] precise degree labels
-   [ ] subtle zodiac glyphs
-   [ ] planets as data points
-   [ ] consistent spacing scale
-   [ ] polished light mode
-   [ ] polished dark mode
-   [ ] no galaxy wallpaper
-   [ ] no excessive gold/purple aesthetic
-   [ ] no unnecessary occult ornament

The chart should provide the visual complexity.

------------------------------------------------------------------------

# Phase 21 --- Responsive Design

-   [ ] desktop axis layout
-   [ ] tablet layout
-   [ ] mobile layout
-   [ ] decide vertical vs horizontal-scroll behavior on mobile
-   [ ] keep labels readable
-   [ ] test expanded cards on small screens
-   [ ] test manual entry on small screens

------------------------------------------------------------------------

# Phase 22 --- Accessibility

-   [ ] keyboard navigation
-   [ ] semantic buttons
-   [ ] visible focus states
-   [ ] sufficient contrast
-   [ ] text alternatives for glyphs
-   [ ] no color-only meaning
-   [ ] `prefers-reduced-motion`
-   [ ] accessible descriptions for visualizations
-   [ ] correct heading hierarchy
-   [ ] screen-reader test of manual input

------------------------------------------------------------------------

# MVP CHECKPOINT

Stop here before adding image parsing or AI.

The MVP is complete when:

-   [ ] manual chart entry works
-   [ ] geometry is correct
-   [ ] geometry tests pass
-   [ ] all six axes render
-   [ ] signs are proportional to actual house spans
-   [ ] planets appear in correct houses
-   [ ] interceptions work
-   [ ] duplicated cusps work
-   [ ] architecture view works
-   [ ] local persistence works
-   [ ] desktop/mobile layouts work
-   [ ] GitHub Pages deployment works

------------------------------------------------------------------------

# Phase 23 --- Traditional Wheel

Only after MVP.

-   [ ] Build circular natal wheel
-   [ ] Render signs
-   [ ] Render houses
-   [ ] Render cusps
-   [ ] Render planets
-   [ ] Render ASC / DSC
-   [ ] Render IC / MC
-   [ ] Ensure wheel uses same geometry engine as axes
-   [ ] Do not create a second independent chart-calculation system

------------------------------------------------------------------------

# Phase 24 --- Unfold Animation

Signature interaction:

``` text
Circular Wheel
      ↓
Opposing houses separate
      ↓
Six horizontal axes
```

-   [ ] prototype geometry transition
-   [ ] preserve planet identity during animation
-   [ ] preserve sign identity during animation
-   [ ] keep animation understandable rather than decorative
-   [ ] support reduced-motion fallback
-   [ ] optimize performance on mobile

------------------------------------------------------------------------

# Phase 25 --- Chart Image Upload

Only after deterministic manual mode is reliable.

-   [ ] image upload UI
-   [ ] image preview
-   [ ] parse printed planetary table when available
-   [ ] parse printed house cusp table when available
-   [ ] prefer printed values over wheel estimation
-   [ ] normalize extracted data
-   [ ] flag uncertain values
-   [ ] never guess unreadable values
-   [ ] send parsed chart to confirmation screen
-   [ ] allow manual corrections

------------------------------------------------------------------------

# Phase 26 --- AI Interpretation

Do not expose private API keys in GitHub Pages.

-   [ ] create interpretation schema
-   [ ] create serverless/backend endpoint
-   [ ] send structured chart JSON
-   [ ] never rely on AI for geometry
-   [ ] validate AI response
-   [ ] gracefully handle unavailable AI service

For each axis request:

-   [ ] House A interpretation
-   [ ] House B interpretation
-   [ ] polarity
-   [ ] sign polarity
-   [ ] planetary story
-   [ ] core lesson
-   [ ] personalized question

Whole chart:

-   [ ] planetary-weight synthesis
-   [ ] luminary synthesis
-   [ ] angular synthesis
-   [ ] interceptions
-   [ ] central axis
-   [ ] six questions
-   [ ] overall architecture

------------------------------------------------------------------------

# Phase 27 --- Interpretation Guardrails

-   [ ] chart JSON is source of truth
-   [ ] no invented degrees
-   [ ] no invented houses
-   [ ] no invented aspects
-   [ ] cusp sign ≠ entire house
-   [ ] no assumed interceptions
-   [ ] no assumed stelliums
-   [ ] empty houses remain meaningful
-   [ ] structural facts separated from interpretation
-   [ ] missing data marked unknown
-   [ ] avoid deterministic future claims
-   [ ] describe astrology as symbolic/interpretive

------------------------------------------------------------------------

# Phase 28 --- Sharing / Export

Future enhancement.

-   [ ] print-friendly reading
-   [ ] export architecture view
-   [ ] SVG export
-   [ ] PNG export
-   [ ] shareable chart state without exposing unnecessary personal data
-   [ ] copy axis summary

------------------------------------------------------------------------

# Backlog

Do not start these until the core product is excellent.

-   [ ] synastry axes
-   [ ] transits
-   [ ] progressions
-   [ ] Whole Sign support
-   [ ] Placidus vs Whole Sign comparison
-   [ ] aspects across axes
-   [ ] educational mode
-   [ ] anonymous share links
-   [ ] saved charts

------------------------------------------------------------------------

# Explicit Non-Goals

Do not add during MVP:

-   [ ] daily horoscopes
-   [ ] tarot
-   [ ] compatibility scoring
-   [ ] predictive astrology
-   [ ] social feed
-   [ ] accounts
-   [ ] subscriptions
-   [ ] giant astrology encyclopedia

------------------------------------------------------------------------

# Bugs / Issues

Use this section while building.

## Critical

-   [ ] None yet

## Geometry

-   [ ] None yet

## UI

-   [ ] None yet

## Accessibility

-   [ ] None yet

## Deployment

-   [ ] None yet

------------------------------------------------------------------------

# Decisions

Record implementation decisions here so future coding sessions do not
repeatedly revisit them.

-   **Primary product:** six opposing house axes
-   **Tagline:** "Unfold your birth chart."
-   **MVP input:** manual structured chart entry
-   **Geometry:** deterministic TypeScript
-   **UI:** React + TypeScript + SVG/CSS
-   **Hosting:** GitHub Pages
-   **AI:** post-MVP, external backend/serverless endpoint
-   **API secrets:** never client-side
-   **Planet house assignment:** longitude-based, never sign-based
-   **Cusp convention:** a planet exactly on a cusp belongs to the house
    beginning at that cusp
-   **Visual direction:** information visualization / scientific
    instrument
-   **MVP accounts:** none
-   **Persistence:** local only

------------------------------------------------------------------------

# Next Actions

Start here:

-   [ ] Scaffold Vite + React + TypeScript
-   [ ] Add chart types
-   [ ] Add zodiac metadata
-   [ ] Implement longitude normalization
-   [ ] Implement house spans
-   [ ] Write geometry tests
-   [ ] Add seed fixture
-   [ ] Render first six-axis prototype

**Do not move to AI or image parsing until the geometry engine and
six-axis visualization are working correctly.**

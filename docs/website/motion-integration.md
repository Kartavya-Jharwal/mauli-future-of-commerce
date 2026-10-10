# Motion integration contract

Status: proposed contract for the separate splash and body-stroke work. This does not require a particular rendering library or reimplementation of the motion agent's work.

## Splash adapter

Accept a mount element, `onComplete`, `onSkip`, `reducedMotion`, viewport dimensions and an abort/dispose signal. Return a cleanup function. Package motion as an ES module or static media with a stable entry point, a poster frame, asset manifest, author/rights metadata and declared dependencies. Expose an error signal that allows the page to proceed.

The page owns document scrolling, history and focus. The splash cannot rewrite the body, seize navigation, leave the page locked after an error, or force audio playback. Keep Skip / Enter in ordinary HTML above the animation layer. The custom animation is optional enhancement: missing assets or failed initialization must still reveal the hero and downloads. Returning visitors may bypass it for the session; reduced-motion users receive the static mark and immediate entry. Direct anchor links bypass the introduction.

Target a short intro with a finite duration, to be agreed from the supplied animation. Use a bounded timeout rather than waiting indefinitely for a completion event. Do not treat a loading spinner as an introduction. Preload only essential poster/type assets; defer the motion code so the case study remains responsive.

## Body SVG stroke

The body adapter receives the ordered section anchors and scroll progress. It draws within a dedicated, pointer-events-none decorative layer. Use a normal-flow layout as the source of section positions and recalculate after font loading, viewport changes and content updates. Do not hardcode desktop coordinates into a mobile path.

Keep the SVG accessible name empty and `aria-hidden="true"` when purely decorative. Give meaningful diagrams their own accessible text and keyboard interaction; do not overload the decorative thread with required content. Pause offscreen work, disconnect observers on disposal, and replace the path drawing with a static treatment under reduced motion. Motion must not alter the section order or cause layout shifts.

## Deliverable checklist for both motion packages

Entry module or media; static fallback; integration example; duration/loop rules; CSS isolation; expected dimensions; dependency versions; asset provenance; cleanup method; reduced-motion behaviour; mobile behaviour; performance measurements; and any fonts it assumes. Integration should first run in an isolated preview and then on the project page with its real content length.

## Ownership

The motion agent owns the effect. The project-site owner owns page structure, editorial content, loading, accessibility and release. Any change to DOM ownership, navigation, scroll locking or framework dependencies must be recorded in the integration decision before merging.

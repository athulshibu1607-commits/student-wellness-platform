# Jijnasu — 3D & Immersive Design Audit

**Document Version:** 1.0.0  
**Frameworks:** Three.js, `@react-three/fiber`, `@react-three/drei`  
**Design Aesthetic:** Cinematic spatial depth inspired by modern immersive product design, deep navy `#080D1A`, teal `#14B8A6`, sky cyan `#0EA5E9`, and warm ember `#F97316`.

---

## 1. 3D Component Inventory

### A. Academic Ecosystem Hero Scene (`components/3d/HeroScene.tsx`)
- **Spatial Composition**:
  - Central Academic Core: A floating outer wireframe icosahedron (`args={[1.5, 1]}`) representing structured analytical thinking, enclosing an organic distorting sphere (`MeshDistortMaterial`) representing cognitive adaptability.
  - Orbiting System Satellites: Six interactive dimensional nodes orbiting on a tilted plane representing Jijnasu's 6 core pillars (*Academic Planner*, *Focus Sanctum*, *Wellness*, *MentorAI*, *Engineering Circles*, *Velocity Analytics*).
- **Interactive Capabilities**:
  - Clicking or hovering over any satellite selects that pillar.
  - Displays an interactive inspection panel below the visualizer with a direct route launch button.
- **Performance Budget**:
  - Draw calls: ~8 calls per frame.
  - Geometry: Low-poly icosahedron and optimized sphere segments (`48x48`).
  - Lighting: Single directional light + soft ambient + 1 point accent.
- **Disposal & Fallback**:
  - Cleans up Three.js canvas instances on unmount.
  - WebGL check verifies hardware support.
  - 2D SVG fallback renders an animated concentric radar when WebGL is absent or when `reducedMotion` is active.

---

### B. Pranayama 4-7-8 Breathing Orb (`components/3d/BreathingOrb.tsx`)
- **Spatial Composition**:
  - A volumetric pulsing sphere (`args={[1.2, 64, 64]}`) with real-time `lerp` scale transitions synchronized to the parasympathetic 4-7-8 rhythm:
    - **Inhale (4s)**: Smooth expansion from scale 1.0 to 1.8 with sky blue emissive glow (`#0284C7`).
    - **Hold (7s)**: Gentle micro-oscillation at peak expansion with teal tone (`#0D9488`).
    - **Exhale (8s)**: Smooth contraction from 1.8 to 1.0 with deep oceanic blue (`#0369A1`).
  - Concentric planar atmospheric glow ring (`ringGeometry args={[1.8, 1.85, 64]}`).
- **Accessibility & Reduced Motion**:
  - If `reducedMotion: true`, the Three.js canvas is replaced with a smooth 2D scale indicator.
  - HUD overlay displays countdown seconds (`4s`, `7s`, `8s`) and instructional text for cognitive clarity.

---

### C. Focus Sanctum Ambient Space (`components/3d/FocusEnvironment.tsx`)
- **Spatial Composition**:
  - **Sanctum**: Wireframe rotating icosahedron with subtle float physics.
  - **Cosmos**: 3D particle starfield drifting along the Z-axis to induce calm peripheral motion.
  - **Zen**: Smooth rotating golden-ratio torus knot (`args={[1.5, 0.35, 100, 16]}`) with subtle metallic sheen.
- **Performance Budget**:
  - Zero heavy shadow maps.
  - Particle arrays utilize single indexed `bufferGeometry` (150-250 points max).
  - Maintains 60 FPS on standard integrated GPUs (e.g. Apple Silicon M-series, Intel Iris Xe).

---

## 2. Mobile & Responsive Behavior

1. **Touch Interaction**:
   - Orbital nodes have expanded touch hitboxes (`args={[0.22]}` with pointer capture).
   - On viewports < 640px wide, canvas height is constrained to `340px` to maintain visible text hierarchy above the fold.
2. **Battery & Power Management**:
   - `powerPreference: 'high-performance'` requested only when canvas is active.
   - Dynamic imports with `ssr: false` ensure zero server-side rendering overhead during static page generation.

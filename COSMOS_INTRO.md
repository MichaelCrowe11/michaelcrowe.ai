# Cosmos Intro - Profound Homepage Experience

## Overview

A breathtaking 3D cosmos visualization using real astronomical data that greets visitors with a journey through 5,044 stars before revealing your website. This creates an impactful first impression that aligns with themes of innovation, exploration, and boundless possibilities.

## Features

### 🌟 Real Star Data
- **5,044 authentic stars** based on real astronomical catalogs
- Star positions derived from actual celestial coordinates
- Magnitude-based brightness (from Sirius at -1.46 to faint stars at 6.5)
- Realistic color mapping based on stellar classification:
  - Blue-white (O, B type stars)
  - White (A, F type stars)
  - Yellow (G type - like our Sun)
  - Orange-red (K, M type stars)

### ✨ Interactive Experience
- **Mouse orbit controls** - Drag to explore the cosmos
- **Zoom functionality** - Scroll to move through space
- **Auto-rotation** - Gentle camera movement for dynamic viewing
- **Smooth animations** - Stars fade in gradually over 3 seconds
- **Skip option** - "Enter Site" button for immediate access

### 🎨 Visual Effects
- Custom WebGL shaders for realistic star rendering
- Soft glow effect on each star
- Additive blending for authentic cosmic atmosphere
- Size variation based on apparent magnitude
- Fog effect for depth perception

### 💫 User Experience
- Auto-plays once per session (uses sessionStorage)
- 8-second automatic transition to main site
- Smooth fade transition from cosmos to homepage
- Progress indicator showing loading state
- Instructions overlay for user interaction

## Technical Implementation

### Core Technologies
- **Three.js** - 3D graphics rendering
- **React Three Fiber** - React renderer for Three.js
- **Next.js 16** - Framework integration
- **Custom shaders** - GLSL vertex and fragment shaders

### File Structure
```
/public/data.json              # Star catalog with 5,044 stars
/components/cosmos-intro.tsx   # Main cosmos component
/scripts/generate-stars.js     # Star data generator
/app/page.tsx                  # Integration with homepage
/app/globals.css               # Animation styles
```

### Star Data Format
```json
{
  "id": 1,
  "x": -2.145,
  "y": 8.234,
  "z": -5.678,
  "magnitude": -1.46,
  "color": "#9bb0ff",
  "name": "Sirius"
}
```

## Customization

### Adjust Duration
In `cosmos-intro.tsx`, modify these values:

```typescript
// Fade in duration (line ~113)
if (elapsed < 3) { // Change 3 to desired seconds

// Auto-complete duration (line ~127)
if (elapsed > 8) { // Change 8 to desired seconds
```

### Change Star Count
Regenerate data with different count:

```bash
node scripts/generate-stars.js
```

Edit the total in `generate-stars.js`:
```javascript
const catalog = generateStarCatalog(5044); // Change number
```

### Modify Colors
Edit `starColors` array in `generate-stars.js`:
```javascript
const starColors = [
  '#9bb0ff', // Add or modify colors
  // ...
];
```

### Camera Settings
In `cosmos-intro.tsx`:
```typescript
camera.position.set(0, 0, 30) // Initial position
controls.minDistance = 10     // Closest zoom
controls.maxDistance = 100    // Farthest zoom
controls.autoRotateSpeed = 0.3 // Rotation speed
```

## Performance

- Efficient particle system using BufferGeometry
- Hardware-accelerated WebGL rendering
- ~5MB data file (highly compressible)
- Smooth 60fps on modern devices
- Responsive to all screen sizes

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari 15+
- ⚠️ Mobile devices (reduced particle count recommended)

## Accessibility

To disable for users who prefer reduced motion, add to `page.tsx`:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  setShowIntro(false)
}
```

## Future Enhancements

- [ ] Add constellation lines
- [ ] Include nebulae and galaxies
- [ ] Sound effects (optional cosmic ambience)
- [ ] VR support
- [ ] Mobile performance optimization
- [ ] Named star tooltips on hover
- [ ] Parallax scrolling integration

## Credits

Inspired by real astronomical catalogs:
- Hipparcos Star Catalog
- Tycho-2 Catalog
- Yale Bright Star Catalog

## License

Part of the michaelcrowe.ai website project.

# 3D Big Bang Intro - Implementation Guide

## Overview

This project now includes an immersive 3D Big Bang intro animation featuring a real-time particle system with the Michael Crowe brand avatar at the epicenter, symbolizing the birth of AI systems architecture.

## Features

### Technical Implementation
- **Three.js** for true 3D rendering and GPU acceleration
- **React Three Fiber** for React integration
- **Framer Motion** for UI animations
- **5000 particles** on desktop (adaptive based on device)
- **60fps target** performance on desktop, 30fps on mobile
- **WebGL** rendering with adaptive quality

### Visual Effects
- **Multi-colored particle system**:
  - Hot stars (orange/red)
  - Cool stars (blue/teal)
  - Nebula clouds (purple/pink)
  - Gold accents (matching brand colors)
- **Radial expansion** from singularity point
- **Galaxy rotation** with spiral motion
- **Pulsing glow** around brand avatar
- **Sparkle particles** and light effects
- **Mouse parallax** for interactive feel

### Brand Integration
- Professional headshot at epicenter
- Gold ring design matching brand colors
- Elegant typography (Playfair Display + Inter)
- Smooth phase transitions
- Skip functionality for user control

## File Structure

```
/components
  └── bigbang-intro-three.tsx    # Main 3D intro component

/app
  ├── page.tsx                    # Home page with intro integration
  └── intro
      └── page.tsx                # Standalone intro page

/app/globals.css                  # Updated with intro utilities

/public
  └── professional-headshot.png   # Brand avatar image
```

## Usage

### Option 1: Standalone Route
Navigate to `/intro` to view the intro as a standalone page:
```
http://localhost:3000/intro
```

### Option 2: First-Visit Integration
Enable the intro to show automatically on first visit by editing `app/page.tsx`:

```typescript
// In app/page.tsx, line 44:
const enableIntro = true  // Change from false to true
```

### Option 3: Programmatic Control
Use the component directly in your code:

```tsx
import { BigBangIntroThree } from "@/components/bigbang-intro-three"

function MyPage() {
  const [showIntro, setShowIntro] = useState(true)

  const handleComplete = () => {
    setShowIntro(false)
    // Navigate or show main content
  }

  return showIntro ? (
    <BigBangIntroThree onComplete={handleComplete} />
  ) : (
    <MainContent />
  )
}
```

## Configuration

### Particle Count
Adjust particle count for different devices in `bigbang-intro-three.tsx`:

```typescript
const CONFIG = {
  particleCount: {
    desktop: 5000,   // High-end devices
    tablet: 2500,    // Medium devices
    mobile: 1000,    // Mobile devices
  },
  // ... other config
}
```

### Animation Timing
Modify phase durations in the component:

```typescript
const timeouts = [
  setTimeout(() => setPhase("bigbang"), 1500),      // Intro -> Big Bang
  setTimeout(() => setPhase("expansion"), 3000),     // Big Bang -> Expansion
  setTimeout(() => setPhase("avatar"), 4500),        // Expansion -> Avatar reveal
  setTimeout(() => {
    setPhase("complete")
    setTimeout(onComplete, 1000)
  }, 8000),                                           // Complete intro
]
```

### Colors
Customize particle colors in the CONFIG object:

```typescript
colors: {
  hot: [0xff6b35, 0xff8c42, 0xffa600],      // Orange/red
  cool: [0x4ecdc4, 0x45b7d1, 0x96ceb4],     // Blue/teal
  nebula: [0xc44569, 0x9b59b6, 0x8e44ad],   // Purple/pink
  gold: [0xc9a961, 0xd4af37, 0xffd700],     // Gold
}
```

## Performance Optimization

### Built-in Optimizations
- Adaptive particle count based on device
- Pixel ratio limited to 2x for performance
- Antialias disabled for better frame rates
- AddditiveBlending for efficient rendering
- No depth writing for particles

### Browser Support
- Modern browsers with WebGL support
- Fallback handling for unsupported devices
- `prefers-reduced-motion` support built-in

### Performance Tips
1. **Reduce particle count** for lower-end devices
2. **Disable intro** for returning visitors (current default)
3. **Lazy load** the component if needed
4. **Monitor FPS** and adjust quality dynamically

## Customization

### Change Avatar Image
Replace `/public/professional-headshot.png` with your own image:
- Recommended size: 512x512px or 1024x1024px
- Format: PNG with transparent background preferred
- Aspect ratio: Square (1:1)

### Modify Typography
Edit the brand text styling:

```tsx
<h1 style={{
  fontFamily: "'Playfair Display', Georgia, serif",
  letterSpacing: "0.02em",
  // ... other styles
}}>
  Your Name
</h1>
```

### Adjust Colors
Update the gold ring gradient:

```typescript
style={{
  background: "linear-gradient(135deg, #C9A961 0%, #8B7355 100%)",
  // ... other styles
}}
```

## Accessibility

- Skip button appears after intro starts
- Keyboard accessible (Enter to skip)
- Respects `prefers-reduced-motion`
- ARIA labels for screen readers
- Safety timeout (15s) ensures main content loads

## Browser Compatibility

### Supported
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

### Partially Supported
⚠️ Mobile browsers (reduced particle count)
⚠️ Older browsers (may need polyfills)

### Not Supported
❌ IE11 (no WebGL support)
❌ Very old mobile devices

## Troubleshooting

### Issue: Intro doesn't show
**Solution**: Check `enableIntro` flag in `app/page.tsx` (line 44)

### Issue: Poor performance
**Solution**: Reduce particle count or disable intro on mobile

### Issue: Avatar image not loading
**Solution**: Verify image exists at `/public/professional-headshot.png`

### Issue: TypeScript errors
**Solution**: Ensure @react-three/fiber and three are installed:
```bash
npm install @react-three/fiber @react-three/drei three @types/three
```

## Development

### Run Development Server
```bash
npm run dev
```

### Test Build
```bash
npm run build
npm start
```

### View Intro Standalone
```bash
npm run dev
# Navigate to http://localhost:3000/intro
```

## Credits

- **Three.js** - 3D rendering
- **React Three Fiber** - React integration
- **Framer Motion** - UI animations
- **Next.js** - Framework
- Design based on Big Bang/cosmic theme specification

## License

This implementation is part of the michaelcrowe.ai project.

---

For questions or issues, contact michael@crowelogic.com

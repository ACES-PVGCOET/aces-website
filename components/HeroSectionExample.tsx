// Example: app/page.tsx (or any Hero section component)
// This shows how to drop GlobeHero into a hero section.

import GlobeHero from './CyberGlobe'; // adjust the import path to match your project

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #150a35 0%, #05010f 65%, #000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.9 }}>
        <GlobeHero />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>Connected, everywhere.</h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>Drag the globe to explore our global network.</p>
      </div>
    </section>
  );
}

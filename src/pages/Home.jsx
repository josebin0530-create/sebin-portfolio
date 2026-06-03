import { useRef, useEffect, useState, useCallback } from 'react';
import './Home.css';

export default function Home({ onEnter, panelOpen }) {
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const hasEntered = useRef(false);

  const [isHoverTitle, setIsHoverTitle] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [seedFall, setSeedFall] = useState(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e) => {
      const cur = cursorRef.current;
      if (!cur) return;
      const r = hero.getBoundingClientRect();
      cur.style.left = `${e.clientX - r.left}px`;
      cur.style.top = `${e.clientY - r.top}px`;
      cur.style.opacity = '1';
    };

    const onOut = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onOut);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onOut);
    };
  }, []);

  const handleHeroClick = useCallback((e) => {
    if (hasEntered.current) return;
    hasEntered.current = true;

    const hero = heroRef.current;
    const rect = hero?.getBoundingClientRect();
    if (rect) {
      setSeedFall({
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (cursorRef.current) cursorRef.current.style.opacity = '0';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      onEnter?.();
      hasEntered.current = false;
      return;
    }

    setIsClicked(true);
    setTimeout(() => setIsTransitioning(true), 820);
    setTimeout(() => onEnter?.(), 1120);
    setTimeout(() => {
      setIsClicked(false);
      setIsTransitioning(false);
      setSeedFall(null);
      hasEntered.current = false;
    }, 2300);
  }, [onEnter]);

  return (
    <div
      className={[
        'hero',
        panelOpen ? 'panel-open' : '',
        isHoverTitle ? 'title-hovered' : '',
        isClicked ? 'title-clicked' : '',
        isTransitioning ? 'hero-transitioning' : '',
      ].filter(Boolean).join(' ')}
      ref={heroRef}
      onClick={handleHeroClick}
    >
      <video className="hero-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/main_bg.mp4" type="video/mp4" />
      </video>

      <div ref={cursorRef} className="seed-cursor" aria-hidden="true">
        <img src="/seed.svg" alt="" draggable="false" />
      </div>

      {seedFall && (
        <div
          key={seedFall.id}
          className="seed-fall-wrap"
          aria-hidden="true"
          style={{
            left: `${seedFall.x}px`,
            top: `${seedFall.y}px`,
            '--seed-y': `${seedFall.y}px`,
          }}
        >
          <img src="/seed.svg" className="seed-fall-img" alt="" draggable="false" />
          <span className="seed-glow" />
          {Array.from({ length: 10 }).map((_, index) => (
            <span
              key={index}
              className="dust-dot"
              style={{
                '--tx': `${Math.cos(index * 0.8) * (26 + index * 2)}px`,
                '--ty': `${Math.sin(index * 0.8) * (18 + index)}px`,
                '--di': `${0.78 + index * 0.025}s`,
              }}
            />
          ))}
        </div>
      )}

      <nav className="hero-nav" onClick={e => e.stopPropagation()}>
        <a className="hero-nav-link" onClick={() => onEnter?.()}>About Me</a>
        <a className="hero-nav-link">My Projects</a>
        <a className="hero-nav-link">Contact Me</a>
      </nav>

      <img
        src="/background_flower.png"
        className="hero-flower"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <div className="hero-bottom">
        <p className="hero-hint">Click anywhere to begin</p>
        <h1
          className="hero-title"
          onMouseEnter={() => setIsHoverTitle(true)}
          onMouseLeave={() => setIsHoverTitle(false)}
        >
          <span className="title-char is-s">S</span>
          <span className="title-char">o</span>
          <span className="title-char">f</span>
          <span className="title-char">t</span>
          <span className="title-char">l</span>
          <span className="title-char">y</span>
          <span className="title-space"> </span>
          <span className="title-char is-b">B</span>
          <span className="title-char">l</span>
          <span className="title-char">o</span>
          <span className="title-char">o</span>
          <span className="title-char">m</span>
          <span className="title-char">i</span>
          <span className="title-char">n</span>
          <span className="title-char">g</span>
        </h1>
      </div>
      <p className="hero-monogram-label">SeBin</p>
    </div>
  );
}

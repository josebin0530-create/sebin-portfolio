import { useRef, useEffect, useState, useCallback } from 'react';
import './Home.css';

const DUST = [
  { x: -26, y: -13 },
  { x:  26, y: -13 },
  { x: -17, y: -26 },
  { x:  17, y: -26 },
  { x:  -7, y: -31 },
  { x:   7, y: -31 },
];

export default function Home({ onEnter, panelOpen }) {
  const heroRef    = useRef(null);
  const cursorRef  = useRef(null);
  const hasEntered = useRef(false);
  const [fallenSeed, setFallenSeed] = useState(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // state 없이 직접 DOM 조작 → re-render 없으므로 낙하 애니메이션 끊기지 않음
    const onMove = (e) => {
      const cur = cursorRef.current;
      if (!cur) return;
      const r = hero.getBoundingClientRect();
      cur.style.left    = `${e.clientX - r.left}px`;
      cur.style.top     = `${e.clientY - r.top}px`;
      cur.style.opacity = '1';
    };
    const onOut = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    hero.addEventListener('mousemove',  onMove);
    hero.addEventListener('mouseleave', onOut);
    return () => {
      hero.removeEventListener('mousemove',  onMove);
      hero.removeEventListener('mouseleave', onOut);
    };
  }, []);

  const handleClick = useCallback((e) => {
    if (hasEntered.current) return;
    hasEntered.current = true;

    // 클릭 순간 커서 숨김 (DOM 직접 조작)
    if (cursorRef.current) cursorRef.current.style.opacity = '0';

    const r = heroRef.current.getBoundingClientRect();
    setFallenSeed({ x: e.clientX - r.left, y: e.clientY - r.top });

    setTimeout(() => onEnter?.(), 950);
    setTimeout(() => {
      setFallenSeed(null);
      hasEntered.current = false; // 패널 닫은 후 재클릭 허용
    }, 2200);
  }, [onEnter]);

  return (
    <div className={`hero${panelOpen ? ' panel-open' : ''}`} ref={heroRef} onClick={handleClick}>

      {/* ── 비디오 배경 ── */}
      <video className="hero-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/main_bg.mp4" type="video/mp4" />
      </video>

      {/* ── 커스텀 씨앗 커서 ── */}
      <div
        ref={cursorRef}
        className="seed-cursor"
        aria-hidden="true"
      >
        <img src="/seed.svg" alt="" draggable="false" />
      </div>

      {/* ── 씨앗 낙하 + 먼지 이펙트 ── */}
      {fallenSeed && (
        <div
          className="seed-fall-wrap"
          style={{ left: fallenSeed.x, top: fallenSeed.y }}
          aria-hidden="true"
        >
          <img src="/seed.svg" className="seed-fall-img" alt="" draggable="false" />
          <div className="seed-glow" />
          {DUST.map((d, i) => (
            <div
              key={i}
              className="dust-dot"
              style={{
                '--tx':   `${d.x}px`,
                '--ty':   `${d.y}px`,
                '--di':   `${0.76 + i * 0.04}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── 상단 네비게이션 ── */}
      <nav className="hero-nav" onClick={e => e.stopPropagation()}>
        <a className="hero-nav-link" onClick={() => onEnter?.()}>About Me</a>
        <a className="hero-nav-link">My Projects</a>
        <a className="hero-nav-link">Contact Me</a>
      </nav>

      {/* ── 꽃 심볼 (우측) ── */}
      <img
        src="/background_flower.png"
        className="hero-flower"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* ── 하단 타이틀 영역 ── */}
      <div className="hero-bottom">
        <p className="hero-hint">Click anywhere to begin</p>
        <h1 className="hero-title">Softly Blooming</h1>
      </div>

    </div>
  );
}

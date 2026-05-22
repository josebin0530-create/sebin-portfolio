import { useRef, useState, useEffect } from 'react';
import Flower3D from './Flower3D';
import './Hero.css';

const STAGES = ['bud', 'opening', 'bloom'];

const STAGE_CONTENT = {
  bud: {
    tagline: 'Every idea begins as a seed.',
    label: 'Bud',
    labelKo: '씨앗',
  },
  opening: {
    tagline: 'Growth happens in the quiet.',
    label: 'Opening',
    labelKo: '성장',
  },
  bloom: {
    tagline: 'Ideas planted, experiences grown.',
    label: 'Bloom',
    labelKo: '개화',
  },
};

export default function Hero() {
  const containerRef = useRef(null);
  const [stage, setStage] = useState('bud');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      // top이 음수로 증가 → 스크롤 진행률 0→1
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);

      if (progress < 0.34)      setStage('bud');
      else if (progress < 0.68) setStage('opening');
      else                       setStage('bloom');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = STAGE_CONTENT[stage];
  const stageIndex = STAGES.indexOf(stage);

  return (
    /* 300vh 컨테이너 — 내부 section은 sticky로 고정 */
    <div className="hero-sticky-container" ref={containerRef}>
      <section className={`hero-section hero--${stage}`}>

        <div className="hero-vignette" />

        {/* Large background typography — 3D 꽃 뒤에 깔림 */}
        <div className="hero-bg-text" aria-hidden="true">
          <span className="hero-bg-title">SEBIN</span>
          <span className="hero-bg-subtitle">UX / UI Designer Garden</span>
        </div>

        {/* 3D 작약꽃 — 중앙 main stage */}
        <div className="hero-3d">
          <Flower3D stage={stage} scrollProgress={scrollProgress} />
        </div>

        {/* Navigation */}
        <nav className="hero-nav">
          <a href="#" className="hero-nav-logo">Sebin</a>
          <ul className="hero-nav-links">
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        {/* Foreground text */}
        <div className="hero-content">
          <p className="hero-eyebrow">Portfolio 2025</p>
          <h1 className="hero-name">Sebin Portfolio</h1>
          <p className="hero-role">UX/UI Designer Garden</p>
          <p className="hero-tagline" key={stage}>{content.tagline}</p>
        </div>

        {/* Bloom stage indicator — 우측 하단 */}
        <div className="hero-stage-indicator" role="status" aria-live="polite">
          {STAGES.map((s, i) => (
            <div key={s} className={`stage-step ${s === stage ? 'active' : ''} ${i < stageIndex ? 'passed' : ''}`}>
              <div className="stage-step-dot" />
              <span className="stage-step-label">{STAGE_CONTENT[s].labelKo}</span>
            </div>
          ))}
          {/* Progress track */}
          <div className="stage-track">
            <div
              className="stage-track-fill"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Side labels */}
        <div className="hero-side-label hero-side-label--left">
          <span>Botanical Editorial</span>
        </div>
        <div className="hero-side-label hero-side-label--right">
          <span>Scroll to bloom</span>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" aria-hidden="true">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>

      </section>
    </div>
  );
}

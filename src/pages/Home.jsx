import { useRef, useEffect, useState } from 'react';
import './Home.css';

export default function Home({ onEnter, panelOpen, projectActive = false }) {
  const heroRef        = useRef(null);
  const flowerVideoRef = useRef(null);
  const flowerWrapRef  = useRef(null);
  const heroCenterRef  = useRef(null);
  const heroNavRef     = useRef(null);
  const progressBarRef = useRef(null);
  const hasEntered     = useRef(false);
  const progressRef    = useRef(0);
  const targetRef      = useRef(0);
  const rafRef         = useRef(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (panelOpen) return;

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const applyProgress = (p) => {
      // 꽃: 화면 왼쪽 끝(오른쪽 기울기) → 중앙(직립) + 점점 커짐
      if (flowerWrapRef.current) {
        const xOffset  = (1 - p) * -46;        // vw: -46vw → 0  (왼쪽→중앙)
        const rotation = (1 - p) * 24;         // deg: +24° → 0° (오른쪽 기울기→직립)
        const scale    = 0.80 + p * 0.42;      // 0.80 → 1.22 (점점 커짐)
        flowerWrapRef.current.style.transform =
          `translateX(calc(-50% + ${xOffset}vw)) rotate(${rotation}deg) scale(${scale})`;
      }

      // 텍스트 페이드 아웃
      const textOp = Math.max(0, 1 - p * 2.8);
      if (heroCenterRef.current) heroCenterRef.current.style.opacity = textOp;
      if (heroNavRef.current)    heroNavRef.current.style.opacity    = Math.max(0.12, textOp);

      // 진행 바
      if (progressBarRef.current) progressBarRef.current.style.width = `${p * 100}%`;

      // 진행도 끝에서 패널 오픈
      if (p >= 0.97 && !hasEntered.current) {
        hasEntered.current = true;
        setIsTransitioning(true);
        setTimeout(() => {
          onEnter?.();
          setTimeout(() => {
            setIsTransitioning(false);
            progressRef.current = 1;
            targetRef.current   = 1;
            hasEntered.current  = false;
            if (heroCenterRef.current)  heroCenterRef.current.style.opacity   = '';
            if (heroNavRef.current)     heroNavRef.current.style.opacity      = '';
            if (progressBarRef.current) progressBarRef.current.style.width    = '100%';
          }, 1500);
        }, 200);
      }
    };

    const tick = () => {
      rafRef.current = null;
      const diff = targetRef.current - progressRef.current;
      if (Math.abs(diff) < 0.0003) {
        progressRef.current = targetRef.current;
      } else {
        progressRef.current += diff * 0.1;
        schedule();
      }
      applyProgress(progressRef.current);
    };

    const onWheel = (e) => {
      if (hasEntered.current) return;
      e.preventDefault();
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + e.deltaY * 0.0007));
      schedule();
    };

    let ty = 0;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      if (hasEntered.current) return;
      e.preventDefault();
      const d = ty - e.touches[0].clientY;
      ty = e.touches[0].clientY;
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + d * 0.003));
      schedule();
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [panelOpen, onEnter]);

  return (
    <div
      className={[
        'hero',
        panelOpen       ? 'panel-open'        : '',
        projectActive   ? 'project-active'    : '',
        isTransitioning ? 'hero-transitioning' : '',
      ].filter(Boolean).join(' ')}
      ref={heroRef}
    >
      {/* 배경 이미지 */}
      <img className="hero-bg" src="/mainvisual.png" alt="" aria-hidden="true" draggable="false" />

      {/* 꽃 영상 — 스크롤 드리븐 */}
      <div ref={flowerWrapRef} className="hero-flower-wrap" aria-hidden="true">
        <video
          ref={flowerVideoRef}
          className="hero-flower-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/main_flower.webm" type="video/webm" />
          <source src="/main_flower.mov"  type="video/quicktime" />
        </video>
      </div>

      {/* 스크롤 진행 바 */}
      <div className="scroll-progress-track" aria-hidden="true">
        <div ref={progressBarRef} className="scroll-progress-bar" />
      </div>

      {/* 상단 수평 네비게이션 */}
      <nav ref={heroNavRef} className="hero-nav-top" onClick={e => e.stopPropagation()}>
        <div className="nav-item">
          <img src="/aboutme_label.png" className="nav-icon" alt="" aria-hidden="true" draggable="false" />
          <a className="nav-link" onClick={() => onEnter?.()}>ABout me</a>
        </div>
        <div className="nav-item center">
          <img src="/myproject_label.png" className="nav-icon" alt="" aria-hidden="true" draggable="false" />
          <a className="nav-link">MY Projects</a>
        </div>
        <div className="nav-item">
          <img src="/contactme_label.png" className="nav-icon" alt="" aria-hidden="true" draggable="false" />
          <a className="nav-link">Contact me</a>
        </div>
      </nav>

      {/* 중앙 메인 콘텐츠 */}
      <div ref={heroCenterRef} className="hero-center">
        <h1 className="hero-title">
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
        <p className="hero-sub">
          <strong>작은 경험</strong>을 천천히 <strong>꽃</strong>피우는 디자이너, <strong>조세빈</strong> 입니다.
        </p>
        <p className="hero-hint">
          <span className="hint-arrow" aria-hidden="true" />
          Scroll to bloom
        </p>
      </div>

      <p className="hero-monogram-label">SeBin</p>
    </div>
  );
}

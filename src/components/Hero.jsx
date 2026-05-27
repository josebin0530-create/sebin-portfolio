import { useEffect, useMemo, useRef, useState } from 'react';
import mainFlower from '../assets/main_flower.png';
import petalOne from '../assets/flower1.svg';
import petalTwo from '../assets/flower2.svg';
import petalThree from '../assets/flower3.svg';
import petalFour from '../assets/flower4.svg';
import petalFive from '../assets/flower5.svg';
import './Hero.css';

const FULL_TEXT = 'Welcome to My Garden';
const petals = [petalOne, petalTwo, petalThree, petalFour, petalFive];

const petalLayout = [
  { left: '19%', size: 62, delay: 0.15, duration: 8.4, drift: -38, rotate: -24 },
  { left: '34%', size: 48, delay: 1.05, duration: 9.6, drift: 54, rotate: 36 },
  { left: '49%', size: 58, delay: 1.85, duration: 7.8, drift: -28, rotate: 18 },
  { left: '62%', size: 46, delay: 2.65, duration: 9.1, drift: 46, rotate: -34 },
  { left: '75%', size: 54, delay: 3.35, duration: 8.7, drift: -52, rotate: 42 },
  { left: '28%', size: 42, delay: 4.25, duration: 9.9, drift: 34, rotate: -18 },
  { left: '57%', size: 50, delay: 5.05, duration: 8.2, drift: -44, rotate: 28 },
  { left: '68%', size: 40, delay: 5.8, duration: 10.4, drift: 26, rotate: -28 },
];

export default function Hero() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const totalScrollable = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      const progress = totalScrollable > 0 ? scrolled / totalScrollable : 0;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    let timer;

    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        index += 1;
        setDisplayText(FULL_TEXT.slice(0, index));

        if (index >= FULL_TEXT.length) {
          window.clearInterval(timer);
          window.setTimeout(() => setDone(true), 700);
        }
      }, 105);
    }, 320);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, []);

  const heroStyle = useMemo(() => {
    const eased = Math.min(1, scrollProgress / 0.78);
    const lookDown = Math.min(1, scrollProgress / 0.9);
    const radius = 22 + eased * 54;
    const y = -eased * 88;
    const scaleX = 1 - eased * 0.05;
    const opacity = Math.max(0, 1 - eased * 1.12);
    const skyScale = 1.02 + lookDown * 0.24;
    const skyY = lookDown * -22;
    const floorScale = 1.25 + lookDown * 0.46;
    const floorY = 30 - lookDown * 30;
    const floorOpacity = Math.max(0, Math.min(1, (lookDown - 0.42) / 0.36));

    return {
      '--hero-radius': `${radius}vw`,
      '--hero-y': `${y}vh`,
      '--hero-scale-x': scaleX,
      '--hero-panel-opacity': opacity,
      '--sky-scale': skyScale,
      '--sky-y': `${skyY}vh`,
      '--floor-scale': floorScale,
      '--floor-y': `${floorY}vh`,
      '--floor-opacity': floorOpacity,
    };
  }, [scrollProgress]);

  const mainOpacity = Math.max(0, 1 - scrollProgress / 0.62);
  const petalOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.24));
  const scrollHintOpacity = Math.max(0, 1 - scrollProgress * 10);

  return (
    <div className="hero-sticky-container" ref={containerRef}>
      <section
        className="hero-section"
        style={heroStyle}
        onPointerMove={(event) => {
          setCursor({ x: event.clientX, y: event.clientY, visible: true });
        }}
        onPointerLeave={() => {
          setCursor((current) => ({ ...current, visible: false }));
        }}
      >
        <div className="hero-background" aria-hidden="true">
          <div className="hero-background__sky" />
          <div className="hero-background__floor" />
          <div className="hero-background__light" />
        </div>

        <img
          src={petalOne}
          alt=""
          className={`hero-flower-cursor${cursor.visible ? ' hero-flower-cursor--visible' : ''}`}
          style={{
            '--cursor-x': `${cursor.x}px`,
            '--cursor-y': `${cursor.y}px`,
          }}
          aria-hidden="true"
        />

        <div className="hero-petal-field" style={{ opacity: petalOpacity }} aria-hidden="true">
          {petalLayout.map((petal, index) => (
            <img
              className="hero-petal"
              key={`${petal.left}-${petal.delay}`}
              src={petals[index % petals.length]}
              alt=""
              style={{
                '--petal-left': petal.left,
                '--petal-size': `${petal.size}px`,
                '--petal-delay': `${petal.delay}s`,
                '--petal-duration': `${petal.duration}s`,
                '--petal-drift': `${petal.drift}px`,
                '--petal-rotate': `${petal.rotate}deg`,
              }}
            />
          ))}
        </div>

        <div className="hero-card">
          <nav className="hero-nav">
            <a href="#" className="hero-nav-logo">Sebin</a>
            <ul className="hero-nav-links">
              <li><a href="#work">Work</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

          <div className="hero-main" style={{ opacity: mainOpacity }}>
            <h1 className="hero-title">
              {displayText}
              <span className={`hero-cursor${done ? ' hero-cursor--hidden' : ''}`} aria-hidden="true">|</span>
            </h1>

            <div className="hero-flower-wrap">
              <img src={mainFlower} alt="" className="hero-flower-ghost hero-flower-ghost--left" aria-hidden="true" />
              <img src={mainFlower} alt="" className="hero-flower-ghost hero-flower-ghost--right" aria-hidden="true" />
              <img src={mainFlower} alt="Pink flowers" className="hero-flower" />
            </div>

            <p className="hero-name-text">Sebin</p>
          </div>
        </div>

        <div className="hero-scroll" style={{ opacity: scrollHintOpacity }} aria-hidden="true">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>
    </div>
  );
}

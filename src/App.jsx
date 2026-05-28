import { useRef, useEffect } from 'react';
import Home from './pages/Home';
import AboutMe from './pages/aboutme/AboutMe';
import './App.css';

const PANELS = 2;

export default function App() {
  const scrollRef = useRef(null);
  const currentPage = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const goTo = (index) => {
      const clamped = Math.max(0, Math.min(PANELS - 1, index));
      if (clamped === currentPage.current) return;
      currentPage.current = clamped;
      isScrolling.current = true;
      el.scrollTo({ top: clamped * window.innerHeight, behavior: 'smooth' });
      setTimeout(() => { isScrolling.current = false; }, 900);
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;
      if (e.deltaY > 0) goTo(currentPage.current + 1);
      else              goTo(currentPage.current - 1);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <>
      <div className="global-bg" aria-hidden="true" />
      <div className="site-scroll" ref={scrollRef}>
        <section className="site-panel"><Home /></section>
        <section className="site-panel"><AboutMe /></section>
      </div>
    </>
  );
}

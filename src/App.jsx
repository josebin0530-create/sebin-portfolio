import { useState, useCallback, useEffect, useRef } from 'react';
import Home from './pages/Home';
import AboutMe from './pages/aboutme/AboutMe';
import StaggeredMenu from './pages/home/StaggeredMenu';
import './App.css';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to Home section', target: 'home' },
  { label: 'About Me', ariaLabel: 'Go to About Me section', target: 'about' },
  { label: 'My Life', ariaLabel: 'Go to My Life section', target: 'mylife' },
  { label: 'Projects', ariaLabel: 'Go to Projects section', target: 'projects' },
  { label: 'Contact Me', ariaLabel: 'Go to Contact Me section', target: 'contact' },
];

export default function App() {
  const butterflyCursorRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [myLifeActive, setMyLifeActive] = useState(false);
  const [projectActive, setProjectActive] = useState(false);
  const [contactActive, setContactActive] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [homeResetKey, setHomeResetKey] = useState(0);

  useEffect(() => {
    const cursor = butterflyCursorRef.current;
    const canUseCustomCursor = window.matchMedia('(pointer: fine)').matches;

    if (!cursor || !canUseCustomCursor) return undefined;

    let lastX = null;
    let direction = 'right';

    document.body.classList.add('has-butterfly-cursor');
    cursor.classList.add('is-facing-right');

    const handleMouseMove = (event) => {
      if (lastX !== null) {
        const deltaX = event.clientX - lastX;

        if (Math.abs(deltaX) > 1) {
          direction = deltaX > 0 ? 'right' : 'left';
          cursor.classList.toggle('is-facing-right', direction === 'right');
          cursor.classList.toggle('is-facing-left', direction === 'left');
        }
      }

      lastX = event.clientX;
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.classList.add('is-visible');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('is-visible');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('has-butterfly-cursor');
    };
  }, []);

  const handleEnter = useCallback(() => {
    setMyLifeActive(false);
    setProjectActive(false);
    setContactActive(false);
    setPanelOpen(true);
  }, []);

  const handleNavigate = useCallback((target) => {
    if (target === 'home') {
      setMyLifeActive(false);
      setProjectActive(false);
      setContactActive(false);
      setPanelOpen(false);
      setNavigationTarget(null);
      setHomeResetKey((key) => key + 1);
      return;
    }

    setMyLifeActive(false);
    setProjectActive(false);
    setContactActive(false);
    setPanelOpen(true);
    setNavigationTarget({ target, key: Date.now() });
  }, []);

  return (
    <>
      <span
        ref={butterflyCursorRef}
        className="butterfly-cursor"
        aria-hidden="true"
      />
      <StaggeredMenu
        items={menuItems}
        accentColor="#ca433a"
        panelOpen={panelOpen}
        onSelect={handleNavigate}
      />
      <Home
        key={homeResetKey}
        onEnter={handleEnter}
        panelOpen={panelOpen}
        myLifeActive={myLifeActive}
        projectActive={projectActive}
        contactActive={contactActive}
        resetKey={homeResetKey}
      />
      <AboutMe
        open={panelOpen}
        navigationTarget={navigationTarget}
        onMyLifeActiveChange={setMyLifeActive}
        onProjectActiveChange={setProjectActive}
        onContactActiveChange={setContactActive}
      />
    </>
  );
}

import { useState, useCallback } from 'react';
import Home from './pages/Home';
import AboutMe from './pages/aboutme/AboutMe';
import StaggeredMenu from './pages/home/StaggeredMenu';
import './App.css';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to Home section', target: 'home' },
  { label: 'About Me', ariaLabel: 'Go to About Me section', target: 'about' },
  { label: 'My Life', ariaLabel: 'Go to My Life section', target: 'mylife' },
  { label: 'Projects', ariaLabel: 'Go to Projects section', target: 'projects' },
];

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [myLifeActive, setMyLifeActive] = useState(false);
  const [projectActive, setProjectActive] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [homeResetKey, setHomeResetKey] = useState(0);

  const handleEnter = useCallback(() => {
    setMyLifeActive(false);
    setProjectActive(false);
    setPanelOpen(true);
  }, []);

  const handleNavigate = useCallback((target) => {
    if (target === 'home') {
      setMyLifeActive(false);
      setProjectActive(false);
      setPanelOpen(false);
      setNavigationTarget(null);
      setHomeResetKey((key) => key + 1);
      return;
    }

    setMyLifeActive(false);
    setProjectActive(false);
    setPanelOpen(true);
    setNavigationTarget({ target, key: Date.now() });
  }, []);

  return (
    <>
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
        resetKey={homeResetKey}
      />
      <AboutMe
        open={panelOpen}
        navigationTarget={navigationTarget}
        onMyLifeActiveChange={setMyLifeActive}
        onProjectActiveChange={setProjectActive}
      />
    </>
  );
}

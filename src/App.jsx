import { useState, useCallback } from 'react';
import Home from './pages/Home';
import AboutMe from './pages/aboutme/AboutMe';
import './App.css';

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [projectActive, setProjectActive] = useState(false);

  const handleEnter = useCallback(() => setPanelOpen(true), []);

  return (
    <>
      <Home onEnter={handleEnter} panelOpen={panelOpen} projectActive={projectActive} />
      <AboutMe open={panelOpen} onProjectActiveChange={setProjectActive} />
    </>
  );
}

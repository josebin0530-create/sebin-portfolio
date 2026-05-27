import { useState } from 'react';
import Intro from './components/Intro';
import Home from './pages/Home';
import './App.css';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <Intro onFinish={() => setIntroDone(true)} />}
      <Home />
    </>
  );
}

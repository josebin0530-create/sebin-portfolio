import { useState } from 'react';
import '../styles/Home.css';

export default function Home() {
  const [introOpen, setIntroOpen] = useState(false);

  const openIntro = () => {
    setIntroOpen(true);
  };

  return (
    <div className="home-page">
      <main className={`main-visual${introOpen ? ' main-visual--open' : ''}`} aria-label="Sebin portfolio main visual">
        <div className="main-visual__shade" aria-hidden="true" />
        <h1 className="main-visual__title">
          <span>My Little</span>
          <span>Garden</span>
        </h1>
        <div
          className={`intro-window${introOpen ? ' intro-window--open' : ''}`}
          aria-label="Open the garden window"
          role="button"
          tabIndex={introOpen ? -1 : 0}
          onClick={openIntro}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openIntro();
            }
          }}
        >
          <img className="intro-window__cover" src="/intro1.png" alt="" />
          <div className="intro-window__glow" />
          <div className="intro-window__panel intro-window__panel--left">
            <img className="intro-window__image" src="/intro1_left.png" alt="" />
          </div>
          <div className="intro-window__panel intro-window__panel--right">
            <img className="intro-window__image" src="/intro1_right.png" alt="" />
          </div>
          <div className="intro-window__veil" />
        </div>
      </main>
    </div>
  );
}

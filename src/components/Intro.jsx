import { useEffect, useRef, useState } from 'react';
import './Intro.css';

export default function Intro({ onFinish }) {
  const videoRef = useRef(null);
  const [fading, setFading] = useState(false);

  const finish = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onFinish, 900);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener('ended', finish);
    return () => video.removeEventListener('ended', finish);
  }, []);

  return (
    <div className={`intro-overlay${fading ? ' intro-overlay--fade' : ''}`}>
      <video
        ref={videoRef}
        className="intro-video"
        src="/images/main_visual.mp4"
        autoPlay
        muted
        playsInline
      />
      <button className="intro-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import './ContactMe.css';

export default function ContactMe({ active = true, scrollRootRef, onActiveChange }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      onActiveChange?.(false);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const scrollRoot = scrollRootRef?.current ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.02);
          onActiveChange?.(entry.isIntersecting && entry.intersectionRatio > 0.02);
        });
      },
      { root: scrollRoot, threshold: [0, 0.02, 0.5] }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [active, scrollRootRef, onActiveChange]);

  return (
    <section
      ref={sectionRef}
      className={`about-section contact-section${isVisible ? ' is-visible' : ''}`}
      aria-label="Contact Me"
    >
      <div className="contact-bg" aria-hidden="true" />

      <div className="contact-content">
        <h1 className="contact-title">
          Let&apos;s Bloom
          <br />
          Together
        </h1>
        <p className="contact-subtitle">함께 피워갈 다음 경험을 기다립니다.</p>

        <div className="contact-card">
          <div className="contact-row">
            <span className="contact-label">Phone</span>
            <span className="contact-value">010-2708-0240</span>
          </div>
          <div className="contact-row">
            <span className="contact-label">Email</span>
            <a
              className="contact-value"
              href="mailto:jsb20324@naver.com"
            >
              jsb20324@naver.com
            </a>
          </div>
          <div className="contact-row">
            <span className="contact-label">Instagram</span>
            <a
              className="contact-value contact-instagram"
              href="https://instagram.com/se_binnnn"
              target="_blank"
              rel="noreferrer"
            >
              @se_binnnn
            </a>
          </div>
        </div>

        <a className="contact-button" href="mailto:jsb20324@naver.com">
          Contact me
        </a>
      </div>

      <div className="contact-flower-wrap" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/main_flower.webm" type="video/webm" />
          <source src="/main_flower.mov" type="video/quicktime" />
        </video>
      </div>
    </section>
  );
}

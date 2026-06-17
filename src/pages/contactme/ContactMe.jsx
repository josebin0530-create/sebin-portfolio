import { useEffect, useRef, useState } from 'react';
import Magnet from '../../components/Magnet';
import './ContactMe.css';

export default function ContactMe({ active = true, scrollRootRef, onActiveChange }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!active) {
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
      className={`about-section contact-section${active && isVisible ? ' is-visible' : ''}`}
      aria-label="Contact Me"
    >
      <div className="contact-bg" aria-hidden="true" />

      <div className="contact-content">
        <h1 className="contact-title">
          <span>Let&apos;s Bloom</span>
          <br />
          <span className="contact-title-indent">Together</span>
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

          <form
            id="contact-form"
            className="contact-form"
            action="https://formspree.io/f/xojzbjlp"
            method="POST"
          >
            <input type="hidden" name="_subject" value="Portfolio contact" />
            <label className="contact-field">
              <span>Your email</span>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="contact-field">
              <span>Message</span>
              <textarea
                name="message"
                placeholder="Write a message"
                rows="3"
                required
              />
            </label>
          </form>
        </div>

        <div className="contact-button-magnet">
          <Magnet
            padding={140}
            disabled={false}
            magnetStrength={8}
            activeTransition="transform 0.16s ease-out"
            inactiveTransition="transform 0.45s ease-in-out"
            innerClassName="contact-button-magnet-inner"
          >
            <button className="contact-button" type="submit" form="contact-form">
              Contact me
            </button>
          </Magnet>
        </div>
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

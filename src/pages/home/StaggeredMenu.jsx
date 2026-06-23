import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

export default function StaggeredMenu({
  items = [],
  accentColor = '#ca433a',
  menuButtonColor = 'rgba(255, 255, 255, 0.9)',
  openMenuButtonColor = '#203322',
  panelOpen = false,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const openRef = useRef(false);
  const busyRef = useRef(false);
  const panelRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const iconRef = useRef(null);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const textInnerRef = useRef(null);
  const timelineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const labels = Array.from(panel?.querySelectorAll('.sm-panel-itemLabel') ?? []);
      const numberedItems = Array.from(panel?.querySelectorAll('.sm-panel-item') ?? []);

      gsap.set(panel, { xPercent: 100, opacity: 1 });
      gsap.set(labels, { yPercent: 140, rotate: 10 });
      gsap.set(numberedItems, { '--sm-num-opacity': 0 });
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(plusVRef.current, { rotate: 90, transformOrigin: '50% 50%' });
      gsap.set(toggleBtnRef.current, { color: panelOpen ? '#203322' : menuButtonColor });
    });

    return () => ctx.revert();
  }, [items, menuButtonColor, panelOpen]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    timelineRef.current?.kill();

    const panel = panelRef.current;
    const labels = Array.from(panel?.querySelectorAll('.sm-panel-itemLabel') ?? []);
    const numberedItems = Array.from(panel?.querySelectorAll('.sm-panel-item') ?? []);

    const tl = gsap.timeline({
      onComplete: () => {
        busyRef.current = false;
      },
    });

    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.68, ease: 'power4.out' }, 0)
      .to(labels, {
        yPercent: 0,
        rotate: 0,
        duration: 0.86,
        ease: 'power4.out',
        stagger: 0.09,
      }, 0.18)
      .to(numberedItems, {
        '--sm-num-opacity': 1,
        duration: 0.46,
        ease: 'power2.out',
        stagger: 0.07,
      }, 0.3)
      .to(iconRef.current, { rotate: 225, duration: 0.66, ease: 'power4.out' }, 0)
      .to(toggleBtnRef.current, { color: openMenuButtonColor, duration: 0.28, ease: 'power2.out' }, 0.16);

    timelineRef.current = tl;
  }, [openMenuButtonColor]);

  const playClose = useCallback((onComplete) => {
    timelineRef.current?.kill();

    const panel = panelRef.current;
    const labels = Array.from(panel?.querySelectorAll('.sm-panel-itemLabel') ?? []);
    const numberedItems = Array.from(panel?.querySelectorAll('.sm-panel-item') ?? []);

    busyRef.current = true;
    gsap.timeline({
      onComplete: () => {
        gsap.set(labels, { yPercent: 140, rotate: 10 });
        gsap.set(numberedItems, { '--sm-num-opacity': 0 });
        busyRef.current = false;
        onComplete?.();
      },
    })
      .to(panel, { xPercent: 100, duration: 0.34, ease: 'power3.in' }, 0)
      .to(iconRef.current, { rotate: 0, duration: 0.34, ease: 'power3.inOut' }, 0)
      .to(toggleBtnRef.current, {
        color: panelOpen ? '#203322' : menuButtonColor,
        duration: 0.24,
        ease: 'power2.out',
      }, 0);
  }, [menuButtonColor, panelOpen]);

  const animateText = useCallback((opening) => {
    const nextLines = opening ? ['Menu', 'Close'] : ['Close', 'Menu'];
    setTextLines(nextLines);
    requestAnimationFrame(() => {
      gsap.fromTo(textInnerRef.current, { yPercent: 0 }, { yPercent: -50, duration: 0.38, ease: 'power4.out' });
    });
  }, []);

  const closeMenu = useCallback((onComplete) => {
    if (!openRef.current) {
      onComplete?.();
      return;
    }
    openRef.current = false;
    setOpen(false);
    animateText(false);
    playClose(onComplete);
  }, [animateText, playClose]);

  const toggleMenu = useCallback(() => {
    if (busyRef.current) return;
    const nextOpen = !openRef.current;
    openRef.current = nextOpen;
    setOpen(nextOpen);
    animateText(nextOpen);

    if (nextOpen) {
      playOpen();
    } else {
      playClose();
    }
  }, [animateText, playClose, playOpen]);

  const handleItemClick = useCallback((item) => {
    closeMenu(() => onSelect?.(item.target));
  }, [closeMenu, onSelect]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenu, open]);

  return (
    <div
      className="staggered-menu-wrapper"
      style={{ '--sm-accent': accentColor }}
      data-open={open || undefined}
    >
      <header className="staggered-menu-header" aria-label="Main navigation">
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((line, index) => (
                <span className="sm-toggle-line" key={`${line}-${index}`}>
                  {line}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <div className="sm-backdrop" aria-hidden="true" onClick={() => closeMenu()} />

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering>
            {items.map((item, index) => (
              <li className="sm-panel-itemWrap" key={item.target}>
                <button
                  className="sm-panel-item"
                  type="button"
                  data-index={String(index + 1).padStart(2, '0')}
                  aria-label={item.ariaLabel}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

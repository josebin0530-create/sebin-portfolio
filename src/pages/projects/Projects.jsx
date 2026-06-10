import { useEffect, useRef, useState } from 'react';
import './Projects.css';
import flower1Img from '../aboutme/images/flower_1.png';
import flower2Img from '../aboutme/images/flower_2.png';
import flower3Img from '../aboutme/images/flower_3.png';
import checkcheckImg from './images/checkcheck.png';
import oneldorakImg from './images/oneldorak.png';
import romandImg from './images/romand.png';

const projects = [
  {
    title: '개인앱 - 책책',
    eyebrow: 'Personal app',
    desc: '책을 고르고 기록하는 시간을 더 가볍고 즐겁게 만든 독서 경험 디자인',
    flower: flower1Img,
    image: checkcheckImg,
    imageAlt: '책책 프로젝트 이미지',
    link: '',
  },
  {
    title: '팀프로젝트 롬앤',
    eyebrow: 'Team project',
    desc: '브랜드 무드와 제품 탐색 흐름이 자연스럽게 이어지는 뷰티 웹 경험',
    flower: flower2Img,
    image: romandImg,
    imageAlt: '롬앤 프로젝트 이미지',
    link: '',
  },
  {
    title: '팀프로젝트 오늘도락',
    eyebrow: 'Team project',
    desc: '도시락 주문 과정을 명확하고 사랑스럽게 풀어낸 모바일 서비스',
    flower: flower3Img,
    image: oneldorakImg,
    imageAlt: '오늘도락 프로젝트 이미지',
    link: '',
  },
];

export default function Projects({ active = true, scrollRootRef, onActiveChange }) {
  const copySectionRef = useRef(null);
  const gridSectionRef = useRef(null);
  const projectGridRef = useRef(null);
  const visibleSectionsRef = useRef(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [isFlowerVisible, setIsFlowerVisible] = useState(false);
  const shouldShowSection = active && isVisible;
  const shouldShowFlower = active && isFlowerVisible;

  useEffect(() => {
    const visibleSections = visibleSectionsRef.current;

    if (!active) {
      visibleSections.clear();
      onActiveChange?.(false);
      return undefined;
    }

    const sections = [copySectionRef.current, gridSectionRef.current].filter(Boolean);
    if (!sections.length) return undefined;

    const scrollRoot = scrollRootRef?.current ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.02) {
            visibleSections.add(entry.target);
          } else {
            visibleSections.delete(entry.target);
          }
        });

        const nextVisible = visibleSections.size > 0;
        setIsVisible(nextVisible);
        onActiveChange?.(nextVisible);
      },
      { root: scrollRoot, threshold: [0, 0.02, 0.24, 0.36, 0.58] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      visibleSections.clear();
      onActiveChange?.(false);
    };
  }, [active, scrollRootRef, onActiveChange]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const projectGrid = projectGridRef.current;
    if (!projectGrid) return undefined;

    const copySection = copySectionRef.current;
    const scrollRoot = scrollRootRef?.current ?? null;
    let rafId = null;

    const updateFlowerVisibility = () => {
      rafId = null;
      const gridRect = projectGrid.getBoundingClientRect();
      const rootRect = scrollRoot
        ? scrollRoot.getBoundingClientRect()
        : { top: 0, height: window.innerHeight };
      const rootCenterY = rootRect.top + rootRect.height / 2;
      const startY = rootRect.top + rootRect.height * 0.92;
      const endY = rootCenterY;
      const rawProgress = (startY - gridRect.top) / (startY - endY);
      const nextProgress = Math.max(0, Math.min(1, rawProgress));
      const flowerX = -18 + nextProgress * 18;
      const flowerScale = 0.88 + nextProgress * 0.12;
      const flowerOpacity = nextProgress * 0.9;

      if (copySection) {
        copySection.style.setProperty('--project-flower-progress', nextProgress.toFixed(3));
        copySection.style.setProperty('--project-flower-x', `${flowerX.toFixed(2)}vw`);
        copySection.style.setProperty('--project-flower-scale', flowerScale.toFixed(3));
        copySection.style.setProperty('--project-flower-opacity', flowerOpacity.toFixed(3));
      }

      setIsFlowerVisible(nextProgress > 0);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateFlowerVisibility);
    };

    updateFlowerVisibility();

    const eventTarget = scrollRoot ?? window;
    eventTarget.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      eventTarget.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
      copySection?.style.setProperty('--project-flower-progress', '0');
      copySection?.style.setProperty('--project-flower-x', '-18vw');
      copySection?.style.setProperty('--project-flower-scale', '0.88');
      copySection?.style.setProperty('--project-flower-opacity', '0');
    };
  }, [active, scrollRootRef]);

  return (
    <>
      <section
        ref={copySectionRef}
        className={[
          'about-section project-section project-intro-section',
          shouldShowSection ? 'is-visible' : '',
          shouldShowFlower ? 'is-flower-visible' : '',
        ].filter(Boolean).join(' ')}
        style={{
          '--project-flower-progress': 0,
          '--project-flower-x': '-18vw',
          '--project-flower-scale': 0.88,
          '--project-flower-opacity': 0,
        }}
        aria-label="My Projects"
      >
        <div className="project-intro-grid">
          <div className="project-flower-wrap" aria-hidden="true">
            <video
              className="project-flower-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/main_flower.webm" type="video/webm" />
              <source src="/main_flower.mov" type="video/quicktime" />
            </video>
          </div>

          <div className="project-copy">
            <span className="project-kicker">My Projects</span>
            <p>
              씨앗이 천천히 자라 꽃을 피우듯,<br />
              저 역시 <strong>다양한 경험</strong>과 고민을 통해 <strong>성장</strong>하고 있습니다.<br />
              단순히 예쁜 화면을 넘어, 브랜드와 사용자의 경험이<br />
              자연스럽게 이어지는 디자인을 만듭니다
            </p>
            <span className="project-divider" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section
        ref={gridSectionRef}
        className="about-section project-section project-list-section"
        aria-label="Project list"
      >
        <div className="project-list-shell">
          <div ref={projectGridRef} className="project-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <img src={project.flower} className="project-card-flower" alt="" aria-hidden="true" draggable="false" />
                <span className="project-card-eyebrow">{project.eyebrow}</span>
                <div className="project-thumb">
                  {project.image ? (
                    <img src={project.image} className="project-thumb-image" alt={project.imageAlt} draggable="false" />
                  ) : (
                    <span className="project-thumb-placeholder" aria-hidden="true" />
                  )}
                </div>
                <h2>{project.title}</h2>
                <p>{project.desc}</p>
                <a
                  className={`project-link-button${project.link ? '' : ' is-disabled'}`}
                  href={project.link || '#'}
                  aria-label={`${project.title} 프로젝트 보기`}
                  target={project.link ? '_blank' : undefined}
                  rel={project.link ? 'noreferrer' : undefined}
                  onClick={(event) => {
                    if (!project.link) event.preventDefault();
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    focusable="false"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M8 7H17V16" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

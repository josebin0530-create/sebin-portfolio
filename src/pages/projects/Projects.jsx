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
    title: '오늘도락 - 필요한 만큼, 맛있게 채우는 한 끼',
    eyebrow: 'Team project',
    desc: 'AI 챗봇과 맞춤형 식단 추천을 통해 1~2인 가구의 식생활 고민을 해결하는 스마트 도시락 플랫폼',
    flower: flower3Img,
    image: oneldorakImg,
    imageAlt: '오늘도락 프로젝트 이미지',
    link: 'https://oneuldorak-new.vercel.app/',
    previewMode: 'mobile',
    planLink: 'https://www.figma.com/deck/UJbjbycQZIvYqNoBI90UXa/-%ED%8C%80%ED%94%8C2-4%EC%A1%B0--%EA%B2%B0%EA%B3%BC%EB%B3%B4%EA%B3%A0%EC%84%9C_oneuldorak-%EC%98%A4%EB%8A%98%EB%8F%84%EB%9D%BD-?node-id=4098-19290&t=04vgDOG1x8bOxQWJ-1',
  },
  {
    title: '개인앱 - 책책',
    eyebrow: 'Personal app',
    desc: '책을 고르고 기록하는 시간을 더 가볍고 즐겁게 만든 독서 경험 디자인',
    flower: flower1Img,
    image: checkcheckImg,
    imageAlt: '책책 프로젝트 이미지',
    link: 'https://www.figma.com/proto/3AMKwqdkfAfSWP9O6oFZ8X/%EC%A1%B0%EC%84%B8%EB%B9%88-%EA%B0%9C%EC%9D%B8%EC%95%B1?node-id=550-1890&p=f&viewport=-9754%2C1382%2C0.25&t=yMJd0sidNuelUtJP-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=550%3A1890&show-proto-sidebar=1&page-id=0%3A1',
    planLink: '',
  },
  {
    title: 'rom&nd Global Renewal',
    eyebrow: 'Team project',
    desc: '글로벌 사용자의 탐색 경험을 개선하기 위한 롬앤 공식 웹사이트 리뉴얼 프로젝트',
    flower: flower2Img,
    image: romandImg,
    imageAlt: '롬앤 프로젝트 이미지',
    link: 'https://josebin0530-create.github.io/romand/',
    planLink: 'https://www.figma.com/deck/oFyXPpvmCjEh4UMY23cSsU',
  },
];

const orderedProjects = [projects[0], projects[2], projects[1]];

const getFigmaEmbedUrl = (url) => (
  `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
);

const openMobileWindow = (url, title) => {
  const width = 390;
  const height = 844;
  const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2));
  const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2));
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=yes',
    'scrollbars=yes',
    'noopener',
    'noreferrer',
  ].join(',');

  window.open(url, title, features);
};

const introCopyLines = [
  [{ text: '씨앗이 천천히 자라 꽃을 피우듯,' }],
  [
    { text: '저 역시 ' },
    { text: '다양한 경험', strong: true },
    { text: '과 고민을 통해 ' },
    { text: '성장', strong: true },
    { text: '하고 있습니다.' },
  ],
  [{ text: '단순히 예쁜 화면을 넘어, 브랜드와 사용자의 경험이' }],
  [{ text: '자연스럽게 이어지는 디자인을 만듭니다' }],
];

const introCopyText = introCopyLines
  .map((line) => line.map((segment) => segment.text).join(''))
  .join('\n');

const introCopyCharCount = Math.max(...introCopyLines.map((line) => (
  line.reduce(
    (lineTotal, segment) => lineTotal + Array.from(segment.text).length,
    0
  )
)));

const renderFillSegment = (segment, visibleCount, key) => {
  const SegmentTag = segment.strong ? 'strong' : 'span';

  return (
    <SegmentTag key={key}>
      {Array.from(segment.text).map((character, characterIndex) => (
        <span
          key={`${key}-character-${characterIndex}`}
          className={`project-copy-char${characterIndex < visibleCount ? ' is-filled' : ''}`}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </SegmentTag>
  );
};

const getVisibleSegmentCharCount = (typedCount, lineIndex, segmentIndex) => {
  const charsBeforeSegment = introCopyLines[lineIndex]
    .slice(0, segmentIndex)
    .reduce(
      (segmentTotal, segment) => segmentTotal + Array.from(segment.text).length,
      0
    );
  const segmentLength = Array.from(introCopyLines[lineIndex][segmentIndex].text).length;

  return Math.max(0, Math.min(segmentLength, typedCount - charsBeforeSegment));
};

export default function Projects({ active = true, scrollRootRef, onActiveChange }) {
  const copySectionRef = useRef(null);
  const gridSectionRef = useRef(null);
  const projectGridRef = useRef(null);
  const flowerRef = useRef(null);
  const visibleSectionsRef = useRef(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [isFlowerVisible, setIsFlowerVisible] = useState(false);
  const [isIntroReady, setIsIntroReady] = useState(false);
  const [typedIntroCount, setTypedIntroCount] = useState(0);
  const shouldShowSection = active && isVisible;
  const shouldShowFlower = active && isFlowerVisible;
  const shouldAnimateIntro = active && isIntroReady;

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
        if (!nextVisible) setTypedIntroCount(0);
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
      const resetTimer = window.setTimeout(() => {
        setIsIntroReady(false);
        setTypedIntroCount(0);
      }, 0);

      return () => window.clearTimeout(resetTimer);
    }

    const copySection = copySectionRef.current;
    if (!copySection) return undefined;

    const scrollRoot = scrollRootRef?.current ?? null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.96) {
          setIsIntroReady(true);
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) {
          setIsIntroReady(false);
          setTypedIntroCount(0);
        }
      },
      { root: scrollRoot, threshold: [0, 0.1, 0.96, 1] }
    );

    observer.observe(copySection);

    return () => observer.disconnect();
  }, [active, scrollRootRef]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const projectGrid = projectGridRef.current;
    if (!projectGrid) return undefined;

    const flower = flowerRef.current;
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

      // fade out as grid scrolls off the top
      const fadeOutStartY = rootRect.top + rootRect.height * 0.55;
      const fadeOutEndY = rootRect.top;
      const rawFadeOut = (gridRect.bottom - fadeOutStartY) / (fadeOutEndY - fadeOutStartY);
      const fadeOutProgress = Math.max(0, Math.min(1, rawFadeOut));

      const flowerX = -18 + nextProgress * 18;
      const flowerScale = 0.88 + nextProgress * 0.12;
      const flowerOpacity = nextProgress * (1 - fadeOutProgress) * 0.9;

      if (flower) {
        flower.style.setProperty('--project-flower-x', `${flowerX.toFixed(2)}vw`);
        flower.style.setProperty('--project-flower-scale', flowerScale.toFixed(3));
        flower.style.setProperty('--project-flower-opacity', flowerOpacity.toFixed(3));
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
      if (flower) {
        flower.style.setProperty('--project-flower-x', '-18vw');
        flower.style.setProperty('--project-flower-scale', '0.88');
        flower.style.setProperty('--project-flower-opacity', '0');
      }
    };
  }, [active, scrollRootRef]);

  useEffect(() => {
    if (!shouldAnimateIntro) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let typeTimer = null;

    if (reduceMotion) {
      typeTimer = window.setTimeout(() => {
        setTypedIntroCount(introCopyCharCount);
      }, 0);

      return () => {
        window.clearTimeout(typeTimer);
      };
    }

    const startTimer = window.setTimeout(() => {
      typeTimer = window.setInterval(() => {
        setTypedIntroCount((currentCount) => {
          if (currentCount >= introCopyCharCount) {
            window.clearInterval(typeTimer);
            return currentCount;
          }

          return currentCount + 1;
        });
      }, 55);
    }, 200);

    return () => {
      window.clearTimeout(startTimer);
      if (typeTimer) window.clearInterval(typeTimer);
    };
  }, [shouldAnimateIntro]);

  return (
    <>
      <div
        ref={flowerRef}
        className={`project-flower-wrap${shouldShowFlower ? ' is-visible' : ''}`}
        aria-hidden="true"
        style={{
          '--project-flower-x': '-18vw',
          '--project-flower-scale': 0.88,
          '--project-flower-opacity': 0,
        }}
      >
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

      <section
        ref={copySectionRef}
        className={[
          'about-section project-section project-intro-section',
          shouldShowSection ? 'is-visible' : '',
        ].filter(Boolean).join(' ')}
        aria-label="My Projects"
      >
        <div className="project-intro-grid">
          <div className="project-copy">
            <span className="project-kicker">My Projects</span>
            <p aria-label={introCopyText}>
              {introCopyLines.map((line, lineIndex) => (
                <span key={`line-${lineIndex}`} className="project-copy-line" aria-hidden="true">
                  {line.map((segment, segmentIndex) => renderFillSegment(
                    segment,
                    getVisibleSegmentCharCount(typedIntroCount, lineIndex, segmentIndex),
                    `segment-${lineIndex}-${segmentIndex}`
                  ))}
                </span>
              ))}
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
            {orderedProjects.map((project) => (
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
                <div className="project-card-actions">
                  {project.planLink && (
                    <span className="project-action-item">
                      <a
                        className="project-link-button project-doc-button"
                        href={project.planLink}
                        aria-label={`${project.title} 기획서 보기`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          focusable="false"
                        >
                          <path d="M6 3.5H14.5L18 7V20.5H6V3.5Z" />
                          <path d="M14.5 3.5V7H18" />
                          <path d="M9 11H15" />
                          <path d="M9 14.5H15" />
                          <path d="M9 18H13.5" />
                        </svg>
                      </a>
                      <span className="project-link-preview project-link-preview-deck" aria-hidden="true">
                        <iframe
                          title={`${project.title} 기획서 미리보기`}
                          src={getFigmaEmbedUrl(project.planLink)}
                          loading="lazy"
                        />
                      </span>
                    </span>
                  )}
                  <span className="project-action-item">
                    <a
                      className={`project-link-button${project.link ? '' : ' is-disabled'}`}
                      href={project.link || '#'}
                      aria-label={`${project.title} 프로젝트 보기`}
                      target={project.link ? '_blank' : undefined}
                      rel={project.link ? 'noreferrer' : undefined}
                      onClick={(event) => {
                        if (!project.link) {
                          event.preventDefault();
                          return;
                        }

                        if (project.previewMode === 'mobile') {
                          event.preventDefault();
                          openMobileWindow(project.link, `${project.title} mobile preview`);
                        }
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
                    {project.link && (
                      <span
                        className={[
                          'project-link-preview project-link-preview-site',
                          project.previewMode === 'mobile' ? 'project-link-preview-mobile' : '',
                        ].filter(Boolean).join(' ')}
                        aria-hidden="true"
                      >
                        <iframe
                          title={`${project.title} 사이트 미리보기`}
                          src={project.link}
                          loading="lazy"
                        />
                      </span>
                    )}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import './Projects.css';
import flower1Img from '../aboutme/images/flower_1.png';
import flower2Img from '../aboutme/images/flower_2.png';
import flower3Img from '../aboutme/images/flower_3.png';

const projects = [
  {
    title: '개인앱 - 책책',
    eyebrow: 'Personal app',
    desc: '책을 고르고 기록하는 시간을 더 가볍고 즐겁게 만든 독서 경험 디자인',
    className: 'project-card-check',
    flower: flower1Img,
  },
  {
    title: '팀프로젝트 롬앤',
    eyebrow: 'Team project',
    desc: '브랜드 무드와 제품 탐색 흐름이 자연스럽게 이어지는 뷰티 웹 경험',
    className: 'project-card-romand',
    flower: flower2Img,
  },
  {
    title: '팀프로젝트 오늘도락',
    eyebrow: 'Team project',
    desc: '도시락 주문 과정을 명확하고 사랑스럽게 풀어낸 모바일 서비스',
    className: 'project-card-lunch',
    flower: flower3Img,
  },
];

export default function Projects({ onActiveChange }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting && entry.intersectionRatio >= 0.36;
        setIsVisible(nextVisible);
        onActiveChange?.(nextVisible);
      },
      { threshold: [0, 0.24, 0.36, 0.58] }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      onActiveChange?.(false);
    };
  }, [onActiveChange]);

  return (
    <section
      ref={sectionRef}
      className={`about-section project-section${isVisible ? ' is-visible' : ''}`}
      aria-label="My Projects"
    >
      <div className="project-founder-grid">
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

        <div className="project-content">
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

          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <img src={project.flower} className="project-card-flower" alt="" aria-hidden="true" draggable="false" />
                <span className="project-card-eyebrow">{project.eyebrow}</span>
                <div className={`project-thumb ${project.className}`} aria-hidden="true">
                  <ProjectPreview type={project.className} />
                </div>
                <h2>{project.title}</h2>
                <p>{project.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPreview({ type }) {
  if (type === 'project-card-check') {
    return (
      <>
        <span className="check-mascot" />
        <span className="check-word">chek<br />check</span>
      </>
    );
  }

  if (type === 'project-card-romand') {
    return (
      <>
        <span className="romand-track" />
        <span className="romand-lip romand-lip-1" />
        <span className="romand-lip romand-lip-2" />
        <span className="romand-lip romand-lip-3" />
        <span className="romand-panel romand-panel-large" />
        <span className="romand-panel romand-panel-small" />
        <span className="romand-text">Your Tone<br />Our Beauty</span>
      </>
    );
  }

  return (
    <>
      <span className="lunch-box" />
      <span className="lunch-phone" />
      <span className="lunch-badge">오늘도락</span>
      <span className="lunch-friend lunch-friend-1" />
      <span className="lunch-friend lunch-friend-2" />
      <span className="lunch-friend lunch-friend-3" />
    </>
  );
}

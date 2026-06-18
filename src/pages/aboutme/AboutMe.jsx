import { useEffect, useRef } from 'react';
import './AboutMe.css';
import MyLife from '../mylife/MyLife';
import Projects from '../projects/Projects';
import ContactMe from '../contactme/ContactMe';
import profileImg from './images/profile_2.png';
import flower1Img from './images/flower_1.png';
import flower2Img from './images/flower_2.png';
import flower3Img from './images/flower_3.png';
import flower4Img from './images/flower_4.png';
import figmaIcon from './images/figma.svg';
import adobeIcon from './images/adobe.svg';
import vscodeIcon from './images/vscode.svg';
import ai1Icon from './images/ai_1.svg';
import ai2Icon from './images/ai_2.svg';
import ai3Icon from './images/ai_3.svg';
import ai4Icon from './images/ai_4.svg';
import hobby1Icon from './images/hobby_1.svg';
import hobby2Icon from './images/hobby_2.svg';
import hobby3Icon from './images/hobby_3.svg';
import hobby4Icon from './images/hobby_4.svg';

const cards = [
  {
    className: 'about-card-bio',
    title: 'Profile',
    flower: flower1Img,
    content: (
      <div className="bio-list">
        <div className="bio-info">
          <span>2003.05.30</span>
          <span>서울특별시 광진구</span>
          <span>jsb20324@naver.com</span>
        </div>
        <span className="bio-hobby-label">Things I Love</span>
        <div className="bio-hobby-grid">
          <div className="bio-hobby-item">
            <img src={hobby1Icon} alt="사진찍기" />
            <span>사진찍기</span>
          </div>
          <div className="bio-hobby-item">
            <img src={hobby2Icon} alt="패브릭공예" />
            <span>패브릭공예</span>
          </div>
          <div className="bio-hobby-item">
            <img src={hobby3Icon} alt="드라이브" />
            <span>드라이브</span>
          </div>
          <div className="bio-hobby-item">
            <img src={hobby4Icon} alt="음악듣기" />
            <span>음악듣기</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    className: 'about-card-skills',
    title: 'Skills',
    flower: flower2Img,
    content: (
      <>
        <SkillBar icon={figmaIcon} label="Figma" pct={80} />
        <SkillBar icon={adobeIcon} label="Adobe Illustrator" pct={43} />
        <SkillBar icon={vscodeIcon} label="VS Code" pct={75} />
        <span className="tool-note">그외 사용가능 툴</span>
        <div className="about-tool-row" aria-label="AI tools">
          {[ai1Icon, ai2Icon, ai3Icon, ai4Icon].map((icon, index) => (
            <img key={index} src={icon} alt="" />
          ))}
        </div>
      </>
    ),
  },
  {
    className: 'about-card-history',
    title: 'History',
    flower: flower3Img,
    content: (
      <>
        <InfoGroup title="Education">
          <Entry year="2019.03 - 2022.01" desc="태광고등학교 졸업" />
          <Entry year="2025.12 - 2026.06" desc="UX/UI 디자인 & 프론트엔드 과정 수료" />
        </InfoGroup>
        <InfoGroup title="Experience">
          <Entry year="2022.02 - 2025.07" desc="주식회사 더케이비코리아 카페 매니저" />
        </InfoGroup>
        <InfoGroup title="License">
          <Entry year="2025" desc="웹디자인개발기능사 필기" />
          <Entry year="2022" desc="운전면허 1종 보통" />
        </InfoGroup>
      </>
    ),
  },
  {
    className: 'about-card-bloom',
    title: 'Values',
    flower: flower4Img,
    content: (
      <div className="values-list">
        <div className="value-item">
          <span className="value-title">Discover</span>
          <span className="value-desc">작은 변화도 놓치지 않고 바라봅니다.</span>
        </div>
        <div className="value-item">
          <span className="value-title">Build</span>
          <span className="value-desc">생각에 머무르지 않고 직접 만들어봅니다.</span>
        </div>
        <div className="value-item">
          <span className="value-title">Grow</span>
          <span className="value-desc">끊임없이 배우고 발전해 나아갑니다.</span>
        </div>
      </div>
    ),
  },
];

const sectionSelectors = {
  about: '.about-section-profile',
  mylife: '.mylife-section',
  projects: '.project-intro-section',
  contact: '.contact-section',
};

export default function AboutMe({
  open = false,
  navigationTarget,
  onMyLifeActiveChange,
  onProjectActiveChange,
  onContactActiveChange,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      onProjectActiveChange?.(false);
      onContactActiveChange?.(false);
      return;
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    onMyLifeActiveChange?.(false);
    onProjectActiveChange?.(false);
    onContactActiveChange?.(false);
  }, [open, onMyLifeActiveChange, onProjectActiveChange, onContactActiveChange]);

  useEffect(() => {
    if (!open || !navigationTarget?.target) return undefined;

    const timeoutId = window.setTimeout(() => {
      const scrollRoot = scrollRef.current;
      const selector = sectionSelectors[navigationTarget.target];
      const section = selector ? scrollRoot?.querySelector(selector) : null;

      if (!scrollRoot || !section) return;

      scrollRoot.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [open, navigationTarget]);

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotateX = (offsetY / (rect.height / 2)) * -7;
    const rotateY = (offsetX / (rect.width / 2)) * 7;

    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleCardLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <section className={`about-panel${open ? ' open' : ''}`} aria-hidden={!open}>
      <div ref={scrollRef} className="about-scroll">
        <section className="about-section about-section-profile">
          <div className="about-intro" aria-label="조세빈 소개">
            <p>
              작은 경험의 <strong>씨앗</strong>을 모아<br />
              <strong>오래 기억되는 경험</strong>으로 키워가는<br />
              <strong>디자이너 조세빈</strong> 입니다.
            </p>
            <img src={profileImg} className="about-profile" alt="조세빈 프로필" draggable="false" />
          </div>

          <div className="about-field" aria-label="About Me">
            {cards.map((card, index) => (
              <article
                key={card.title}
                className={`about-card ${card.className}`}
                style={{ '--card-index': index }}
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
              >
                <div className="about-card-surface">
                  <img src={card.flower} className="about-card-flower" aria-hidden="true" draggable="false" />
                  {card.content && (
                    <>
                      <div className="about-card-content">{card.content}</div>
                    </>
                  )}
                </div>
                <span className="about-card-caption">{card.title}</span>
              </article>
            ))}
          </div>
        </section>

        <MyLife
          active={open}
          scrollRootRef={scrollRef}
          onActiveChange={onMyLifeActiveChange}
        />
        <Projects active={open} scrollRootRef={scrollRef} onActiveChange={onProjectActiveChange} />
        <ContactMe active={open} scrollRootRef={scrollRef} onActiveChange={onContactActiveChange} />
      </div>
    </section>
  );
}

function SkillBar({ icon, label, pct }) {
  return (
    <div className="skill-item">
      <div className="skill-item-left">
        <img src={icon} alt="" className="skill-icon" />
        <span className="skill-label">{label}</span>
      </div>
      <div className="skill-track" aria-label={`${label} ${pct}%`}>
        <div className="skill-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function InfoGroup({ title, children }) {
  return (
    <section className="info-group">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Entry({ year, desc }) {
  return (
    <div className="entry">
      <span className="entry-year">{year}</span>
      <span className="entry-desc">{desc}</span>
    </div>
  );
}

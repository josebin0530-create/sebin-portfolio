import './AboutMe.css';
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

const cards = [
  {
    className: 'about-card-bio',
    title: 'Profile',
    flower: flower1Img,
    content: (
      <div className="bio-list">
        <strong>2003.05.30</strong>
        <span>취미</span>
        <span>악기 배우기</span>
        <span>미싱하기</span>
        <span>드라이브</span>
        <span>음악듣기</span>
      </div>
    ),
  },
  {
    className: 'about-card-skills',
    title: 'Skills',
    flower: flower2Img,
    content: (
      <>
        <SkillBar icon={figmaIcon} label="Figma" pct={75} />
        <SkillBar icon={adobeIcon} label="Adobe Illustrator" pct={43} />
        <SkillBar icon={vscodeIcon} label="VS Code" pct={55} />
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
          <Entry year="2019.03 - 2022.01" desc="성지고등학교 졸업" />
          <Entry year="2025.12 - 2026.06" desc="UX/UI 디자인 & 프론트엔드 과정 수료" />
        </InfoGroup>
        <InfoGroup title="Experience">
          <Entry year="2022.02 - 2025.07" desc="주식회사 이디비코리아 카페 매니저" />
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
    title: 'Bloom',
    flower: flower4Img,
    content: null,
  },
];

export default function AboutMe({ open = false, onClose }) {
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
      <button className="about-close" onClick={onClose} aria-label="About Me 닫기">
        Close
      </button>

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
                  <h2>{card.title}</h2>
                  <div className="about-card-content">{card.content}</div>
                </>
              )}
            </div>
            <span className="about-card-caption">{card.title}</span>
          </article>
        ))}
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

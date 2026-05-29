import './AboutMe.css';
import profileImg from './images/profile.png';
import flowerImg  from './images/background_flower2.png';
import figmaIcon  from './images/figma.svg';
import adobeIcon  from './images/adobe.svg';
import vscodeIcon from './images/vscode.svg';
import ai1Icon    from './images/ai_1.svg';
import ai2Icon    from './images/ai_2.svg';
import ai3Icon    from './images/ai_3.svg';
import ai4Icon    from './images/ai_4.svg';

export default function AboutMe({ open = false, onClose }) {
  return (
    <div className={`about-panel${open ? ' open' : ''}`}>

      {/* 닫기 버튼 */}
      <button className="about-close" onClick={onClose} aria-label="닫기">✕</button>

      {/* 배경 장식 꽃 */}
      <img src={flowerImg} className="about-flower-deco" aria-hidden="true" draggable="false" />

      {/* ── 상단: 사진(좌) | 태그라인 + 스킬카드(우) ── */}
      <div className="about-top">
        <img src={profileImg} className="about-photo" alt="프로필 사진" />

        <div className="about-top-right">
          <p className="about-tagline">
            작은 경험의 <strong>씨앗</strong>을 모아<br />
            <strong>오래 기억되는 경험</strong>으로 키워가는<br />
            <strong>디자이너 조세빈</strong> 입니다.
          </p>

          <div className="about-skills-card">
            <h3 className="skills-title">Skills</h3>
            <div className="skills-body">
              <div className="skill-bars-col">
                <SkillBar icon={figmaIcon}  label="Figma"             pct={75} />
                <SkillBar icon={adobeIcon}  label="Adobe Illustrator" pct={43} />
                <SkillBar icon={vscodeIcon} label="VS Code"           pct={55} />
              </div>
              <div className="ai-tools-col">
                <span className="ai-tools-label">그외 사용가능 툴</span>
                <div className="ai-tools-icons">
                  <img src={ai1Icon} alt="AI 1" />
                  <img src={ai2Icon} alt="AI 2" />
                  <img src={ai3Icon} alt="AI 3" />
                  <img src={ai4Icon} alt="AI 4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 정보 섹션 ── */}
      <div className="about-info">
        <InfoSection title="Education">
          <Entry year="2019.03~2022.01" desc="태광고등학교졸업" />
          <Entry
            year="2025.12~2026.06"
            desc={<>이젠아카데미DX교육센터<br />&lt;UXUI디자인&amp;웹기획 프론트엔드 부트캠프&gt; 수료</>}
          />
        </InfoSection>
        <InfoSection title="Experience">
          <Entry year="2022.02~2025.07" desc="주식회사 더케이비코리아  '카페 매니저'" />
        </InfoSection>
        <InfoSection title="License">
          <Entry year="2022.02~2025.07" desc="운전면허증 1종 보통" />
          <Entry year="2022.02~2025.07" desc="웹디자인개발기능사(필기)" />
        </InfoSection>
      </div>

    </div>
  );
}

function SkillBar({ icon, label, pct }) {
  return (
    <div className="skill-item">
      <div className="skill-item-left">
        <img src={icon} alt={label} className="skill-icon" />
        <span className="skill-label">{label}</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="info-section">
      <h3 className="info-section-title">{title}</h3>
      <div className="info-section-entries">{children}</div>
    </div>
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

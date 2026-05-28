import './AboutMe.css';
import figmaIcon    from './images/figma.svg';
import adobeIcon    from './images/adobe.svg';
import vscodeIcon   from './images/vscode.svg';
import ai1Icon      from './images/ai_1.svg';
import ai2Icon      from './images/ai_2.svg';
import ai3Icon      from './images/ai_3.svg';
import ai4Icon      from './images/ai_4.svg';

export default function AboutMe() {
  return (
    <div className="about">

      <div className="about-header">
        <h2 className="about-title">About me</h2>
      </div>

      <div className="about-card">

        <p className="about-intro">
          씨앗이 천천히 자라 꽃을 피우듯, 저 역시 다양한 경험과 고민을 통해 성장하고 있습니다.<br />
          사용자의 입장에서 생각하고, 더 나은 흐름을 만들기 위해 끊임없이 관찰하고 실험합니다.<br />
          단순히 예쁜 화면을 넘어, 브랜드와 사용자의 경험이 자연스럽게 이어지는 디자인을 만들고 싶습니다.
        </p>

        <div className="about-card-body">

          {/* 왼쪽 */}
          <div className="about-left">
            <div className="about-photo" aria-label="프로필 사진" />
            <p className="about-name">JOSEBIN</p>
            <p className="about-dob">2003.05.30</p>
            <div className="about-traits">
              <span>밝은 에너지를 가진</span>
              <span>경험 중심으로 사고하는</span>
              <span>새로운 시도를 즐기는</span>
            </div>

            {/* 스킬바 */}
            <div className="about-skills">
              <SkillBar icon={figmaIcon}  label="Figma"       pct={75} />
              <SkillBar icon={adobeIcon}  label="Illustrator" pct={43} />
              <SkillBar icon={vscodeIcon} label="VSCode"      pct={55} />
            </div>

            {/* AI 툴 아이콘 */}
            <div className="about-ai-tools">
              <span className="ai-tools-label">그외 사용가능 툴</span>
              <div className="ai-tools-icons">
                <img src={ai1Icon} alt="AI Tool 1" />
                <img src={ai2Icon} alt="AI Tool 2" />
                <img src={ai3Icon} alt="AI Tool 3" />
                <img src={ai4Icon} alt="AI Tool 4" />
              </div>
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="about-right-wrap">
            <div className="about-right">
              <InfoSection title="Education">
                <Entry year="2019.03~2022.01" desc="태광고등학교졸업" />
                <Entry year="2025.12~2026.06" desc={<>이젠아카데미DX교육센터<br />&lt;UXUI디자인&amp;웹기획 프론트엔드 부트캠프&gt; 수료</>} />
              </InfoSection>
              <InfoSection title="Experience">
                <Entry year="2022.02~2025.07" desc="주식회사 더케이비코리아  '카페 매니저'" />
              </InfoSection>
              <InfoSection title="License">
                <Entry year="2022.02~2025.07" desc="운전면허증 1종 보통" />
                <Entry year="2022.02~2025.07" desc="웹디자인개발기능사(필기)" />
              </InfoSection>
            </div>
            <div className="about-quote-wrap">
              <p className="about-quote">
                "작은 경험의 씨앗을, 오래 기억되는 사용자 경험으로 키워가는 디자이너"
              </p>
            </div>
          </div>

        </div>
      </div>

      <img src="/seed.png" className="about-seed" alt="" aria-hidden="true" draggable="false" />
      <div className="about-line" aria-hidden="true" />
    </div>
  );
}

function SkillBar({ icon, label, pct }) {
  return (
    <div className="skill-bar">
      <img src={icon} alt={label} className="skill-icon" />
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

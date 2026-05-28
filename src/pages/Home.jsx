import './Home.css';

export default function Home() {
  return (
    <div className="hero">

      {/* ── 빛 오버레이 ── */}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-glow"    aria-hidden="true" />

      {/* ── 메인 콘텐츠 ── */}
      <main className="hero-content">

        {/* 십자수 꽃 오브젝트 (타이틀 뒤) */}
        <img
          src="/background_flower.png"
          className="hero-flower"
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        {/* 타이포그래피 */}
        <h1 className="hero-title">Softly Blooming</h1>
        <p  className="hero-sub">Sebin portfolio</p>

      </main>

      {/* ── 하단 editorial 라인 ── */}
      <div className="hero-line" aria-hidden="true" />

    </div>
  );
}

import { useRef, useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import flower1Src from '../assets/flower1.png';
import flower2Src from '../assets/flower2.png';
import './Flower3D.css';

const SPLINE_URL = 'YOUR_SPLINE_SCENE_URL_HERE';

/* ─────────────────────────────────────────────────────
   Canvas로 흰 배경 제거
   - 밝기 높고 채도 낮은 픽셀(흰색/회색) → 투명 처리
   - 경계 픽셀은 부드럽게 페이드 (anti-aliasing)
───────────────────────────────────────────────────── */
function removeWhiteBg(src) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];

        // 채도: 0 = 완전 흰/회색, 높을수록 컬러
        const sat = Math.max(r, g, b) - Math.min(r, g, b);
        // 밝기 평균
        const bright = (r + g + b) / 3;

        if (bright > 248 && sat < 14) {
          // 순수 흰 배경 → 완전 투명
          d[i + 3] = 0;
        } else if (bright > 228 && sat < 28) {
          // 경계 부근 → 부드럽게 반투명
          const bRatio = (bright - 228) / 20;   // 0 → 1
          const sRatio = Math.max(0, (28 - sat) / 28); // 1 → 0
          const reduce = bRatio * sRatio * 0.94;
          d[i + 3] = Math.round(d[i + 3] * (1 - reduce));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(src); // 실패 시 원본 그대로
    img.src = src;
  });
}

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function Flower3D({ stage = 'bud', scrollProgress = 0 }) {
  const splineRef = useRef(null);
  function onLoad(app) { splineRef.current = app; }

  useEffect(() => {
    const app = splineRef.current;
    if (!app) return;
    try { app.emitEvent('mouseDown', { bud: 'Bud', opening: 'Opening', bloom: 'Bloom' }[stage]); } catch (_) {}
    try { app.setVariable('Progress', scrollProgress); } catch (_) {}
  }, [stage, scrollProgress]);

  return (
    <div className="flower3d-wrapper">
      {SPLINE_URL === 'YOUR_SPLINE_SCENE_URL_HERE'
        ? <PeonyImages scrollProgress={scrollProgress} />
        : <Spline scene={SPLINE_URL} onLoad={onLoad} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Image crossfade with transparent backgrounds
───────────────────────────────────────────────────── */
function PeonyImages({ scrollProgress }) {
  const [budSrc,   setBudSrc]   = useState(null);
  const [bloomSrc, setBloomSrc] = useState(null);
  const [ready,    setReady]    = useState(false);

  // 마운트 시 한 번만 배경 제거 처리
  useEffect(() => {
    Promise.all([
      removeWhiteBg(flower1Src),
      removeWhiteBg(flower2Src),
    ]).then(([bud, bloom]) => {
      setBudSrc(bud);
      setBloomSrc(bloom);
      setReady(true);
    });
  }, []);

  // 스크롤 → ease-in-out 커브로 전환 비율 계산
  const t = Math.max(0, Math.min(1, (scrollProgress - 0.08) / 0.78));
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const budOpacity   = 1 - eased;
  const budScale     = 0.88 + eased * 0.16;   // 0.88 → 1.04
  const bloomOpacity = eased;
  const bloomScale   = 0.90 + eased * 0.10;   // 0.90 → 1.00

  return (
    <div
      className="peony-images-container"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease' }}
    >
      {/* 꽃 뒤 핑크 글로우 */}
      <div className="peony-glow" style={{ opacity: 0.35 + eased * 0.55 }} />

      <div className="peony-float-wrapper">
        {/* 만개 이미지 — 아래 레이어 */}
        {bloomSrc && (
          <img
            src={bloomSrc}
            alt="작약 만개"
            className="peony-img"
            style={{ opacity: bloomOpacity, transform: `scale(${bloomScale})` }}
            draggable={false}
          />
        )}
        {/* 봉우리 이미지 — 위 레이어, 서서히 사라짐 */}
        {budSrc && (
          <img
            src={budSrc}
            alt="작약 봉우리"
            className="peony-img"
            style={{ opacity: budOpacity, transform: `scale(${budScale})` }}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import CircularGallery from './CircularGallery';
import './MyLife.css';
import myImg1 from './images/optimized/myimg_1.jpg';
import myImg2 from './images/optimized/myimg_2.jpg';
import myImg3 from './images/optimized/myimg_3.jpg';
import myImg4 from './images/optimized/myimg_4.jpeg';
import myImg5 from './images/optimized/myimg_5.jpg';
import myImg6 from './images/optimized/myimg_6.jpg';
import myImg7 from './images/optimized/myimg_7.jpg';
import myImg12 from './images/optimized/myimg_12.jpg';
import myImg18 from './images/optimized/myimg_18.jpg';
import myPage20 from './images/optimized/mypage_20.jpg';

const galleryItems = [
  { image: myImg1, text: '커피를 내리는 시간을 좋아합니다' },
  { image: myImg2, text: '바이크를 타며 바람을 즐기기도 합니다' },
  { image: myImg3, text: '소중한 친구들과 추억을 쌓고요' },
  { image: myImg4, text: '저의 작품을 사진으로 남기기도 합니다' },
  { image: myImg5, text: '제품이미지 사진에도 항상 진심입니다' },
  { image: myImg6, text: '전시회를 즐기기도 하고' },
  { image: myImg7, text: '디저트도 많이 좋아합니다' },
  { image: myImg12, text: '소중한 사람들과 계절을 같이 즐깁니다' },
  { image: myImg18, text: '팀원들과 소통하는것을 중요시 합니다' },
  { image: myPage20, text: '런닝크루 가방제작도 했습니다' },
];

const notes = [
  {
    title: 'Calm',
    text: '급하게 결론을 내리기보다 오래 바라보고 천천히 정리합니다.',
  },
  {
    title: 'Detail',
    text: '작은 차이를 발견하는 순간을 좋아하고, 그 감각을 화면에 담습니다.',
  },
  {
    title: 'Warm',
    text: '사용자에게 편안하게 닿는 말투와 흐름을 중요하게 생각합니다.',
  },
];

export default function MyLife({ active = true, scrollRootRef, onActiveChange }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldShow = active && isVisible;

  useEffect(() => {
    onActiveChange?.(shouldShow);
  }, [onActiveChange, shouldShow]);

  useEffect(() => {
    if (!active) {
      onActiveChange?.(false);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.18);
      },
      {
        root: scrollRootRef?.current ?? null,
        threshold: [0, 0.18, 0.4],
      }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      onActiveChange?.(false);
    };
  }, [active, scrollRootRef, onActiveChange]);

  return (
    <section
      ref={sectionRef}
      className={`about-section mylife-section${shouldShow ? ' is-visible' : ''}`}
      aria-label="My Life"
    >
      <div className="mylife-copy">
        <span className="mylife-kicker">My Life</span>
        <h2>The Things That Shape Me</h2>
        <p>
          좋아하는 것들 속에서 영감을 얻고, 저만의 방식으로 일상을 채워갑니다.
        </p>
      </div>

      <div className="mylife-gallery-wrap" aria-label="나의 취향 갤러리">
        <CircularGallery
          items={galleryItems}
          bend={2.7}
          textColor="#ffffff"
          borderRadius={0.06}
          font='500 24px "Gmarket Sans TTF"'
          scrollSpeed={1.6}
          scrollEase={0.045}
        />
        <p className="mylife-gallery-hint" aria-hidden="true">
          <span className="mylife-swipe-icon" />
          Swipe to explore
        </p>
      </div>

      <div className="mylife-notes" aria-label="나의 성격 키워드">
        {notes.map((note) => (
          <article key={note.title} className="mylife-note">
            <span>{note.title}</span>
            <p>{note.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

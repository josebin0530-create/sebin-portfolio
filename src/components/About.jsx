import './About.css';

const aboutCards = [
  {
    title: 'Profile',
    subtitle: 'A quiet observer with a garden-like process.',
    position: 'about-card--left',
  },
  {
    title: 'Moment',
    subtitle: 'Collecting light, texture, and small details.',
    position: 'about-card--upper',
  },
  {
    title: 'Taste',
    subtitle: 'Soft visuals, clear structure, careful interaction.',
    position: 'about-card--center',
  },
  {
    title: 'Archive',
    subtitle: 'Photos, sketches, notes, and memories.',
    position: 'about-card--right',
  },
];

export default function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-scroll-content">
        <div className="about-intro">
          <p className="about-eyebrow">About Sebin</p>
          <h2 className="about-title" id="about-title">A garden of personal details</h2>
          <p className="about-copy">
            Photos will sit here like small memories across the field.
          </p>
        </div>

        <div className="about-card-field" aria-label="About photo layout">
          {aboutCards.map((card, index) => (
            <article className={`about-photo-card ${card.position}`} key={card.title}>
              <div className="about-photo-placeholder">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="about-card-caption">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="about-large-type" aria-hidden="true">ABOUT</p>
      </div>
    </section>
  );
}

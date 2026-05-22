import './FixedBackground.css';

export default function FixedBackground() {
  return (
    <div className="fixed-background" aria-hidden="true">
      <div className="fixed-background__image" />
      <div className="fixed-background__overlay" />
    </div>
  );
}

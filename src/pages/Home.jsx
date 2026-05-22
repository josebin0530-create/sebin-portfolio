import FixedBackground from '../components/FixedBackground';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <FixedBackground />
      <main className="content">
        <Hero />
        <About />
        <Projects />
      </main>
    </div>
  );
}

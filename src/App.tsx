import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { DesignStudio } from './components/DesignStudio';
import { Process } from './components/Process';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen w-full bg-paper font-sans text-ink">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <DesignStudio />
        <Process />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>);

}
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Vision from "./components/Vision";
import Services from "./components/Services";
import Expertise from "./components/Expertise";
import Achievements from "./components/Achievements";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Vision />
        <Services />
        <Expertise />
        <Achievements />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

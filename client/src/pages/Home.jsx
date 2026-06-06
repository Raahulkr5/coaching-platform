import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LandingSections from "../components/LandingSections";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <Hero />
      <LandingSections />
      <Footer />
    </div>
  );
}

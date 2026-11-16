import { useCallback, useState } from "react";
import { homeCopy } from "../../cms/siteContent.js";
import Hero from "./components/Hero/Hero";
import IntroReveal from "./components/HomeIntro/HomeIntro";
import About from "./components/About/About";
import AcademicPrograms from "./components/AcademicPrograms/AcademicPrograms";
import LifeAtSchool from "./components/LifeAtSchool/LifeAtSchool";
import TheWay from "./components/TheWay/TheWay";
import QuickFacts from "./components/QuickFacts/QuickFacts";
import LearningPillars from "./components/LearningPillars/LearningPillars";
import FAQ from "./components/FAQ/FAQ";
import "./HomePage.css";

export default function HomePage() {
  const hasIntroLogo = Boolean(homeCopy.hero.introLogoImage);
  const [showIntro, setShowIntro] = useState(() => hasIntroLogo && !window.__VIDYA_HOME_INTRO_DONE__);
  const finishIntro = useCallback(() => {
    window.__VIDYA_HOME_INTRO_DONE__ = true;
    setShowIntro(false);
  }, []);

  return (
    <div className="home-page">
      {showIntro && <IntroReveal onComplete={finishIntro} />}
      <Hero introActive={showIntro} />
      <About />
      <AcademicPrograms />
      <LifeAtSchool />
      <TheWay />
      <LearningPillars />
      <QuickFacts />
      <FAQ />
    </div>
  );
}

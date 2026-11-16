import AboutHero from "./components/AboutHero/AboutHero";
import AboutStatement from "./components/AboutStatement/AboutStatement";
import AboutContent from "./components/AboutContent/AboutContent";
import AboutChairmanVoice from "./components/AboutChairmanVoice/AboutChairmanVoice";
import AboutLeadership from "./components/AboutLeadership/AboutLeadership";
import AboutWay from "./components/AboutWay/AboutWay";
import AboutYear from "./components/AboutYear/AboutYear";

import "./AboutPage.css";


const AboutPage = () => {
  return (
    <main className="about-page">
      <AboutHero />
      <AboutStatement />
      <AboutContent />
      <AboutChairmanVoice />
      <AboutLeadership />
      <AboutWay />
      <AboutYear />
    </main>
  );
};


export default AboutPage;

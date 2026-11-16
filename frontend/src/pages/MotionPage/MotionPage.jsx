import MotionHero from "./components/MotionHero/MotionHero";
import MotionSections from "./components/MotionSections/MotionSections";

import "./MotionPage.css";


const MotionPage = () => {
  return (
    <main className="motion-page">

      <MotionHero />

      <MotionSections />

    </main>
  );
};


export default MotionPage;

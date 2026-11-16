import CampusHero from "./components/CampusHero/CampusHero";
import CampusInfrastructure from "./components/CampusInfrastructure/CampusInfrastructure";
import UpcomingCampus from "./components/UpcomingCampus/UpcomingCampus";
import CampusNumbers from "./components/CampusNumbers/CampusNumbers";

import "./CampusPage.css";


const CampusPage = () => {
  return (
    <div className="campus-page">

      <CampusHero />

      <CampusInfrastructure />
      <UpcomingCampus />
      <CampusNumbers />

    </div>
  );
};


export default CampusPage;

import { achievements, motionAchievementsPage } from "../../cms/siteContent.js";
import MotionArchivePage from "./components/MotionArchivePage/MotionArchivePage";

export default function AchievementsPage() {
  return <MotionArchivePage page={motionAchievementsPage} items={achievements} detailBase="/motion/achievements" />;
}

import { motionEvents as events, motionEventsPage } from "../../cms/siteContent.js";
import MotionArchivePage from "./components/MotionArchivePage/MotionArchivePage";

export default function EventsPage() {
  return <MotionArchivePage page={motionEventsPage} items={events} detailBase="/motion/events" />;
}

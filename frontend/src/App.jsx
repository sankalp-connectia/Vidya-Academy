import { lazy, Suspense, useLayoutEffect } from "react";
import {
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"));
const CampusPage = lazy(() => import("./pages/CampusPage/CampusPage"));
const MotionPage = lazy(() => import("./pages/MotionPage/MotionPage"));
const LearningPathwaysPage = lazy(() => import("./pages/VidyaLearningPathwaysPage"));
const AdmissionsPage = lazy(() => import("./pages/AdmissionsPage/AdmissionsPage"));
const MandatoryDisclosurePage = lazy(() => import("./pages/MandatoryDisclosurePage/MandatoryDisclosurePage"));
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage/BlogDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const SEOLandingPage = lazy(() => import("./pages/SEOLandingPage/SEOLandingPage"));
const SEOLandingIndexPage = lazy(() => import("./pages/SEOLandingPage/SEOLandingPage").then((module) => ({ default: module.SEOLandingIndexPage })));

const EventsPage = lazy(() => import("./pages/MotionPage/EventsPage"));
const AchievementsPage = lazy(() => import("./pages/MotionPage/AchievementsPage"));
const MotionStoryPage = lazy(() => import("./pages/MotionPage/components/MotionStoryPage/MotionStoryPage"));
import { motionEvents as events } from "./cms/siteContent.js";
import { achievements } from "./cms/siteContent.js";

import "./App.css";

function ScrollReset() {
  const { key, pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash.length <= 1) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }

    let frame;
    const observer = new MutationObserver(scrollToTarget);

    function scrollToTarget() {
      const target = document.getElementById(id);
      if (!target) return;
      observer.disconnect();
      frame = requestAnimationFrame(() => {
        if (!target.isConnected) return;
        if (target.id === "faq") target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: "instant", block: "start" });
      });
    }

    observer.observe(document.getElementById("root"), { childList: true, subtree: true });
    scrollToTarget();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [key, pathname, search, hash]);

  return null;
}


function App() {
  return (
    <>
    <ScrollReset />
    <Suspense fallback={null}>
    <Routes>

      <Route element={<MainLayout />}>

        <Route
          path="/"
          element={<HomePage />}
        />
        <Route path="/faq" element={<Navigate to="/#faq" replace />} />
        <Route path="/faqs" element={<Navigate to="/#faq" replace />} />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/admissions"
          element={<AdmissionsPage />}
        />

        <Route path="/mandatory-disclosure" element={<MandatoryDisclosurePage />} />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/schools" element={<SEOLandingIndexPage />} />
        <Route path="/schools/:slug" element={<SEOLandingPage />} />

        <Route
          path="/campus"
          element={<CampusPage />}
        />

        <Route
          path="/motion"
          element={<MotionPage />}
        />
        <Route
  path="/learning-pathways"
  element={<LearningPathwaysPage />}
/>



        <Route path="/motion/events" element={<EventsPage />} />
        <Route path="/motion/events/:slug" element={<MotionStoryPage items={events} type="events" />} />
        <Route path="/motion/achievements" element={<AchievementsPage />} />
        <Route path="/motion/achievements/:slug" element={<MotionStoryPage items={achievements} type="achievements" />} />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>

    </Routes>
    </Suspense>
    </>
  );
}


export default App;

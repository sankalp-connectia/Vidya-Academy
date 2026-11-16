import { useLayoutEffect } from "react";
import { gsap } from "gsap";

/** Animate one exact group width so the duplicated track loops without gaps. */
export function useMeasuredMarquee(trackRef, groupClassName) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    const group = track?.querySelector(`.${groupClassName}`);

    if (!track || !group) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tween;
    let frame = 0;
    let active = true;
    let measuredDistance = 0;

    const measureAndSync = () => {
      if (!active) return;
      const distance = group.getBoundingClientRect().width;
      if (!Number.isFinite(distance) || distance <= 0) return;

      // A burst of font/image/resize events used to restart the animation at
      // zero several times in a row, which looked like a brief freeze on wide
      // monitors. Coalesce them into one measurement and keep the track full.
      const viewportWidth = Math.ceil(
        track.parentElement?.getBoundingClientRect().width || window.innerWidth,
      );
      const existingCopies = track.querySelectorAll(`.${groupClassName}`).length;
      // Keep at least two whole groups beyond the visible viewport so the
      // loop stays covered even while its first group is moving out of view.
      const requiredCopies = Math.max(4, Math.ceil(viewportWidth / distance) + 3);
      for (let index = existingCopies; index < requiredCopies; index += 1) {
        const copy = group.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.dataset.marqueeCopy = "true";
        copy.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
        track.append(copy);
      }

      if (reduceMotion.matches) {
        tween?.kill();
        tween = undefined;
        measuredDistance = distance;
        gsap.set(track, { x: 0 });
        return;
      }

      if (tween && Math.abs(distance - measuredDistance) < 0.5) return;

      const progress = tween?.progress() ?? 0;
      tween?.kill();
      tween = undefined;
      measuredDistance = distance;
      gsap.set(track, { x: 0 });

      const duration = Math.max(20, Math.min(34, distance / 70));
      tween = gsap.to(track, {
        x: -distance,
        duration,
        ease: "none",
        repeat: -1,
        paused: true,
      });
      if (progress > 0) tween.progress(progress);
      tween.play();
    };

    const syncMarquee = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        measureAndSync();
      });
    };

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(syncMarquee);

    resizeObserver?.observe(group);
    if (track.parentElement) resizeObserver?.observe(track.parentElement);
    window.addEventListener("resize", syncMarquee, { passive: true });
    reduceMotion.addEventListener?.("change", syncMarquee);

    const images = [...group.querySelectorAll("img")];
    images.forEach((image) => image.addEventListener("load", syncMarquee));
    document.fonts?.ready?.then(syncMarquee);
    syncMarquee();

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      tween?.kill();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncMarquee);
      reduceMotion.removeEventListener?.("change", syncMarquee);
      images.forEach((image) => image.removeEventListener("load", syncMarquee));
      gsap.set(track, { clearProps: "transform" });
      measuredDistance = 0;
    };
  }, [trackRef, groupClassName]);
}

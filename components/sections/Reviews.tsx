"use client";
 
import { useEffect, useRef, useState } from "react";
 
const REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Daily Commuter",
    avatar: "SM",
    rating: 5,
    comment: "Prometrix completely changed how I handle parking. I find a spot in seconds instead of circling for 20 minutes. The live tracking is incredibly accurate.",
  },
  {
    id: 2,
    name: "James K.",
    role: "Business Owner",
    avatar: "JK",
    rating: 5,
    comment: "As someone who parks downtown every day, this is a game-changer. Online payments are seamless and I never have to worry about cash or meters again.",
  },
  {
    id: 3,
    name: "Alicia R.",
    role: "Frequent Traveler",
    avatar: "AR",
    rating: 4,
    comment: "The vehicle type support is what sold me. I drive a van and most apps don't account for that. Prometrix shows me exactly which spots fit — no guessing.",
  },
  {
    id: 4,
    name: "Tom B.",
    role: "City Resident",
    avatar: "TB",
    rating: 5,
    comment: "Super intuitive interface. I booked my first spot within a minute of signing up. The three-step process — check, park, pay — is exactly as simple as advertised.",
  },
  {
    id: 5,
    name: "Nina P.",
    role: "Parking Lot Admin",
    avatar: "NP",
    rating: 5,
    comment: "From the admin side, Prometrix is a dream. Managing users, adjusting pricing, and monitoring activity is all in one clean dashboard. Huge time-saver.",
  },
];
 
const CARD_WIDTH = 360;
const CARD_GAP = 20;
const STEP = CARD_WIDTH + CARD_GAP;
const DURATION = 500;
const N = REVIEWS.length;
const ITEMS = [...REVIEWS, ...REVIEWS, ...REVIEWS];
 
export default function ReviewsSection() {
  const [activeDot, setActiveDot] = useState(0);
  const trackRef = useRef(null);
  const indexRef = useRef(N);
  const slidingRef = useRef(false);
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);
 
  const moveTo = (idx: number, animate: boolean) => {
    const el = trackRef.current as HTMLDivElement;
    if (!el) return;
    el.style.transition = animate ? `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)` : "none";
    el.style.transform = `translateX(calc(-${idx * STEP}px + 50% - ${CARD_WIDTH / 2}px))`;
  };
 
  const slide = (dir: number) => {
    if (slidingRef.current) return;
    slidingRef.current = true;
    const next = indexRef.current + dir;
    indexRef.current = next;
    setActiveDot(((next % N) + N) % N);
    moveTo(next, true);
    setTimeout(() => {
      let corrected = indexRef.current;
      if (corrected >= N * 2) corrected -= N;
      else if (corrected < N) corrected += N;
      if (corrected !== indexRef.current) {
        indexRef.current = corrected;
        moveTo(corrected, false);
      }
      slidingRef.current = false;
    }, DURATION);
  };
 
  const goToDot = (i: number) => {
    if (slidingRef.current) return;
    const current = ((indexRef.current % N) + N) % N;
    if (i === current) return;
    slidingRef.current = true;
    const target = indexRef.current - current + i;
    indexRef.current = target;
    setActiveDot(i);
    moveTo(target, true);
    setTimeout(() => {
      let corrected = indexRef.current;
      if (corrected >= N * 2) corrected -= N;
      else if (corrected < N) corrected += N;
      if (corrected !== indexRef.current) {
        indexRef.current = corrected;
        moveTo(corrected, false);
      }
      slidingRef.current = false;
    }, DURATION);
  };
 
  useEffect(() => {
    moveTo(N, false);
    intervalRef.current = window.setInterval(() => {
      if (!pausedRef.current) slide(1);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);
 
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="text-center mb-11 px-6">
        <p className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1 mb-4">
          Reviews
        </p>
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            What Our Users Say
          </span>
        </h2>
        <p className="text-sm text-slate-400">
          Real experiences from real drivers using Prometrix every day.
        </p>
      </div>
 
      <div
        className="relative overflow-hidden w-full py-5 mb-8"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div
          className="absolute top-0 bottom-0 left-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0f172a, transparent)" }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0f172a, transparent)" }}
        />
 
        <div ref={trackRef} className="flex" style={{ gap: `${CARD_GAP}px`, willChange: "transform" }}>
          {ITEMS.map((review, i) => (
    <div key={i}
    className="flex-shrink-0 flex flex-col rounded-2xl p-6 text-left backdrop-blur-sm"
    style={{ width: "360px", background: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(51, 65, 85, 0.5)" }}
  >
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, si) => (
        <svg key={si} width="16" height="16" viewBox="0 0 24 24"
          fill={si < review.rating ? "#f59e0b" : "none"}
          stroke={si < review.rating ? "#f59e0b" : "rgba(100,116,139,0.35)"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <p className="text-sm leading-7 text-slate-300/85 italic mb-5 flex-1">"{review.comment}"</p>
    <div className="h-px bg-slate-700/40 mb-4" />
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
        {review.avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200 mb-0.5">{review.name}</p>
        <p className="text-xs text-slate-500">{review.role}</p>
      </div>
    </div>
  </div>
))}
        </div>
      </div>
 
      <div className="flex items-center justify-center gap-4 px-6">
        <button
          aria-label="Previous"
          onClick={() => slide(-1)}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-500/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
 
        <div className="flex items-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToDot(i)}
              aria-label={`Go to review ${i + 1}`}
              className="h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300"
              style={{
                width: i === activeDot ? "24px" : "7px",
                background: i === activeDot
                  ? "linear-gradient(90deg, #818cf8, #a78bfa)"
                  : "rgba(148,163,184,0.25)",
              }}
            />
          ))}
        </div>
 
        <button
          aria-label="Next"
          onClick={() => slide(1)}
          className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-500/50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
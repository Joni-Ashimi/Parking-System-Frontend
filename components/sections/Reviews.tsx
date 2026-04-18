"use client";

import { useEffect, useRef, useState } from "react";

const REVIEWS = [
  { id: 1, name: "Sarah M.",   role: "Daily Commuter",    avatar: "SM", rating: 5, comment: "Prometrix completely changed how I handle parking. I find a spot in seconds instead of circling for 20 minutes. The live tracking is incredibly accurate." },
  { id: 2, name: "James K.",   role: "Business Owner",    avatar: "JK", rating: 5, comment: "As someone who parks downtown every day, this is a game-changer. Online payments are seamless and I never have to worry about cash or meters again." },
  { id: 3, name: "Alicia R.",  role: "Frequent Traveler", avatar: "AR", rating: 4, comment: "The vehicle type support is what sold me. I drive a van and most apps don't account for that. Prometrix shows me exactly which spots fit — no guessing." },
  { id: 4, name: "Tom B.",     role: "City Resident",     avatar: "TB", rating: 5, comment: "Super intuitive interface. I booked my first spot within a minute of signing up. The three-step process — check, park, pay — is exactly as simple as advertised." },
  { id: 5, name: "Nina P.",    role: "Parking Lot Admin", avatar: "NP", rating: 5, comment: "From the admin side, Prometrix is a dream. Managing users, adjusting pricing, and monitoring activity is all in one clean dashboard. Huge time-saver." },
];

const CARD_WIDTH = 340;
const CARD_GAP = 20;
const STEP = CARD_WIDTH + CARD_GAP;
const DURATION = 500;
const N = REVIEWS.length;
const ITEMS = [...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function ReviewsSection() {
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef   = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const indexRef   = useRef(N);
  const slidingRef = useRef(false);
  const pausedRef  = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const drag = useRef({ active: false, startX: 0, startOffset: 0 });

  const getOffset = (idx: number) => {
    const w = wrapperRef.current;
    if (!w) return 0;
    return -(idx * STEP) + w.offsetWidth / 2 - CARD_WIDTH / 2;
  };

  const moveTo = (idx: number, animate: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)` : "none";
    el.style.transform  = `translateX(${getOffset(idx)}px)`;
  };

  const correctLoop = () => {
    let c = indexRef.current;
    if (c >= N * 2) c -= N;
    else if (c < N) c += N;
    if (c !== indexRef.current) { indexRef.current = c; moveTo(c, false); }
  };

  const slide = (dir: number) => {
    if (slidingRef.current) return;
    slidingRef.current = true;
    const next = indexRef.current + dir;
    indexRef.current = next;
    setActiveDot(((next % N) + N) % N);
    moveTo(next, true);
    setTimeout(() => { correctLoop(); slidingRef.current = false; }, DURATION);
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
    setTimeout(() => { correctLoop(); slidingRef.current = false; }, DURATION);
  };

  const startDrag = (clientX: number) => {
    if (slidingRef.current) return;
    pausedRef.current = true;
    drag.current = { active: true, startX: clientX, startOffset: getOffset(indexRef.current) };
    const el = trackRef.current;
    if (el) el.style.transition = "none";
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (el) el.style.transform = `translateX(${drag.current.startOffset + (clientX - drag.current.startX)}px)`;
  };

  const endDrag = (clientX: number) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    pausedRef.current   = false;
    setIsDragging(false);

    const delta = clientX - drag.current.startX;
    if (Math.abs(delta) < 10) {
      moveTo(indexRef.current, true);
      return;
    }

    const stepsFloat = -delta / STEP;
    const steps      = Math.round(stepsFloat) || (delta < 0 ? 1 : -1);
    const next       = indexRef.current + steps;

    const clamped = Math.max(N - N, Math.min(N * 3 - 1, next));
    slidingRef.current = true;
    indexRef.current   = clamped;
    setActiveDot(((clamped % N) + N) % N);
    moveTo(clamped, true);
    setTimeout(() => { correctLoop(); slidingRef.current = false; }, DURATION);
  };

  const onMouseDown  = (e: React.MouseEvent) => startDrag(e.clientX);
  const onMouseMove  = (e: React.MouseEvent) => moveDrag(e.clientX);
  const onMouseUp    = (e: React.MouseEvent) => endDrag(e.clientX);
  const onMouseLeave = (e: React.MouseEvent) => { endDrag(e.clientX); pausedRef.current = false; };

  const onTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => moveDrag(e.touches[0].clientX);
  const onTouchEnd   = (e: React.TouchEvent) => endDrag(e.changedTouches[0].clientX);

  useEffect(() => {
    const onResize = () => moveTo(indexRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => moveTo(N, false));
    intervalRef.current = setInterval(() => { if (!pausedRef.current) slide(1); }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const NavBtn = ({ dir }: { dir: "left" | "right" }) => (
      <button
          aria-label={dir === "left" ? "Previous" : "Next"}
          onClick={() => slide(dir === "left" ? -1 : 1)}
          className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-slate-300 flex items-center justify-center transition-all duration-200 hover:bg-indigo-500/30 hover:border-indigo-500/50 hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
        </svg>
      </button>
  );

  return (
      <section className="py-24 relative">
        <div className="text-center mb-12 px-6">
          <p className="inline-block text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1 mb-4">
            Reviews
          </p>
          <h2 className="text-3xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                        What Our Users Say
                    </span>
          </h2>
          <p className="text-sm text-slate-400">Real experiences from real drivers using Prometrix every day.</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20">
            <NavBtn dir="left" />
          </div>
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20">
            <NavBtn dir="right" />
          </div>

          <div
              ref={wrapperRef}
              className="relative w-full py-6 mb-6 select-none"
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={onMouseLeave}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 pointer-events-none"
                 style={{ background: "linear-gradient(to right, #0f172a 30%, transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 pointer-events-none"
                 style={{ background: "linear-gradient(to left, #0f172a 30%, transparent)" }} />

            <div ref={trackRef} className="flex" style={{ gap: `${CARD_GAP}px`, willChange: "transform" }}>
              {ITEMS.map((review, i) => (
                  <div
                      key={i}
                      className="flex-shrink-0 flex flex-col rounded-2xl p-6 text-left"
                      style={{
                        width: `${CARD_WIDTH}px`,
                        background: "rgba(30, 41, 59, 0.7)",
                        border: "1px solid rgba(51, 65, 85, 0.6)",
                        backdropFilter: "blur(12px)",
                        userSelect: "none",
                      }}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                          <svg key={si} width="15" height="15" viewBox="0 0 24 24"
                               fill={si < review.rating ? "#f59e0b" : "none"}
                               stroke={si < review.rating ? "#f59e0b" : "rgba(100,116,139,0.4)"}
                               strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-slate-300/80 italic mb-5 flex-1">"{review.comment}"</p>
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

          <div className="flex items-center justify-center gap-2">
            {REVIEWS.map((_, i) => (
                <button
                    key={i}
                    onClick={() => goToDot(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className="h-2 rounded-full border-none p-0 transition-all duration-300"
                    style={{
                      width: i === activeDot ? "24px" : "7px",
                      background: i === activeDot
                          ? "linear-gradient(90deg, #818cf8, #a78bfa)"
                          : "rgba(148,163,184,0.25)",
                    }}
                />
            ))}
          </div>
        </div>
      </section>
  );
}
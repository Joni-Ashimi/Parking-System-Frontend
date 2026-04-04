"use client";
 
import { useEffect, useRef, useState } from "react";
 
interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}
 
const BASE: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Daily Commuter",
    avatar: "SM",
    rating: 5,
    comment:
      "Prometrix completely changed how I handle parking. I find a spot in seconds instead of circling for 20 minutes. The live tracking is incredibly accurate.",
  },
  {
    id: 2,
    name: "James K.",
    role: "Business Owner",
    avatar: "JK",
    rating: 5,
    comment:
      "As someone who parks downtown every day, this is a game-changer. Online payments are seamless and I never have to worry about cash or meters again.",
  },
  {
    id: 3,
    name: "Alicia R.",
    role: "Frequent Traveler",
    avatar: "AR",
    rating: 4,
    comment:
      "The vehicle type support is what sold me. I drive a van and most apps don't account for that. Prometrix shows me exactly which spots fit — no guessing.",
  },
  {
    id: 4,
    name: "Tom B.",
    role: "City Resident",
    avatar: "TB",
    rating: 5,
    comment:
      "Super intuitive interface. I booked my first spot within a minute of signing up. The three-step process — check, park, pay — is exactly as simple as advertised.",
  },
  {
    id: 5,
    name: "Nina P.",
    role: "Parking Lot Admin",
    avatar: "NP",
    rating: 5,
    comment:
      "From the admin side, Prometrix is a dream. Managing users, adjusting pricing, and monitoring activity is all in one clean dashboard. Huge time-saver.",
  },
];
 
const CARD_WIDTH = 360;
const CARD_GAP = 20;
const STEP = CARD_WIDTH + CARD_GAP;
const DURATION = 500; // ms per slide
const N = BASE.length;
 
// Triple the list: [copy0 | copy1 | copy2]
// We always operate inside copy1 (indices N..2N-1).
// When we drift into copy0 or copy2, we silently snap back to copy1.
const ITEMS = [...BASE, ...BASE, ...BASE];
 
export default function Reviews() {
  // index into ITEMS — start in the middle copy
  const indexRef = useRef(N);
  const [index, setIndex] = useState(N);
  const [activeDot, setActiveDot] = useState(0);
 
  const trackRef = useRef<HTMLDivElement>(null);
  const slidingRef = useRef(false);
  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  // Move the track to a given index, with or without transition
  const moveTo = (idx: number, animate: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)` : "none";
    el.style.transform = `translateX(calc(-${idx * STEP}px + 50% - ${CARD_WIDTH / 2}px))`;
  };
 
  const slide = (dir: 1 | -1) => {
    if (slidingRef.current) return;
    slidingRef.current = true;
 
    const next = indexRef.current + dir;
    indexRef.current = next;
    setIndex(next);
    setActiveDot(((next % N) + N) % N);
    moveTo(next, true);
 
    setTimeout(() => {
      // If we've drifted out of the middle copy, silently jump back
      let corrected = indexRef.current;
      if (corrected >= N * 2) corrected -= N;
      else if (corrected < N) corrected += N;
 
      if (corrected !== indexRef.current) {
        indexRef.current = corrected;
        setIndex(corrected);
        moveTo(corrected, false);
      }
 
      slidingRef.current = false;
    }, DURATION);
  };
 
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) slide(1);
    }, 4000);
  };
 
  useEffect(() => {
    // Set initial position without animation
    moveTo(N, false);
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const goToDot = (i: number) => {
    if (slidingRef.current) return;
    const current = ((indexRef.current % N) + N) % N;
    const diff = i - current;
    const base = indexRef.current - current;
    const target = base + i;
    const delta = diff === 0 ? 0 : diff;
    if (delta === 0) return;
 
    slidingRef.current = true;
    indexRef.current = target;
    setIndex(target);
    setActiveDot(i);
    moveTo(target, true);
 
    setTimeout(() => {
      let corrected = indexRef.current;
      if (corrected >= N * 2) corrected -= N;
      else if (corrected < N) corrected += N;
      if (corrected !== indexRef.current) {
        indexRef.current = corrected;
        setIndex(corrected);
        moveTo(corrected, false);
      }
      slidingRef.current = false;
    }, DURATION);
  };
 
  return (
    <section style={styles.section}>
      <div style={styles.bgGlow} />
 
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Reviews</p>
          <h2 style={styles.title}>What Our Users Say</h2>
          <p style={styles.subtitle}>
            Real experiences from real drivers using Prometrix every day.
          </p>
        </div>
 
        {/* Viewport */}
        <div
          style={styles.viewport}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div style={{ ...styles.edge, left: 0, background: "linear-gradient(to right, #0f172a 0%, transparent 100%)" }} />
          <div style={{ ...styles.edge, right: 0, background: "linear-gradient(to left, #0f172a 0%, transparent 100%)" }} />
 
          <div ref={trackRef} style={styles.track}>
            {ITEMS.map((t, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.stars}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 24 24"
                      fill={si < t.rating ? "#f59e0b" : "none"}
                      stroke={si < t.rating ? "#f59e0b" : "rgba(100,116,139,0.35)"}
                      strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p style={styles.comment}>"{t.comment}"</p>
                <div style={styles.divider} />
                <div style={styles.author}>
                  <div style={styles.avatar}>{t.avatar}</div>
                  <div>
                    <p style={styles.authorName}>{t.name}</p>
                    <p style={styles.authorRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Nav */}
        <div style={styles.nav}>
          <button style={styles.navBtn} aria-label="Previous"
            onClick={() => slide(-1)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
 
          <div style={styles.dots}>
            {BASE.map((_, i) => (
              <button key={i} onClick={() => goToDot(i)}
                style={{
                  ...styles.dot,
                  width: i === activeDot ? "24px" : "7px",
                  background: i === activeDot
                    ? "linear-gradient(90deg, #818cf8, #a78bfa)"
                    : "rgba(148,163,184,0.25)",
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
 
          <button style={styles.navBtn} aria-label="Next"
            onClick={() => slide(1)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
 
const styles: Record<string, React.CSSProperties> = {
  section: {
    position: "relative",
    padding: "60px 0",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: "700px", height: "400px",
    background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1600px",
    margin: "0 auto",
    textAlign: "center",
  },
  header: {
    marginBottom: "44px",
    padding: "0 24px",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#818cf8",
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "999px",
    padding: "4px 14px",
    marginBottom: "14px",
  },
  title: {
    fontSize: "clamp(22px, 3.5vw, 34px)",
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 10px",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(148,163,184,0.7)",
    margin: 0,
  },
  viewport: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    marginBottom: "32px",
    padding: "20px 0",
  },
  edge: {
    position: "absolute",
    top: 0, bottom: 0,
    width: "120px",
    zIndex: 2,
    pointerEvents: "none",
  },
  track: {
    display: "flex",
    gap: `${CARD_GAP}px`,
    willChange: "transform",
  },
  card: {
    flexShrink: 0,
    width: `${CARD_WIDTH}px`,
    background: "rgba(241,245,249,0.04)",
    border: "1px solid rgba(226,232,240,0.1)",
    borderRadius: "16px",
    padding: "26px 24px",
    textAlign: "left" as const,
    display: "flex",
    flexDirection: "column" as const,
    backdropFilter: "blur(8px)",
  },
  stars: {
    display: "flex",
    gap: "3px",
    marginBottom: "14px",
  },
  comment: {
    fontSize: "14px",
    lineHeight: 1.75,
    color: "rgba(203,213,225,0.85)",
    margin: "0 0 18px",
    fontStyle: "italic",
    flex: 1,
  },
  divider: {
    height: "1px",
    background: "rgba(226,232,240,0.08)",
    marginBottom: "16px",
  },
  author: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
    letterSpacing: "0.05em",
  },
  authorName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e2e8f0",
    margin: "0 0 2px",
  },
  authorRole: {
    fontSize: "12px",
    color: "rgba(148,163,184,0.6)",
    margin: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "0 24px",
  },
  navBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(203,213,225,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  dots: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dot: {
    height: "7px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s ease",
  },
};
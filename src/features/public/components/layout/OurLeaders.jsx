import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function OurLeaders() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const { get } = useSiteContent();

  const content = get("vision-mission", {
    eyebrow: "OUR LEADERS",
    heading: "Creating Growth On The Foundation Of Trust And Innovation",
    ctaLabel: "Meet The Visionaries",
    vision: { title: "Vision", body: "" },
    mission: { title: "Mission", body: "" },
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reveal = (delay) => ({ transitionDelay: `${delay}ms` });

  const cards = [
    { ...content.vision, delay: 480 },
    { ...content.mission, delay: 640 },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#73513a_0%,rgba(115,81,58,0.49)_100%)]"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Mulish:wght@400;600;700;800&display=swap');
        @keyframes slowZoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }
        @keyframes floatArrow {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(4px); }
        }
      `}</style>

      {/* Background overlays */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(74,52,38,0.82) 0%, rgba(92,66,46,0.80) 45%, rgba(120,90,64,0.78) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(140,108,78,0.25) 0%, rgba(58,40,28,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 md:px-10">
        <p
          className={`text-center text-xs font-extrabold tracking-[0.22em] text-amber-50/90 transition-all duration-700 ease-out sm:text-sm sm:tracking-[0.28em] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ fontFamily: "'Mulish', sans-serif" }}
        >
          {content.eyebrow}
        </p>

        <h2
          className={`mx-auto mt-4 max-w-3xl text-center text-2xl leading-snug text-amber-50 transition-all duration-900 ease-out sm:mt-5 sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={reveal(120)}
        >
          {content.heading}
        </h2>

        <div
          className={`mt-6 flex items-center justify-center transition-all duration-700 ease-out sm:mt-8 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={reveal(320)}
        >
          <button
            className="group flex items-center gap-3 text-amber-50 transition-opacity hover:opacity-90 sm:gap-4"
            style={{ fontFamily: "'Mulish', sans-serif" }}
          >
            <span className="text-sm font-extrabold tracking-wide sm:text-base">
              {content.ctaLabel}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-[#5c422e] transition-transform duration-300 group-hover:scale-110 group-hover:bg-white sm:h-9 sm:w-9">
              <ArrowRight
                size={16}
                style={{ animation: "floatArrow 1.8s ease-in-out infinite" }}
              />
            </span>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:mt-12 md:grid-cols-2">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`group/card cursor-default border border-amber-50/25 px-6 py-10 text-center transition-all duration-900 ease-out hover:z-10 hover:-translate-y-1.5 hover:border-amber-50/60 hover:bg-[#3a281c]/40 hover:shadow-2xl sm:px-10 sm:py-14 md:px-12 md:py-16 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={reveal(card.delay)}
            >
              <h3 className="text-2xl text-amber-50 transition-transform duration-300 group-hover/card:scale-105 sm:text-3xl md:text-4xl">
                {card.title}
              </h3>
              <span className="mx-auto mt-3 block h-px w-10 origin-center scale-x-0 bg-amber-50/70 transition-transform duration-300 group-hover/card:scale-x-100" />
              <p
                className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-amber-50/85 transition-colors duration-300 group-hover/card:text-amber-50 sm:mt-5"
                style={{ fontFamily: "'Mulish', sans-serif" }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

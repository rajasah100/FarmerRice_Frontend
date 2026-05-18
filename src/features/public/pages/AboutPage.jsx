import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";

// Reusable scroll-reveal hook
function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Reveal wrapper
function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(0);
  const [scrolled, setScrolled] = useState(0);
  const { get, loading } = useSiteContent();

  const content = get("about-page", {});
  const achievements = content.achievements || [];
  const timeline = content.timeline || [];
  const values = content.values || [];
  const storyParagraphs = content.storyParagraphs || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3ec]">
        <div className="text-[#7b5a42] font-serif text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#1a2a1f] font-serif overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans-pro { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grain::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.08;
          pointer-events: none;
          mix-blend-mode: multiply;
        }
      `}</style>

      {/* HERO */}
      <section className="relative h-screen min-h-150 max-w-355 mx-auto flex items-end overflow-hidden grain">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${content.heroImage}')`,
            transform: `scale(1.1) translateY(${scrolled * 0.3}px)`,
            transition: "transform 0.1s linear",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a2a1f] via-[#1a2a1f]/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-[#1a2a1f]/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-2 pb-24 md:pb-32 w-full">
          <Reveal delay={200}>
            <p className="font-sans-pro text-xs md:text-sm tracking-[0.4em] text-[#d4a574] uppercase mb-6">
              {content.heroEyebrow}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-[#f7f3ec] leading-[1.05] max-w-4xl">
              {content.heroHeadingLine1}{" "}
              <em className="text-[#d4a574]">{content.heroHeadingEmphasis}</em>
              <br />
              {content.heroHeadingLine2}
            </h1>
          </Reveal>
          <Reveal delay={700}>
            <div className="mt-12 flex items-center gap-4">
              <div className="w-px h-12 bg-[#d4a574] animate-pulse" />
              <p className="font-sans-pro text-xs tracking-[0.3em] text-[#f7f3ec]/70 uppercase">
                {content.scrollLabel}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal>
            <p className="font-sans-pro text-xs tracking-[0.4em] text-[#8b6914] uppercase mb-4">
              {content.storyEyebrow}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight max-w-4xl mb-16 text-[#2d4a2b]">
              {content.storyHeadingPart1}
              <em className="text-[#8b6914]"> {content.storyHeadingPart2}</em>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 font-sans-pro text-base leading-relaxed text-[#1a2a1f]/85">
            <Reveal delay={200}>
              {storyParagraphs.slice(0, 2).map((p, i) => (
                <p key={i} className={i > 0 ? "mt-6" : ""}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={350}>
              {storyParagraphs.slice(2).map((p, i) => (
                <p key={i} className={i > 0 ? "mt-6" : ""}>
                  {p}
                </p>
              ))}
              {content.meetVisionariesLabel && (
                <a
                  href="#"
                  className="inline-flex items-center gap-3 mt-8 font-sans-pro text-sm tracking-wider uppercase text-[#8b6914] border-b border-[#8b6914] pb-1 hover:gap-5 transition-all"
                >
                  {content.meetVisionariesLabel}
                  <span>→</span>
                </a>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="py-20 md:py-28 px-5 md:px-8 bg-[#2d4a2b] text-[#f7f3ec] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#d4a574] blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#5a7a3a] blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <Reveal>
              <h3 className="font-display text-3xl md:text-5xl font-light mb-16 max-w-2xl">
                {content.achievementsHeading}
              </h3>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((item, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div className="group relative overflow-hidden rounded-sm aspect-3/4 cursor-pointer">
                    <img
                      src={item.img}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1a2a1f] via-[#1a2a1f]/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="font-display text-5xl md:text-6xl font-light text-[#d4a574]">
                        {item.rank}
                      </span>
                      <p className="font-sans-pro text-sm leading-relaxed text-[#f7f3ec] translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS section removed per requirements */}

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="py-24 md:py-32 px-5 md:px-8 bg-linear-to-b from-[#f7f3ec] to-[#ede5d3] relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <h3 className="font-display text-4xl md:text-6xl font-light text-center mb-4 text-[#2d4a2b]">
                The History
              </h3>
            </Reveal>
            <Reveal delay={150}>
              <p className="font-sans-pro text-center text-[#8b6914] tracking-widest text-sm uppercase mb-16">
                A 130+ Year Old Trusted Brand
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-16">
              <Reveal>
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:max-h-150 lg:overflow-y-auto pb-4 lg:pb-0 -mx-5 px-5 lg:mx-0 lg:px-0">
                  {timeline.map((item, i) => (
                    <button
                      key={item.year + i}
                      onClick={() => setActiveYear(i)}
                      className={`shrink-0 px-4 py-2 text-left font-display text-lg md:text-xl transition-all whitespace-nowrap lg:whitespace-normal ${
                        activeYear === i
                          ? "text-[#8b6914] border-l-2 lg:border-l-4 border-[#8b6914] pl-3 lg:pl-5 font-medium"
                          : "text-[#1a2a1f]/40 hover:text-[#2d4a2b] border-l-2 lg:border-l-4 border-transparent pl-3 lg:pl-5"
                      }`}
                    >
                      {item.year}
                    </button>
                  ))}
                </div>
              </Reveal>

              <div className="relative">
                {timeline[activeYear] && (
                  <div key={activeYear} style={{ animation: "fadeIn 0.6s ease-out" }}>
                    <div className="aspect-16/10 mb-8 overflow-hidden rounded-sm bg-[#2d4a2b]/5 relative">
                      {timeline[activeYear].image ? (
                        <img
                          src={timeline[activeYear].image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2d4a2b]/10" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#1a2a1f]/60 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <span className="font-display text-6xl md:text-8xl font-light text-[#f7f3ec]">
                          {timeline[activeYear].year}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-display text-2xl md:text-4xl font-light text-[#2d4a2b] mb-4">
                      {timeline[activeYear].title}
                    </h4>
                    <p className="font-sans-pro text-base md:text-lg leading-relaxed text-[#1a2a1f]/80 max-w-2xl">
                      {timeline[activeYear].desc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CORE VALUES */}
      {values.length > 0 && (
        <section className="py-24 md:py-32 px-5 md:px-8 bg-[#ede5d3]">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="font-sans-pro text-xs tracking-[0.4em] text-[#8b6914] uppercase mb-4 text-center">
                Our Foundation
              </p>
            </Reveal>
            <Reveal delay={150}>
              <h3 className="font-display text-4xl md:text-6xl font-light text-center mb-20 text-[#2d4a2b]">
                {content.valuesHeading || "Core values."}
              </h3>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2d4a2b]/15">
              {values.map((v, i) => (
                <Reveal key={v.num + i} delay={i * 100}>
                  <div className="bg-[#ede5d3] hover:bg-[#f7f3ec] p-8 md:p-10 h-full transition-colors duration-500 group relative overflow-hidden">
                    <p className="font-sans-pro text-xs tracking-[0.3em] text-[#8b6914] mb-4 relative">
                      {v.num}
                    </p>
                    <h4 className="font-display text-2xl md:text-3xl font-medium text-[#2d4a2b] mb-4 relative">
                      {v.title}
                    </h4>
                    <p className="font-sans-pro text-sm md:text-base leading-relaxed text-[#1a2a1f]/75 relative">
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

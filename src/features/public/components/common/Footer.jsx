import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const SOCIAL_ICONS = {
  Facebook: FaFacebook,
  Twitter: FaXTwitter,
  "X / Twitter": FaXTwitter,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  YouTube: FaYoutube,
};

const DEFAULT_FOOTER = {
  brandName: "Farmers",
  brandAccent: "Rice",
  aboutHeading: "About Farmers-Rice",
  aboutText: "",
  tagline: "",
  discoverMoreLabel: "Discover More",
  quickLinksHeading: "Quick Links",
  contactHeading: "Contact Us",
  registeredOfficeLabel: "Registered Office :",
  registeredOffice: "",
  corporateOfficeLabel: "Corporate Office :",
  corporateOffice: "",
  callLabel: "Call :",
  phones: [],
  emailLabel: "Email :",
  email: "",
  followHeading: "Follow Us",
  socials: [],
  followerCount: "",
  annualReportLabel: "",
  copyrightText: "",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useMouseParallax() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleMove = (e) => {
      const rect = node.getBoundingClientRect();
      setPos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    node.addEventListener("mousemove", handleMove);
    return () => node.removeEventListener("mousemove", handleMove);
  }, []);
  return [ref, pos];
}

function useTypewriter(text, start, speed = 25) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start || !text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [start, text, speed]);
  return out;
}

function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const handleLeave = () => {
    const node = ref.current;
    if (node) node.style.transform = "translate(0,0)";
  };
  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </span>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 12 + Math.random() * 10;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white/30 blur-[1px]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-10px`,
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Footer() {
  const [ref, inView] = useInView(0.1);
  const [parallaxRef, mouse] = useMouseParallax();
  const { get } = useSiteContent();

  const footer = get("footer", DEFAULT_FOOTER);
  const navConfig = get("navbar", { items: [] });
  const quickLinks = navConfig.items && navConfig.items.length > 0 ? navConfig.items : [];

  const typed = useTypewriter(footer.tagline || "", inView, 28);

  return (
    <footer
      ref={(el) => {
        ref.current = el;
        parallaxRef.current = el;
      }}
      className="relative overflow-hidden font-sans text-white"
    >
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-110vh) translateX(40px); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.95); opacity: 0.8; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ffffff 0%, #ffe8c8 25%, #ffffff 50%, #ffe8c8 75%, #ffffff 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 6s linear infinite;
        }
        .cursor-blink::after {
          content: "|";
          margin-left: 2px;
          animation: blink 0.9s steps(1) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div className="absolute inset-0 bg-[#7a4e3a] z-0" />

      <div
        className="absolute inset-0 z-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at ${50 + (mouse.x - 0.5) * 8}% ${70 + (mouse.y - 0.5) * 5}%, rgba(80,140,170,0.4) 0%, rgba(80,140,170,0) 60%),
            radial-gradient(circle at 50% 72%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%),
            linear-gradient(to bottom, rgba(122,78,58,0) 55%, rgba(180,120,70,0.45) 78%, rgba(90,55,38,0.85) 100%)
          `,
          transition: "background-image 0.4s ease-out",
        }}
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(450px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(255,220,180,0.15), transparent 60%)`,
          opacity: inView ? 1 : 0,
        }}
      />

      <FloatingParticles />

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(122,78,58,0.55) 0%, rgba(122,78,58,0.65) 50%, rgba(80,50,35,0.85) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 pt-16 sm:pt-20 lg:pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ABOUT */}
          <Column inView={inView} delay={0} className="lg:col-span-3">
            <Heading>{footer.aboutHeading}</Heading>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.75] text-white/85">
              {footer.aboutText}
            </p>
            {footer.tagline && (
              <p className="mt-3 text-[13px] text-amber-100/80 italic cursor-blink min-h-[1.2em]">
                {typed}
              </p>
            )}

            <a
              href="#"
              className="group mt-7 inline-flex items-center gap-4 text-[15px] tracking-wide"
            >
              <span className="relative">
                {footer.discoverMoreLabel}
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#7a4e3a] shadow-md transition-all duration-500 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
                <span
                  className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-100"
                  style={{ animation: "pulseRing 1.5s ease-out infinite" }}
                />
              </span>
            </a>
          </Column>

          {/* QUICK LINKS */}
          <Column inView={inView} delay={120} className="lg:col-span-3">
            <Heading>{footer.quickLinksHeading}</Heading>
            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((link, i) => (
                <li
                  key={link.id}
                  className="transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: inView ? `${200 + i * 50}ms` : "0ms",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-20px)",
                  }}
                >
                  <Link
                    to={link.link}
                    className="group relative inline-flex items-center gap-2 text-[15px] text-white/90 hover:text-white"
                  >
                    <span className="h-1 w-0 rounded-full bg-amber-200 transition-all duration-400 group-hover:w-3" />
                    <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                      {link.title}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-linear-to-r from-amber-200 to-white transition-all duration-400 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          {/* CONTACT */}
          <Column inView={inView} delay={240} className="lg:col-span-4">
            <Heading>{footer.contactHeading}</Heading>
            <div className="mt-6 space-y-5 text-[15px] leading-[1.7] text-white/90">
              {footer.registeredOffice && (
                <ContactBlock
                  label={footer.registeredOfficeLabel}
                  value={footer.registeredOffice}
                />
              )}
              {footer.corporateOffice && (
                <ContactBlock
                  label={footer.corporateOfficeLabel}
                  value={footer.corporateOffice}
                />
              )}

              {footer.phones && footer.phones.length > 0 && (
                <p className="flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-white">{footer.callLabel}</span>
                  {footer.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                      className="group relative hover:text-amber-100 transition-colors"
                    >
                      {phone}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-amber-100 transition-all duration-300 group-hover:w-full" />
                    </a>
                  ))}
                </p>
              )}

              {footer.email && (
                <p>
                  <span className="font-semibold text-white">
                    {footer.emailLabel}
                  </span>{" "}
                  <a
                    href={`mailto:${footer.email}`}
                    className="group relative hover:text-amber-100 transition-colors"
                  >
                    {footer.email}
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-amber-100 transition-all duration-300 group-hover:w-full" />
                  </a>
                </p>
              )}
            </div>
          </Column>

          {/* SOCIALS */}
          <Column inView={inView} delay={360} className="lg:col-span-2">
            <Heading>{footer.followHeading}</Heading>
            <ul className="mt-6 flex flex-wrap gap-3">
              {(footer.socials || []).map((social, i) => {
                const Icon = SOCIAL_ICONS[social.platform] || FaFacebook;
                return (
                  <li
                    key={social.platform + i}
                    className="transition-all duration-700 ease-out"
                    style={{
                      transitionDelay: inView ? `${500 + i * 90}ms` : "0ms",
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-180deg)",
                    }}
                  >
                    <Magnetic strength={0.4}>
                      <a
                        href={social.url || "#"}
                        aria-label={social.platform}
                        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 text-white overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.6)]"
                      >
                        <span
                          className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
                          style={{ background: social.color || "#7a4e3a" }}
                        />
                        <Icon className="relative h-4 w-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-360" />
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/40 opacity-0 group-hover:opacity-100"
                          style={{ animation: "pulseRing 1.4s ease-out infinite" }}
                        />
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>

            {footer.followerCount && (
              <div
                className="mt-6 flex items-center gap-2 text-[12px] text-amber-100/70 transition-all duration-700"
                style={{
                  transitionDelay: "1000ms",
                  opacity: inView ? 1 : 0,
                }}
              >
                <Sparkles className="h-3 w-3 animate-pulse" />
                {footer.followerCount}
              </div>
            )}
          </Column>
        </div>

        {/* ANNUAL REPORT pill */}
        {footer.annualReportLabel && (
          <div
            className="pointer-events-none absolute right-0 bottom-16 sm:bottom-20 transition-all duration-1000 ease-out"
            style={{
              transitionDelay: "700ms",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(60px)",
            }}
          >
            <a
              href="#"
              className="group relative pointer-events-auto inline-flex items-center overflow-hidden rounded-l-md bg-[#5a3826]/85 backdrop-blur-sm px-5 py-3 text-xs sm:text-sm font-semibold tracking-[0.18em] text-white shadow-lg ring-1 ring-white/10 transition-all hover:bg-[#4a2e1f] hover:pr-8"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">{footer.annualReportLabel}</span>
              <ArrowRight className="relative ml-2 h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </a>
          </div>
        )}

        {/* COPYRIGHT */}
        <div
          className="mt-16 sm:mt-20 border-t border-white/20 pt-6 text-center text-[13px] text-white/85 transition-all duration-700 ease-out"
          style={{
            transitionDelay: "900ms",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(10px)",
          }}
        >
          {footer.copyrightText}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(60,40,25,0.95), rgba(60,40,25,0))",
        }}
      />
    </footer>
  );
}

function Heading({ children }) {
  return (
    <h3
      className="shimmer-text text-[26px] sm:text-[28px] lg:text-[30px] font-semibold tracking-tight"
      style={{
        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </h3>
  );
}

function ContactBlock({ label, value }) {
  return (
    <p className="group">
      <span className="font-semibold text-white">{label}</span>{" "}
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        {value}
      </span>
    </p>
  );
}

function Column({ children, inView, delay = 0, className = "" }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -4, y: x * 4 });
  };

  return (
    <div
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView
          ? `translateY(0) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : "translateY(30px)",
        transformStyle: "preserve-3d",
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}

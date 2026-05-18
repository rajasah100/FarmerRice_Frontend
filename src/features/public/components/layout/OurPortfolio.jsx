import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioAPI } from "@/api/portfolioApi";
import { useSiteContent } from "@/context/SiteContentContext";

// Fallback images per category if portfolio has no image set
import basmatiImg from "@/assets/Premium-1.jpg";
import uplifeImg from "@/assets/uplife-thumb.jpg";
import regionalImg from "@/assets/Regional.jpg";
import healthImg from "@/assets/Health-Range.jpg";
import organicImg from "@/assets/furfural-oil-660x448-copy-1.jpg";
import cleanEnergyImg from "@/assets/clean energy.jpg";

const fallbackImageByCategory = {
  Premium: basmatiImg,
  Health: healthImg,
  Regional: regionalImg,
  "Rice Bran": organicImg,
  Furfural: organicImg,
  Energy: cleanEnergyImg,
  Other: uplifeImg,
};

const ArrowIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function PortfolioCard({ card, index, visible, ctaLabel }) {
  const imgSrc = card.image || fallbackImageByCategory[card.category] || basmatiImg;
  const link = `/portfolio/${encodeURIComponent(card.category)}`;

  return (
    <article
      style={{ transitionDelay: `${index * 140}ms` }}
      className={[
        "group relative px-6 text-center transition-all duration-700 ease-out",
        "md:px-8",
        "md:not-last:border-r md:not-last:border-[#5e3d2b]/30",
        "max-md:not-last:border-b max-md:not-last:border-[#5e3d2b]/25 max-md:not-last:pb-11",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      ].join(" ")}
    >
      <Link to={link} className="block">
        <div className="flex aspect-16/11 items-center justify-center overflow-hidden rounded bg-white shadow-[0_8px_24px_rgba(94,61,43,0.08)] transition-all duration-400 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_18px_38px_rgba(94,61,43,0.18)]">
          <img
            src={imgSrc}
            alt={card.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-110"
          />
        </div>

        <h3 className="mt-7 mb-3.5 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] font-normal text-[#5e3d2b]">
          {card.title}
        </h3>

        <p className="mx-auto mb-6 max-w-85 font-sans text-[14.5px] leading-relaxed text-[#5b5048]">
          {card.shortDescription || card.description}
        </p>

        <div className="inline-flex items-center gap-3 font-sans text-sm font-bold text-[#5e3d2b] pb-10">
          <span>{ctaLabel}</span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6b4226] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-6 group-hover:bg-[#3f2a1d]">
            <ArrowIcon size={15} />
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * OurPortfolio – renders the "Our Products" grid.
 *
 * Props:
 *   limit       – cap the number of cards shown (used to limit homepage to 9)
 *   showHeader  – set false to hide the section header (used when this component
 *                 is embedded inside a page that already has its own banner)
 *   cardCtaLabel– text under each card. Defaults to "Buy Now".
 */
export default function OurPortfolio({
  limit,
  showHeader = true,
  cardCtaLabel = "Buy Now",
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useSiteContent();

  const sectionContent = get("portfolio-section", {
    eyebrow: "OUR PRODUCTS",
    heading: "Delivering Excellence In Every Field",
    ctaLabel: "Our Products",
    ctaLink: "/portfolio",
  });

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const { data } = await portfolioAPI.getAll();
        setPortfolios(data.data || []);
      } catch (err) {
        console.error("Failed to load portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  // Apply optional limit (e.g. homepage shows 9, product page shows all)
  const visibleCards =
    typeof limit === "number" ? portfolios.slice(0, limit) : portfolios;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fbf3e4] py-16 pb-24 font-serif max-sm:py-12 max-sm:pb-16"
    >
      <div className="relative mx-auto max-w-355 px-8 max-sm:px-5">
        {/* Header */}
        {showHeader && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-6 max-sm:flex-col">
              <div>
                <span
                  className={`inline-block font-sans text-[13px] font-bold tracking-[2px] text-[#6b4a35] ${reveal()}`}
                >
                  {sectionContent.eyebrow}
                </span>

                <h2
                  className={`mt-3.5 max-w-180 text-[clamp(2rem,4.8vw,3.6rem)] font-normal leading-[1.1] text-[#5e3d2b] ${reveal(
                    "delay-100"
                  )}`}
                >
                  {sectionContent.heading}
                </h2>
              </div>

              <Link
                to={sectionContent.ctaLink || "/portfolio"}
                className={`group mt-2 inline-flex items-center gap-3.5 font-sans text-sm font-bold text-[#5e3d2b] max-sm:mt-4 ${reveal(
                  "delay-200"
                )}`}
              >
                <span>{sectionContent.ctaLabel}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#6b4226] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-6 group-hover:bg-[#3f2a1d]">
                  <ArrowIcon size={16} />
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div
              className={`mt-8 h-px origin-left bg-[#5e3d2b]/45 transition-transform duration-900 ease-[cubic-bezier(0.22,0.61,0.36,1)] delay-250 ${
                visible ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </>
        )}

        {/* Cards */}
        {loading ? (
          <div className="mt-20 text-center text-[#5e3d2b]">Loading products...</div>
        ) : visibleCards.length === 0 ? (
          <div className="mt-20 text-center text-[#5e3d2b]">No products available</div>
        ) : (
          <div className="mt-11 grid grid-cols-3 gap-0 max-md:grid-cols-2 max-md:gap-y-12 max-sm:grid-cols-1 max-sm:gap-11">
            {visibleCards.map((card, i) => (
              <PortfolioCard
                key={card._id}
                card={card}
                index={i}
                visible={visible}
                ctaLabel={cardCtaLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

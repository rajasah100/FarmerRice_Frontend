import React from "react";
import portfolioBanner from "@/assets/Portfolio-listing-banner.jpg";
import OurPortfolio from "@/features/public/components/layout/OurPortfolio";

const PortfolioPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#1a2a1f] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
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

      {/* HERO BANNER */}
      <section className="relative h-screen min-h-175 max-w-355 mx-auto flex items-end overflow-hidden grain">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${portfolioBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5e3d2b]/70 via-[#5e3d2b]/20 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pb-20 text-white">
          <p className="uppercase tracking-[4px] text-amber-100 text-sm font-semibold mb-4">
            Our Portfolio
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight">
            Browse Our Complete Range
          </h1>
        </div>
      </section>

      {/* PORTFOLIO CARDS - each card links to /portfolio/:category */}
      <OurPortfolio />
    </div>
  );
};

export default PortfolioPage;

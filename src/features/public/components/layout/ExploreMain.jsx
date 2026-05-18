import React from "react";
import riceBg from "@/assets/ExploreImg.png";
import { useSiteContent } from "@/context/SiteContentContext";

const ExploreMain = () => {
  const { get } = useSiteContent();
  const content = get("explore-main", {
    eyebrow: "Explore Rice",
    heading: "Discover, Savor, Enjoy Rice.",
  });

  return (
    <>
      <style>
        {`
          @keyframes slowZoom { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
          @keyframes fadeUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-slowZoom { animation: slowZoom 12s ease-in-out infinite alternate; }
          .animate-fadeUp { animation: fadeUp 1.2s ease forwards; }
          .delay-200 { animation-delay: 0.2s; }
        `}
      </style>

      <section className="relative max-w-355 mx-auto h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{ backgroundImage: `url(${riceBg})` }}
        />
        <div className="absolute inset-0 bg-[#6f4b36]/35" />
        <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-[#7a553c]/95 via-[#7a553c]/55 to-transparent backdrop-blur-[3px]" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 text-center">
          <span className="uppercase tracking-[5px] text-white font-semibold text-xs sm:text-sm md:text-base mb-5 animate-fadeUp">
            {content.eyebrow}
          </span>
          <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-7xl lg:text-[82px] leading-tight animate-fadeUp delay-200">
            {content.heading}
          </h1>
        </div>
      </section>
    </>
  );
};

export default ExploreMain;

import React from "react";
import bgImage from "@/assets/ExploreImg.png";
import { useSiteContent } from "@/context/SiteContentContext";

const ExploreIntro = () => {
  const { get } = useSiteContent();
  const content = get("explore-intro", {
    eyebrow: "Explore Rice",
    heading: "",
    body1: "",
    body2: "",
    cards: [],
  });

  return (
    <>
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(60px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatCard {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .fade-up { animation: fadeUp 1s ease forwards; }
          .float-card { animation: floatCard 5s ease-in-out infinite; }
        `}
      </style>

      <section className="relative overflow-hidden bg-[#f6efe3] py-16 sm:py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="relative z-10 max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div className="fade-up">
              <p className="uppercase tracking-[4px] sm:tracking-[6px] text-[#7a5a45] font-semibold text-xs sm:text-sm mb-5">
                {content.eyebrow}
              </p>

              <h2 className="font-serif text-[#7b5a45] text-[38px] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl">
                {content.heading}
              </h2>
            </div>

            <div className="fade-up lg:pt-3">
              {content.body1 && (
                <p className="text-[#6f5a4b] text-[15px] sm:text-[17px] leading-[1.9] font-medium mb-5">
                  {content.body1}
                </p>
              )}
              {content.body2 && (
                <p className="text-[#6f5a4b] text-[15px] sm:text-[17px] leading-[1.9] font-medium">
                  {content.body2}
                </p>
              )}
            </div>
          </div>

          {content.cards && content.cards.length > 0 && (
            <div className="mt-16 sm:mt-20 lg:mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {content.cards.map((card, index) => {
                const offsetClass = index % 2 === 1 ? "lg:mt-28" : "lg:mt-0";
                return (
                  <div
                    key={index}
                    className={`${offsetClass} relative overflow-hidden group h-45 sm:h-72 lg:h-80 fade-up`}
                  >
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 float-card"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-[#5d0f0f]/30 via-[#3d0000]/50 to-black/80" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:18px_18px]" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                      <h3 className="text-white font-serif text-4xl sm:text-5xl lg:text-6xl mb-4">
                        {card.number}
                      </h3>
                      <p className="text-white text-base sm:text-lg lg:text-[22px] leading-[1.5] tracking-[1px] font-semibold">
                        {card.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ExploreIntro;

import React from "react";
import { useSiteContent } from "@/context/SiteContentContext";

const ExploreValues = () => {
  const { get } = useSiteContent();
  const content = get("explore-values", {
    eyebrow: "OUR VALUES",
    heading: "What Drives Us",
    values: [],
  });

  if (!content.values || content.values.length === 0) return null;

  return (
    <section className="bg-[#fbf3e4] py-16 sm:py-20 lg:py-28 px-5 sm:px-10 lg:px-16">
      <div className="max-w-[1700px] mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="uppercase tracking-[4px] text-[#7a5a45] font-semibold text-xs sm:text-sm mb-4">
            {content.eyebrow}
          </p>
          <h2 className="font-serif text-[#5e3d2b] text-3xl sm:text-4xl lg:text-5xl">
            {content.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {content.values.map((value, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e3d4c1] rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#7b5a42] text-white flex items-center justify-center font-serif font-bold text-lg mb-5">
                {idx + 1}
              </div>
              <h3 className="font-serif text-[#5e3d2b] text-xl mb-3">
                {value.title}
              </h3>
              <p className="text-[#7a6656] text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreValues;

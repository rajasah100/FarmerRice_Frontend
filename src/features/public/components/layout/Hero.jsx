import React, { useEffect, useState } from "react";

import img1 from "@/assets/KRBL-1600-x-767.jpg";
import img2 from "@/assets/top-class-banner-desktop.jpg";
import img3 from "@/assets/website-2.jpg";
import { useSiteContent } from "@/context/SiteContentContext";

// Local fallback images bundled with the app (used only when no video and no slides are configured)
const localSlides = [img1, img2, img3];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { get } = useSiteContent();

  const content = get("hero", {
    eyebrow: "Annual Report 2024-25",
    heading: "Rooted.\nReignited.\nReimagined.",
    video: "",
    videoPoster: "",
    slides: [],
  });

  const hasVideo = !!content.video;

  // Image slides used only when no video is set
  const slides =
    content.slides && content.slides.length > 0
      ? content.slides.map((s, idx) =>
          s.startsWith("http") ? s : localSlides[idx % localSlides.length]
        )
      : localSlides;

  useEffect(() => {
    if (hasVideo) return;
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(slider);
  }, [slides.length, hasVideo]);

  // Split heading by spaces or newlines for line breaks
  const headingLines = content.heading
    ? content.heading.split(/\n|(?<=\.)\s+/).filter(Boolean)
    : [];

  return (
    <section className="relative w-full min-h-screen overflow-hidden max-w-355 mx-auto">
      {hasVideo ? (
        <video
          key={content.video}
          className="absolute inset-0 w-full h-full object-cover"
          src={content.video}
          poster={content.videoPoster || undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : (
        slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide})`,
            }}
          />
        ))
      )}

      <div className="absolute inset-0 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-60 bg-linear-to-t from-[#005f56] to-transparent z-10"></div>

      <div className="relative z-20 flex justify-end min-h-screen px-5 sm:px-10 lg:px-16">
        <div className="max-w-4xl absolute mt-40">
          <p className="uppercase tracking-[6px] text-xs sm:text-sm mb-2 text-[#73513a]">
            {content.eyebrow}
          </p>

          <h1 className="text-[#73513a] font-serif leading-tight text-3xl sm:text-4xl lg:text-5xl">
            {headingLines.length > 0
              ? headingLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </React.Fragment>
                ))
              : content.heading}
          </h1>

          <button className="mt-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#7a523a] hover:bg-[#5f3d2b] transition text-white text-2xl flex items-center justify-center">
            →
          </button>
        </div>
      </div>

      {!hasVideo && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;

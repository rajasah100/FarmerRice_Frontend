import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function CSR() {
  const { get } = useSiteContent();
  const content = get("csr", {
    eyebrow: "CSR & Sustainability",
    heading: "Paving The Way For A Better Tomorrow",
    subtext:
      "Explore our eco-friendly initiatives. Join us in shaping a sustainable future.",
    leftLabel: "CSR",
    rightLabel: "ESG",
    circleText: "",
    backgroundImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    circleImage:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1887&auto=format&fit=crop",
    annualReportLabel: "ANNUAL REPORT 2025-26",
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(50px); } to { opacity:1; transform:translateY(0); } }
        @keyframes zoomIn { from { opacity:0; transform:scale(.8); } to { opacity:1; transform:scale(1); } }
        @keyframes float { 0% { transform:translateY(0px); } 50% { transform:translateY(-10px); } 100% { transform:translateY(0px); } }
        .fade-up { animation:fadeUp 1.2s ease forwards; }
        .zoom-in { animation:zoomIn 1.3s ease forwards; }
        .float { animation:float 4s ease-in-out infinite; }
      `}</style>

      <section className="relative max-w-355 mx-auto min-h-screen overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url('${content.backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-[#3b2416]/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-5 py-8 min-h-[calc(100vh-50px)]">
          <p className="uppercase tracking-[4px] text-white md:text-sm font-semibold fade-up">
            {content.eyebrow}
          </p>

          <h1 className="font-serif text-white text-[42px] md:text-[30px] lg:text-[50px] leading-tight mt-3 fade-up">
            {content.heading}
          </h1>

          <p className="text-white/90 mt-3 max-w-[800px] md:text-sm leading-8 fade-up">
            {content.subtext}
          </p>

          <div className="relative mt-20 flex items-center justify-center w-full max-w-[1200px]">
            <div className="hidden md:flex items-center gap-5 absolute left-0 text-white fade-up">
              <h2 className="font-serif text-[52px]">{content.leftLabel}</h2>
              <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition duration-300 cursor-pointer">
                <ArrowLeft size={30} />
              </div>
            </div>

            <div className="relative zoom-in float">
              <div className="w-[320px] h-[320px] md:w-[520px] md:h-[520px] rounded-full border border-white/90 flex items-center justify-center">
                <div className="w-[260px] h-[260px] md:w-[430px] md:h-[430px] rounded-full overflow-hidden relative">
                  <img
                    src={content.circleImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#3d2417]/45"></div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 text-center">
                    <p className="text-white leading-7 md:leading-10 text-sm md:text-[15px] font-semibold">
                      {content.circleText}
                    </p>
                    <div className="w-24 h-[2px] bg-white mt-8"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-5 absolute right-0 text-white fade-up">
              <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition duration-300 cursor-pointer">
                <ArrowRight size={30} />
              </div>
              <h2 className="font-serif text-[52px]">{content.rightLabel}</h2>
            </div>
          </div>
        </div>

        {content.annualReportLabel && (
          <button className="fixed bottom-5 right-5 z-50 bg-[#8b5d3c] hover:bg-[#6e452a] text-white px-6 py-4 rounded-md text-sm md:text-xl font-medium transition duration-300 shadow-2xl">
            {content.annualReportLabel}
          </button>
        )}
      </section>
    </>
  );
}

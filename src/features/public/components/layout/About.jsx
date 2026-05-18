import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import aboutImg from "@/assets/about-us.png";
import { useSiteContent } from "@/context/SiteContentContext";

/**
 * AnimatedStat
 *
 * Parses a string like "130", "~15%", "60%", "90+", "6", "1.2M" and animates
 * the numeric portion from 0 -> target when the element scrolls into view.
 * Preserves any prefix (~) and suffix (%, +, M, …) characters around the number.
 */
function AnimatedStat({ value, duration = 1800 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  // Pull the first run of digits/decimal out of the value
  const match = String(value || "").match(/(-?\d+\.?\d*)/);
  const numericTarget = match ? parseFloat(match[1]) : null;
  const prefix = match ? String(value).slice(0, match.index) : value || "";
  const suffix = match
    ? String(value).slice(match.index + match[0].length)
    : "";

  const isInteger = numericTarget !== null && Number.isInteger(numericTarget);

  useEffect(() => {
    if (numericTarget === null) {
      // Nothing to animate – just render the raw value
      setDisplay(String(value));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const tick = (now) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = numericTarget * eased;
            setDisplay(
              isInteger ? String(Math.floor(current)) : current.toFixed(1)
            );
            if (p < 1) requestAnimationFrame(tick);
            else
              setDisplay(
                isInteger ? String(numericTarget) : numericTarget.toFixed(1)
              );
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numericTarget, isInteger, value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const About = () => {
  const { get } = useSiteContent();
  const content = get("about", {
    eyebrow: "About Us",
    heading: "",
    subheading: "",
    body: "",
    image: "",
    stats: [],
  });

  // Use the admin-uploaded image when present, otherwise fall back to the bundled asset
  const centerImage = content.image && content.image.length > 0
    ? content.image
    : aboutImg;

  return (
    <section className="bg-[#f6eadb] py-20 px-6 md:px-16 overflow-hidden mt-7">
      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-10 items-center">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="uppercase tracking-widest text-sm mb-4 text-[#3d3a35] font-bold">
            {content.eyebrow}
          </p>

          <h2 className="text-3xl md:text-5xl font-serif leading-tight text-[#3d3a35]">
            {content.heading}
          </h2>
        </motion.div>

        {/* Center Image */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border border-[#73513a] overflow-hidden shadow-xl outline-1 outline-[#73513a] outline-offset-25">
              <img
                src={centerImage}
                alt="About visual"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-[#a58b6f] animate-spin-slow"></div>
          </div>
        </motion.div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-serif mb-4 text-[#3d3a35]">
            {content.subheading}
          </h3>

          <p className="text-sm leading-relaxed text-[#000000]">
            {content.body}
          </p>
        </motion.div>
      </div>

      {/* Stats Section – animated counters */}
      {content.stats && content.stats.length > 0 && (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {content.stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h4 className="text-3xl md:text-4xl font-semibold text-[#3d3a35]">
                <AnimatedStat value={item.value} />
              </h4>
              <p className="text-xs text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default About;

import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { faqAPI } from "@/api/faqApi";

const CATEGORIES = ["All", "General", "Products", "Shipping", "Quality", "Company"];

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const { data } = await faqAPI.getAll();
        setFaqs(data.data || []);
        setError("");
      } catch (err) {
        setError("Failed to load FAQs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, activeCategory, searchTerm]);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .faq-fadeUp { animation: fadeUp 0.8s ease forwards; opacity: 0; }
        .faq-fadeIn { animation: fadeIn 0.5s ease forwards; }
      `}</style>

      <section className="min-h-screen bg-[#f7f3eb] pt-32 pb-20 px-4 md:px-8">
        {/* HERO */}
        <div className="max-w-5xl mx-auto text-center mb-16 faq-fadeUp">
          <div className="inline-flex items-center gap-2 bg-[#efe4d2] px-5 py-2 rounded-full mb-6">
            <HelpCircle size={18} className="text-[#7b5a42]" />
            <span className="uppercase tracking-[3px] text-[#7b5a42] text-xs font-semibold">
              Frequently Asked Questions
            </span>
          </div>

          <h1 className="font-serif text-[#7b5a42] text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
            How Can We <span className="italic">Help You?</span>
          </h1>

          <p className="text-[#7a6656] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our premium rice products,
            quality standards, shipping, and company values.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-10 faq-fadeUp" style={{ animationDelay: "150ms" }}>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9a7c63]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a question..."
              className="w-full pl-14 pr-5 py-4 rounded-full border border-[#e3d4c1] bg-white text-[#6d513d] placeholder-[#9a7c63] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 focus:border-[#7b5a42] transition shadow-sm"
            />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="max-w-5xl mx-auto mb-12 faq-fadeUp" style={{ animationDelay: "300ms" }}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 md:px-7 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#7b5a42] text-white shadow-md scale-105"
                    : "bg-white text-[#7b5a42] border border-[#e3d4c1] hover:border-[#7b5a42] hover:-translate-y-0.5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="text-center text-[#7b5a42] py-20 text-lg">
              Loading questions...
            </div>
          )}

          {error && (
            <div className="text-center text-red-700 bg-red-50 border border-red-200 rounded-lg py-6 px-4">
              {error}
            </div>
          )}

          {!loading && !error && filteredFaqs.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle size={48} className="mx-auto text-[#c4a888] mb-4" />
              <p className="text-[#7b5a42] text-lg">
                No questions found
                {searchTerm && ` matching "${searchTerm}"`}.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl border border-[#e3d4c1] overflow-hidden shadow-sm hover:shadow-md transition-shadow faq-fadeIn"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <button
                    onClick={() => toggle(faq._id)}
                    className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 text-left group"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <span className="hidden md:flex flex-shrink-0 w-9 h-9 rounded-full bg-[#efe4d2] items-center justify-center text-[#7b5a42] font-serif font-bold text-sm">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-[#6d513d] text-lg md:text-xl leading-snug group-hover:text-[#7b5a42] transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`flex-shrink-0 text-[#7b5a42] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 md:px-8 pb-6 md:pb-8 md:pl-[4.75rem]">
                        <div className="h-px bg-[#e3d4c1] mb-5" />
                        <p className="text-[#7a6656] leading-[1.85] text-[15px] md:text-base">
                          {faq.answer}
                        </p>
                        {faq.category && (
                          <span className="inline-block mt-4 px-3 py-1 bg-[#f3eadb] text-[#7b5a42] text-xs font-medium rounded-full">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTACT CTA */}
        <div className="max-w-3xl mx-auto mt-20 text-center bg-[#7b5a42] rounded-2xl p-10 md:p-14 faq-fadeUp">
          <h2 className="font-serif text-white text-3xl md:text-4xl mb-4">
            Still Have Questions?
          </h2>
          <p className="text-amber-100/90 mb-8 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact-us"
            className="inline-block bg-white text-[#7b5a42] px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors shadow-md"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}

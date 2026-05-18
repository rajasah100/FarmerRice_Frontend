import { Mail, Phone, Printer } from "lucide-react";
import contactBanner from "@/assets/contact.jpg";
import ContactInput from "@/features/public/components/layout/ContactInput";
import { useSiteContent } from "@/context/SiteContentContext";

const iconMap = {
  phone: <Phone size={22} />,
  email: <Mail size={22} />,
  printer: <Printer size={22} />,
};

function ContactCard({ title, sections, delay }) {
  return (
    <div
      className="p-8 lg:p-12 rounded-sm border border-[#e3d4c1]
        hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 animate-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-[32px] md:text-[42px] text-[#7b5a42] font-serif mb-12">
        {title}
      </h2>

      {sections.map((section, idx) => (
        <div key={idx}>
          {section.heading && (
            <h4 className="font-bold text-[#6d513d] mb-3">{section.heading}</h4>
          )}

          {section.address && section.address.length > 0 && (
            <div className="text-[#7a6656] leading-8 text-[17px]">
              {section.address.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-8 mt-10">
            {section.contacts.map((contact, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-full bg-[#f8f3ec]
                    flex items-center justify-center text-[#7b5a42]
                    group-hover:bg-[#7b5a42] group-hover:text-white
                    transition-all duration-300"
                >
                  {iconMap[contact.type] || <Mail size={22} />}
                </div>
                <span className="font-semibold text-[#6e5644] text-[16px] md:text-[18px] break-all">
                  {contact.text}
                </span>
              </div>
            ))}
          </div>

          {idx !== sections.length - 1 && (
            <div className="border-t border-[#d7c5b0] my-14"></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Contact() {
  const { get } = useSiteContent();
  const content = get("contact-page", {
    bannerEyebrow: "Contact Us",
    bannerHeading: "Reach Out To Us For Enquiries, Support, Or Collaborations",
    pageHeading: "Connect With Us Worldwide",
    offices: [],
  });

  const offices = content.offices || [];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; opacity: 0; }
        .animate-fadeDown { animation: fadeDown 1s ease forwards; }
      `}</style>

      <section className="min-h-screen px-4 md:px-8 py-16 overflow-hidden bg-[#f7f7f7]">
        {/* Banner */}
        <section className="relative w-full max-w-355 mx-auto h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${contactBanner})` }}
          />
          <div className="absolute inset-0 bg-[#6f4b36]/35" />
          <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-[#7a553c]/95 via-[#7a553c]/55 to-transparent backdrop-blur-[3px]" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 text-center">
            <span className="uppercase tracking-[5px] text-white font-semibold text-xs sm:text-sm md:text-base mb-5 animate-fadeUp">
              {content.bannerEyebrow}
            </span>
            <h1 className="font-serif text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight animate-fadeUp">
              {content.bannerHeading}
            </h1>
          </div>
        </section>

        {/* Heading */}
        <div className="text-center mt-20">
          <h1 className="text-[40px] md:text-[72px] text-[#7b5a42] font-serif animate-fadeDown">
            {content.pageHeading}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-12 mt-10 text-[#76563f]">
            <button className="font-bold text-[20px] relative pb-4">
              Our Offices
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#7b5a42]" />
            </button>
          </div>
        </div>

        {/* Offices Grid */}
        {offices.length > 0 ? (
          <div className="max-w-[1700px] mx-auto mt-20 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="xl:row-span-2">
              <ContactCard
                title={offices[0].title}
                sections={offices[0].sections}
                delay={100}
              />
            </div>
            {offices[1] && (
              <ContactCard
                title={offices[1].title}
                sections={offices[1].sections}
                delay={300}
              />
            )}
            {offices[2] && (
              <ContactCard
                title={offices[2].title}
                sections={offices[2].sections}
                delay={500}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-[#7b5a42] mt-20 py-10">
            Loading office information...
          </div>
        )}

        <ContactInput />
      </section>
    </>
  );
}

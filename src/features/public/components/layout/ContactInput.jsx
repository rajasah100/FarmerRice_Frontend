import { useState } from "react";
import {
  User,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { contactAPI } from "@/api/contactApi";

export default function ContactInput() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await contactAPI.submit(formData);
      toast.success(data.message || "Message sent successfully!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* CUSTOM CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        body{
          margin:0;
          padding:0;
          overflow-x:hidden;
          font-family:'Inter', sans-serif;
          background:#f3eadb;
        }

        .font-serif{
          font-family:'Cormorant Garamond', serif;
        }

        @keyframes fadeUp{
          from{
            opacity:0;
            transform:translateY(60px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        @keyframes fadeLeft{
          from{
            opacity:0;
            transform:translateX(-60px);
          }
          to{
            opacity:1;
            transform:translateX(0);
          }
        }

        @keyframes fadeRight{
          from{
            opacity:0;
            transform:translateX(60px);
          }
          to{
            opacity:1;
            transform:translateX(0);
          }
        }

        .fade-up{
          animation:fadeUp 1s ease forwards;
        }

        .fade-left{
          animation:fadeLeft 1.2s ease forwards;
        }

        .fade-right{
          animation:fadeRight 1.2s ease forwards;
        }
      `}</style>

      {/* MAIN SECTION */}
      <section className="w-full min-h-screen bg-[#efe4d2] px-4 md:px-10 py-12 overflow-hidden">

        {/* TOP TEXT */}
        <div className="text-center fade-up">
          <p
            className="uppercase tracking-[3px]
            text-[#7b5a42] text-sm md:text-xl font-medium"
          >
            Make An Enquiry
          </p>

          <h1
            className="font-serif text-[#7b5a42]
            text-[50px] md:text-[80px]
            leading-none mt-4"
          >
            Connect With Us
          </h1>
        </div>

        {/* MAIN GRID */}
        <div
          className="max-w-[1700px] mx-auto mt-12
          grid grid-cols-1 lg:grid-cols-2 gap-5"
        >

          {/* LEFT FORM */}
          <div
            className="bg-[#f8f3ec] p-8 md:p-14 fade-left"
          >
            <h2
              className="font-serif text-center
              text-[#7b5a42] text-[28px] md:text-[42px]
              mb-10"
            >
              MAKE AN ENQUIRY
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* INPUT */}
              <div
                className="flex items-center gap-4
                border border-[#8b6549]
                rounded-2xl px-5 h-[65px]
                bg-transparent"
              >
                <User className="text-[#8b6549]" size={22} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name*"
                  className="w-full bg-transparent outline-none
                  text-[#6b4a35] font-medium placeholder:text-[#6b4a35]"
                />
              </div>

              {/* PHONE */}
              <div
                className="flex items-center gap-4
                border border-[#8b6549]
                rounded-2xl px-5 h-[65px]"
              >
                <Phone className="text-[#8b6549]" size={22} />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                  className="w-full bg-transparent outline-none
                  text-[#6b4a35] font-medium placeholder:text-[#6b4a35]"
                />
              </div>

              {/* EMAIL */}
              <div
                className="flex items-center gap-4
                border border-[#8b6549]
                rounded-2xl px-5 h-[65px]"
              >
                <Mail className="text-[#8b6549]" size={22} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Id*"
                  className="w-full bg-transparent outline-none
                  text-[#6b4a35] font-medium placeholder:text-[#6b4a35]"
                />
              </div>

              {/* MESSAGE */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Message*"
                className="w-full h-[220px]
                border border-[#8b6549]
                rounded-2xl p-5 resize-none
                bg-transparent outline-none
                text-[#6b4a35] font-medium
                placeholder:text-[#6b4a35]"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[72px]
                bg-[#81583c]
                hover:bg-[#68452d]
                rounded-full text-white
                text-lg font-bold
                transition-all duration-300
                hover:scale-[1.02]
                active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "SENDING..." : "SUBMIT"}
              </button>
            </form>
          </div>

          {/* RIGHT MAP */}
          <div
            className="relative min-h-[500px] lg:min-h-full
            fade-right overflow-hidden"
          >
            <iframe
              title="map"
              src="https://www.google.com/maps?q=KRBL+Limited+Noida&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* OVERLAY */}
            <div
              className="absolute inset-0 bg-black/5
              pointer-events-none"
            />
          </div>
        </div>

        {/* FLOATING BUTTON */}
        <button
          className="fixed bottom-5 right-5 z-50
          bg-[#8b5d3c]
          hover:bg-[#6d452b]
          text-white px-6 py-4
          rounded-md shadow-2xl
          transition duration-300
          text-sm md:text-xl font-medium"
        >
          ANNUAL REPORT 2024-25
        </button>
      </section>
    </>
  );
}
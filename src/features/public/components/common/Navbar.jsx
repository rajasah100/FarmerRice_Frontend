import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/context/SiteContentContext";

// Fallback nav items if backend hasn't loaded yet
const DEFAULT_NAV = {
  brandName: "Farmers",
  brandAccent: "Rice",
  items: [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "About Us", link: "/about" },
    { id: 3, title: "Our Products", link: "/Products" },
    { id: 4, title: "Explore Rice", link: "/explore-rice" },
    { id: 5, title: "FAQS", link: "/FAQS" },
    { id: 6, title: "Contact Us", link: "/contact-us" },
  ],
};

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { get } = useSiteContent();
  const navConfig = get("navbar", DEFAULT_NAV);
  const navItems = navConfig.items && navConfig.items.length > 0 ? navConfig.items : DEFAULT_NAV.items;

  return (
    <header className="px-4 sm:px-6 lg:px-10 py-4 left-0 right-0 top-0 fixed bg-[#fff9f0] z-50">
      <div className="flex items-center justify-between max-w-355 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl sm:text-3xl font-serif text-green-700">
              {navConfig.brandName}
              <span className="text-gray-700">{navConfig.brandAccent}</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex pr-20 items-center gap-7 text-[#6a4a36] font-medium text-sm">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="hover:text-[#9a6b4d] transition flex items-center gap-1"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="xl:hidden text-[#6a4a36]"
        >
          {mobileMenu ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="xl:hidden mt-5 bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setMobileMenu(false)}
              className="text-[#6a4a36] border-b pb-2"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;

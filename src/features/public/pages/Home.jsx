import React from "react";
import Hero from "@/features/public/components/layout/Hero";
import AboutUs from "@/features/public/components/layout/About";
import OurLeaders from "@/features/public/components/layout/OurLeaders";
import OurPortfolio from "@/features/public/components/layout/OurPortfolio";
import CSR from "@/features/public/components/layout/CSR";

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutUs />
      <OurLeaders />
      <OurPortfolio limit={9} />
      <CSR />
    </div>
  );
};

export default Home;

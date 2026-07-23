import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProgramPage from "./pages/ProgramPage";
import ResultsPage from "./pages/ResultsPage";
import ApplyPage from "./pages/ApplyPage";

// Каждая страница открывается с верха, а не с середины
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const base = import.meta.env.BASE_URL;
  return (
    <div
      className="min-h-screen text-[#E8E6D9] font-sans overflow-x-clip selection:bg-[#A3B18A]/30 selection:text-[#E8E6D9]"
      style={{
        backgroundColor: "#0F1108",
        backgroundImage: `linear-gradient(rgba(15,17,8,0.28), rgba(15,17,8,0.28)), url(${base}assets/fields_bg.jpg)`,
        backgroundSize: "300px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

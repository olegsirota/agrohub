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
  return (
    <div className="min-h-screen bg-[#0F1108] text-[#E8E6D9] font-sans overflow-x-clip selection:bg-[#A3B18A]/30 selection:text-[#E8E6D9]">
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

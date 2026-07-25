import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import First from "./components/First";
import Second from "./components/Second";
import Plants from "./components/Plants";
import Diseases from "./components/Diseases";
import Blog from "./components/Blog";
import YourPlants from "./components/YourPlant";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PlantDetail from "./components/PlantDetail";
import DiseaseDetail from "./components/DiseaseDetail";
import BlogDetail from "./components/BlogDetail";
import NotFound from "./components/NotFound";

export default function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signup", "/login"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <First />
              <Second />
            </>
          } 
        />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/diseases/:id" element={<DiseaseDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/your-plants" element={<YourPlants />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideHeader && <Footer />}
    </>
  );
}

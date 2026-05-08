import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ProductShoot from "./pages/ProductShoot.tsx";
import LeadsGenerator from "./pages/LeadsGenerator.tsx";
import Jack from "./pages/Jack.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPlanetBee from "./pages/BlogPlanetBee.tsx";
import BlogBeeAiEngine from "./pages/BlogBeeAiEngine.tsx";
import BlogHealthBeeQuantum from "./pages/BlogHealthBeeQuantum.tsx";
import BlogSpaceBeeQuantum from "./pages/BlogSpaceBeeQuantum.tsx";
import BlogQuantumBeeCity from "./pages/BlogQuantumBeeCity.tsx";
import BlogStudyBeeAcademy from "./pages/BlogStudyBeeAcademy.tsx";
import HealthBee from "./pages/HealthBee.tsx";
import Profile from "./pages/Profile.tsx";
import SpaceBee from "./pages/SpaceBee.tsx";
import StudyBee from "./pages/StudyBee.tsx";
import NotFound from "./pages/NotFound.tsx";
import Recharge from "./pages/Recharge.tsx";
import BeeCursor from "./components/BeeCursor.tsx";
import IntroAnimation from "./components/IntroAnimation.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BeeCursor />
      <IntroAnimation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bee-ai" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product-shoot" element={<ProductShoot />} />
          <Route path="/leads-generator" element={<LeadsGenerator />} />
          <Route path="/jack" element={<Jack />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/discovery-of-planet-bee" element={<BlogPlanetBee />} />
          <Route path="/blogs/bee-ai-engine" element={<BlogBeeAiEngine />} />
          <Route path="/blogs/health-bee-quantum" element={<BlogHealthBeeQuantum />} />
          <Route path="/blogs/space-bee-quantum" element={<BlogSpaceBeeQuantum />} />
          <Route path="/blogs/quantum-bee-city" element={<BlogQuantumBeeCity />} />
          <Route path="/blogs/study-bee-academy" element={<BlogStudyBeeAcademy />} />
          <Route path="/health-bee" element={<HealthBee />} />
          <Route path="/space-bee" element={<SpaceBee />} />
          <Route path="/study-bee" element={<StudyBee />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recharge" element={<Recharge />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

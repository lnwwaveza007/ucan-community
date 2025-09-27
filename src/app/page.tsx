import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProgramsEvents from "@/components/ProgramsEvents";
import Resources from "@/components/Resources";
import Blog from "@/components/Blog";
import CommunityPartners from "@/components/CommunityPartners";
import CTA from "@/components/CTA";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <Hero />
      <About />
      <ProgramsEvents />
      {/* <Resources /> */}
      {/* <Blog /> */}
      <CommunityPartners />
      <CTA />
      <ContactFooter />
    </div>
  );
}

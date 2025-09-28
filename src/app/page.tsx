import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProgramsEvents from "@/components/ProgramsEvents";
import Resources from "@/components/Resources";
import Blog from "@/components/Blog";
import CommunityPartners from "@/components/CommunityPartners";
import CTA from "@/components/CTA";
import ContactFooter from "@/components/ContactFooter";
import { readContent } from "@/lib/content";

export default async function Home() {
  const content = await readContent();
  return (
    <div className="font-sans min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <Hero slides={content.slideshow} />
      <About />
      <ProgramsEvents upcomingPrograms={content.upcomingPrograms} pastPrograms={content.pastPrograms} />
      {/* <Resources /> */}
      {/* <Blog /> */}
      <CommunityPartners communityPartners={content.communityPartners} partners={content.partners} />
      <CTA />
      <ContactFooter />
    </div>
  );
}

import { ObjectId } from "mongodb";
import { getCollection } from "./mongodb";

export type SlideshowItem = { src: string; alt?: string };
export type ProgramItem = { title: string; date: string; description?: string; image?: string };
export type PartnerItem = { name: string; logo: string };

export type SiteContent = {
  slideshow: SlideshowItem[];
  upcomingPrograms: ProgramItem[];
  pastPrograms: ProgramItem[];
  communityPartners: PartnerItem[];
  partners: PartnerItem[];
};

export const defaultContent: SiteContent = {
  slideshow: [
    { src: "/images/slide-show/test1.jpg", alt: "Slide 1" },
    { src: "/images/slide-show/test2.jpg", alt: "Slide 2" },
    { src: "/images/slide-show/test3.jpg", alt: "Slide 3" },
    { src: "/images/slide-show/test4.jpg", alt: "Slide 4" },
  ],
  upcomingPrograms: [
    { title: "Founder Sprint Week", date: "Oct 12, 2025", description: "Intensive program to validate ideas and ship MVPs.", image: "/images/programs/mockup4.jpg" },
  ],
  pastPrograms: [
    { title: "Founder Sprint Week 1", date: "Oct 12, 2025", description: "Intensive program to validate ideas and ship MVPs.", image: "/images/programs/mockup.jpg" },
    { title: "Founder Sprint Week 2", date: "Oct 12, 2025", description: "Intensive program to validate ideas and ship MVPs.", image: "/images/programs/mockup2.jpg" },
    { title: "Founder Sprint Week 3", date: "Oct 12, 2025", description: "Intensive program to validate ideas and ship MVPs.", image: "/images/programs/mockup3.jpg" },
  ],
  communityPartners: [
    { name: "Chula Deeptech Association", logo: "/images/partners/chula_deeptech.png" },
    { name: "KMITL Startup Hub", logo: "/images/partners/kmitl_startup_hub.png" },
    { name: "Chula Blockchain Society", logo: "/images/partners/cubs.jpg" },
    { name: "SWU Sandbox", logo: "/images/partners/swu_sandbox.jpg" },
    { name: "Case of Thammasat", logo: "/images/partners/case_of_thammasat.jpg" },
    { name: "Startup Club KKU", logo: "/images/partners/startup_kku.jpg" },
  ],
  partners: [
    { name: "KMUTT Hatch", logo: "/images/partners/kmutt_hatch.png" },
    { name: "Student Affairs KMUTT", logo: "/images/partners/student_affairs.png" },
    { name: "Knowledge Exchange", logo: "/images/partners/KX.png" },
    { name: "GMI KMUTT", logo: "/images/partners/GMI.png" },
    { name: "MIDI KMUTT", logo: "/images/partners/midi.png" },
    { name: "Science and Industrial Park", logo: "/images/partners/science_and_industrial.png" },
    { name: "CARPE DIEM", logo: "/images/partners/CARPE_DIEM.jpg" },
    { name: "Global Competence Development Centre", logo: "/images/partners/GCDC.jpg" },
    { name: "UBI KMUTT", logo: "/images/partners/ubi_kmutt.png" },
    { name: "Innovation Experience", logo: "/images/partners/Innovation_experience.png" },
    { name: "DEVA", logo: "/images/partners/deva.jpg" },
  ],
};

type ContentDoc = SiteContent & { _id?: ObjectId; key: "site_content" };

const COLLECTION_NAME = "content";
const CONTENT_KEY: ContentDoc["key"] = "site_content";

export async function readContent(): Promise<SiteContent> {
  try {
    const col = await getCollection<ContentDoc>(COLLECTION_NAME);
    const doc = await col.findOne({ key: CONTENT_KEY });
    if (!doc) {
      return defaultContent;
    }
    // Return only the site content fields
    return {
      slideshow: doc.slideshow,
      upcomingPrograms: doc.upcomingPrograms,
      pastPrograms: doc.pastPrograms,
      communityPartners: doc.communityPartners,
      partners: doc.partners,
    } satisfies SiteContent;
  } catch {
    return defaultContent;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  const col = await getCollection<ContentDoc>(COLLECTION_NAME);
  await col.updateOne(
    { key: CONTENT_KEY },
    { $set: { ...content, key: CONTENT_KEY } },
    { upsert: true }
  );
}



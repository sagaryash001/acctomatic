import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section, SectionIntro } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";

interface TeamMember {
  name: string;
  role?: string;
  initials: string;
  gradient: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Atharv Mittal",
    role: "Founder & CEO",
    initials: "AM",
    gradient: "from-accent to-accent-secondary",
  },
  {
    name: "Akshita Mittal",
    initials: "AM",
    gradient: "from-accent-secondary to-[#8fb2ff]",
  },
  {
    name: "Yash Sagar",
    initials: "YS",
    gradient: "from-[#0f172a] to-accent",
  },
];

export function TeamPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />

      <Section className="px-4 pb-16 pt-4 sm:px-6 md:pt-8">
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-10 md:p-12">
          <SectionIntro label="Team" title="The people behind Acctomatic." />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {TEAM.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="rounded-2xl border border-black/5 bg-card/70 p-6 text-center shadow-sm"
              >
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-semibold text-white ${member.gradient}`}
                >
                  {member.initials}
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em]">{member.name}</h3>
                {member.role && <p className="mt-1 text-sm text-accent">{member.role}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Footer onContactClick={contactModal.open} />
    </div>
  );
}

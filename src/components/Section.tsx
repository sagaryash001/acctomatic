import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-6 py-20", className)}>
      {children}
    </section>
  );
}

export function SectionIntro({
  label,
  title,
  showLabel = true,
}: {
  label: string;
  title: React.ReactNode;
  showLabel?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-10 flex flex-col gap-4"
    >
      {showLabel && (
        <motion.div variants={fadeInUp}>
          <Badge pulse>{label}</Badge>
        </motion.div>
      )}
      <motion.h2 variants={fadeInUp} className="text-3xl leading-[1.15] md:text-[3.25rem]">
        {title}
      </motion.h2>
    </motion.div>
  );
}

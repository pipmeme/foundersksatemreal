import { motion } from "framer-motion";

export interface TimelineMilestone {
  year: string;
  title: string;
  description?: string;
  icon?: string;
}

interface FounderTimelineProps {
  milestones: TimelineMilestone[];
}

const FounderTimeline = ({ milestones }: FounderTimelineProps) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="relative py-2 sm:py-4">
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">
          At a glance
        </p>
        <h3 className="font-display text-base sm:text-xl md:text-2xl font-bold tracking-tight">
          The journey, in four moments
        </h3>
      </div>

      {/* Compact horizontal spine */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="relative pl-3 sm:pl-0 sm:pt-3 border-l-2 sm:border-l-0 sm:border-t-2 border-primary/30"
          >
            <div className="absolute -left-[5px] top-0 sm:left-0 sm:-top-[5px] w-2 h-2 rounded-full gradient-bg" />
            <span className="block text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              {m.year}
            </span>
            <p className="font-display text-xs sm:text-sm font-bold text-foreground leading-snug">
              {m.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FounderTimeline;

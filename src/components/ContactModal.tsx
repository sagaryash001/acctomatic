import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";

export interface ContactOrigin {
  x: number;
  y: number;
}

/** Manages the click-origin state that drives the iris-open animation. */
export function useContactModal() {
  const [origin, setOrigin] = useState<ContactOrigin | null>(null);

  const open = (event: React.MouseEvent) => {
    setOrigin({ x: event.clientX, y: event.clientY });
  };
  const close = () => setOrigin(null);

  return { origin, open, close };
}

/** The card sitting underneath: dimmed and pushed back as the next one stacks over it. */
const BEHIND_VARIANTS = {
  front: { opacity: 1, scale: 1, y: 0, x: "-50%" },
  behind: { opacity: 0.6, scale: 0.95, y: -10, x: "-50%" },
};

/** The incoming card: springs up from below into place. */
const FRONT_VARIANTS = {
  below: { opacity: 0, y: 100, x: "-50%" },
  front: { opacity: 1, y: 0, x: "-50%" },
};

const fieldClassName =
  "border-white/20 bg-white/5 text-white placeholder:text-white/35 focus:border-accent focus:ring-offset-foreground";

const VOLUMES = ["Under 100", "100–1,000", "1,000–10,000", "10,000+"];

const TOTAL_STEPS = 4;

export function ContactModal({
  origin,
  onClose,
}: {
  origin: ContactOrigin | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [volume, setVolume] = useState(VOLUMES[1]);

  useEffect(() => {
    if (!origin) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    // `overflow: hidden` alone still lets iOS Safari rubber-band the page
    // behind the modal when a touch drag starts past the modal's own
    // scroll bounds; containing overscroll on body closes that gap.
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [origin]);

  // Diameter needed so the scaled circle covers every corner of the viewport.
  const diameter = origin
    ? 2 *
      Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      )
    : 0;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  /** One card per question, so each step is its own page in the stack. */
  const renderStep = (index: number) => {
    switch (index) {
      case 0:
        return (
          <>
            <StepHeader
              label="Contact Us"
              title="Let's talk documents."
              subtitle="Tell us who you are and we'll show you where Acctomatic fits."
              index={0}
            />
            <form className="mt-8 space-y-5" onSubmit={next}>
              <Field id="contact-name" label="Full name" placeholder="Jane Doe" />
              <Field
                id="contact-email"
                label="Work email"
                type="email"
                placeholder="jane@company.com"
              />
              <Field id="contact-company" label="Company" placeholder="Acme Inc." />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </>
        );
      case 1:
        return (
          <>
            <StepHeader
              label="Your Workflow"
              title="How many documents a month?"
              subtitle="A rough range is plenty — it tells us what scale to design for."
              index={1}
            />
            <form className="mt-8 space-y-5" onSubmit={next}>
              <div className="flex flex-wrap gap-2">
                {VOLUMES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setVolume(option)}
                    className={
                      option === volume
                        ? "rounded-lg border border-accent bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                        : "rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <StepHeader
              label="Your Workflow"
              title="Where do they arrive?"
              subtitle="Acctomatic sits behind the tools you already use — tell us which ones."
              index={2}
            />
            <form className="mt-8 space-y-5" onSubmit={next}>
              <Field
                id="contact-tools"
                label="Tools and inboxes"
                placeholder="Email, Drive, Slack, NetSuite…"
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </>
        );
      case 3:
        return (
          <>
            <StepHeader
              label="Your Workflow"
              title="What's slowing you down?"
              subtitle="The part of the process you'd most like to stop doing by hand."
              index={3}
            />
            <form className="mt-8 space-y-5" onSubmit={next}>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-white/80">
                  Tell us more
                </label>
                <Textarea
                  id="contact-message"
                  required
                  placeholder="Manual data entry, approval chases, month-end crunch…"
                  className={fieldClassName}
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  const isSent = step === TOTAL_STEPS;

  return (
    <AnimatePresence onExitComplete={() => setStep(0)}>
      {origin && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Iris wash: a circle that scales up from the click point, revealing a
              wireframe-room backdrop. Animating `scale` (transform) instead of
              clip-path keeps this on the GPU. The image's black is screen-blended
              against the same navy as `--foreground` so it reads as one continuous
              surface with the iris rather than a mismatched black. */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: origin.x,
              top: origin.y,
              width: diameter,
              height: diameter,
              x: "-50%",
              y: "-50%",
              backgroundColor: "var(--foreground)",
              backgroundImage: "url(/textures/wireframe-room.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "screen",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="relative h-full overflow-y-auto overscroll-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <button
              onClick={onClose}
              aria-label="Close contact form"
              className="fixed right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>

            <MotionConfig transition={{ type: "spring", bounce: 0.3, visualDuration: 0.4 }}>
              <div className="flex min-h-full items-start justify-center px-6 py-24">
                <div className="relative min-h-[460px] w-full max-w-lg">
                  {isSent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-6 w-6" />
                      </div>
                      <h2 className="mt-6 text-2xl font-semibold text-white">Message sent</h2>
                      <p className="mt-2 text-white/60">
                        Thanks for reaching out — we'll be in touch soon.
                      </p>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="mt-8 border-white/25 text-white hover:bg-white/10"
                        onClick={onClose}
                      >
                        Close
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      {/* The previous step stays on screen, dimmed and pushed back,
                          so each new question visibly stacks over the last. */}
                      {step > 0 && (
                        <motion.div
                          key={`behind-${step - 1}`}
                          variants={BEHIND_VARIANTS}
                          initial="front"
                          animate="behind"
                          className="pointer-events-none absolute left-1/2 max-h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm"
                          style={{
                            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                          }}
                        >
                          {renderStep(step - 1)}
                        </motion.div>
                      )}

                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={`front-${step}`}
                          variants={FRONT_VARIANTS}
                          initial="below"
                          animate="front"
                          exit="below"
                          className="absolute left-1/2 z-10 w-full rounded-3xl border border-white/10 bg-foreground p-8 shadow-2xl"
                        >
                          {renderStep(step)}

                          {step > 0 && (
                            <button
                              type="button"
                              onClick={back}
                              className="mt-3 w-full text-sm font-medium text-white/50 transition-colors hover:text-white"
                            >
                              Back
                            </button>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>
            </MotionConfig>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepHeader({
  label,
  title,
  subtitle,
  index,
}: {
  label: string;
  title: string;
  subtitle: string;
  index: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">{label}</span>
        <span className="font-mono text-xs text-white/40">
          {index + 1} / {TOTAL_STEPS}
        </span>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white">{title}</h2>
      <p className="mt-3 text-white/60">{subtitle}</p>
    </>
  );
}

function Field({
  id,
  label,
  placeholder,
  type,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-white/80">
        {label}
      </label>
      <Input id={id} type={type} required placeholder={placeholder} className={fieldClassName} />
    </div>
  );
}

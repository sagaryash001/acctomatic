import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const fieldClassName =
  "border-white/20 bg-white/5 text-white placeholder:text-white/35 focus:border-accent focus:ring-offset-foreground";

export function ContactModal({
  origin,
  onClose,
}: {
  origin: ContactOrigin | null;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!origin) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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

  return (
    <AnimatePresence onExitComplete={() => setSubmitted(false)}>
      {origin && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Iris wash: a circle that scales up from the click point. Animating
              `scale` (transform) instead of clip-path keeps this on the GPU. */}
          <motion.div
            className="absolute rounded-full bg-foreground"
            style={{
              left: origin.x,
              top: origin.y,
              width: diameter,
              height: diameter,
              x: "-50%",
              y: "-50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="relative h-full overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="flex min-h-full items-center justify-center px-6 py-24">
              <button
                onClick={onClose}
                aria-label="Close contact form"
                className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-full max-w-lg">
                {!submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                      Contact Us
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
                      Let's talk documents.
                    </h2>
                    <p className="mt-3 text-white/60">
                      Tell us about your workflow and we'll show you where Acctomatic fits.
                    </p>

                    <form
                      className="mt-10 space-y-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                    >
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="text-sm font-medium text-white/80">
                          Full name
                        </label>
                        <Input id="contact-name" required placeholder="Jane Doe" className={fieldClassName} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-sm font-medium text-white/80">
                          Work email
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="jane@company.com"
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-message" className="text-sm font-medium text-white/80">
                          Message
                        </label>
                        <Textarea
                          id="contact-message"
                          required
                          placeholder="Tell us what you need..."
                          className={fieldClassName}
                        />
                      </div>
                      <Button type="submit" variant="primary" size="lg" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
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
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

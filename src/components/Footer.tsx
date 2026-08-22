import { Facebook, Instagram, Linkedin } from "lucide-react";
import { InvertedSection } from "@/components/ui";
import { ScrambleText } from "@/components/ScrambleText";
import { cn } from "@/lib/utils";

export function Footer({
  onContactClick,
  className,
}: {
  onContactClick: (event: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <InvertedSection className={className}>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <span className="text-lg font-semibold tracking-[-0.02em] text-background">
              acct<span className="gradient-text">omatic</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-background/60">
              Documents in. Manual work out. Acctomatic sits behind the tools you already use.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Acctomatic on Instagram"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-background/15",
                  "text-background/60 transition-colors hover:border-background/40 hover:text-background",
                )}
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Acctomatic on Facebook"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-background/15",
                  "text-background/60 transition-colors hover:border-background/40 hover:text-background",
                )}
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Acctomatic on LinkedIn"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-background/15",
                  "text-background/60 transition-colors hover:border-background/40 hover:text-background",
                )}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-background/40">
                Product
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="/#how-it-works" className="text-background/70 transition-colors hover:text-background">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="/#get-started" className="text-background/70 transition-colors hover:text-background">
                    <ScrambleText text="Get started" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-background/40">
                Company
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <button
                    onClick={onContactClick}
                    className="text-background/70 transition-colors hover:text-background"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Acctomatic. All rights reserved.</span>
        </div>
      </section>
    </InvertedSection>
  );
}

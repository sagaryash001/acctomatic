import { LinkButton } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { MegaMenu } from "@/components/MegaMenu";
import { ScrambleText } from "@/components/ScrambleText";
import { type ContactOrigin } from "@/components/ContactModal";

/** Shared nav for every secondary page (feature detail, coming-soon, 404, team). */
export function PageNav({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { navigateWithDoors } = useDoors();

  const goHome = (event: React.MouseEvent) => {
    event.preventDefault();
    navigateWithDoors("/");
  };

  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 sm:py-7">
      <a href="/" onClick={goHome} className="shrink-0 text-base font-semibold tracking-[-0.02em] text-foreground">
        acct<span className="gradient-text">omatic</span>
      </a>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <MegaMenu />
        <button
          onClick={contactModal.open}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent/30"
        >
          Contact Us
        </button>
        <LinkButton href="/#get-started" variant="primary" size="sm">
          <ScrambleText text="Get Started" />
        </LinkButton>
      </div>
    </nav>
  );
}

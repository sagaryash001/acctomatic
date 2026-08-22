import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ContactModal, useContactModal } from "@/components/ContactModal";
import { DoorsProvider } from "@/components/DoorsTransition";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { HomePage } from "@/pages/HomePage";
import { FeaturePage } from "@/pages/FeaturePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Rarely-visited pages are code-split so their chunk genuinely buffers in
// behind the pulse-dot loading overlay, rather than faking a delay.
const ComingSoonPage = lazy(() =>
  import("@/pages/ComingSoonPage").then((module) => ({ default: module.ComingSoonPage })),
);

export default function App() {
  const contactModal = useContactModal();

  return (
    <DoorsProvider>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route path="/" element={<HomePage contactModal={contactModal} />} />
          <Route path="/features/:slug" element={<FeaturePage contactModal={contactModal} />} />
          <Route
            path="/faq"
            element={
              <ComingSoonPage
                title="FAQ"
                description="Answers to the common questions are on the way. In the meantime, reach out and we'll answer directly."
                contactModal={contactModal}
              />
            }
          />
          <Route
            path="/team"
            element={
              <ComingSoonPage
                title="Team"
                description="We're putting together a page to introduce the people behind Acctomatic."
                contactModal={contactModal}
              />
            }
          />
          <Route
            path="/blog"
            element={
              <ComingSoonPage
                title="Blog"
                description="Product notes and updates from the Acctomatic team are coming soon."
                contactModal={contactModal}
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <ComingSoonPage
                title="Privacy"
                description="Our privacy policy is being finalized. Reach out if you have questions in the meantime."
                contactModal={contactModal}
              />
            }
          />
          <Route
            path="/pricing"
            element={
              <ComingSoonPage
                title="Pricing"
                description="Pricing details are on the way. Talk to sales for a plan that fits your team today."
                contactModal={contactModal}
              />
            }
          />
          <Route
            path="/affiliate"
            element={
              <ComingSoonPage
                title="Affiliate"
                description="Our affiliate program is in the works. Get in touch if you'd like to partner early."
                contactModal={contactModal}
              />
            }
          />
          <Route path="*" element={<NotFoundPage contactModal={contactModal} />} />
        </Routes>
      </Suspense>
      <ContactModal origin={contactModal.origin} onClose={contactModal.close} />
    </DoorsProvider>
  );
}

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
const TeamPage = lazy(() => import("@/pages/TeamPage").then((module) => ({ default: module.TeamPage })));

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
          <Route path="/team" element={<TeamPage contactModal={contactModal} />} />
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
          <Route
            path="/demo"
            element={
              <ComingSoonPage
                title="Book a Demo"
                description="Guided demos are being scheduled by hand for now — reach out and we'll set one up personally."
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

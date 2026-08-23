import { Suspense, lazy } from "react";
import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { ContactModal, useContactModal } from "@/components/ContactModal";
import { DoorsProvider } from "@/components/DoorsTransition";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AuthProvider } from "@/lib/auth/useAuth";
import { HomePage } from "@/pages/HomePage";
import { FeaturePage } from "@/pages/FeaturePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Rarely-visited pages are code-split so their chunk genuinely buffers in
// behind the pulse-dot loading overlay, rather than faking a delay.
const ComingSoonPage = lazy(() =>
  import("@/pages/ComingSoonPage").then((module) => ({ default: module.ComingSoonPage })),
);
const TeamPage = lazy(() => import("@/pages/TeamPage").then((module) => ({ default: module.TeamPage })));
const FaqPage = lazy(() => import("@/pages/FaqPage").then((module) => ({ default: module.FaqPage })));
const BlogPage = lazy(() => import("@/pages/BlogPage").then((module) => ({ default: module.BlogPage })));
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPostPage").then((module) => ({ default: module.BlogPostPage })),
);
const PricingPage = lazy(() => import("@/pages/PricingPage").then((module) => ({ default: module.PricingPage })));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage").then((module) => ({ default: module.PrivacyPage })));
const AffiliatePage = lazy(() =>
  import("@/pages/AffiliatePage").then((module) => ({ default: module.AffiliatePage })),
);
const SignUpPage = lazy(() => import("@/pages/SignUpPage").then((module) => ({ default: module.SignUpPage })));
const LoginPage = lazy(() => import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const CheckEmailPage = lazy(() =>
  import("@/pages/CheckEmailPage").then((module) => ({ default: module.CheckEmailPage })),
);
const AdminLayout = lazy(() =>
  import("@/components/admin/AdminLayout").then((module) => ({ default: module.AdminLayout })),
);
const AdminLeadsPage = lazy(() =>
  import("@/pages/admin/AdminLeadsPage").then((module) => ({ default: module.AdminLeadsPage })),
);
const AdminFaqPage = lazy(() =>
  import("@/pages/admin/AdminFaqPage").then((module) => ({ default: module.AdminFaqPage })),
);
const AdminBlogPage = lazy(() =>
  import("@/pages/admin/AdminBlogPage").then((module) => ({ default: module.AdminBlogPage })),
);
const AdminPricingPage = lazy(() =>
  import("@/pages/admin/AdminPricingPage").then((module) => ({ default: module.AdminPricingPage })),
);
const AdminStaticPagesPage = lazy(() =>
  import("@/pages/admin/AdminStaticPagesPage").then((module) => ({ default: module.AdminStaticPagesPage })),
);

export default function App() {
  const contactModal = useContactModal();

  return (
    // reducedMotion="user" makes every Framer Motion animation in the app -
    // page-transition doors, the modal iris, the hero spring, card lifts -
    // defer to the OS-level "reduce motion" setting automatically. Without
    // this, that preference only strips CSS transitions/animations (see the
    // prefers-reduced-motion block in index.css); Framer Motion's own
    // JS-driven animations run at full strength regardless, which is both a
    // smoothness cost on weaker mobile hardware and an accessibility gap.
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <DoorsProvider>
          <Suspense fallback={<LoadingOverlay />}>
            <Routes>
              <Route path="/" element={<HomePage contactModal={contactModal} />} />
              <Route path="/features/:slug" element={<FeaturePage contactModal={contactModal} />} />
              <Route path="/faq" element={<FaqPage contactModal={contactModal} />} />
              <Route path="/team" element={<TeamPage contactModal={contactModal} />} />
              <Route path="/blog" element={<BlogPage contactModal={contactModal} />} />
              <Route path="/blog/:slug" element={<BlogPostPage contactModal={contactModal} />} />
              <Route path="/privacy" element={<PrivacyPage contactModal={contactModal} />} />
              <Route path="/pricing" element={<PricingPage contactModal={contactModal} />} />
              <Route path="/affiliate" element={<AffiliatePage contactModal={contactModal} />} />
              <Route path="/signup" element={<SignUpPage contactModal={contactModal} />} />
              <Route path="/login" element={<LoginPage contactModal={contactModal} />} />
              <Route path="/check-email" element={<CheckEmailPage contactModal={contactModal} />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Navigate to="leads" replace />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="faq" element={<AdminFaqPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
                <Route path="pricing" element={<AdminPricingPage />} />
                <Route path="pages" element={<AdminStaticPagesPage />} />
              </Route>
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
      </AuthProvider>
    </MotionConfig>
  );
}

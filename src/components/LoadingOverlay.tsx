import { PulseDots } from "@/components/PulseDots";

/** Full-page Suspense fallback for lazy-loaded routes, while their chunk buffers in. */
export function LoadingOverlay() {
  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center">
      <PulseDots />
    </div>
  );
}

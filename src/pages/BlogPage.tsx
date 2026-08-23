import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ClickableCard } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section, SectionIntro } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { getBlogPosts, type BlogPost } from "@/lib/content";

export function BlogPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { navigateWithDoors } = useDoors();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  if (posts === null) return null;

  if (posts.length === 0) {
    return (
      <ComingSoonPage
        title="Blog"
        description="Product notes and updates from the Acctomatic team are coming soon."
        contactModal={contactModal}
      />
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="px-4 pb-16 pt-4 sm:px-6 md:pt-8">
        <SectionIntro label="Blog" title="Product notes and updates." />
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => {
            const path = `/blog/${post.slug}`;
            return (
              <ClickableCard
                key={post.id}
                href={path}
                onClick={(event) => {
                  event.preventDefault();
                  navigateWithDoors(path);
                }}
              >
                <h3 className="text-xl font-semibold tracking-[-0.01em]">{post.title}</h3>
                {post.excerpt && <p className="mt-3 text-muted-foreground">{post.excerpt}</p>}
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ClickableCard>
            );
          })}
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}

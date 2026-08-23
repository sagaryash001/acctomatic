import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { Markdown } from "@/components/Markdown";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { getBlogPostBySlug, type BlogPost } from "@/lib/content";

export function BlogPostPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { slug } = useParams();
  const { navigateWithDoors } = useDoors();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getBlogPostBySlug(slug).then(setPost);
  }, [slug]);

  const goToBlog = (event: React.MouseEvent) => {
    event.preventDefault();
    navigateWithDoors("/blog");
  };

  if (post === undefined) return null;

  // A specific post not existing is a real 404, distinct from the section
  // as a whole having no content yet (that's the ComingSoonPage case).
  if (post === null) return <NotFoundPage contactModal={contactModal} />;

  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="pb-16 pt-4 md:pt-8">
        <a
          href="/blog"
          onClick={goToBlog}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </a>
        <div className="glass-panel overflow-hidden rounded-[2rem] p-8 md:p-12">
          <h1 className="text-4xl leading-[1.1] tracking-[-0.02em] md:text-6xl">{post.title}</h1>
          {post.author_name && <p className="mt-4 text-sm text-muted-foreground">By {post.author_name}</p>}
          <Markdown content={post.body} className="prose prose-sm mt-8 max-w-2xl text-muted-foreground" />
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}

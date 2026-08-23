import { supabase } from "@/lib/supabase";

export interface StaticPage {
  slug: string;
  title: string;
  body: string;
  published: boolean;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  published: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  author_name: string | null;
  published: boolean;
  published_at: string | null;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string | null;
  price_monthly: number | null;
  is_custom_pricing: boolean;
  features: string[];
  cta_label: string;
  highlighted: boolean;
  sort_order: number;
  published: boolean;
}

export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  const { data } = await supabase.from("static_pages").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const { data } = await supabase.from("faq_items").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const { data } = await supabase.from("pricing_plans").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

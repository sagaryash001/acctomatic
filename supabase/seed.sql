-- One-time bootstrap content so /faq, /pricing, /privacy, /affiliate aren't
-- empty on first launch. Ongoing editing moves to the admin UI (Phase 4).
-- NOTE: the privacy policy text is placeholder/template language only - it
-- must be reviewed by counsel before this site goes live for real, it is
-- not a substitute for legal review of Acctomatic's actual data practices.

insert into public.static_pages (slug, title, body, published) values
('privacy', 'Privacy Policy', $$## Privacy Policy

_Last updated: this is placeholder content seeded for launch - replace with your reviewed policy before going live._

Acctomatic ("we", "us") provides document-processing software that connects to the tools you already use - email, cloud storage, chat, and your ERP - to read, verify, and file documents on your behalf.

### What we collect
- Account information you provide (name, work email, company).
- Documents and data you connect us to, solely to provide the service.
- Usage data about how you interact with our product and site.

### How we use it
We use your data to operate, secure, and improve Acctomatic, and to communicate with you about your account. We do not sell your data.

### Security
Every document and field is encrypted at rest and in transit, and access is audited end to end.

### Your choices
You can request a copy of your data or ask us to delete it at any time by contacting us.

### Contact
Questions about this policy can be sent through our contact form.
$$, true),
('affiliate', 'Affiliate Program', $$## Partner with Acctomatic

If you work with finance and operations teams who are still doing manual document work, we'd like to partner with you.

### How it works
Refer a company that signs up for Acctomatic, and you earn a commission on their subscription for as long as they stay a customer.

### Who it's for
Consultants, accounting firms, and software partners who already work alongside the tools we integrate with - email, Drive, Slack, Teams, and ERPs.

Reach out through our contact form to get started.
$$, true);

insert into public.faq_items (question, answer, category, sort_order, published) values
('How does Acctomatic read my documents?', 'Acctomatic connects to the tools you already use - email, Drive, Slack, Teams, and your ERP - and reads every document that arrives, without you changing how your team works.', 'Product', 0, true),
('How accurate is the extraction?', 'Every field is checked against the document itself - evidence, arithmetic, format, and your own rules - before it''s ever trusted. Nothing ships until it''s verified.', 'Product', 1, true),
('What happens when Acctomatic isn''t sure about something?', 'Only genuine exceptions reach your team. Everything Acctomatic can verify with confidence files itself in the background.', 'Product', 2, true),
('Is my data secure?', 'Every document and field is encrypted at rest and in transit, and access is audited end to end.', 'Security', 3, true),
('How do I get started?', 'Start a free trial or book a demo, and we''ll help you connect your first inbox or drive in minutes.', 'Getting Started', 4, true);

insert into public.pricing_plans (name, tagline, price_monthly, is_custom_pricing, features, cta_label, highlighted, sort_order, published) values
('Starter', 'For small teams getting started', 99, false, '["Up to 500 documents / month", "Email + Drive integration", "Standard verification rules", "Email support"]'::jsonb, 'Start Free Trial', false, 0, true),
('Growth', 'For teams scaling document volume', 349, false, '["Up to 5,000 documents / month", "Every integration - email, Drive, Slack, Teams, ERP", "Custom verification rules", "Priority support"]'::jsonb, 'Start Free Trial', true, 1, true),
('Enterprise', 'For high-volume, custom needs', null, true, '["Unlimited document volume", "Dedicated onboarding", "SSO and custom integrations", "Dedicated support"]'::jsonb, 'Talk to Sales', false, 2, true);

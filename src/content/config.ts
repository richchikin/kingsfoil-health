import { defineCollection, z } from 'astro:content';

/**
 * Kingsfoil Health Content Collections
 * Schema matches the CMS content types from kh-content-architecture.md
 */

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    // Core fields
    title: z.string(),
    type: z.enum(['blog', 'announcement', 'case-study', 'report']),
    excerpt: z.string().min(100).max(300),
    publishedDate: z.date(),
    updatedDate: z.date().optional(),

    // Taxonomy
    audienceTags: z.array(z.enum([
      'Business Leaders', 'CFO', 'HR', 'Employee', 'All'
    ])),
    topicTags: z.array(z.enum([
      'Plan Structures', 'Cost Management', 'Employee Experience',
      'Compliance', 'Claims & Data', 'Benefits Strategy',
      'Industry Trends', 'Getting Started'
    ])),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),

    // Learning track integration
    learningTrack: z.enum(['business-case', 'hr-playbook']).optional(),
    trackOrder: z.number().optional(),

    // Gating (for reports and case studies)
    isGated: z.boolean().default(false),
    gateAssetUrl: z.string().url().optional(),

    // Display
    featuredImage: z.string().optional(),
    isFeatured: z.boolean().default(false),

    // Relations
    relatedArticles: z.array(z.string()).optional(),

    // CTA overrides
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),

    // SEO overrides (defaults to title/excerpt if not set)
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { articles };

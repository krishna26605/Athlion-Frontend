import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Dumbbell, ShieldCheck, Activity } from 'lucide-react';
import { JsonLd, getArticleSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  author?: string;
  readTime?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Fallback blog data for pre-rendering / offline fallback
const FALLBACK_BLOGS: Record<string, Blog> = {
  'mastering-compromised-running-functional-fitness': {
    _id: '1',
    title: 'Mastering Compromised Running for Functional Fitness Racing',
    slug: 'mastering-compromised-running-functional-fitness',
    category: 'Athletic Training',
    excerpt: 'Learn proven endurance strategies to maintain running speed immediately after heavy sled pushes, wall ball reps, and burpee broad jumps.',
    content: `Compromised running is the single defining element of modern functional fitness racing. When you step off a 50m heavy sled push or complete 80m of burpee broad jumps, your legs feel heavy, heart rate is spiked, and lactic acid floods your muscles.

## Understanding Compromised Running

In traditional running events, your body operates in a steady aerobic state. However, in an Athlion functional fitness race, running segments immediately follow heavy muscular resistance stations. This transition forces your neuromuscular system to adapt rapidly from anaerobic force output to aerobic movement efficiency.

### Key Training Principles for Compromised Running:

1. **Station-to-Run Transitions:** Practice dropping heavy weights (or finishing sled pushes) and instantly launching into a controlled 400m-800m jog without resting.
2. **Heart Rate Control:** Focus on nasal breathing during the first 100 meters of each running split to settle your respiratory rate.
3. **Leg Fatigue Recovery:** Incorporate targeted leg-quad fatigue workouts like heavy goblet squats combined immediately with treadmill or track sprints.

### Recommended Weekly compromised Running Workout

- **Round 1-4:**
  - 50m Sled Push (Heavy)
  - 500m Run at 80% 5K Pacing
  - 30 Wall Ball Shots
  - 500m Run at 80% 5K Pacing
  - 2 Minutes Rest between rounds

By training your body to execute under extreme muscular fatigue, you will shave minutes off your total finish time in your next Athlion race.`,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    author: 'Athlion Performance Team',
    readTime: '6 min read',
    tags: ['Compromised Running', 'Sled Push', 'Functional Fitness', 'Endurance Training'],
    metaTitle: 'Mastering Compromised Running | Athlion Functional Fitness Guide',
    metaDescription: 'Learn proven endurance strategies for compromised running split efficiency after heavy functional fitness stations.',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  'traditional-mudgar-mace-swings-in-modern-fitness': {
    _id: '2',
    title: 'Why Traditional Indian Mudgar Mace Swings Build Unbreakable Shoulders',
    slug: 'traditional-mudgar-mace-swings-in-modern-fitness',
    category: 'Functional Fitness',
    excerpt: 'Explore how traditional 360° mace rotational mechanics develop core stability, grip strength, and bulletproof shoulder joint mobility.',
    content: `The Mudgar (traditional Indian mace) has been used for centuries by Indian warriors and pehlwans to build terrifying upper-body rotational strength and shoulder endurance.

## Integrating Traditional Strength into Modern Athletic Performance

Athlion proudly incorporates the 360° Mudgar mace swing into its 11 standardized race stations. Unlike static barbell overhead presses, the dynamic pendulum arc of a Mudgar mace engages deep stabilizing muscles in the rotator cuff, lats, and obliques.

### Benfits of Mudgar Training:

- **Bulletproof Rotational Shoulders:** The circular momentum opens the shoulder joint under load, improving mobility and preventing injury.
- **Crushing Grip Strength:** Maintaining control of a weighted lever arm taxes the forearms and fingers far more than standard dumbbells.
- **Core Anti-Rotation:** Your abdominal wall must aggressively contract to prevent the swinging weight from twisting your torso.

Incorporate 100 mace swings into your warm-up routine to experience instantaneous improvements in shoulder health and station endurance!`,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    author: 'Coach Vikram Singh',
    readTime: '4 min read',
    tags: ['Mudgar', 'Mace Swings', 'Shoulder Strength', 'Functional Fitness'],
    metaTitle: 'Traditional Mudgar Mace Swings for Shoulder & Grip Strength | Athlion',
    metaDescription: 'Discover how traditional 360 degree Mudgar mace swings build shoulder mobility, grip strength, and core stability.',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const baseUrl = getApiUrl().endsWith('/') ? getApiUrl() : `${getApiUrl()}/`;
    const res = await fetch(`${baseUrl}blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (err) {
    console.error('Failed to fetch blog from backend, using fallback if available:', err);
  }

  // Fallback check
  return FALLBACK_BLOGS[slug] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | Athlion Functional Fitness',
    };
  }

  const title = blog.metaTitle || `${blog.title} | Athlion Blog`;
  const description = blog.metaDescription || blog.excerpt;
  const url = `https://www.athlion.in/functional-fitness/blog/${blog.slug}`;
  const image = blog.coverImage || '/FINAL-ATH-LOGO.png';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Athlion',
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author || 'Athlion Team'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) {
    notFound();
  }

  const siteUrl = 'https://www.athlion.in';
  const pageUrl = `${siteUrl}/functional-fitness/blog/${blog.slug}`;

  // Format content paragraphs and headers
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl md:text-4xl font-black italic uppercase text-white mt-10 mb-4 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl md:text-2xl font-bold text-[#f82506] mt-6 mb-3 uppercase">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="text-gray-300 text-base md:text-lg leading-relaxed ml-6 list-disc mb-2">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-4" />;
      
      return (
        <p key={idx} className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 font-normal">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <JsonLd
        data={[
          getArticleSchema({
            title: blog.title,
            description: blog.excerpt,
            url: pageUrl,
            image: blog.coverImage,
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            author: blog.author,
          }),
          getBreadcrumbSchema([
            { name: 'Home', url: `${siteUrl}/` },
            { name: 'Functional Fitness', url: `${siteUrl}/functional-fitness` },
            { name: blog.title, url: pageUrl },
          ]),
        ]}
      />

      <article className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/functional-fitness"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#f82506] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Functional Fitness Hub
          </Link>
        </div>

        {/* Article Meta Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-widest">
              {blog.category}
            </span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock size={14} /> {blog.readTime || '5 min read'}
            </span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium border-l-4 border-[#f82506] pl-4 italic">
            {blog.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
            <div className="flex items-center gap-2 font-bold text-white uppercase">
              <div className="w-8 h-8 rounded-full bg-[#f82506]/20 border border-[#f82506]/40 flex items-center justify-center text-[#f82506]">
                <User size={16} />
              </div>
              {blog.author || 'Athlion Performance Team'}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 aspect-video relative shadow-2xl">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Content Body */}
        <div className="glass-card p-6 md:p-12 rounded-3xl border border-white/10 mb-12 space-y-2">
          {renderFormattedContent(blog.content)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-500 mr-2 flex items-center gap-1">
              <Tag size={14} /> Keywords:
            </span>
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Footer */}
        <div className="text-center bg-gradient-to-r from-[#f82506]/20 via-black to-black p-8 rounded-3xl border border-[#f82506]/30">
          <h3 className="text-2xl md:text-3xl font-black italic uppercase mb-3">READY TO PUT TRAINING INTO PRACTICE?</h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            Join thousands of athletes competing in Athlion Functional Fitness races across India.
          </p>
          <Link
            href="/events"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm uppercase font-black italic"
          >
            EXPLORE UPCOMING RACES
          </Link>
        </div>
      </article>
    </div>
  );
}

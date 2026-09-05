import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Activity, Dumbbell, HelpCircle, BookOpen, Clock, Calendar } from 'lucide-react';
import { JsonLd, getFAQSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: "Functional Fitness & Obstacle Course Racing in India | Athlion",
  description: "Discover functional fitness racing in India with Athlion. Complete guide to physical workout stations, 2KM running splits, athletic training programs, and event calendar.",
  alternates: {
    canonical: "https://www.athlion.in/functional-fitness",
  },
  openGraph: {
    title: "Functional Fitness & Obstacle Course Racing in India | Athlion",
    description: "Master functional fitness racing with Athlion. Standardized fitness racing combining 2KM running with 11 physical challenge stations.",
    url: "https://www.athlion.in/functional-fitness",
    siteName: "Athlion",
    type: "article",
    images: [
      {
        url: "/FINAL-ATH-LOGO.png",
        width: 1200,
        height: 630,
        alt: "Athlion Functional Fitness Training India",
      },
    ],
  },
};

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  author?: string;
  readTime?: string;
  createdAt: string;
}

const FALLBACK_ARTICLES: Blog[] = [
  {
    _id: '1',
    title: 'Mastering Compromised Running for Functional Fitness Racing',
    slug: 'mastering-compromised-running-functional-fitness',
    category: 'Athletic Training',
    excerpt: 'Learn proven endurance strategies to maintain running speed immediately after heavy sled pushes, wall ball reps, and burpee broad jumps.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    author: 'Athlion Performance Team',
    readTime: '6 min read',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Why Traditional Indian Mudgar Mace Swings Build Unbreakable Shoulders',
    slug: 'traditional-mudgar-mace-swings-in-modern-fitness',
    category: 'Functional Fitness',
    excerpt: 'Explore how traditional 360° mace rotational mechanics develop core stability, grip strength, and bulletproof shoulder joint mobility.',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    author: 'Coach Vikram Singh',
    readTime: '4 min read',
    createdAt: new Date().toISOString(),
  },
];

const fitnessFaqs = [
  {
    question: "What is functional fitness racing and how does Athlion bring it to India?",
    answer: "Functional fitness racing is a standardized hybrid sports format combining cardiovascular running with physical workout stations. Athlion brings this standardized format to India, featuring a 2KM total run interspersed across 11 challenge stations designed for athletes of all conditioning levels.",
  },
  {
    question: "What physical stations are included in Athlion races?",
    answer: "Athlion's 11 challenge stations include: 2KM Run, Mudgar 360° Mace Swings, 50m Sled Push, Monkey Crawl, Burpee Broad Jumps (80m), Tire Flips, 100m Farmer's Carry, Wall Ball Shots, Low Mud Crawl, 20ft Cargo Net Trap, and the Ice Pool Slide finish.",
  },
  {
    question: "How should beginners train for their first functional fitness event?",
    answer: "Beginners should focus on building an aerobic base with Zone 2 running, combined with functional strength training (sled pushes, farmer carries, wall balls) and compromised running workouts (running immediately after functional exercises).",
  },
  {
    question: "What divisions and categories can I participate in?",
    answer: "Athlion offers Single (Solo Open), Elite (VIP Competition), and partner divisions so both first-time fitness enthusiasts and seasoned endurance athletes can race at their preferred challenge level.",
  },
];

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const baseUrl = getApiUrl().endsWith('/') ? getApiUrl() : `${getApiUrl()}/`;
    const res = await fetch(`${baseUrl}blogs?limit=6`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch blogs for functional fitness hub, using fallbacks:', err);
  }
  return FALLBACK_ARTICLES;
}

export default async function FunctionalFitnessPage() {
  const baseUrl = "https://www.athlion.in";
  const articles = await getPublishedBlogs();

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-black text-white px-4">
      <JsonLd
        data={[
          getFAQSchema(fitnessFaqs),
          getBreadcrumbSchema([
            { name: "Home", url: `${baseUrl}/` },
            { name: "Functional Fitness", url: `${baseUrl}/functional-fitness` },
          ]),
        ]}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header Hero */}
        <header className="mb-12 md:mb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f82506]/10 border border-[#f82506]/30 text-[#f82506] text-xs font-black uppercase tracking-[0.3em] mb-4">
            FUNCTIONAL FITNESS & OBSTACLE COURSE RACING HUB
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            FUNCTIONAL <span className="text-[#f82506]">FITNESS INDIA</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Welcome to India&apos;s definitive resource for functional fitness racing, strength and conditioning, station techniques, and athletic performance preparation.
          </p>
        </header>

        {/* Quick Navigation Hub Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link
            href="/functional-fitness/training"
            className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#f82506] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-[#f82506]/10 rounded-xl w-fit mb-4 text-[#f82506]">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-black italic uppercase mb-2 group-hover:text-[#f82506] transition-colors">
                Athletic Training Program
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Step-by-step guide to aerobic base building, compromised running, and station endurance splits.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#f82506] font-black text-xs uppercase tracking-widest">
              Explore Training Guide <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/functional-fitness/workouts"
            className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-[#f82506] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-[#f82506]/10 rounded-xl w-fit mb-4 text-[#f82506]">
                <Dumbbell size={24} />
              </div>
              <h2 className="text-2xl font-black italic uppercase mb-2 group-hover:text-[#f82506] transition-colors">
                Workouts & 11 Station Standards
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Master all 11 physical challenge stations with detailed exercise techniques and scaled workout routines.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#f82506] font-black text-xs uppercase tracking-widest">
              Explore Workouts & Stations <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* What is Functional Fitness Section */}
        <section className="mb-16 glass-card p-8 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-6 tracking-tight">
            WHAT IS <span className="text-[#f82506]">FUNCTIONAL FITNESS RACING?</span>
          </h2>
          <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed font-normal">
            <p>
              Functional fitness racing is a standardized hybrid competition format designed for athletes of all disciplines. It merges functional strength movements with standardized running segments to test complete physical conditioning.
            </p>
            <p>
              In an Athlion race, athletes run a total distance of <strong>2KM</strong> broken into sections, paired with <strong>11 physical stations</strong> including heavy sled pushes, farmer carries, wall balls, mud crawls, and traditional Indian warrior mudgar mace swings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10 text-center">
            <div>
              <span className="text-3xl md:text-4xl font-black text-[#f82506] block">2KM</span>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Run</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-black text-[#f82506] block">11</span>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Stations</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-black text-[#f82506] block">100%</span>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Standardized</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-black text-[#f82506] block">ALL</span>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Fitness Levels</span>
            </div>
          </div>
        </section>

        {/* 11 Stations Preview Grid */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-8 text-center tracking-tight">
            THE 11 ATHLION <span className="text-[#f82506]">STATIONS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "2km Opening Run", desc: "Sets your heart rate and tests pacing discipline." },
              { num: "02", title: "Mudgar Ritual", desc: "360° traditional Indian mace swings for shoulders & grip." },
              { num: "03", title: "Sled Push", desc: "50m explosive lower-body leg drive on turf." },
              { num: "04", title: "Monkey Crawl", desc: "30m low locomotive movement for core stability." },
              { num: "05", title: "Burpee Broad Jump", desc: "80m of full-body explosive plyometrics." },
              { num: "06", title: "Tire Flip", desc: "10 heavy flips engaging posterior chain." },
              { num: "07", title: "Farmer's Carry", desc: "100m heavy walking carry testing grip & traps." },
              { num: "08", title: "Wall Ball Shots", desc: "30 high-target wall ball repetitions." },
              { num: "09", title: "Low Mud Crawl", desc: "30m military crawl under obstacles." },
              { num: "10", title: "20ft Cargo Net", desc: "Ascent and descent conquer obstacle." },
              { num: "11", title: "Ice Pool Slide", desc: "10m cold wade & immersion finish." },
            ].map((st) => (
              <div key={st.num} className="p-6 bg-zinc-950/60 border border-white/5 rounded-2xl">
                <span className="text-xs font-black text-[#f82506] uppercase tracking-widest block mb-2">Station {st.num}</span>
                <h3 className="text-lg font-black italic uppercase mb-2">{st.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ BLOG & ARTICLES SECTION ═════════ */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#f82506] text-xs font-black uppercase tracking-[0.25em] block mb-2">
                EXPERT INSIGHTS & ATHLETIC GUIDES
              </span>
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight">
                LATEST <span className="text-[#f82506]">ARTICLES & BLOGS</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              In-depth functional fitness guides, station strategies, compromised running protocols, and recovery guides uploaded by Athlion coaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((blog) => (
              <Link
                key={blog._id}
                href={`/functional-fitness/blog/${blog.slug}`}
                className="glass-card rounded-3xl border border-white/10 overflow-hidden hover:border-[#f82506] transition-all group flex flex-col justify-between"
              >
                <div>
                  {blog.coverImage ? (
                    <div className="aspect-[16/9] w-full overflow-hidden relative">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[#f82506] text-[10px] font-black uppercase tracking-widest rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-zinc-900 border-b border-white/10 flex items-center justify-center relative">
                      <BookOpen size={48} className="text-gray-600" />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[#f82506] text-[10px] font-black uppercase tracking-widest rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || '5 min read'}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black italic uppercase text-white group-hover:text-[#f82506] transition-colors mb-3 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 md:px-8 pb-6 pt-0 flex items-center gap-2 text-[#f82506] font-black text-xs uppercase tracking-widest">
                  Read Full Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="mb-16 glass-card p-8 md:p-12 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-[#f82506]" size={28} />
            <h2 className="text-2xl md:text-4xl font-black italic uppercase">FREQUENTLY ASKED QUESTIONS</h2>
          </div>
          <div className="space-y-6">
            {fitnessFaqs.map((faq, idx) => (
              <div key={idx} className="border-b border-white/5 pb-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#f82506]/20 via-black to-black p-8 md:p-12 rounded-3xl border border-[#f82506]/30">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-4">READY TO TEST YOUR LIMITS?</h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-8 uppercase font-bold tracking-wider">
            Explore upcoming Athlion functional fitness events across India and claim your race pass today.
          </p>
          <Link href="/events" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg uppercase font-black italic">
            VIEW UPCOMING RACES <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

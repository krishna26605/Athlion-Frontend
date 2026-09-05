import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.athlion.in/#organization',
  name: 'Athlion',
  legalName: 'Athlion Fitness Entertainment',
  url: 'https://www.athlion.in',
  logo: 'https://www.athlion.in/FINAL-ATH-LOGO.png',
  description: 'India premier fitness racing series combining functional fitness, strength, endurance, and athletic performance.',
  sameAs: [
    'https://www.instagram.com/athlion.in',
    'https://twitter.com/athlion',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9579680332',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
});

export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.athlion.in/#website',
  name: 'Athlion',
  url: 'https://www.athlion.in',
  description: 'India premier functional fitness and athletic performance racing platform.',
  publisher: {
    '@id': 'https://www.athlion.in/#organization',
  },
});

export const getSportsActivityLocationSchema = (locationName = 'Athlion Arena India', city = 'India') => ({
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  '@id': `https://www.athlion.in/#location-${city.toLowerCase().replace(/\s+/g, '-')}`,
  name: `Athlion ${locationName}`,
  url: 'https://www.athlion.in',
  description: 'Official Athlion functional fitness and athletic training venue.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: city,
  },
  priceRange: '₹₹',
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const getArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${article.url}#article`,
  headline: article.title,
  description: article.description,
  url: article.url,
  image: article.image || 'https://www.athlion.in/FINAL-ATH-LOGO.png',
  datePublished: article.datePublished || new Date().toISOString(),
  dateModified: article.dateModified || new Date().toISOString(),
  author: {
    '@type': 'Organization',
    name: article.author || 'Athlion',
    url: 'https://www.athlion.in',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Athlion',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.athlion.in/FINAL-ATH-LOGO.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});

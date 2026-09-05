import { Metadata } from 'next';
import EventDetailClient from './EventDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = 'https://www.athlion.in';

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';
    const res = await fetch(`${apiUrl}events/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const event = data.data;
      if (event) {
        return {
          title: `${event.name} | Athlion Functional Fitness Race`,
          description: event.description || `Register for ${event.name} on ${event.date} at ${event.venue?.address}. 2KM run, 11 stations.`,
          alternates: {
            canonical: `${baseUrl}/events/${id}`,
          },
          openGraph: {
            title: `${event.name} | Athlion Functional Fitness Race`,
            description: event.description || `Register for ${event.name} on ${event.date} at ${event.venue?.address}.`,
            url: `${baseUrl}/events/${id}`,
            siteName: 'Athlion',
            images: [
              {
                url: event.image || '/FINAL-ATH-LOGO.png',
                width: 1200,
                height: 630,
                alt: event.name,
              },
            ],
          },
        };
      }
    }
  } catch (e) {
    console.error('Error generating metadata for event page', e);
  }

  return {
    title: 'Athlion Functional Fitness Event Pass',
    description: 'Register for Athlion fitness racing events across India.',
    alternates: {
      canonical: `${baseUrl}/events/${id}`,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const baseUrl = 'https://www.athlion.in';

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${baseUrl}/events/${id}#event`,
    name: 'Athlion Functional Fitness Race',
    url: `${baseUrl}/events/${id}`,
    organizer: {
      '@type': 'Organization',
      name: 'Athlion',
      url: baseUrl,
    },
  };

  return (
    <>
      <JsonLd data={eventSchema} />
      <EventDetailClient />
    </>
  );
}

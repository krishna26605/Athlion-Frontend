import { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: "Upcoming Functional Fitness & Obstacle Racing Events in India | Athlion",
  description: "Find and register for upcoming Athlion fitness races across India. 2KM runs, 11 physical station challenges, and standardized hybrid fitness competitions.",
  alternates: {
    canonical: "https://www.athlion.in/events",
  },
  openGraph: {
    title: "Upcoming Functional Fitness & Obstacle Racing Events in India | Athlion",
    description: "Find and register for upcoming Athlion fitness races across India. Test strength, endurance, and mental grit.",
    url: "https://www.athlion.in/events",
    siteName: "Athlion",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventsPage() {
  return <EventsClient />;
}

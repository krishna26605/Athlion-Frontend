import { Metadata } from 'next';
import SponsorsClient from './SponsorsClient';

export const metadata: Metadata = {
  title: "Official Partners, Functional Fitness Gyms & Run Clubs | Athlion",
  description: "Explore Athlion's network of certified affiliate gyms, run clubs, and premium fitness sponsors powering functional fitness across India.",
  alternates: {
    canonical: "https://www.athlion.in/sponsors",
  },
  openGraph: {
    title: "Official Partners, Functional Fitness Gyms & Run Clubs | Athlion",
    description: "Explore Athlion's network of certified affiliate gyms, run clubs, and premium sponsors.",
    url: "https://www.athlion.in/sponsors",
    siteName: "Athlion",
    locale: "en_IN",
    type: "website",
  },
};

export default function SponsorsPage() {
  return <SponsorsClient />;
}

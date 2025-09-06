import { Metadata } from 'next';
import About from '@/components/About';

export const metadata: Metadata = {
  title: 'About',
  description: 'About page - Access and manage your content',
};

export default function AboutPage() {
  return <About />;
}
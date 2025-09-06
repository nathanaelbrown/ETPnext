import { Metadata } from 'next';
import MultiPropertyContact from '@/components/MultiPropertyContact';

export const metadata: Metadata = {
  title: 'Multi Property Contact',
  description: 'Multi Property Contact page - Access and manage your content',
};

export default function MultiPropertyContactPage() {
  return <MultiPropertyContact />;
}
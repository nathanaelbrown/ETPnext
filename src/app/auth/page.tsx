import { Metadata } from 'next';
import Auth from '@/components/Auth';

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Auth page - Access and manage your content',
};

export default function AuthPage() {
  return <Auth />;
}
import { Metadata } from 'next';
import AuthCallback from '@/components/AuthCallback';

export const metadata: Metadata = {
  title: 'Auth - Callback',
  description: 'Auth - Callback page - Access and manage your content',
};

export default function AuthCallbackPage() {
  return <AuthCallback />;
}
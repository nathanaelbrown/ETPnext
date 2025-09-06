import { Metadata } from 'next';
import EmailVerification from '@/components/EmailVerification';

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Email Verification page - Access and manage your content',
};

export default function EmailVerificationPage() {
  return <EmailVerification />;
}
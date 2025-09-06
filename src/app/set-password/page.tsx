import { Metadata } from 'next';
import SetPassword from '@/components/SetPassword';

export const metadata: Metadata = {
  title: 'Set Password',
  description: 'Set Password page - Access and manage your content',
};

export default function SetPasswordPage() {
  return <SetPassword />;
}
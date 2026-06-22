import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically redirect the user to the dashboard
  redirect('/dashboard');
}
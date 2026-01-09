import { redirect } from 'next/navigation';

// This page will immediately redirect to the first file in the manual.
// This prevents errors when navigating to the /manual route directly.
export default function ManualIndexPage() {
  redirect('/manual/File_00.0_Intro.md');
}

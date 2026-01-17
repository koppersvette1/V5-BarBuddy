import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { manualFiles } from '@/lib/manual-files';

export default async function ManualPage({ params }: { params: { file: string } }) {
  const slug = params.file;
  const manualItem = manualFiles.find(item => item.slug === slug);

  if (!manualItem) {
    notFound();
  }
    
  const manualDir = path.join(process.cwd(), 'manual', 'Manual');
  const filePath = path.join(manualDir, manualItem.file);
  let content = '';
  const title = manualItem.name;

  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-destructive">Server Error</h1>
          <p className="mt-4">Could not load the manual file: {manualItem.file}</p>
           <p className="mt-2 text-sm text-muted-foreground">This file is listed in the navigation but could not be found on the server.</p>
        </main>
      </div>
    );
  }

  const allFiles = manualFiles;
  const currentIndex = allFiles.findIndex(f => f.slug === slug);
  const prevFile = currentIndex > 0 ? allFiles[currentIndex - 1] : null;
  const nextFile = currentIndex < allFiles.length - 1 ? allFiles[currentIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto p-4 md:p-8">
         <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="prose dark:prose-invert max-w-none prose-h1:font-headline prose-h1:text-primary prose-h2:font-headline prose-h2:text-primary/90 prose-h3:font-headline prose-h3:text-primary/80 prose-a:text-accent prose-strong:text-foreground">
         
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

          <div className="flex justify-between mt-12 border-t pt-4 not-prose">
            {prevFile ? (
              <Link href={`/manual/${prevFile.slug}`}>
                <Button variant="outline">Previous: {prevFile.name}</Button>
              </Link>
            ) : <div />}
            {nextFile ? (
              <Link href={`/manual/${nextFile.slug}`}>
                <Button variant="outline">Next: {nextFile.name}</Button>
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}

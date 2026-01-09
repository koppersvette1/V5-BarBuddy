import { promises as fs } from 'fs';
import path from 'path';
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


// Function to get all markdown files
const getMarkdownFiles = async () => {
  const manualDir = path.join(process.cwd(), 'manual', 'Manual');
  try {
    const filenames = await fs.readdir(manualDir);
    return filenames.filter(filename => filename.endsWith('.md'));
  } catch (error) {
    console.error("Could not read manual directory:", error);
    return [];
  }
};


export default async function ManualPage({ params }: { params: { file: string } }) {
  const decodedFile = params.file ? decodeURIComponent(params.file) : undefined;
  
  if (typeof decodedFile !== 'string') {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-1 container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-destructive">Error</h1>
            <p className="mt-4">Invalid file parameter provided.</p>
          </main>
        </div>
    );
  }
    
  const manualDir = path.join(process.cwd(), 'manual', 'Manual');
  const filePath = path.join(manualDir, decodedFile);
  let content = '';
  let title = decodedFile.replace('.md', '').replace(/File \d+\.\d+ - /, '');

  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-destructive">Error</h1>
          <p className="mt-4">Could not load the manual file: {decodedFile}</p>
        </main>
      </div>
    );
  }

  const allFiles = await getMarkdownFiles();
  const currentIndex = allFiles.findIndex(f => f === decodedFile);
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
              <Link href={`/manual/${encodeURIComponent(prevFile)}`} passHref>
                <Button variant="outline">Previous</Button>
              </Link>
            ) : <div />}
            {nextFile ? (
              <Link href={`/manual/${encodeURIComponent(nextFile)}`} passHref>
                <Button variant="outline">Next</Button>
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}

import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

// This function is needed by Next.js to know which dynamic routes to pre-render
export async function generateStaticParams() {
  const files = await getMarkdownFiles();
  return files.map(file => ({
    file: file,
  }));
}

export default async function ManualPage({ params }: { params: { file: string } }) {
  const manualDir = path.join(process.cwd(), 'manual', 'Manual');
  const filePath = path.join(manualDir, params.file);
  let content = '';
  let title = params.file.replace('.md', '').replace(/File \d+\.\d+ - /, '');

  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold text-destructive">Error</h1>
          <p className="mt-4">Could not load the manual file: {params.file}</p>
        </main>
      </div>
    );
  }

  const allFiles = await getMarkdownFiles();
  const currentIndex = allFiles.findIndex(f => f === params.file);
  const prevFile = currentIndex > 0 ? allFiles[currentIndex - 1] : null;
  const nextFile = currentIndex < allFiles.length - 1 ? allFiles[currentIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
             <h1 className="text-3xl font-bold mb-0">{title}</h1>
            <div className="w-[150px]"/>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

          <div className="flex justify-between mt-12 border-t pt-4">
            {prevFile ? (
              <Link href={`/manual/${prevFile}`} passHref>
                <Button variant="outline">Previous</Button>
              </Link>
            ) : <div />}
            {nextFile ? (
              <Link href={`/manual/${nextFile}`} passHref>
                <Button variant="outline">Next</Button>
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}

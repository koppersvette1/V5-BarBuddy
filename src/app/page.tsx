import { promises as fs } from 'fs';
import path from 'path';
import CocktailSearch from '@/components/cocktail-search';
import type { Cocktail } from '@/lib/types';
import imageData from '@/lib/placeholder-images.json';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default async function Home() {
  const jsonPath = path.join(process.cwd(), 'data', 'cocktails.json');
  let cocktails: Cocktail[] = [];
  try {
    const file = await fs.readFile(jsonPath, 'utf8');
    cocktails = JSON.parse(file);
  } catch (error) {
    console.error("Could not read or parse cocktails.json:", error);
  }

  const { placeholderImages } = imageData;

  const imageMap = placeholderImages.reduce((acc, img) => {
    acc[img.id] = img.imageUrl;
    return acc;
  }, {} as Record<string, string>);

  const cocktailsWithImages = cocktails.map(cocktail => ({
    ...cocktail,
    imageUrl: imageMap[cocktail.image] || `https://picsum.photos/seed/${cocktail.id}/600/400`,
  }));

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 container mx-auto p-4 md:p-8">
        <CocktailSearch cocktails={cocktailsWithImages} />
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>BarBuddy V5: The Triad Cocktail Engine</p>
      </footer>
    </main>
  );
}

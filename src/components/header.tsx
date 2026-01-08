import { Martini } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-6 bg-primary/10 border-b-2 border-primary/20">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center gap-4">
          <Martini className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            BarBuddy V5
          </h1>
          <Martini className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground mt-2">The Triad Cocktail Engine</p>
      </div>
    </header>
  );
}

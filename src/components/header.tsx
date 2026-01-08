import { Martini } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

export default function Header() {
  return (
    <header className="py-6 bg-primary/10 border-b-2 border-primary/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex-1 flex justify-center items-center gap-4 md:gap-4 -ml-7 md:ml-0">
          <Martini className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            BarBuddy V5
          </h1>
          <Martini className="h-8 w-8 text-primary" />
        </div>
        <div className="hidden md:block w-[28px]"></div>
      </div>
      <div className="container mx-auto text-center">
         <p className="text-muted-foreground mt-2">The Triad Cocktail Engine</p>
      </div>
    </header>
  );
}

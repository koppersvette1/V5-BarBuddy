import { Martini } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex justify-center items-center gap-2 md:gap-4 md:ml-0">
        <Martini className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        <h1 className="text-2xl md:text-4xl font-headline font-bold text-primary">
          BarBuddy V5
        </h1>
        <Martini className="h-6 w-6 md:h-8 md:w-8 text-primary" />
      </div>
       <div className="w-[28px] md:hidden"></div>
    </header>
  );
}
import { Martini } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-3 sm:gap-4 border-b bg-background/95 px-3 sm:px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 touch-manipulation">
      <div className="md:hidden">
        <SidebarTrigger className="h-9 w-9 touch-manipulation" />
      </div>
      <div className="flex-1 flex justify-center items-center gap-2 sm:gap-3 md:gap-4 md:ml-0">
        <Martini className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl md:text-4xl font-headline font-bold text-primary leading-tight">
          BarBuddy V5
        </h1>
        <Martini className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
      </div>
       <div className="w-[36px] md:hidden"></div>
    </header>
  );
}
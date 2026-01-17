'use client';

import type { CocktailTriad, Cocktail } from '@/lib/types';
import CocktailCard from './cocktail-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface CocktailTriadCardProps {
  triad: CocktailTriad;
  allCocktails: Cocktail[];
}

export default function CocktailTriadCard({ triad, allCocktails }: CocktailTriadCardProps) {
  const { lead, shadow, junior } = triad;

  return (
    <Card className="overflow-hidden shadow-md sm:shadow-lg border-primary/20 transform transition-transform duration-300 hover:shadow-2xl sm:hover:-translate-y-1">
      <CardHeader className="bg-primary/5 p-3 sm:p-4 md:p-6">
        <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl text-primary flex items-center gap-2 sm:gap-3">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary/80 flex-shrink-0"/>
          <span className="leading-tight">The {lead.name.replace('Classic ', '')} Family</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <CocktailCard cocktail={lead} />
          {shadow && <CocktailCard cocktail={shadow} />}
          {junior && <CocktailCard cocktail={junior} />}
        </div>
      </CardContent>
    </Card>
  );
}

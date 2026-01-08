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
    <Card className="overflow-hidden shadow-lg border-primary/20 transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-headline text-3xl text-primary flex items-center gap-3">
          <Users className="h-7 w-7 text-primary/80"/>
          The {lead.name.replace('Classic ', '')} Family
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CocktailCard cocktail={lead} />
          {shadow && <CocktailCard cocktail={shadow} />}
          {junior && <CocktailCard cocktail={junior} />}
        </div>
      </CardContent>
    </Card>
  );
}

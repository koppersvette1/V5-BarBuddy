'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Cocktail, CocktailTriad } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SlidersHorizontal, ChevronDown, ChevronUp, Search } from 'lucide-react';
import CocktailTriadCard from './cocktail-triad-card';

// Helper to extract the main ingredient name (e.g., "2 oz Tequila" -> "Tequila")
const getIngredientName = (ingredient: string): string => {
  return ingredient
    .replace(/^\d+(\/\d+)?(\.\d+)?\s*(oz|ml|cl|part|parts|dash|dashes|splash|splashes|to|taste|tsp|tbsp|cup|cups)?\s*/i, '')
    .trim();
};

export default function CocktailSearch({ cocktails }: { cocktails: Cocktail[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const allIngredients = useMemo(() => {
    const ingredientsSet = new Set<string>();
    cocktails.forEach(cocktail => {
      cocktail.ingredients.forEach(ing => {
        const name = getIngredientName(ing);
        if (name) ingredientsSet.add(name);
      });
    });
    return Array.from(ingredientsSet).sort();
  }, [cocktails]);

  const handleInventoryChange = (ingredient: string) => {
    setInventory(prev =>
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const filteredTriads = useMemo((): CocktailTriad[] => {
    const leadCocktails = cocktails.filter(cocktail => {
      if (cocktail.type !== 'Lead') return false;

      const searchTermMatch =
        searchTerm === '' ||
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchTermMatch) return false;

      if (inventory.length > 0) {
        const cocktailIngredients = cocktail.ingredients.map(getIngredientName);
        const hasAllIngredients = cocktailIngredients.every(ing =>
          inventory.includes(ing)
        );
        if (!hasAllIngredients) return false;
      }
      
      return true;
    });

    return leadCocktails.map(lead => {
      const shadow = cocktails.find(c => c.id === lead.related.shadow);
      const junior = cocktails.find(c => c.id === lead.related.junior);
      return { lead, shadow, junior };
    });
  }, [searchTerm, inventory, cocktails]);

  if (!hydrated) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-8">
      <div className="p-4 md:p-6 border-2 border-dashed border-primary/20 rounded-lg bg-card shadow-sm">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a cocktail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-base md:text-lg pl-10 h-12"
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="mt-4 w-full justify-center gap-2 text-primary hover:text-primary hover:bg-primary/10">
              <SlidersHorizontal className="h-4 w-4" />
              Filter by Your Inventory ({inventory.length} selected)
              {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 p-4 border rounded-md bg-background max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allIngredients.map(ingredient => (
                  <div key={ingredient} className="flex items-center space-x-2">
                    <Checkbox
                      id={ingredient}
                      checked={inventory.includes(ingredient)}
                      onCheckedChange={() => handleInventoryChange(ingredient)}
                      className="border-primary data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={ingredient} className="cursor-pointer">{ingredient}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        {filteredTriads.length > 0 ? (
          <div className="grid gap-8">
            {filteredTriads.map(triad => (
              <CocktailTriadCard key={triad.lead.id} triad={triad} allCocktails={cocktails}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-card rounded-lg shadow-sm">
            <h3 className="font-headline text-2xl text-primary">No Cocktails Found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search term or inventory filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

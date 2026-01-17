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
  // More robust regex to handle various formats
  const match = ingredient.match(
    /^(?:\d+(?:\/\d+)?(?:\.\d+)?\s*(?:oz|ml|cl|part|parts|dash|dashes|splash|splashes|to|taste|tsp|tbsp|cup|cups)?\s*)?(.*)/i
  );
  let name = match ? match[1].trim() : ingredient.trim();
  // Further clean up by removing text in parentheses, e.g., (Bourbon for sweet, Rye for spicy)
  name = name.replace(/\s*\(.*\)/, '').trim();
  
  // Create a mapping for base spirits that might have variations in the text
  const baseSpirits: { [key: string]: string[] } = {
    'Whiskey': ['Whiskey', 'Bourbon', 'Rye', 'Scotch'],
    'Gin': ['Gin'],
    'Tequila': ['Tequila', 'Mezcal'],
    'Vodka': ['Vodka'],
    'Rum': ['Rum'],
    'Brandy': ['Cognac', 'Brandy'],
    'Pisco': ['Pisco'],
    'Campari': ['Campari'],
    'Aperol': ['Aperol'],
    'Amaretto': ['Amaretto'],
    'Lillet Blanc': ['Lillet'],
    'Peychaud’s Bitters': ['Peychaud’s'],
    'Angostura Bitters': ['Angostura'],
    'Prosecco': ['Prosecco'],
    'Champagne': ['Champagne'],
  };

  for (const base in baseSpirits) {
    if (baseSpirits[base].some(variant => name.toLowerCase().includes(variant.toLowerCase()))) {
      return base;
    }
  }

  // Handle simple cases
  const firstWord = name.split(' ')[0];
  if (['Lillet', 'Peychaud’s', 'Angostura', 'Prosecco', 'Champagne'].includes(firstWord)) {
    return firstWord;
  }
  
  return name;
};


export default function CocktailSearch({ cocktails }: { cocktails: Cocktail[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
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
        if (name && name.length > 1) ingredientsSet.add(name); // Ensure name is not empty
      });
    });
    return Array.from(ingredientsSet).sort((a, b) => a.localeCompare(b));
  }, [cocktails]);

  const filteredIngredients = useMemo(() => {
    if (ingredientSearch === '') return allIngredients;
    return allIngredients.filter(ingredient =>
      ingredient.toLowerCase().includes(ingredientSearch.toLowerCase())
    );
  }, [allIngredients, ingredientSearch]);

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
        const cocktailIngredients = new Set(cocktail.ingredients.map(getIngredientName));
        const hasAllInventoryItems = inventory.every(item => 
            Array.from(cocktailIngredients).some(cocktailIng => cocktailIng.toLowerCase().includes(item.toLowerCase()))
        );
        if (!hasAllInventoryItems) return false;
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
            <div className="mt-4 p-4 border rounded-md bg-background">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search ingredients..."
                  value={ingredientSearch}
                  onChange={e => setIngredientSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredIngredients.map(ingredient => (
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

'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Cocktail } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Wand2, Loader, Flame, Sprout, Baby } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getProTips, type ProTipsOutput } from '@/ai/flows/pro-tips';

interface CocktailCardProps {
  cocktail: Cocktail;
}

export default function CocktailCard({ cocktail }: CocktailCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [externalData, setExternalData] = useState<ProTipsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchExternal = () => {
    setIsDialogOpen(true);
    setError(null);
    setExternalData(null);
    startTransition(async () => {
      try {
        const result = await getProTips({
          name: cocktail.name,
          ingredients: cocktail.ingredients,
          instructions: cocktail.instructions,
          baseSpirit: cocktail.baseSpirit,
        });
        setExternalData(result);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'An unexpected error occurred.');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not fetch AI pro tips.",
        });
      }
    });
  };

  const getBadgeInfo = (type: Cocktail['type']) => {
    switch (type) {
      case 'Lead':
        return { variant: 'default' as const, className: 'bg-primary text-primary-foreground', icon: <Flame className="h-3 w-3 mr-1" /> };
      case 'Shadow':
        return { variant: 'secondary' as const, className: 'bg-secondary text-secondary-foreground', icon: <Sprout className="h-3 w-3 mr-1" /> };
      case 'Junior':
        return { variant: 'outline' as const, className: 'border-green-500 text-green-600', icon: <Baby className="h-3 w-3 mr-1" /> };
      default:
        return { variant: 'outline' as const, icon: null };
    }
  };

  const badgeInfo = getBadgeInfo(cocktail.type);

  return (
    <>
      <Card className="flex flex-col h-full bg-card hover:bg-card/90 transition-colors duration-200 group">
        <CardHeader>
          <div className="relative aspect-[3/2] w-full mb-4">
            <Image
              src={cocktail.imageUrl || ''}
              alt={cocktail.name}
              fill
              className="rounded-md object-cover"
              data-ai-hint="cocktail drink"
            />
          </div>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-2xl">{cocktail.name}</CardTitle>
            <Badge variant={badgeInfo.variant} className={badgeInfo.className}>
               {badgeInfo.icon}
               <span>{cocktail.type}</span>
            </Badge>
          </div>
          <CardDescription>{cocktail.baseSpirit !== 'N/A' ? `Base: ${cocktail.baseSpirit}` : 'Non-alcoholic'}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Ingredients</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {cocktail.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Instructions</h4>
            <p className="text-sm">{cocktail.instructions}</p>
          </div>
        </CardContent>
        <CardFooter>
          {cocktail.type === 'Lead' && (
            <Button
              onClick={handleFetchExternal}
              disabled={isPending}
              className="w-full bg-accent/90 text-accent-foreground hover:bg-accent hover:shadow-md transition-all"
            >
              {isPending && isDialogOpen ? <Loader className="animate-spin" /> : <Wand2 />}
              <span>Get Pro Tips</span>
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">{cocktail.name} - Pro Tips</DialogTitle>
            <DialogDescription>AI-enhanced recipe analysis.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isPending && (
              <div className="flex justify-center items-center gap-2 text-muted-foreground">
                <Loader className="animate-spin h-5 w-5" />
                <span>Augmenting recipe with AI...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Failed to Fetch Tips</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {externalData && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Standardized Ingredients</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {externalData.cleanedIngredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                {externalData.smokeRecommendation && externalData.smokeRecommendation !== 'N/A' && (
                  <div>
                     <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Flame className="h-4 w-4"/>
                      Smoke Recommendation
                    </h4>
                    <p className="text-sm font-semibold text-primary bg-primary/10 p-3 rounded-md">
                      {externalData.smokeRecommendation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

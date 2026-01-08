
export interface Cocktail {
  id: string;
  name: string;
  type: 'Lead' | 'Shadow' | 'Junior';
  baseSpirit: string;
  ingredients: string[];
  instructions: string;
  related: {
    shadow?: string;
    junior?: string;
    lead?: string;
  };
  image: string;
  imageUrl?: string;
}

export interface CocktailTriad {
  lead: Cocktail;
  shadow?: Cocktail;
  junior?: Cocktail;
}

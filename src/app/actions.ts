'use server';

import { externalDataCleaningAndAugmentation } from '@/ai/flows/external-data-cleaning-augmentation';

// This is a mock response from TheCocktailDB API for a "Margarita".
// In a real application, you would use `fetch` to call the actual API.
const MOCK_COCKTAIL_DB_RESPONSE = {
  drinks: [
    {
      strDrink: 'Margarita',
      strInstructions: 'Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass.',
      strIngredient1: 'Tequila',
      strIngredient2: 'Triple sec',
      strIngredient3: 'Lime juice',
      strIngredient4: 'Salt',
      strMeasure1: '1 1/2 oz ',
      strMeasure2: '1/2 oz ',
      strMeasure3: '1 oz ',
      strMeasure4: null,
    },
  ],
};

// Mock response for a drink with "Sour Mix" to test replacement logic.
const MOCK_SOUR_MIX_RESPONSE = {
  drinks: [
    {
      strDrink: 'Whiskey Sour',
      strInstructions: 'Shake with ice. Strain into chilled glass.',
      strIngredient1: 'Whiskey',
      strIngredient2: 'Sour Mix',
      strIngredient3: 'Cherry',
      strMeasure1: '2 oz ',
      strMeasure2: '1 part',
      strMeasure3: '1',
    }
  ]
}

export async function fetchAndCleanExternalRecipe(drinkName: string, baseSpirit: string) {
  try {
    // Determine which mock response to use.
    const mockResponse = drinkName.toLowerCase().includes('sour') 
      ? MOCK_SOUR_MIX_RESPONSE
      : MOCK_COCKTAIL_DB_RESPONSE;

    const drink = mockResponse.drinks[0];

    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}` as keyof typeof drink];
      const measure = drink[`strMeasure${i}` as keyof typeof drink];
      if (ingredient) {
        ingredients.push(`${measure || ''}${ingredient}`.trim());
      }
    }

    const input = {
      ingredients,
      instructions: drink.strInstructions,
      baseSpirit,
    };

    const cleanedData = await externalDataCleaningAndAugmentation(input);

    return { data: cleanedData };
  } catch (error) {
    console.error('Error in GenAI flow:', error);
    return { error: 'Failed to process recipe with AI. Please try again later.' };
  }
}

'use server';

/**
 * @fileOverview Cleans and augments external cocktail data from TheCocktailDB API.
 *
 * - externalDataCleaningAndAugmentation - A function that cleans external cocktail data, standardizing measurements to ounces, replacing 'Sour Mix' with 'Lemon Juice + Simple Syrup', and suggesting smoke pairings based on the base liquor.
 * - ExternalDataCleaningAndAugmentationInput - The input type for the externalDataCleaningAndAugmentation function.
 * - ExternalDataCleaningAndAugmentationOutput - The return type for the externalDataCleaningAndAugmentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExternalDataCleaningAndAugmentationInputSchema = z.object({
  ingredients: z.array(z.string()).describe('The list of ingredients from TheCocktailDB API.'),
  instructions: z.string().describe('The preparation instructions from TheCocktailDB API.'),
  baseSpirit: z.string().describe('The base spirit of the cocktail (e.g., Tequila, Vodka).'),
});
export type ExternalDataCleaningAndAugmentationInput = z.infer<typeof ExternalDataCleaningAndAugmentationInputSchema>;

const ExternalDataCleaningAndAugmentationOutputSchema = z.object({
  cleanedIngredients: z.array(z.string()).describe('The cleaned list of ingredients with measurements in ounces and Sour Mix replaced.'),
  smokeRecommendation: z.string().optional().describe('A smoke pairing recommendation based on the base spirit.'),
});
export type ExternalDataCleaningAndAugmentationOutput = z.infer<typeof ExternalDataCleaningAndAugmentationOutputSchema>;

export async function externalDataCleaningAndAugmentation(
  input: ExternalDataCleaningAndAugmentationInput
): Promise<ExternalDataCleaningAndAugmentationOutput> {
  return externalDataCleaningAndAugmentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'externalDataCleaningAndAugmentationPrompt',
  input: {
    schema: ExternalDataCleaningAndAugmentationInputSchema,
  },
  output: {
    schema: ExternalDataCleaningAndAugmentationOutputSchema,
  },
  prompt: `You are a world-class bartender, known for your precision and flavor pairings.

You are given a list of ingredients and instructions from TheCocktailDB API, along with the base spirit of the cocktail.

Your tasks are as follows:

1.  **Standardize Measurements:** Convert all measurements in the ingredient list to ounces (oz). If a measurement is not explicitly provided, assume a reasonable quantity (e.g., a splash is 0.5 oz, a dash is 0.125 oz). If there are no quantities, use a modifier like "Generous" before the ingredient.
2.  **Replace Sour Mix:** If "Sour Mix" is present in the ingredient list, replace it with "1 oz Lemon Juice + 1 oz Simple Syrup".
3.  **Smoke Recommendation:** Based on the base spirit, suggest a smoke pairing to enhance the cocktail. Use the following guidelines:
    *   Tequila: Mesquite
    *   Whiskey: Hickory
    *   Rum: Oak
    *   Vodka: Applewood
    *   Gin: Alder
    *   If the base spirit is none of the above, respond with 'No Smoke Pairing Available'

Here's the information:

Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}
Base Spirit: {{{baseSpirit}}}

Ensure your output is accurate, consistent, and easy to understand.

Output the cleaned ingredient list and smoke recommendation (if applicable).`,
});

const externalDataCleaningAndAugmentationFlow = ai.defineFlow(
  {
    name: 'externalDataCleaningAndAugmentationFlow',
    inputSchema: ExternalDataCleaningAndAugmentationInputSchema,
    outputSchema: ExternalDataCleaningAndAugmentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

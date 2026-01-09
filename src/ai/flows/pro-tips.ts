'use server';
/**
 * @fileOverview An AI flow to provide "Pro Tips" for a given cocktail recipe.
 *
 * - getProTips - A function that takes cocktail details and returns AI-generated tips.
 * - ProTipsInput - The input type for the getProTips function.
 * - ProTipsOutput - The return type for the getProTips function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProTipsInputSchema = z.object({
  name: z.string().describe('The name of the cocktail.'),
  ingredients: z.array(z.string()).describe('The list of ingredients.'),
  instructions: z.string().describe('The preparation instructions.'),
  baseSpirit: z.string().describe('The base spirit of the cocktail.'),
});
export type ProTipsInput = z.infer<typeof ProTipsInputSchema>;

const ProTipsOutputSchema = z.object({
  cleanedIngredients: z
    .array(z.string())
    .describe('A cleaned-up and standardized list of the ingredients provided.'),
  smokeRecommendation: z
    .string()
    .describe(
      'A recommendation for a wood smoke pairing, including the wood type and a brief justification. If no smoke pairing is suitable, this should be "N/A".'
    ),
});
export type ProTipsOutput = z.infer<typeof ProTipsOutputSchema>;

export async function getProTips(input: ProTipsInput): Promise<ProTipsOutput> {
  return proTipsFlow(input);
}

const proTipsPrompt = ai.definePrompt({
  name: 'proTipsPrompt',
  input: { schema: ProTipsInputSchema },
  output: { schema: ProTipsOutputSchema },
  prompt: `You are BarBuddy V5, a master mixologist and flavor architect.
Your task is to analyze the provided cocktail recipe and generate "Pro Tips" for it.

Cocktail Name: {{name}}
Base Spirit: {{baseSpirit}}
Ingredients:
{{#each ingredients}}- {{this}}
{{/each}}
Instructions: {{instructions}}

Based on the official BarBuddy V5 Manual, provide the following:

1.  **cleanedIngredients**: Review the ingredients list. Standardize the format and measurements. For example, "0.25 oz Demerara Syrup (or 1 sugar cube + 3 dashes water)" should be cleaned to "0.25 oz Demerara Syrup".

2.  **smokeRecommendation**: Referencing "File 02.0 - Wood Library Complete.md" and "File 03.0 - Quick Reference Chart - All 50 Classic Cocktails.md", determine the best wood smoke pairing for this cocktail. Your recommendation should be a single, concise sentence, like "Cherry wood smoke for 8-10 seconds will complement the bourbon's caramel notes." If the manual explicitly says the cocktail is NOT smoke compatible (e.g., it contains mint or is a delicate spritz), you MUST return "N/A".`,
});

const proTipsFlow = ai.defineFlow(
  {
    name: 'proTipsFlow',
    inputSchema: ProTipsInputSchema,
    outputSchema: ProTipsOutputSchema,
  },
  async (input) => {
    const { output } = await proTipsPrompt(input);
    if (!output) {
        throw new Error('The AI model did not return any output.');
    }
    return output;
  }
);

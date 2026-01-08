# **App Name**: BarBuddy V5: The Triad Cocktail Engine

## Core Features:

- Markdown Manual Ingestion: Recursively scans the 'manual/' folder, parses Markdown files to extract recipes.
- Cocktail JSON Generation: Generates a 'data/cocktails.json' file that stores recipe information and links related drinks (Lead, Shadow, Junior).
- Fuzzy Search Engine: Fuzzy matches the user query against the drink names in 'cocktails.json'.
- Inventory-Based Filtering: Filters search results based on the user-provided inventory list.
- Triad Recipe Object: Returns a Triad Object (Lead + Shadow + Junior recipes) that matches search parameters.
- External Recipe Fetch: Fetches data from TheCocktailDB API based on the user-selected drink.
- External Data Cleaning Tool: Transforms measurements from the CocktailDB API to ounces. Replaces 'Sour Mix' with 'Lemon Juice + Simple Syrup', then it offers Smoke Pairings when applicable based on the base liquor.

## Style Guidelines:

- Primary color: Deep burgundy (#800020) for a sophisticated, cocktail lounge feel.
- Background color: Off-white (#F5F5DC) provides contrast while evoking a classic cocktail recipe card.
- Accent color: Gold (#FFD700) is used sparingly to highlight important elements like search results.
- Headline font: 'Playfair', serif, for an elegant, fashionable, high-end feel. Body font: 'PT Sans', sans-serif.
- Use elegant line icons for ingredients and cocktail types.
- Clean, minimalist layout to emphasize recipe details and images.
- Subtle transitions and animations on search results and recipe display.
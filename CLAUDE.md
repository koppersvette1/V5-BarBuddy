# CLAUDE.md - AI Assistant Guide for BarBuddy V5

## Project Overview

**BarBuddy V5: The Triad Cocktail Engine** is a full-stack web application that serves as an interactive cocktail reference guide with AI-powered recommendations. The application uses a unique "Triad" system where cocktails are grouped into families:

- **Lead**: Classic alcoholic version (e.g., Old Fashioned)
- **Shadow**: Non-alcoholic adult version (e.g., The New Fashioned)
- **Junior**: Kid-friendly version (e.g., Apple on the Rocks)

**Key Value Propositions:**
- Fuzzy search engine for finding cocktails by name
- Inventory-based filtering (filter by available ingredients)
- AI-powered "Pro Tips" using Google Gemini for personalized recommendations
- Comprehensive manual with 21+ markdown reference files
- Responsive design with elegant, cocktail-lounge aesthetic

---

## Technology Stack

### Core Framework
- **Next.js 16.0.10** with App Router (React 19.2.1)
- **TypeScript 5** in strict mode
- **Turbopack** for development builds

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first styling
- **shadcn/ui** - Component library built on Radix UI primitives
- **Lucide React** - Icon library
- **Fonts**:
  - Headlines: `Playfair Display` (serif, elegant)
  - Body: `PT Sans` (sans-serif)

### AI Integration
- **Firebase Genkit 1.20.0** - AI orchestration framework
- **Google Gemini 2.5 Flash** - LLM for generating pro tips
- **Zod** - Schema validation for AI inputs/outputs

### Form & Data Management
- **React Hook Form** with **Zod** validation
- **React Markdown** with remark-gfm for rendering manual files

### Deployment
- **Firebase App Hosting** (configured in `apphosting.yaml`)
- Runs on port **9002** (development)

---

## Codebase Structure

```
/home/user/V5-BarBuddy/
├── data/
│   └── cocktails.json              # Main cocktail database (~50 cocktails)
├── docs/
│   └── blueprint.md                # App design specifications
├── manual/
│   ├── brain/
│   │   └── MASTER_BRAIN_V5.md     # AI knowledge base
│   └── Manual/                     # 21+ markdown reference files
│       ├── File 00.0 - Intro
│       ├── File 01.0 - Tools, Techniques & Ingredients
│       ├── File 02.0 - Wood Library Complete
│       ├── File 02.1 - Garnish Library Complete
│       ├── File 03.0 - Quick Reference Chart - All 50 Classic Cocktails
│       ├── File 03.1-03.5 - Recipes (1-50)
│       ├── File 04.0 - Adult NA Mocktails Master File
│       ├── File 05.0 - Kid-Friendly Mocktails Master File
│       ├── File 06.0 - Smoker Devices Guide Complete
│       ├── File 07.0 - Smoking Techniques Master Guide
│       ├── File 08.0 - Spirit Substitution Guide
│       ├── File 09.0 - Glassware Guide Complete
│       ├── File 10.0 - Ice Types Guide Complete
│       ├── File 11.0 - Food Pairing Complete
│       ├── File 12.0 - Bitters & Tinctures Guide Complete
│       ├── File 13.0 - Syrups & Sweeteners Guide Complete
│       ├── File 14.0 - Advanced Techniques Complete
│       ├── File 15.0 - Troubleshooting Complete
│       ├── File 16.0 - Bar Tools Complete
│       ├── File 17.0 - Cocktail Categories Complete
│       ├── File 18.0 - Taste Profile Guide Complete
│       ├── File 19.0 - Safety Guide Complete
│       ├── File 20.0 - Quick Reference Card Complete
│       └── File 21.0 - Stocking & Shopping Guide
├── src/
│   ├── ai/
│   │   ├── genkit.ts               # Genkit AI configuration
│   │   ├── dev.ts                  # Genkit dev server entry point
│   │   └── flows/
│   │       └── pro-tips.ts         # AI flow for cocktail tips
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout with sidebar
│   │   ├── page.tsx                # Home page (cocktail search)
│   │   ├── globals.css             # Global styles & CSS variables
│   │   └── manual/                 # Manual documentation routes
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── [file]/page.tsx     # Dynamic route for manual files
│   ├── components/
│   │   ├── app-sidebar.tsx         # Main navigation sidebar
│   │   ├── cocktail-card.tsx       # Individual cocktail display
│   │   ├── cocktail-search.tsx     # Main search/filter interface
│   │   ├── cocktail-triad-card.tsx # Triad family display
│   │   ├── header.tsx              # Page header
│   │   └── ui/                     # shadcn/ui components (40+ files)
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile detection hook
│   │   └── use-toast.ts            # Toast notification hook
│   └── lib/
│       ├── types.ts                # TypeScript type definitions
│       ├── utils.ts                # Utility functions (cn, etc.)
│       └── placeholder-images.json # Image mapping data
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── next.config.ts                  # Next.js configuration
├── components.json                 # shadcn/ui configuration
├── postcss.config.mjs              # PostCSS configuration
└── apphosting.yaml                 # Firebase App Hosting config
```

---

## Data Models & Types

### Core Types (`src/lib/types.ts`)

```typescript
export interface Cocktail {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  type: 'Lead' | 'Shadow' | 'Junior';  // Triad type
  baseSpirit: string;            // Primary alcohol (or "None")
  ingredients: string[];         // List of ingredients with measurements
  instructions: string;          // Preparation steps
  related: {                     // Links to related cocktails
    shadow?: string;
    junior?: string;
    lead?: string;
  };
  image: string;                 // Placeholder image identifier
  imageUrl?: string;             // Actual image URL (mapped from placeholder)
}

export interface CocktailTriad {
  lead: Cocktail;                // Main alcoholic version
  shadow?: Cocktail;             // Non-alcoholic adult version
  junior?: Cocktail;             // Kid-friendly version
}
```

### AI Flow Types (`src/ai/flows/pro-tips.ts`)

```typescript
export interface ProTipsInput {
  name: string;
  ingredients: string[];
  instructions: string;
  baseSpirit: string;
}

export interface ProTipsOutput {
  cleanedIngredients: string[];     // Standardized ingredient list
  smokeRecommendation: string;      // Wood smoke pairing (or "N/A")
}
```

---

## Component Architecture

### Page Components

**`src/app/page.tsx`** (Home Page)
- Server component (RSC)
- Loads `data/cocktails.json`
- Maps placeholder images from `src/lib/placeholder-images.json`
- Renders `<CocktailSearch />` component

**`src/app/manual/[file]/page.tsx`** (Dynamic Manual Pages)
- Loads markdown files from `manual/Manual/` directory
- Renders with `<ReactMarkdown>` component

### Feature Components

**`src/components/cocktail-search.tsx`**
- **Client component** (`'use client'`)
- Implements fuzzy search across cocktail names
- Inventory-based filtering with checkboxes
- Collapsible filter UI
- Ingredient name parsing and normalization
- Groups results into Triads

**`src/components/cocktail-triad-card.tsx`**
- Displays a family of related cocktails (Lead/Shadow/Junior)
- Card-based layout with hover effects
- Responsive design

**`src/components/cocktail-card.tsx`**
- Individual cocktail display
- Shows ingredients, instructions, image
- **"Get Pro Tips" button** triggers AI flow
- Likely uses server actions to call `getProTips()`

**`src/components/app-sidebar.tsx`**
- Navigation sidebar with collapsible sections
- Links to home and 21+ manual pages
- Accordion-based menu structure
- Uses shadcn/ui `Sidebar` components

### AI Components

**`src/ai/genkit.ts`**
- Configures Genkit with Google AI plugin
- Initializes Gemini 2.5 Flash model
- Exports `ai` instance for use in flows

**`src/ai/flows/pro-tips.ts`**
- Server-side AI flow (`'use server'`)
- Defines `proTipsFlow` using Genkit
- Uses structured output with Zod schemas
- References manual files (File 02.0, File 03.0) in prompt
- Returns cleaned ingredients + smoke pairing recommendation

---

## Development Workflows

### Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 9002)
npm run dev

# Start Genkit development UI
npm run genkit:dev

# Watch mode for Genkit (auto-reload)
npm run genkit:watch
```

### Available Scripts

```json
{
  "dev": "next dev --turbopack -p 9002",
  "build": "NODE_ENV=production next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
  "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts"
}
```

### Git Workflow

**Current Branch**: `claude/add-claude-documentation-BEIA3`

**Branch Naming Convention**:
- All Claude Code branches start with `claude/` prefix
- Must end with matching session ID
- Example: `claude/add-feature-name-ABC123`

**Push Requirements**:
- Always use: `git push -u origin <branch-name>`
- CRITICAL: Branch must match `claude/*-<SESSION_ID>` pattern
- Push failures (403) indicate branch name mismatch
- Retry network failures up to 4 times with exponential backoff (2s, 4s, 8s, 16s)

### Common Development Tasks

#### Adding a New Cocktail
1. Edit `data/cocktails.json`
2. Follow the `Cocktail` interface structure
3. Link related cocktails via `related` field
4. Add placeholder image mapping to `src/lib/placeholder-images.json`

#### Modifying the Manual
1. Edit files in `manual/Manual/`
2. Use standard markdown formatting
3. Files are automatically loaded by `app/manual/[file]/page.tsx`
4. AI flows reference these files for context

#### Adding a New Component
1. Create in `src/components/` directory
2. Use TypeScript and proper type definitions
3. Follow shadcn/ui patterns for UI components
4. Server components by default, add `'use client'` only when needed
5. Use Tailwind CSS for styling

#### Working with AI Flows
1. Define flows in `src/ai/flows/`
2. Always use `'use server'` directive for server actions
3. Use Zod schemas for input/output validation
4. Reference manual files in prompts for context
5. Test flows using Genkit Dev UI (`npm run genkit:dev`)

---

## Key Conventions

### Code Style

**TypeScript**
- Strict mode enabled
- Always define types for props, returns, and complex objects
- Use interfaces for data models
- Use type aliases for unions and utilities

**React Components**
- Server Components by default (Next.js 13+ App Router)
- Only use `'use client'` when necessary:
  - Event handlers (onClick, onChange, etc.)
  - Hooks (useState, useEffect, etc.)
  - Browser APIs
- Prefer composition over prop drilling
- Keep components focused and single-purpose

**Naming Conventions**
- Components: PascalCase (`CocktailCard.tsx`)
- Files: kebab-case (`cocktail-search.tsx`)
- Types/Interfaces: PascalCase (`Cocktail`, `ProTipsInput`)
- Functions: camelCase (`getProTips`, `cleanIngredients`)
- Constants: UPPER_SNAKE_CASE for true constants

### Import Patterns

```typescript
// Always use path aliases
import { Cocktail } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getProTips } from '@/ai/flows/pro-tips';

// NOT: import { Cocktail } from '../../lib/types';
```

### Styling Guidelines

**Color System** (from `docs/blueprint.md`):
- Primary: Deep burgundy (`#800020`)
- Background: Off-white (`#F5F5DC`)
- Accent: Gold (`#FFD700`)

**Tailwind Classes**:
```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "variant-classes"
)} />
```

**Typography**:
- Headlines: Use `font-headline` class (Playfair Display)
- Body text: Default `font-body` class (PT Sans)
- Maintain elegant, high-end aesthetic

### File Organization

**Components**:
- UI primitives: `src/components/ui/` (shadcn/ui)
- Feature components: `src/components/` (root level)
- One component per file

**Types**:
- Shared types: `src/lib/types.ts`
- Component-specific types: Define in component file or co-located `.types.ts`

**AI Flows**:
- Each flow in separate file: `src/ai/flows/flow-name.ts`
- Export both the function and types
- Always use server actions (`'use server'`)

---

## AI Integration Details

### Genkit Configuration

**Location**: `src/ai/genkit.ts`

The AI instance is configured with:
- Google AI plugin
- Gemini 2.5 Flash model
- Vertex AI support (if configured)

### Pro Tips Flow

**Location**: `src/ai/flows/pro-tips.ts`

**Purpose**: Generate AI-powered recommendations for cocktails

**Input**:
```typescript
{
  name: string;
  ingredients: string[];
  instructions: string;
  baseSpirit: string;
}
```

**Output**:
```typescript
{
  cleanedIngredients: string[];
  smokeRecommendation: string;  // "N/A" if not suitable
}
```

**How It Works**:
1. Accepts cocktail details as input
2. Uses structured output with Zod schemas
3. References manual files (File 02.0 - Wood Library, File 03.0 - Quick Reference)
4. Returns standardized ingredients + smoke pairing
5. Respects cocktail compatibility (returns "N/A" for incompatible drinks)

**Usage Pattern**:
```typescript
import { getProTips } from '@/ai/flows/pro-tips';

// In a server component or server action
const tips = await getProTips({
  name: cocktail.name,
  ingredients: cocktail.ingredients,
  instructions: cocktail.instructions,
  baseSpirit: cocktail.baseSpirit,
});
```

### Adding New AI Flows

1. Create file in `src/ai/flows/`
2. Add `'use server'` directive
3. Import `ai` from `@/ai/genkit`
4. Define Zod schemas for input/output
5. Use `ai.definePrompt()` for prompts
6. Use `ai.defineFlow()` for orchestration
7. Export typed function and types

Example skeleton:
```typescript
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InputSchema = z.object({
  // Define input shape
});
export type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  // Define output shape
});
export type Output = z.infer<typeof OutputSchema>;

const myPrompt = ai.definePrompt({
  name: 'myPrompt',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `Your prompt here...`,
});

const myFlow = ai.defineFlow(
  {
    name: 'myFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const { output } = await myPrompt(input);
    if (!output) {
      throw new Error('No output from AI model');
    }
    return output;
  }
);

export async function runMyFlow(input: Input): Promise<Output> {
  return myFlow(input);
}
```

---

## Common Patterns & Best Practices

### Search & Filtering

**Fuzzy Search** (`cocktail-search.tsx`):
- Implemented client-side for instant feedback
- Uses simple string matching (can be enhanced with libraries like Fuse.js)
- Searches across cocktail names

**Inventory Filtering**:
- Checkbox-based ingredient selection
- Filters cocktails to show only those makeable with selected ingredients
- Ingredient parsing normalizes variations (e.g., "Bourbon" vs "Bourbon Whiskey")

### Data Loading

**Static Data**:
```typescript
// In server components
import cocktailsData from '@/data/cocktails.json';
const cocktails = cocktailsData as Cocktail[];
```

**Dynamic Manual Files**:
```typescript
// Example from manual/[file]/page.tsx
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'manual/Manual', `${params.file}.md`);
const content = await fs.readFile(filePath, 'utf-8');
```

### Error Handling

**AI Flows**:
- Always check for null/undefined outputs
- Throw descriptive errors
- Use try/catch in calling components

**File Operations**:
- Handle missing files gracefully
- Show user-friendly error messages
- Log errors for debugging

### State Management

**Local State** (Client Components):
```typescript
import { useState } from 'react';

// For component-specific state
const [search, setSearch] = useState('');
```

**Server State** (Server Components):
- No state needed - components re-render on navigation
- Use server actions for mutations
- Leverage React Server Components for data fetching

### Responsive Design

- Mobile-first approach
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Test sidebar behavior on mobile (collapsible)
- Ensure touch-friendly hit targets

---

## Configuration Files

### `next.config.ts`

```typescript
{
  typescript: {
    ignoreBuildErrors: true  // ⚠️ Allows deployment despite type errors
  },
  eslint: {
    ignoreDuringBuilds: true  // ⚠️ Allows deployment despite lint errors
  },
  images: {
    remotePatterns: [
      // Configured for placeholder services
      'placehold.co',
      'images.unsplash.com',
      'picsum.photos'
    ]
  }
}
```

**Note**: Type and lint errors are currently ignored for rapid prototyping. Consider re-enabling for production.

### `tailwind.config.ts`

**Custom Fonts**:
- `font-headline`: Playfair Display
- `font-body`: PT Sans

**Custom Colors**:
- Defined via CSS variables in `globals.css`
- Uses HSL format for easy theming
- Dark mode support via class strategy

**Custom Animations**:
- Accordion expand/collapse
- Sidebar transitions

### `tsconfig.json`

**Key Settings**:
- `target`: ES2017
- `strict`: true
- `paths`: `@/*` → `./src/*`
- `moduleResolution`: bundler
- `jsx`: react-jsx (React 19)

### `components.json` (shadcn/ui)

**Configuration**:
- `rsc`: true (React Server Components)
- `tsx`: true
- `tailwind.baseColor`: neutral
- `aliases.components`: `@/components`
- `aliases.utils`: `@/lib/utils`

---

## Testing & Quality Assurance

### Type Checking

```bash
npm run typecheck
```

- Runs `tsc --noEmit` to check types without building
- Fix type errors before committing when possible
- Note: Currently ignored in builds (`ignoreBuildErrors: true`)

### Linting

```bash
npm run lint
```

- Uses Next.js ESLint configuration
- Enforces React best practices
- Note: Currently ignored in builds (`ignoreDuringBuilds: true`)

### Manual Testing Checklist

When making changes, test:
- [ ] Cocktail search functionality
- [ ] Inventory filtering
- [ ] Triad card display (Lead/Shadow/Junior)
- [ ] "Get Pro Tips" button
- [ ] Manual page navigation
- [ ] Sidebar collapse/expand
- [ ] Mobile responsiveness
- [ ] Toast notifications

---

## Deployment

### Firebase App Hosting

**Configuration**: `apphosting.yaml`

```yaml
runConfig:
  maxInstances: 1  # Cost-saving measure
```

### Build Process

```bash
# Production build
npm run build

# Start production server locally
npm run start
```

**Build Output**:
- Optimized static pages
- Server components rendered on-demand
- API routes for server actions

### Environment Variables

**Required**:
- `GOOGLE_GENAI_API_KEY` (for Google AI/Gemini)
- Check `.env.example` for other potential variables

**Setup**:
```bash
# Create .env.local file
touch .env.local

# Add required variables
echo "GOOGLE_GENAI_API_KEY=your_key_here" >> .env.local
```

**Note**: `.env*` files are gitignored. Never commit API keys.

---

## Troubleshooting

### Common Issues

**"Get Pro Tips" Button Not Working**
- Check that `GOOGLE_GENAI_API_KEY` is set
- Verify Genkit is properly configured
- Check browser console for errors
- Ensure server action is properly exported with `'use server'`

**Sidebar Menu Not Working**
- Verify accordion state management
- Check for hydration errors (client/server mismatch)
- Ensure proper use of `'use client'` directive

**Type Errors**
- Run `npm run typecheck`
- Verify imports match exported types
- Check `src/lib/types.ts` for type definitions
- Ensure Zod schemas match TypeScript types

**Build Failures**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check for circular dependencies
- Verify all imports resolve correctly

**Styling Issues**
- Ensure Tailwind CSS is processing all files (check `tailwind.config.ts`)
- Verify global styles are imported in `app/layout.tsx`
- Check for CSS variable definitions in `globals.css`
- Use `cn()` utility for merging class names

### Debugging Tips

**Server Components**:
```typescript
// Add console logs (visible in terminal)
console.log('Data loaded:', cocktails.length);
```

**Client Components**:
```typescript
// Add console logs (visible in browser console)
console.log('Search query:', search);
```

**AI Flows**:
```bash
# Use Genkit Dev UI for testing
npm run genkit:dev

# Visit http://localhost:4000 to test flows
```

**Network Requests**:
- Open browser DevTools → Network tab
- Filter by "Fetch/XHR"
- Check server action calls
- Verify response payloads

---

## Key Files Reference

### Must-Read Files for New Contributors

1. **`docs/blueprint.md`** - App design and feature specs
2. **`src/lib/types.ts`** - Core type definitions
3. **`src/app/layout.tsx`** - App structure and layout
4. **`src/components/cocktail-search.tsx`** - Main search logic
5. **`src/ai/flows/pro-tips.ts`** - AI integration example
6. **`data/cocktails.json`** - Data structure example

### Critical Configuration Files

1. **`next.config.ts`** - Next.js settings
2. **`tailwind.config.ts`** - Styling system
3. **`tsconfig.json`** - TypeScript compiler options
4. **`components.json`** - shadcn/ui setup
5. **`apphosting.yaml`** - Deployment configuration

---

## Resources & Documentation

### Official Documentation
- [Next.js 14+ Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Firebase Genkit](https://firebase.google.com/docs/genkit)
- [Google AI (Gemini)](https://ai.google.dev/docs)

### Internal References
- **Manual Files**: Extensive bartending knowledge in `manual/Manual/`
- **Master Brain**: AI knowledge base at `manual/brain/MASTER_BRAIN_V5.md`
- **Blueprint**: Feature specifications in `docs/blueprint.md`

---

## Recent Development Notes

**Current Branch**: `claude/add-claude-documentation-BEIA3`

**Recent Commit History**:
```
7964671 - how do I upload this project to github
227e453 - The pro tips are working again but the menus on the left side are not wo
73a0b5a - The get pro tips buttons are not working
62b40ac - Nothing in this side bar is working (_for element <Button>_)
5799b8d - I feel like I wasted my time
```

**Known Issues** (from commits):
- Pro tips functionality was recently fixed
- Sidebar menu had issues, now resolved
- Button click handlers may need attention

**Active Development Areas**:
- AI integration (Pro Tips feature)
- Sidebar navigation stability
- Component event handling

---

## For AI Assistants: Quick Start Checklist

When starting work on this codebase:

1. ✅ Read this CLAUDE.md file thoroughly
2. ✅ Review `docs/blueprint.md` for feature context
3. ✅ Examine `src/lib/types.ts` for data models
4. ✅ Check `data/cocktails.json` for data structure
5. ✅ Understand the Triad concept (Lead/Shadow/Junior)
6. ✅ Review AI flow pattern in `src/ai/flows/pro-tips.ts`
7. ✅ Familiarize yourself with component structure
8. ✅ Note the use of Server Components vs Client Components
9. ✅ Understand the manual file system for AI context
10. ✅ Check git branch requirements (`claude/*-<SESSION_ID>`)

**Before Making Changes**:
- Always read files before editing
- Understand existing patterns
- Follow TypeScript types strictly
- Test locally before committing
- Use descriptive commit messages
- Push to the correct branch with proper naming

**Communication**:
- Be clear about what you're changing and why
- Explain trade-offs when making architectural decisions
- Ask for clarification when requirements are ambiguous
- Document complex logic in code comments

---

## Version History

- **2026-01-17**: Initial CLAUDE.md creation
  - Comprehensive codebase analysis
  - Development workflows documented
  - AI integration patterns established
  - Troubleshooting guide added

---

**Last Updated**: 2026-01-17
**Document Maintainer**: AI Assistant
**Project Version**: V5
**Next.js Version**: 16.0.10
**React Version**: 19.2.1

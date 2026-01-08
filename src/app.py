"""
BarBuddy V5 - Recipe Engine & Search Logic
Architecture for managing 22 markdown files and Tri-Menu Protocol
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from pathlib import Path
from enum import Enum
import re
import json


# ============================================================================
# ENUMS & DATA MODELS
# ============================================================================

class RecipeType(Enum):
    ALCOHOLIC = "lead"          # The Classic
    MOCKTAIL_ADULT = "shadow"   # Adult Mocktail
    MOCKTAIL_KID = "junior"     # Kid Version


class InventoryTier(Enum):
    BASICS = 1      # Tier 1: The Basics
    HOST = 2        # Tier 2: The Host
    PRO = 3         # Tier 3: The Pro
    MOCKTAIL = 4    # Mocktail Kit


class WoodType(Enum):
    OAK = "oak"
    MESQUITE = "mesquite"
    HICKORY = "hickory"
    CHERRY = "cherry"
    APPLE = "apple"
    PECAN = "pecan"


@dataclass
class SmokePairing:
    wood: WoodType
    duration_seconds: int
    bridge_flavor: str  # e.g., "Grain & Sugar" or "Vegetal & Acid"
    notes: str
    
    def is_safe(self) -> bool:
        """Validates against safety caps from File 02.0"""
        safety_caps = {
            WoodType.MESQUITE: 5,
            WoodType.HICKORY: 5,
            WoodType.OAK: 10,
            WoodType.CHERRY: 10,
            WoodType.APPLE: 15,
            WoodType.PECAN: 15
        }
        return self.duration_seconds <= safety_caps.get(self.wood, 15)


@dataclass
class Recipe:
    id: int                              # 1-50 for classics, 1-20 for mocktails/kids
    name: str
    type: RecipeType
    file_source: str                     # e.g., "03.2" for Margarita
    
    # Core Recipe Data
    ingredients: List[Dict[str, str]]    # [{name, amount, notes}, ...]
    steps: List[str]
    glassware: str
    garnish: Optional[str] = None
    
    # Tri-Menu Relationships
    lead_id: Optional[int] = None        # Links to alcoholic version
    shadow_id: Optional[int] = None      # Links to adult mocktail
    junior_id: Optional[int] = None      # Links to kid version
    
    # Metadata
    smoke_pairing: Optional[SmokePairing] = None
    base_spirit: Optional[str] = None    # "Whiskey", "Gin", etc.
    flavor_profile: List[str] = field(default_factory=list)
    inventory_tier: Optional[InventoryTier] = None
    
    # External API Flag
    is_external: bool = False            # True if from TheCocktailDB


@dataclass
class TriMenu:
    """Represents the complete triad for a drink request"""
    lead: Optional[Recipe] = None        # The Alcoholic Classic
    shadow: Optional[Recipe] = None      # The Adult Mocktail
    junior: Optional[Recipe] = None      # The Kid Version
    
    def is_complete(self) -> bool:
        """Check if all three variations exist"""
        return all([self.lead, self.shadow, self.junior])


# ============================================================================
# RECIPE ENGINE - Markdown Ingestion
# ============================================================================

class RecipeEngine:
    """
    Handles ingestion of 22 markdown files and builds the recipe database.
    Maintains the relationships between Lead/Shadow/Junior variations.
    """
    
    def __init__(self, manual_path: str = "./manual"):
        self.manual_path = Path(manual_path)
        self.recipes: Dict[int, Recipe] = {}          # Key: recipe_id
        self.recipe_index: Dict[str, int] = {}        # Key: recipe_name -> recipe_id
        self.tri_menu_map: Dict[int, TriMenu] = {}    # Key: lead_id -> TriMenu
        
        # Core Knowledge Bases (extracted from specific files)
        self.smoke_rules: Dict[str, SmokePairing] = {}
        self.substitution_rules: Dict[str, List[str]] = {}
        self.inventory_tiers: Dict[InventoryTier, List[str]] = {}
        self.forbidden_smoke: List[str] = ["mint", "fresh berries", "dairy", "cream"]
        
    
    def load_all_files(self) -> None:
        """Master loader - ingests all 22 markdown files"""
        print("🔄 Loading BarBuddy V5 Manual...")
        
        # Phase 1: Load Knowledge Bases (Files 00-02, 08, 21)
        self._load_tools_garnish()          # File 00.0, 01.0
        self._load_smoke_rules()            # File 02.0
        self._load_substitution_rules()     # File 08.0
        self._load_inventory_tiers()        # File 21.0
        
        # Phase 2: Load Core 50 Alcoholic Recipes (Files 03.0 - 03.5)
        self._load_alcoholic_recipes()
        
        # Phase 3: Load Mocktails (File 04.0) & Kids (File 05.0)
        self._load_mocktails()
        self._load_kids_recipes()
        
        # Phase 4: Build Tri-Menu Relationships
        self._build_tri_menu_map()
        
        print(f"✅ Loaded {len(self.recipes)} recipes")
        print(f"✅ Built {len(self.tri_menu_map)} Tri-Menus")
    
    
    def _load_smoke_rules(self) -> None:
        """Parse File 02.0 - Wood Profiles & Bridge Theory"""
        file_path = self.manual_path / "02.0-wood-profiles.md"
        if not file_path.exists():
            return
            
        # Example parsing logic (adjust to your markdown structure)
        content = file_path.read_text()
        
        # Extract bridge theory patterns
        self.smoke_rules["bourbon"] = SmokePairing(
            wood=WoodType.OAK,
            duration_seconds=10,
            bridge_flavor="Grain & Sugar",
            notes="Oak bridges vanilla notes in bourbon"
        )
        
        self.smoke_rules["tequila"] = SmokePairing(
            wood=WoodType.MESQUITE,
            duration_seconds=5,
            bridge_flavor="Vegetal & Acid",
            notes="Mesquite bridges agave earthiness"
        )
        
        # Add more rules based on your File 02.0 content
    
    
    def _load_substitution_rules(self) -> None:
        """Parse File 08.0 - Substitution Logic"""
        self.substitution_rules = {
            "whiskey": ["aged rum", "bourbon"],
            "gin": ["vodka", "blanco tequila"],
            "vodka": ["gin", "white rum"],
            "tequila": ["mezcal", "white rum"],
            "rum": ["bourbon", "cognac"]
        }
    
    
    def _load_inventory_tiers(self) -> None:
        """Parse File 21.0 - Inventory Tiers"""
        self.inventory_tiers = {
            InventoryTier.BASICS: [
                "bourbon", "gin", "white rum", "vodka", 
                "cointreau", "angostura bitters"
            ],
            InventoryTier.HOST: [
                "rye whiskey", "tequila", "campari", 
                "dry vermouth", "aged rum", "peychaud's bitters"
            ],
            InventoryTier.PRO: [
                "mezcal", "scotch", "chartreuse", 
                "maraschino liqueur", "aperol", "absinthe"
            ],
            InventoryTier.MOCKTAIL: [
                "seedlip", "verjus", "shrubs", "na bitters"
            ]
        }
    
    
    def _load_alcoholic_recipes(self) -> None:
        """Parse Files 03.0 - 03.5 (Recipes 1-50)"""
        recipe_files = [
            "03.0-classics-01-10.md",
            "03.1-classics-11-20.md",
            "03.2-classics-21-30.md",
            "03.3-classics-31-40.md",
            "03.4-classics-41-50.md"
        ]
        
        for file_name in recipe_files:
            file_path = self.manual_path / file_name
            if file_path.exists():
                self._parse_recipe_file(file_path, RecipeType.ALCOHOLIC)
    
    
    def _load_mocktails(self) -> None:
        """Parse File 04.0 - Adult Mocktails (The Shadow)"""
        file_path = self.manual_path / "04.0-mocktails-adult.md"
        if file_path.exists():
            self._parse_recipe_file(file_path, RecipeType.MOCKTAIL_ADULT)
    
    
    def _load_kids_recipes(self) -> None:
        """Parse File 05.0 - Kid Versions (The Junior)"""
        file_path = self.manual_path / "05.0-mocktails-kids.md"
        if file_path.exists():
            self._parse_recipe_file(file_path, RecipeType.MOCKTAIL_KID)
    
    
    def _parse_recipe_file(self, file_path: Path, recipe_type: RecipeType) -> None:
        """
        Generic markdown parser for recipe files.
        Adjust regex patterns based on your actual markdown format.
        """
        content = file_path.read_text()
        
        # Example pattern - adjust to your format:
        # ## Recipe #8: Margarita
        # **Glass:** Coupe
        # **Ingredients:**
        # - 2 oz Tequila
        # ...
        
        pattern = r'## Recipe #(\d+):\s*(.+?)\n(.+?)(?=## Recipe|$)'
        matches = re.finditer(pattern, content, re.DOTALL)
        
        for match in matches:
            recipe_id = int(match.group(1))
            name = match.group(2).strip()
            body = match.group(3)
            
            # Parse ingredients
            ingredients = self._extract_ingredients(body)
            
            # Parse steps
            steps = self._extract_steps(body)
            
            # Parse glassware
            glassware = self._extract_glassware(body)
            
            # Create recipe object
            recipe = Recipe(
                id=recipe_id,
                name=name,
                type=recipe_type,
                file_source=file_path.stem,
                ingredients=ingredients,
                steps=steps,
                glassware=glassware
            )
            
            self.recipes[recipe_id] = recipe
            self.recipe_index[name.lower()] = recipe_id
    
    
    def _extract_ingredients(self, text: str) -> List[Dict[str, str]]:
        """Extract ingredients from markdown text"""
        ingredients = []
        pattern = r'-\s*(.+?)(?:\n|$)'
        
        # Find the Ingredients section
        ing_section = re.search(r'\*\*Ingredients:\*\*(.+?)(?=\*\*|\n##|$)', text, re.DOTALL)
        if ing_section:
            for line in re.finditer(pattern, ing_section.group(1)):
                ingredient_text = line.group(1).strip()
                # Parse "2 oz Tequila" into structured format
                parts = ingredient_text.split(' ', 2)
                ingredients.append({
                    "amount": parts[0] if len(parts) > 0 else "",
                    "unit": parts[1] if len(parts) > 1 else "",
                    "name": parts[2] if len(parts) > 2 else ingredient_text
                })
        
        return ingredients
    
    
    def _extract_steps(self, text: str) -> List[str]:
        """Extract preparation steps from markdown text"""
        steps = []
        pattern = r'\d+\.\s*(.+?)(?:\n|$)'
        
        steps_section = re.search(r'\*\*Steps:\*\*(.+?)(?=\*\*|\n##|$)', text, re.DOTALL)
        if steps_section:
            for line in re.finditer(pattern, steps_section.group(1)):
                steps.append(line.group(1).strip())
        
        return steps
    
    
    def _extract_glassware(self, text: str) -> str:
        """Extract glassware type from markdown text"""
        match = re.search(r'\*\*Glass:\*\*\s*(.+?)(?:\n|$)', text)
        return match.group(1).strip() if match else "Rocks Glass"
    
    
    def _load_tools_garnish(self) -> None:
        """Parse Files 00.0, 01.0 for tools and garnish info"""
        # Placeholder - implement based on your needs
        pass
    
    
    def _build_tri_menu_map(self) -> None:
        """
        Build the critical Tri-Menu relationships.
        Example mapping (adjust based on your actual recipe IDs):
        Recipe #8 (Margarita) -> Recipe #7 (Hibiscus Margarita) -> Recipe #16 (Kiddi-Rita)
        """
        
        # Hardcoded mapping example - ideally this comes from metadata in your markdown
        tri_menu_mapping = {
            8: {"shadow": 7, "junior": 16},   # Margarita family
            # Add more mappings based on your recipe relationships
        }
        
        for lead_id, links in tri_menu_mapping.items():
            lead = self.recipes.get(lead_id)
            shadow = self.recipes.get(links.get("shadow"))
            junior = self.recipes.get(links.get("junior"))
            
            if lead:
                self.tri_menu_map[lead_id] = TriMenu(
                    lead=lead,
                    shadow=shadow,
                    junior=junior
                )
                
                # Update recipe cross-references
                if lead:
                    lead.shadow_id = links.get("shadow")
                    lead.junior_id = links.get("junior")
                if shadow:
                    shadow.lead_id = lead_id
                if junior:
                    junior.lead_id = lead_id
    
    
    def get_recipe(self, identifier: str | int) -> Optional[Recipe]:
        """Get recipe by ID or name"""
        if isinstance(identifier, int):
            return self.recipes.get(identifier)
        else:
            recipe_id = self.recipe_index.get(identifier.lower())
            return self.recipes.get(recipe_id) if recipe_id else None
    
    
    def get_smoke_pairing(self, base_spirit: str) -> Optional[SmokePairing]:
        """Get smoke pairing recommendation for a spirit"""
        return self.smoke_rules.get(base_spirit.lower())
    
    
    def can_smoke_ingredient(self, ingredient: str) -> bool:
        """Check if ingredient is safe to smoke"""
        return ingredient.lower() not in self.forbidden_smoke
    
    
    def get_substitutes(self, spirit: str) -> List[str]:
        """Get substitution options using Can-Do Protocol"""
        return self.substitution_rules.get(spirit.lower(), [])


# ============================================================================
# SEARCH LOGIC - Tri-Menu Results Handler
# ============================================================================

class SearchLogic:
    """
    Handles all search queries and returns results in Tri-Menu format.
    Integrates with TheCocktailDB for infinite scaling.
    """
    
    def __init__(self, recipe_engine: RecipeEngine):
        self.engine = recipe_engine
        self.external_api_base = "https://www.thecocktaildb.com/api/json/v1/1"
    
    
    def search(self, query: str, include_external: bool = False) -> List[TriMenu]:
        """
        Main search entry point.
        Returns Tri-Menu results (Lead + Shadow + Junior for each match).
        """
        results = []
        
        # Phase 1: Search internal database (Core 50)
        internal_matches = self._search_internal(query)
        
        for recipe in internal_matches:
            if recipe.type == RecipeType.ALCOHOLIC:
                tri_menu = self.engine.tri_menu_map.get(recipe.id)
                if tri_menu:
                    results.append(tri_menu)
        
        # Phase 2: Search external API if enabled
        if include_external and len(results) < 3:
            external_matches = self._search_external(query)
            results.extend(external_matches)
        
        return results
    
    
    def _search_internal(self, query: str) -> List[Recipe]:
        """Search the Core 50 recipes"""
        matches = []
        query_lower = query.lower()
        
        for recipe in self.engine.recipes.values():
            # Search in name
            if query_lower in recipe.name.lower():
                matches.append(recipe)
                continue
            
            # Search in ingredients
            for ing in recipe.ingredients:
                if query_lower in ing.get("name", "").lower():
                    matches.append(recipe)
                    break
            
            # Search in base spirit
            if recipe.base_spirit and query_lower in recipe.base_spirit.lower():
                matches.append(recipe)
        
        return matches
    
    
    def _search_external(self, query: str) -> List[TriMenu]:
        """
        Search TheCocktailDB and apply V5 Filter.
        Returns sanitized Tri-Menus.
        """
        import requests
        
        try:
            response = requests.get(
                f"{self.external_api_base}/search.php",
                params={"s": query}
            )
            
            if response.status_code == 200:
                data = response.json()
                drinks = data.get("drinks", [])
                
                return [self._sanitize_external_recipe(drink) for drink in drinks[:3]]
        
        except Exception as e:
            print(f"⚠️ External API error: {e}")
        
        return []
    
    
    def _sanitize_external_recipe(self, raw_data: Dict) -> TriMenu:
        """
        Apply V5 Filter to external API data:
        1. Reformat to V5 Header/Spec/Steps style
        2. Swap "Sour Mix" for Lemon + Sugar
        3. Generate Smoke Pairing
        """
        
        # Parse ingredients from API format (strIngredient1, strMeasure1, etc.)
        ingredients = []
        for i in range(1, 16):
            ing_name = raw_data.get(f"strIngredient{i}")
            ing_measure = raw_data.get(f"strMeasure{i}")
            
            if ing_name and ing_name.strip():
                # V5 Filter Rule: Replace Sour Mix
                if "sour mix" in ing_name.lower():
                    ingredients.append({"amount": "0.75", "unit": "oz", "name": "Fresh Lemon Juice"})
                    ingredients.append({"amount": "0.5", "unit": "oz", "name": "Simple Syrup"})
                else:
                    ingredients.append({
                        "amount": ing_measure.strip() if ing_measure else "",
                        "unit": "",
                        "name": ing_name.strip()
                    })
        
        # Parse instructions into steps
        instructions = raw_data.get("strInstructions", "")
        steps = [s.strip() for s in instructions.split(". ") if s.strip()]
        
        # Detect base spirit for smoke pairing
        base_spirit = self._detect_base_spirit(ingredients)
        smoke_pairing = self.engine.get_smoke_pairing(base_spirit) if base_spirit else None
        
        # Create external recipe
        recipe = Recipe(
            id=int(raw_data.get("idDrink", 0)),
            name=raw_data.get("strDrink", "Unknown"),
            type=RecipeType.ALCOHOLIC,
            file_source="external",
            ingredients=ingredients,
            steps=steps,
            glassware=raw_data.get("strGlass", "Rocks Glass"),
            garnish=raw_data.get("strGarnish"),
            smoke_pairing=smoke_pairing,
            base_spirit=base_spirit,
            is_external=True
        )
        
        # External recipes don't have Shadow/Junior variants
        return TriMenu(lead=recipe, shadow=None, junior=None)
    
    
    def _detect_base_spirit(self, ingredients: List[Dict]) -> Optional[str]:
        """Detect primary spirit from ingredient list"""
        spirits = ["bourbon", "whiskey", "gin", "vodka", "rum", "tequila", "mezcal"]
        
        for ing in ingredients:
            name = ing.get("name", "").lower()
            for spirit in spirits:
                if spirit in name:
                    return spirit
        
        return None
    
    
    def get_tri_menu(self, recipe_id: int) -> Optional[TriMenu]:
        """Get complete Tri-Menu for a specific recipe"""
        return self.engine.tri_menu_map.get(recipe_id)
    
    
    def find_by_inventory_tier(self, tier: InventoryTier) -> List[Recipe]:
        """Find all recipes makeable with given inventory tier"""
        available_spirits = []
        
        for t in InventoryTier:
            available_spirits.extend(self.engine.inventory_tiers.get(t, []))
            if t == tier:
                break
        
        makeable = []
        for recipe in self.engine.recipes.values():
            if recipe.type == RecipeType.ALCOHOLIC:
                # Check if all required spirits are available
                required = [ing.get("name", "").lower() for ing in recipe.ingredients]
                if all(any(spirit in req for spirit in available_spirits) for req in required):
                    makeable.append(recipe)
        
        return makeable
    
    
    def suggest_substitute(self, recipe: Recipe, missing_spirit: str) -> Optional[str]:
        """
        Apply Can-Do Protocol - never say "You can't"
        Returns substitution suggestion with smoking warning if needed
        """
        substitutes = self.engine.get_substitutes(missing_spirit)
        
        if not substitutes:
            return None
        
        suggestion = substitutes[0]
        
        # Check smoking compatibility
        warning = ""
        if missing_spirit.lower() in ["vodka", "gin"] and recipe.smoke_pairing:
            warning = " ⚠️ Note: Do NOT smoke white spirits unless using very light fruit wood."
        
        return f"Try substituting {suggestion} for {missing_spirit}.{warning}"


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # Initialize the system
    engine = RecipeEngine(manual_path="./manual")
    engine.load_all_files()
    
    search = SearchLogic(engine)
    
    # Example 1: Search for a drink
    print("\n🔍 Searching for 'Margarita'...")
    results = search.search("margarita")
    
    for tri_menu in results:
        print(f"\n📋 TRI-MENU RESULT:")
        print(f"  🍸 Lead: {tri_menu.lead.name if tri_menu.lead else 'N/A'}")
        print(f"  🌿 Shadow: {tri_menu.shadow.name if tri_menu.shadow else 'N/A'}")
        print(f"  🧒 Junior: {tri_menu.junior.name if tri_menu.junior else 'N/A'}")
    
    # Example 2: Get recipe by ID
    print("\n📖 Getting Recipe #8...")
    recipe = engine.get_recipe(8)
    if recipe:
        print(f"Name: {recipe.name}")
        print(f"Glass: {recipe.glassware}")
        print(f"Ingredients: {len(recipe.ingredients)}")
    
    # Example 3: Check smoke pairing
    print("\n🔥 Smoke Pairing for Bourbon...")
    pairing = engine.get_smoke_pairing("bourbon")
    if pairing:
        print(f"Wood: {pairing.wood.value}")
        print(f"Duration: {pairing.duration_seconds}s")
        print(f"Bridge: {pairing.bridge_flavor}")
    
    # Example 4: Find recipes by inventory tier
    print("\n🥃 Recipes makeable with Tier 1 (Basics)...")
    basics_recipes = search.find_by_inventory_tier(InventoryTier.BASICS)
    print(f"Found {len(basics_recipes)} recipes")
    
    # Example 5: Get substitution suggestion
    print("\n🔄 Substitution for missing Whiskey...")
    suggestion = search.suggest_substitute(recipe, "whiskey")
    print(suggestion)
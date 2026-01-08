
import os
import re
import json

def parse_recipe_file(filepath):
    """Parses a single recipe markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    recipes = []
    # Split the file content by recipe sections
    recipe_sections = re.split(r'RECIPE #\d+:', content)[1:]
    
    for section in recipe_sections:
        try:
            name_match = re.search(r'(.+?)\n', section)
            name = name_match.group(1).strip() if name_match else 'Unknown'
            
            base_spirit_match = re.search(r'Base Spirit: (.+?)\n', section)
            base_spirit = base_spirit_match.group(1).split('(')[0].strip() if base_spirit_match else 'N/A'

            spec_match = re.search(r'Standard Spec.*?:\n(.*?)\nStep-by-Step', section, re.DOTALL)
            ingredients = []
            if spec_match:
                ingredients_text = spec_match.group(1).strip()
                ingredients = [ing.strip().lstrip('- ') for ing in ingredients_text.split('\n') if ing.strip()]

            instructions_match = re.search(r'Step-by-Step Instructions:\n(.*?)\n(Smoke Pairing|Common Mistakes|Why It Works)', section, re.DOTALL)
            instructions = instructions_match.group(1).strip().replace('\n', ' ') if instructions_match else ''
            
            mocktail_match = re.search(r'MOCKTAIL VERSION: "(.+?)"', section)
            mocktail_name = mocktail_match.group(1) if mocktail_match else None
            
            kid_match = re.search(r'KID VERSION: "(.+?)"', section)
            kid_name = kid_match.group(1) if kid_match else None

            # Create the main lead cocktail
            lead_id = name.lower().replace(' ', '-') + '-lead'
            
            related = {}
            if mocktail_name:
                related['shadow'] = mocktail_name.lower().replace(' ', '-') + '-shadow'
            if kid_name:
                related['junior'] = kid_name.lower().replace(' ', '-') + '-junior'

            image_id = name.lower().replace(' ', '-').replace('\'', '')

            recipes.append({
                "id": lead_id,
                "name": name,
                "type": "Lead",
                "baseSpirit": base_spirit,
                "ingredients": ingredients,
                "instructions": instructions,
                "related": related,
                "image": image_id
            })

            # Create the shadow (mocktail) version
            if mocktail_name:
                mocktail_ingredients_match = re.search(r'MOCKTAIL VERSION:.*?Ingredients:\n(.*?)\nStep-by-Step', section, re.DOTALL)
                mocktail_ingredients = []
                if mocktail_ingredients_match:
                    mocktail_ingredients = [ing.strip().lstrip('- ') for ing in mocktail_ingredients_match.group(1).strip().split('\n') if 'Substitution:' not in ing and ing.strip()]
                
                mocktail_instructions_match = re.search(r'MOCKTAIL VERSION:.*?Step-by-Step Instructions:\n(.*?)\nWhy It Works', section, re.DOTALL)
                mocktail_instructions = mocktail_instructions_match.group(1).strip().replace('\n', ' ') if mocktail_instructions_match else ''
                
                shadow_image_id = 'non-alcoholic-' + name.lower().replace(' ', '-')
                if 'margarita' in name.lower():
                    shadow_image_id = 'hibiscus-mocktail'
                
                recipes.append({
                    "id": related['shadow'],
                    "name": mocktail_name,
                    "type": "Shadow",
                    "baseSpirit": "N/A",
                    "ingredients": mocktail_ingredients,
                    "instructions": mocktail_instructions,
                    "related": {"lead": lead_id},
                    "image": shadow_image_id
                })

            # Create the junior (kid) version
            if kid_name:
                kid_ingredients_match = re.search(r'KID VERSION:.*?Ingredients:\n(.*?)\nStep-by-Step', section, re.DOTALL)
                kid_ingredients = []
                if kid_ingredients_match:
                    kid_ingredients = [ing.strip().lstrip('- ') for ing in kid_ingredients_match.group(1).strip().split('\n') if ing.strip()]
                
                kid_instructions_match = re.search(r'KID VERSION:.*?Step-by-Step Instructions:\n(.*?)\nWhy It Works', section, re.DOTALL)
                kid_instructions = kid_instructions_match.group(1).strip().replace('\n', ' ') if kid_instructions_match else ''
                
                kid_image_id = kid_name.lower().replace(' ', '-')
                
                recipes.append({
                    "id": related['junior'],
                    "name": kid_name,
                    "type": "Junior",
                    "baseSpirit": "N/A",
                    "ingredients": kid_ingredients,
                    "instructions": kid_instructions,
                    "related": {"lead": lead_id},
                    "image": kid_image_id
                })

        except Exception as e:
            print(f"Error parsing a recipe in {filepath}: {e}")
            continue
            
    return recipes

def generate_placeholder_images(cocktails):
    """Generates placeholder image JSON from a list of cocktails."""
    images = []
    seen_ids = set()
    for cocktail in cocktails:
        if cocktail['image'] not in seen_ids:
            image_hint = cocktail['name'].lower().replace('-', ' ')
            # Limit to two words
            hint_words = image_hint.split()
            if len(hint_words) > 2:
                image_hint = ' '.join(hint_words[:2])
            
            images.append({
                "id": cocktail['image'],
                "description": f"A placeholder for {cocktail['name']}.",
                "imageUrl": f"https://picsum.photos/seed/{cocktail['image']}/600/400",
                "imageHint": image_hint
            })
            seen_ids.add(cocktail['image'])
    return {"placeholderImages": images}

def main():
    manual_dir = os.path.join('manual', 'Manual')
    output_cocktail_file = os.path.join('data', 'cocktails.json')
    output_image_file = os.path.join('src', 'lib', 'placeholder-images.json')

    all_cocktails = []
    recipe_files = sorted([f for f in os.listdir(manual_dir) if re.match(r'File 03\.\d+.*\.md', f)])

    for filename in recipe_files:
        filepath = os.path.join(manual_dir, filename)
        all_cocktails.extend(parse_recipe_file(filepath))
        
    # Sort cocktails to ensure consistent output, putting lead cocktails first
    all_cocktails.sort(key=lambda x: (x['related'].get('lead', x['id']), x['type'] != 'Lead'))

    # Generate placeholder images JSON
    placeholder_data = generate_placeholder_images(all_cocktails)

    # Write cocktails to JSON
    os.makedirs(os.path.dirname(output_cocktail_file), exist_ok=True)
    with open(output_cocktail_file, 'w', encoding='utf-8') as f:
        json.dump(all_cocktails, f, indent=2)
    print(f"Successfully generated {output_cocktail_file}")

    # Write images to JSON
    os.makedirs(os.path.dirname(output_image_file), exist_ok=True)
    with open(output_image_file, 'w', encoding='utf-8') as f:
        json.dump(placeholder_data, f, indent=2)
    print(f"Successfully generated {output_image_file}")

if __name__ == '__main__':
    main()

    
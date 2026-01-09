import { Home, BookOpen, Search, Flame } from 'lucide-react';
import { SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from './ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link';

const manualFiles = [
  { name: "Intro", file: "File_00.0_Intro.md" },
  { name: "Tools & Ingredients", file: "File 01.0 - Tools, Techniques & Ingredients.md" },
  { name: "Wood Library", file: "File 02.0 - Wood Library Complete.md" },
  { name: "Garnish Library", file: "File 02.1 - Garnish Library Complete.md" },
  { name: "Recipe Index", file: "File 03.0 - Quick Reference Chart - All 50 Classic Cocktails.md" },
  { name: "Recipes 1-6", file: "File 03.1 - Recipes 1-6.md" },
  { name: "Recipes 7-15", file: "File 03.2 - Recipes 7-15.md" },
  { name: "Recipes 16-25", file: "File 03.3 - Recipes 16-25.md" },
  { name: "Recipes 26-38", file: "File 03.4 - Recipes 26-38.md" },
  { name: "Recipes 39-50", file: "File 03.5 - Recipes 39-50.md" },
  { name: "Adult Mocktails", file: "File 04.0 - Adult NA Mocktails Master File.md" },
  { name: "Kid-Friendly Mocktails", file: "File 05.0 - Kid-Friendly Mocktails Master File.md" },
  { name: "Smoker Devices", file: "File 06.0 - Smoker Devices Guide Complete.md" },
  { name: "Smoking Techniques", file: "File 07.0 - Smoking Techniques Master Guide.md" },
  { name: "Substitutions", file: "File 08.0 - Spirit Substitution Guide.md" },
  { name: "Glassware", file: "File 09.0 - Glassware Guide Complete.md" },
  { name: "Ice Types", file: "File 10.0 - Ice Types Guide Complete.md" },
  { name: "Food Pairing", file: "File 11.0 - Food Pairing Complete.md" },
  { name: "Bitters Guide", file: "File 12.0 - Bitters & Tinctures Guide Complete.md" },
  { name: "Syrups Guide", file: "File 13.0 - Syrups & Sweeteners Guide Complete.md" },
  { name: "Advanced Techniques", file: "File 14.0 - Advanced Techniques Complete.md" },
  { name: "Troubleshooting", file: "File 15.0 - Troubleshooting Complete.md" },
];


export default function AppSidebar() {
  return (
    <>
      <SidebarHeader className="hidden md:flex">
        {/* Placeholder for header content */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/" >
              <Home />
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>
        
          <SidebarGroup>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="w-full hover:no-underline">
                  <SidebarMenuButton asChild isActive={true}>
                    <span className="w-full">
                      <BookOpen />
                      BarBuddy Manual
                    </span>
                  </SidebarMenuButton>
                </AccordionTrigger>
                <AccordionContent>
                  <SidebarMenuSub>
                    {manualFiles.map(item => (
                      <SidebarMenuSubItem key={item.file}>
                        <Link href={`/manual/${item.file}`} passHref>
                          <SidebarMenuSubButton>
                            {item.name}
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarGroup>

        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

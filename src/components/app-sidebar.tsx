import { Home, BookOpen, Search, Flame } from 'lucide-react';
import { SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';

export default function AppSidebar() {
  return (
    <>
      <SidebarHeader className="hidden md:flex">
        {/* Placeholder for header content */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/" isActive>
              <Home />
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/manual/File 03.0 - Quick Reference Chart - All 50 Classic Cocktails.md">
              <BookOpen />
              All Recipes
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/manual/File 02.0 - Wood Library Complete.md">
              <Flame />
              Smoking Guide
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Search />
              Browse
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}

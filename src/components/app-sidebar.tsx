import { Home, BookOpen, Search } from 'lucide-react';
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
            <SidebarMenuButton href="#" isActive>
              <Home />
              Home
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <BookOpen />
              All Recipes
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

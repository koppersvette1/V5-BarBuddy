'use client';

import { Home, BookOpen } from 'lucide-react';
import { SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarMenuSub, SidebarMenuSubItem } from './ui/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link';
import { manualFiles } from '@/lib/manual-files';


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
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger
                  className="h-8 w-full rounded-md p-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline data-[state=open]:bg-sidebar-accent data-[state=open]:font-medium data-[state=open]:text-sidebar-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>BarBuddy Manual</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <SidebarMenuSub>
                    {manualFiles.map(item => (
                      <SidebarMenuSubItem key={item.file}>
                        <Link 
                          href={`/manual/${item.slug}`}
                          className="flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 text-sm group-data-[collapsible=icon]:hidden"
                        >
                          <span>{item.name}</span>
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

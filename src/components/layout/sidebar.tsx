"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  BarChart3,
  LogOut,
  Briefcase,
  Settings,
  Target,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '../theme-toggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { href: '/leads', icon: Users, label: 'Leads' },
  { href: '/campaigns', icon: Target, label: 'Campaigns' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <SidebarPrimitive collapsible="icon" className="border-r bg-card flex flex-col">
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Briefcase className="w-8 h-8 text-primary flex-shrink-0" />
        <h1
          className={`font-bold text-xl ml-2 whitespace-nowrap transition-all duration-300 ${
            sidebarState === 'collapsed' ? 'opacity-0 -translate-x-4 w-0' : 'opacity-100'
          }`}
        >
          DataFlow Pro
        </h1>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                size="lg"
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
                className={cn(
                  'justify-start rounded-3xl',
                  pathname.startsWith(item.href) && 'shadow-[0_0_15px_hsl(var(--primary-glow))]'
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className='whitespace-nowrap'>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 mt-auto">
        <Separator className="my-2" />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='group/user-profile cursor-pointer p-2 flex items-center gap-3 rounded-3xl hover:bg-sidebar-accent'>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://picsum.photos/id/1025/100" alt="User" data-ai-hint="man portrait" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${sidebarState === 'collapsed' ? 'w-0' : 'w-full'}`}>
                        <span className="font-semibold text-sm truncate">Alex Starr</span>
                        <span className="text-xs text-muted-foreground truncate">alex.starr@example.com</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <ThemeToggle />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

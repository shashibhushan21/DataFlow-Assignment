"use client";

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  const parts = pathname.split('/').filter(Boolean);
  
  return (
    <nav aria-label="breadcrumb" className="hidden md:flex items-center text-sm">
      <ol className="flex items-center space-x-2 text-muted-foreground">
        <li>
            <Link href="/leads" className="hover:text-foreground">Dashboard</Link>
        </li>
        {parts.map((part, index) => (
          <li key={part} className="flex items-center space-x-2">
            <span className="select-none">/</span>
            <span className={`capitalize ${index === parts.length - 1 ? 'text-foreground font-semibold' : 'hover:text-foreground'}`}>
                {index === parts.length - 1 ? (
                    part
                ) : (
                    <Link href={`/${parts.slice(0, index + 1).join('/')}`}>{part}</Link>
                )}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function Header() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}
      
      <Breadcrumbs />

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex-1 max-w-xs"
        >
            <form>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="w-full pl-10 rounded-full shadow-none bg-transparent" />
                </div>
            </form>
        </motion.div>
        
        <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}

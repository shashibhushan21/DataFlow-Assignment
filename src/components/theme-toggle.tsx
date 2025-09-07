"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <DropdownMenuItem onClick={toggleTheme}>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
            </div>
            <span className="text-xs text-muted-foreground capitalize">{theme}</span>
        </div>
    </DropdownMenuItem>
  )
}

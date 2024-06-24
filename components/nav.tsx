"use client"

import { Sun, Moon, Menu, Activity } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import NavLink from './nav-link'
import { useTheme } from "next-themes"


export default function Nav() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex flex-col bg-background">
      <header className="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Activity className="h-6 w-6" />
              <span className="sr-only">Dash</span>
            </Link>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/analytics">Analytics</NavLink>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Activity className="h-6 w-6" />
                  <span className="sr-only">Dash</span>
                </Link>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}

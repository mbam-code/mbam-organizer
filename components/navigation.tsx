"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Kanban Board",
      icon: LayoutDashboard,
    },
    {
      href: "/content",
      label: "Content Studio",
      icon: FileText,
    },
  ]

  return (
    <nav className="bg-burgundy dark:bg-gray-900 border-b-4 border-gold dark:border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-white">
                MBAM Organizer
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-gold text-gold"
                        : "border-transparent text-white hover:border-gold hover:text-gold"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden bg-burgundy/95 dark:bg-gray-900">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                  isActive
                    ? "bg-burgundy-dark dark:bg-burgundy border-gold text-gold"
                    : "border-transparent text-white hover:bg-burgundy-dark dark:hover:bg-gray-800 hover:border-gold hover:text-gold"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

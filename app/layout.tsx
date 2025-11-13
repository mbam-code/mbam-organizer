import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "MBAM Organizer - Content Production Kanban",
  description: "Beautiful production line content management Kanban board",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}

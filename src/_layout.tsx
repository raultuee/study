import { ThemeProvider } from "./components/theme-provider" 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="pt-br" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            defaultTheme="system"
            storageKey="vite-ui-theme"
          >
            {children}
          </ThemeProvider>
          
        </body>
        
      </html>
    </>
  )
}

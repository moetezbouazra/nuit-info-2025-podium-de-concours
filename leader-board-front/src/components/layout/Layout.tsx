import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>

      <footer
        className="border-t border-[hsl(var(--border))] py-6 mt-auto"
        role="contentinfo"
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              NIRD - Numérique Inclusif, Responsable et Durable
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Nuit de l'Info 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

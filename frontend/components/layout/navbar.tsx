'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSiteConfig } from '@/lib/context/site-config';
import { SiteBranding } from '@/components/layout/site-branding';
import { getLucideIcon } from '@/lib/lucide-icon';
import { cn } from '@/lib/utils';

/** Nav links from site settings (menuItems); includes optional icon name for Lucide. */
function buildNavLinks(siteConfig: ReturnType<typeof useSiteConfig>): { href: string; label: string; icon?: string; openInNewTab: boolean }[] {
  const menu = siteConfig.menu ?? [];
  return menu.map((item) => ({
    href: item.href,
    label: item.name,
    icon: item.icon,
    openInNewTab: item.openInNewTab,
  }));
}

const ICON_SIZE = 'h-4 w-4';
const ICON_SIZE_MOBILE = 'h-5 w-5';

export function Navbar() {
  const siteConfig = useSiteConfig();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const siteName = siteConfig.name || 'ZdravLife';
  const logoUrl = siteConfig.logo ?? '';
  const navLinks = React.useMemo(() => buildNavLinks(siteConfig), [siteConfig]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full max-w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20 min-w-0 gap-2">
            {/* Logo + site name (accent from Site Settings) */}
            <div className="min-w-0 overflow-hidden">
              <SiteBranding siteConfig={siteConfig} size="header" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
                const className = cn(
                  'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                );
                const IconComponent = getLucideIcon(link.icon);
                const content = (
                  <>
                    {IconComponent && <IconComponent className={cn(ICON_SIZE, 'shrink-0')} aria-hidden />}
                    {link.label}
                  </>
                );
                if (link.openInNewTab) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {content}
                    </a>
                  );
                }
                return (
                  <Link key={link.href} href={link.href} className={className}>
                    {content}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Search"
                asChild
              >
                <Link href="/search">
                  <Search className="h-[1.2rem] w-[1.2rem]" />
                </Link>
              </Button>

              {siteConfig.features?.shop !== false && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[1.2rem] w-[1.2rem]" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    0
                  </span>
                </Button>
              )}

              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Menu className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b shadow-lg">
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
                  const className = cn(
                    'flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
                  );
                  const IconComponent = getLucideIcon(link.icon);
                  const content = (
                    <>
                      {IconComponent && <IconComponent className={cn(ICON_SIZE_MOBILE, 'shrink-0')} aria-hidden />}
                      {link.label}
                    </>
                  );
                  if (link.openInNewTab) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {content}
                      </a>
                    );
                  }
                  return (
                    <Link key={link.href} href={link.href} className={className}>
                      {content}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t mt-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

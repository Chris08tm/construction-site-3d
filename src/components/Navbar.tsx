import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { Logo } from './Logo';
import { navLinks } from '../data/navigation';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-paper/95 backdrop-blur transition-colors duration-200 ${
      scrolled ? 'border-line' : 'border-transparent'}`
      }>
      
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main">
        <a href="#top" aria-label="Ridgeline Build Co. home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
          <li key={link.href}>
              <a
              href={link.href}
              className="whitespace-nowrap text-sm text-muted transition-colors duration-150 hover:text-ink">
              
                {link.label}
              </a>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden whitespace-nowrap rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors duration-150 hover:bg-blueprint-mid sm:inline-flex">
            
            Request a quote
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}>
            
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open &&
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="border-t border-line bg-paper md:hidden">
          
            <ul className="flex flex-col px-5 py-3">
              {navLinks.map((link) =>
            <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="block py-3 text-base text-ink">
                    {link.label}
                  </a>
                </li>
            )}
              <li className="pt-2">
                <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-ink px-4 py-3 text-center text-sm font-medium text-paper">
                
                  Request a quote
                </a>
              </li>
            </ul>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}
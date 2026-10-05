import { Logo } from './Logo';
import { navLinks } from '../data/navigation';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm text-paper/60">
            Design-build general contractor serving the San Francisco Peninsula and South Bay since 1994.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            {navLinks.map((link) =>
            <li key={link.href}>
                <a href={link.href} className="text-paper/70 transition-colors duration-150 hover:text-paper">
                  {link.label}
                </a>
              </li>
            )}
            <li>
              <a href="#contact" className="text-paper/70 transition-colors duration-150 hover:text-paper">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 py-6 font-mono text-[11px] text-paper/50 sm:flex-row sm:justify-between lg:px-8">
        <span>© 2026 Ridgeline Build Co. All rights reserved.</span>
        <span>CSLB #1048821 · Licensed, bonded & insured</span>
      </div>
    </footer>);

}

interface LogoProps {
  tone?: 'dark' | 'light';
}

export function Logo({ tone = 'dark' }: LogoProps) {
  const text = tone === 'dark' ? 'text-ink' : 'text-paper';
  return (
    <span className={`flex items-center gap-2.5 ${text}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 20V13L14 7L22 13V20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 20V15H17V20" stroke="#D9622B" strokeWidth="1.5" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        Ridgeline <span className="font-normal opacity-70">Build Co.</span>
      </span>
    </span>);

}
import { useId } from 'react';

interface BlueprintGridProps {
  color: string;
  className?: string;
}

export function BlueprintGrid({ color, className = '' }: BlueprintGridProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={`minor-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
        </pattern>
        <pattern id={`major-${id}`} width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill={`url(#minor-${id})`} />
          <path d="M120 0H0V120" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#major-${id})`} />
    </svg>);

}
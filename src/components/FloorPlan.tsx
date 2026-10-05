import { useId } from 'react';
import type { RoomId } from '../types/house';

const rooms: { id: RoomId; x: number; y: number; w: number; h: number; label: string; size: string }[] = [
  { id: 'kitchen', x: 100, y: 100, w: 224, h: 168, label: 'KITCHEN', size: '16′ × 12′' },
  { id: 'bedroom', x: 380, y: 100, w: 224, h: 168, label: 'BEDROOM', size: '16′ × 12′' },
  { id: 'bathroom', x: 464, y: 268, w: 140, h: 112, label: 'BATH', size: '10′ × 8′' },
];

export function FloorPlan() {
  const patternId = useId().replace(/:/g, '');
  return <div className="relative h-full bg-blueprint-deep text-blueprint-light">
    <div className="absolute inset-x-4 top-5 flex items-center justify-between gap-3 font-mono text-[11px]">
      <span>Sample floor plan</span><span className="opacity-60">A–101</span>
    </div>
    <div className="absolute inset-x-0 bottom-4 top-14 px-1 sm:px-3" aria-label="Sample house floor plan">
      <svg viewBox="0 0 720 570" className="mx-auto h-full w-full" role="img" aria-labelledby={`${patternId}-title ${patternId}-desc`}>
        <title id={`${patternId}-title`}>Sample one-bedroom house plan, 36 feet by 28 feet</title>
        <desc id={`${patternId}-desc`}>Kitchen and bedroom are each 16 by 12 feet, connected by a 4-foot hall. A 10-by-8-foot bathroom and 6-by-8-foot laundry open to the entry. The living and dining room is 20 by 16 feet. Dimensions are illustrative planning zones, not construction measurements.</desc>
        <defs>
          <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="#4875af" strokeWidth="0.5" opacity="0.25" /></pattern>
        </defs>
        <rect width="720" height="570" fill={`url(#${patternId})`} />
        <g fill="currentColor" fontFamily="IBM Plex Mono, monospace" fontSize="11">
          <text x="100" y="20" fontSize="12" letterSpacing="2">SAMPLE RESIDENCE / FLOOR PLAN</text>
          <text x="100" y="552" opacity="0.65">A–101 · CONCEPT PLAN · DIMENSIONS IN FEET</text>
        </g>
        {/* Dimension strings use the same 14 drawing units per foot throughout. */}
        <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.75">
          <path d="M100 91V42M604 91V42M100 49H604M96 53L104 45M600 53L608 45" />
          <path d="M100 77H604M324 70V91M380 70V91M96 81L104 73M320 81L328 73M376 81L384 73M600 81L608 73" />
          <path d="M90 100H40M90 492H40M48 100V492M44 104L52 96M44 496L52 488" />
          <path d="M78 100V492M70 268H91M74 104L82 96M74 272L82 264M74 496L82 488" />
          <path d="M100 502V525M380 502V525M604 502V525M100 517H604M96 521L104 513M376 521L384 513M600 521L608 513" />
        </g>
        <g fill="currentColor" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="12">
          <text x="352" y="41">36′–0″</text>
          <text x="212" y="70">16′–0″</text><text x="352" y="70">4′–0″</text><text x="492" y="70">16′–0″</text>
          <text x="35" y="296" transform="rotate(-90 35 296)">28′–0″</text>
          <text x="69" y="184" transform="rotate(-90 69 184)">12′–0″</text>
          <text x="69" y="380" transform="rotate(-90 69 380)">16′–0″</text>
          <text x="240" y="535">20′–0″</text><text x="492" y="535">16′–0″</text>
        </g>
        {rooms.map(room => <g key={room.id}>
          <text x={room.x + room.w / 2} y={room.id === 'kitchen' ? 155 : room.y + room.h - 37} fill="currentColor" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="13">{room.label}</text>
          <text x={room.x + room.w / 2} y={room.id === 'kitchen' ? 171 : room.y + room.h - 19} fill="currentColor" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" opacity="0.75">{room.size}</text>
        </g>)}
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.65" pointerEvents="none">
          {/* Kitchen: pantry, prep run, sink, cooktop, island and stools. */}
          <path d="M106 106H318V135H106ZM136 106V135M259 106V135" />
          <rect x="191" y="113" width="33" height="16" rx="2" /><path d="M207 108V118" />
          <circle cx="277" cy="115" r="4" /><circle cx="298" cy="115" r="4" /><circle cx="277" cy="126" r="4" /><circle cx="298" cy="126" r="4" />
          <rect x="162" y="180" width="103" height="44" rx="1" /><circle cx="187" cy="235" r="8" /><circle cx="239" cy="235" r="8" />
          {/* Bedroom: queen bed, nightstands, built-in wardrobe. */}
          <rect x="441" y="110" width="79" height="98" rx="2" /><path d="M441 143H520M441 192H520" />
          <rect x="447" y="116" width="29" height="18" rx="3" /><rect x="484" y="116" width="29" height="18" rx="3" />
          <rect x="415" y="114" width="20" height="20" /><rect x="528" y="114" width="20" height="20" />
          <path d="M386 146H410V225H386M386 172H410M386 198H410" />
          {/* Bathroom and laundry fixtures. */}
          <rect x="470" y="274" width="49" height="59" /><path d="M470 274L519 333M519 274L470 333" opacity="0.35" />
          <rect x="526" y="274" width="43" height="25" /><ellipse cx="547" cy="286" rx="10" ry="7" />
          <path d="M580 274H598V282H580Z" /><ellipse cx="589" cy="295" rx="9" ry="13" />
          <rect x="386" y="274" width="29" height="30" /><circle cx="400" cy="289" r="10" />
          <rect x="424" y="274" width="29" height="30" /><circle cx="438" cy="289" r="10" />
          {/* Living and dining furniture leaves an open route from entry to hall. */}
          <rect x="118" y="307" width="96" height="34" rx="5" /><path d="M124 316H208M148 317V338M181 317V338" />
          <rect x="136" y="359" width="65" height="31" rx="5" />
          <rect x="255" y="397" width="70" height="42" rx="3" />
          <path d="M268 392V385H282V392M299 392V385H313V392M268 444V451H282V444M299 444V451H313V444" />
          <rect x="518" y="401" width="70" height="13" />
        </g>
        {/* Thick wall lines interrupted at doors and windows. */}
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" pointerEvents="none">
          <path d="M100 100H164M258 100H553M591 100H604V294M604 342V492H537M495 492H320M192 492H100V420M100 338V100" />
          <path d="M100 268H324M324 100V216M380 100V216M380 268H604M380 268V336M380 380H400M438 380H476M512 380H604M464 268V380M380 380V411M380 458V492" />
        </g>
        {/* Glazed openings, with parallel lines showing frame and glass. */}
        <g fill="none" stroke="currentColor" strokeWidth="1" pointerEvents="none">
          <path d="M164 97H258V103H164ZM211 97V103M553 97H591V103H553ZM601 294V342H607V294ZM97 338V420H103V338ZM192 489H320V495H192ZM256 489V495" />
          {/* Door leaves and swing arcs. Hall opens directly into living space. */}
          <path d="M324 216H282A42 42 0 0 0 324 258M380 216H422A42 42 0 0 1 380 258M400 380V342A38 38 0 0 1 438 380M512 380V344A36 36 0 0 0 476 380M495 492V450A42 42 0 0 1 537 492" />
        </g>
        <g fill="currentColor" fontFamily="IBM Plex Mono, monospace" textAnchor="middle" fontSize="12" pointerEvents="none">
          <text x="239" y="294">LIVING / DINING</text><text x="239" y="309" fontSize="10" opacity="0.7">20′ × 16′</text>
          <text x="352" y="173" transform="rotate(-90 352 173)" fontSize="10">HALL · 4′ WIDE</text>
          <text x="422" y="328" fontSize="9">LAUNDRY</text><text x="422" y="341" fontSize="9" opacity="0.7">6′ × 8′</text>
          <text x="493" y="435">ENTRY</text><text x="493" y="451" fontSize="10" opacity="0.7">16′ × 8′</text>
          <text x="656" y="114" fontSize="11">N</text><path d="M656 122L649 143L656 138L663 143Z" />
        </g>
      </svg>
    </div>
  </div>;
}

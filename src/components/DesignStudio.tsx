import { useState } from 'react';
import { ArrowRightIcon, MoveHorizontalIcon, RotateCcwIcon, BoxIcon, RulerIcon } from 'lucide-react';
import { HouseViewer } from './HouseViewer';
import { roomDesigns } from '../data/houseDesigns';
import type { RoomId } from '../types/house';

function defaultFeature(id: RoomId) {
  return window.matchMedia('(max-width: 639px)').matches
    ? roomDesigns.find(room => room.id === id)?.features[0].id ?? null
    : null;
}

export function DesignStudio() {
  const [roomId, setRoomId] = useState<RoomId>('kitchen');
  const [featureId, setFeatureId] = useState<string | null>(() => defaultFeature('kitchen'));
  const [resetSignal, setResetSignal] = useState(0);
  const room = roomDesigns.find(item => item.id === roomId) ?? roomDesigns[0];
  const selectRoom = (id: RoomId) => {
    setRoomId(id);
    setFeatureId(defaultFeature(id));
  };
  const selectFeature = (id: string | null) => setFeatureId(current => current === id ? null : id);

  return <section id="studio" className="scroll-mt-16 bg-paper py-20 lg:py-28">
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-blueprint">The remodeling studio</p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Small details. A whole new home.</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">Step inside a few possibilities. Explore our rooms in 3D and click a numbered detail to discover the materials and finishes that make a difference.</p>
        </div>
        <p className="flex items-center gap-2 font-mono text-xs text-muted"><span className="h-2 w-2 rounded-full bg-accent" />Three spaces. Plenty of possibilities.</p>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div role="group" aria-label="Room designs" className="grid grid-cols-3 gap-2 sm:w-[360px]">
            {roomDesigns.map(item => <button key={item.id} type="button" aria-pressed={roomId === item.id} onClick={() => selectRoom(item.id)} className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${roomId === item.id ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink/40'}`}>{item.name}</button>)}
          </div>
          <p className="text-sm text-muted">{room.subtitle}<span className="ml-3 whitespace-nowrap font-mono text-[11px]">{room.area}</span></p>
        </div>
        <div className="relative h-[640px] overflow-hidden rounded-xl border border-line bg-[#eae8e1] sm:h-[560px] lg:h-[610px]">
          <HouseViewer room={room} activeFeature={featureId} onSelectFeature={selectFeature} resetSignal={resetSignal} />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
            <span className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white/95 px-3 py-2.5 text-xs font-medium text-ink shadow-sm sm:text-sm"><BoxIcon size={14} aria-hidden="true" />3D room preview</span>
            <button type="button" onClick={() => setResetSignal(value => value + 1)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/5 bg-white/95 text-ink shadow-sm hover:bg-white" aria-label="Reset camera view"><RotateCcwIcon size={15} /></button>
          </div>
          {!featureId && <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div><p className="text-sm font-medium text-ink">{room.name} <span className="mx-1 text-muted/40">/</span> <span className="font-mono text-[11px] font-normal text-muted">{room.dimensions}</span></p><p className="mt-1 font-mono text-[10px] text-muted">SELECT A NUMBER TO EXPLORE</p></div>
            <p className="flex items-center gap-1.5 font-mono text-[10px] text-muted"><MoveHorizontalIcon size={14} aria-hidden="true" />Drag to rotate</p>
          </div>}
        </div>
        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <p className="flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-muted"><RulerIcon size={14} className="mt-0.5 shrink-0" aria-hidden="true" />Concept rooms with sample finishes. Every layout, material, and detail can be tailored to your home.</p>
          <a href="#contact" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-md bg-ink px-5 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-blueprint-mid">Let’s plan your remodel<ArrowRightIcon size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
  </section>;
}

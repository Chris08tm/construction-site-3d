import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, MoveHorizontalIcon, RotateCcwIcon } from 'lucide-react';
import { HouseViewer } from './HouseViewer';
import { houseDesigns } from '../data/houseDesigns';
import type { HouseDesignId, ViewMode } from '../types/house';
const modes: {
  id: ViewMode;
  label: string;
}[] = [{
  id: 'render',
  label: 'Render'
}, {
  id: 'blueprint',
  label: 'Blueprint'
}];
export function DesignStudio() {
  const [designId, setDesignId] = useState<HouseDesignId>('modern');
  const [mode, setMode] = useState<ViewMode>('render');
  const [exploded, setExploded] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const design = houseDesigns.find((d) => d.id === designId) ?? houseDesigns[0];
  const blueprint = mode === 'blueprint';
  return <section id="studio" className="scroll-mt-16 bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Walk around your home before we break ground.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Rotate our signature plans, switch to blueprint view, or lift the floors apart to see how each level is laid
              out. Every one can be tailored to your lot.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Viewer */}
          <div className={`relative h-[420px] overflow-hidden rounded-xl border sm:h-[520px] lg:col-span-8 lg:h-[620px] ${blueprint ? 'border-blueprint-deep' : 'border-line'}`}>
            <HouseViewer designId={designId} mode={mode} exploded={exploded} resetSignal={resetSignal} />

            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3">
              <div role="radiogroup" aria-label="View mode" className="pointer-events-auto flex rounded-lg bg-white/95 p-1 shadow-sm backdrop-blur">
                {modes.map((m) => <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => setMode(m.id)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${mode === m.id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}>
                    {m.label}
                  </button>)}
              </div>
              <button type="button" onClick={() => setResetSignal((n) => n + 1)} className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-ink shadow-sm backdrop-blur transition-colors duration-150 hover:bg-white" aria-label="Reset camera view">
                <RotateCcwIcon className="h-4 w-4" />
              </button>
            </div>

            <p className={`pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[11px] ${blueprint ? 'text-blueprint-light' : 'text-muted'}`}>
              <MoveHorizontalIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Drag to rotate
            </p>

            <AnimatePresence>
              {exploded && <motion.ol initial={{
              opacity: 0,
              x: -6
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -6
            }} transition={{
              duration: 0.2,
              ease: [0.23, 1, 0.32, 1]
            }} className={`pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col-reverse gap-3 font-mono text-[11px] sm:flex ${blueprint ? 'text-blueprint-light' : 'text-ink'}`} aria-label="Levels">
                  {design.levels.map((level, i) => <li key={level} className="flex items-center gap-2">
                      <span className={`h-px w-5 ${blueprint ? 'bg-blueprint-light' : 'bg-ink'}`} />
                      L{i + 1} · {level}
                    </li>)}
                </motion.ol>}
            </AnimatePresence>

            <AnimatePresence>
              {blueprint && <motion.dl initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.2
            }} className="pointer-events-none absolute bottom-3 right-3 hidden grid-cols-[auto_auto] border border-blueprint-light/40 font-mono text-[10px] text-blueprint-light sm:grid">
                  {[['PROJECT', design.name.toUpperCase()], ['DWG NO.', design.drawingNo], ['SCALE', '1:100'], ['DRAWN', 'RIDGELINE BUILD CO.']].map(([k, v]) => <React.Fragment key={k}>
                      <dt className="border-b border-r border-blueprint-light/25 px-2.5 py-1.5 opacity-70">{k}</dt>
                      <dd className="border-b border-blueprint-light/25 px-2.5 py-1.5">{v}</dd>
                    </React.Fragment>)}
                </motion.dl>}
            </AnimatePresence>
          </div>

          {/* Panel */}
          <div className="flex flex-col lg:col-span-4">
            <div role="radiogroup" aria-label="Home designs" className="flex flex-col gap-2">
              {houseDesigns.map((d) => {
              const selected = d.id === designId;
              return <button key={d.id} type="button" role="radio" aria-checked={selected} onClick={() => setDesignId(d.id)} className={`flex items-center justify-between gap-4 rounded-lg border px-4 py-3.5 text-left transition-colors duration-150 ${selected ? 'border-ink bg-white' : 'border-line bg-transparent hover:border-ink/30'}`}>
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{d.name}</span>
                      <span className="block text-sm text-muted">{d.style}</span>
                    </span>
                    <span className="whitespace-nowrap font-mono text-xs text-muted">{d.area}</span>
                  </button>;
            })}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={design.id} initial={{
                opacity: 0,
                y: 4
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.18,
                ease: [0.23, 1, 0.32, 1]
              }}>
                  <p className="text-[15px] leading-relaxed text-muted">{design.description}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <dt className="font-mono text-[11px] text-muted">Starting at</dt>
                      <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">{design.startingAt}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] text-muted">Living area</dt>
                      <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">{design.area}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] text-muted">Bedrooms</dt>
                      <dd className="mt-1 text-base font-medium text-ink">{design.beds}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] text-muted">Bathrooms</dt>
                      <dd className="mt-1 text-base font-medium text-ink">{design.baths}</dd>
                    </div>
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>

            <button type="button" role="switch" aria-checked={exploded} onClick={() => setExploded((v) => !v)} className="mt-8 flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3.5 text-left">
              <span className="flex items-center gap-3">
                <div className="h-4 w-4 text-blueprint" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium text-ink">Separate levels</span>
                  <span className="block text-xs text-muted">Lift floors apart to see inside</span>
                </span>
              </span>
              <span className={`relative h-6 w-10 rounded-full transition-colors duration-150 ${exploded ? 'bg-blueprint' : 'bg-line'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${exploded ? 'translate-x-5' : 'translate-x-1'}`} />
              </span>
            </button>

            <a href="#contact" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors duration-150 hover:bg-blueprint-mid lg:mt-auto">
              Start with {design.name}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>;
}
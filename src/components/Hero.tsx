import { ArrowRightIcon } from 'lucide-react';
import { BlueprintGrid } from './BlueprintGrid';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <BlueprintGrid color="#D6DCE6" className="opacity-60" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-6">
          <p className="font-mono text-xs text-blueprint">Custom homes · Renovations · Additions</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[64px]">
            We build homes exactly the way they were drawn.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Ridgeline designs, engineers and builds custom homes across the Bay Area — with fixed pricing, one project
            manager and a 3D model of your home before we break ground.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#studio"
              className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors duration-150 hover:bg-blueprint-mid">
              
              Explore home designs
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-ink/40">
              
              View our work
            </a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            <div>
              <dt className="font-mono text-[11px] text-muted">Homes delivered</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">420+</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted">Finished on schedule</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">96%</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted">License</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">CSLB #1048821</dd>
            </div>
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative ml-8 mt-8 sm:ml-10">
            {/* Horizontal dimension */}
            <div className="absolute -top-7 left-0 right-0 flex items-center text-blueprint" aria-hidden="true">
              <span className="h-3 w-px bg-current" />
              <span className="h-px flex-1 bg-current" />
              <span className="bg-paper px-2 font-mono text-[11px]">42′-6″</span>
              <span className="h-px flex-1 bg-current" />
              <span className="h-3 w-px bg-current" />
            </div>
            {/* Vertical dimension */}
            <div className="absolute -left-7 bottom-0 top-0 flex flex-col items-center text-blueprint" aria-hidden="true">
              <span className="h-px w-3 bg-current" />
              <span className="w-px flex-1 bg-current" />
              <span className="bg-paper py-2 font-mono text-[11px] [writing-mode:vertical-rl] rotate-180">26′-0″</span>
              <span className="w-px flex-1 bg-current" />
              <span className="h-px w-3 bg-current" />
            </div>

            <figure className="relative overflow-hidden rounded-lg bg-line">
              <img
                src="/5ac2f1ea-9325-4e2a-b6e9-69d2e478f761.jpg"
                alt="The Meridian Residence, a modern two-story home with white stucco and cedar cladding"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]" />
              
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 rounded-md bg-white/95 px-4 py-3 backdrop-blur">
                <div>
                  <p className="text-sm font-semibold text-ink">Meridian Residence</p>
                  <p className="text-xs text-muted">Los Altos, CA · Completed 2025</p>
                </div>
                <p className="font-mono text-[11px] text-blueprint">DWG A-101</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>);

}
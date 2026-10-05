import { BlueprintGrid } from './BlueprintGrid';
import { FloorPlan } from './FloorPlan';

const facts = [
{ label: 'Established', value: '1994, Palo Alto' },
{ label: 'In-house team', value: '6 architects · 3 structural engineers · 140 tradespeople' },
{ label: 'Warranty', value: '10-year structural, 2-year workmanship' }];


export function About() {
  return (
    <section id="about" className="relative scroll-mt-16 overflow-hidden bg-blueprint-deep py-20 text-paper lg:py-28">
      <BlueprintGrid color="#1E4686" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Every build starts on paper — and stays true to it.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-blueprint-light">
            Our architects and engineers sit down the hall from the crews who build their drawings. Questions get answered
            in hours, not weeks, and what you approve is what gets built.
          </p>
          <dl className="mt-10 divide-y divide-white/15 border-y border-white/15">
            {facts.map((fact) =>
            <div key={fact.label} className="grid grid-cols-3 gap-4 py-4">
                <dt className="font-mono text-xs text-blueprint-light/80">{fact.label}</dt>
                <dd className="col-span-2 text-[15px] text-paper">{fact.value}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="h-[440px] overflow-hidden rounded-xl border border-blueprint-light/25 sm:h-[560px]">
            <FloorPlan />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-blueprint-light/70">Illustrative house plan. Dimensions describe sample planning zones; wall thickness and final measurements are confirmed during design.</p>
        </div>
      </div>
    </section>);

}

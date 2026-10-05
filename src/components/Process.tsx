import { processSteps } from '../data/process';

export function Process() {
  return (
    <section id="process" className="scroll-mt-16 border-t border-line bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From first sketch to keys in hand
            </h2>
            <p className="mt-4 text-lg text-muted">
              A clear sequence with no hand-offs between firms. You’ll always know what’s happening this week and what
              comes next.
            </p>
          </div>
          <div className="lg:col-span-7">
            <img
              src="/6df6643b-1731-458d-90bf-20a2956b7ecf.jpg"
              alt="Two Ridgeline project leads reviewing blueprints on a job site"
              className="aspect-[16/8] w-full rounded-lg object-cover" />
            
          </div>
        </div>

        <ol className="mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
          {processSteps.map((step, i) =>
          <li key={step.title} className="relative flex flex-col">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink font-mono text-xs text-ink">
                  {i + 1}
                </span>
                {i < processSteps.length - 1 && <span className="hidden h-px flex-1 bg-line md:block" aria-hidden="true" />}
              </div>
              <p className="mt-5 font-mono text-[11px] text-blueprint">{step.duration}</p>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}
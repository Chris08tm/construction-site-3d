import { testimonials } from '../data/testimonials';

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="reviews" className="scroll-mt-16 border-t border-line bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <figure className="lg:col-span-7">
          <p className="font-mono text-xs text-blueprint">4.9 average · 212 verified client reviews</p>
          <blockquote className="mt-6 text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            “{featured.quote}”
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <img
              src="/5ac2f1ea-9325-4e2a-b6e9-69d2e478f761.jpg"
              alt=""
              className="h-14 w-14 rounded-md object-cover" />
            
            <span>
              <span className="block font-semibold text-ink">{featured.name}</span>
              <span className="block text-sm text-muted">{featured.project}</span>
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col divide-y divide-line border-y border-line lg:col-span-5 lg:self-end">
          {rest.map((t) =>
          <figure key={t.name} className="py-7">
              <blockquote className="text-[15px] leading-relaxed text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="text-muted"> · {t.project}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>);

}
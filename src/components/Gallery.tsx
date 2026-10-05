import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2Icon } from 'lucide-react';
import { Lightbox } from './Lightbox';
import { galleryCategories, galleryItems } from '../data/gallery';
import type { GalleryCategory } from '../types/content';

type Filter = 'All' | GalleryCategory;

const spanClass = {
  tall: 'row-span-2',
  wide: 'col-span-2',
  base: ''
};

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const filters: Filter[] = ['All', ...galleryCategories];
  const visible = filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);
  const countFor = (f: Filter) => f === 'All' ? galleryItems.length : galleryItems.filter((i) => i.category === f).length;
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section id="gallery" className="scroll-mt-16 bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Recent work</h2>
            <p className="mt-4 text-lg text-muted">
              Finished homes, interiors and active job sites — photographed by our team, not staged by a catalog.
            </p>
          </div>
          <div role="tablist" aria-label="Filter gallery" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
            {filters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-150 ${
                  active ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-muted hover:text-ink'}`
                  }>
                  
                  {f}
                  <span className={`font-mono text-[11px] ${active ? 'text-paper/70' : 'text-muted/70'}`}>{countFor(f)}</span>
                </button>);

            })}
          </div>
        </div>

        <motion.ul layout className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-3 [grid-auto-flow:dense] md:auto-rows-[210px] md:grid-cols-4">
          <AnimatePresence initial={false}>
            {visible.map((item, i) =>
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={spanClass[item.span]}>
              
                <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block h-full w-full overflow-hidden rounded-lg bg-line text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blueprint focus-visible:ring-offset-2"
                aria-label={`Open ${item.title}, ${item.location}`}>
                
                  <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-ink/70 px-3.5 py-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span>
                      <span className="block text-sm font-semibold text-paper">{item.title}</span>
                      <span className="block text-xs text-paper/75">
                        {item.location} · {item.year}
                      </span>
                    </span>
                    <Maximize2Icon className="h-4 w-4 shrink-0 text-paper" aria-hidden="true" />
                  </span>
                </button>
              </motion.li>
            )}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {openIndex !== null &&
        <Lightbox items={visible} index={openIndex} onClose={close} onNavigate={setOpenIndex} />
        }
      </AnimatePresence>
    </section>);

}
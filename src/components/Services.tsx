import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { services } from '../data/services';

export function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <section id="services" className="scroll-mt-16 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">What we build</h2>
          <p className="mt-4 text-lg text-muted">
            Design, engineering and construction under one roof — so the drawings, the budget and the finished home all
            agree.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <ul className="lg:col-span-5" role="tablist" aria-label="Services">
            {services.map((service) => {
              const selected = service.id === activeId;
              return (
                <li key={service.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="service-panel"
                    onClick={() => setActiveId(service.id)}
                    onMouseEnter={() => setActiveId(service.id)}
                    onFocus={() => setActiveId(service.id)}
                    className="group flex w-full items-start gap-5 py-6 text-left">
                    
                    <span
                      aria-hidden="true"
                      className={`mt-3.5 h-px w-4 shrink-0 transition-colors duration-150 ${
                      selected ? 'bg-accent' : 'bg-line'}`
                      } />
                    
                    <span className="flex-1">
                      <span
                        className={`block text-xl font-semibold tracking-tight transition-colors duration-150 ${
                        selected ? 'text-ink' : 'text-muted group-hover:text-ink'}`
                        }>
                        
                        {service.title}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                        selected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`
                        }>
                        
                        <span className="overflow-hidden">
                          <span className="mt-3 block text-[15px] leading-relaxed text-muted">{service.description}</span>
                          <span className="mt-3 block font-mono text-xs text-blueprint">{service.timeline}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>);

            })}
          </ul>

          <div id="service-panel" role="tabpanel" className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-line">
              <AnimatePresence initial={false}>
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={active.imageAlt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 h-full w-full object-cover" />
                
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>);

}
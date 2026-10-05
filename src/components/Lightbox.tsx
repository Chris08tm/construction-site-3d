import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import type { GalleryItem } from '../types/content';

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];
  const prev = () => onNavigate((index - 1 + items.length) % items.length);
  const next = () => onNavigate((index + 1) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-ink/95"
      onClick={onClose}>
      
      <div className="flex items-center justify-between px-5 py-4 text-paper">
        <p className="font-mono text-xs text-paper/70">
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-paper transition-colors duration-150 hover:bg-white/10"
          aria-label="Close gallery">
          
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-paper transition-colors duration-150 hover:bg-white/20 sm:left-6"
          aria-label="Previous image">
          
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <motion.img
          key={item.id}
          src={item.image}
          alt={item.title}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="max-h-[74vh] max-w-full rounded-md object-contain" />
        
        <button
          type="button"
          onClick={next}
          className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-paper transition-colors duration-150 hover:bg-white/20 sm:right-6"
          aria-label="Next image">
          
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pb-6 pt-4 text-center text-paper" onClick={(e) => e.stopPropagation()}>
        <p className="text-base font-semibold">{item.title}</p>
        <p className="mt-1 text-sm text-paper/70">
          {item.location} · {item.year} · {item.category}
        </p>
      </div>
    </motion.div>);

}
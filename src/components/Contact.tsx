import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, Loader2Icon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { useQuoteForm, type QuoteFormValues } from '../hooks/useQuoteForm';

const projectTypes = ['New custom home', 'Whole-home renovation', 'Kitchen or bath', 'Addition or ADU', 'Outdoor living'];
const budgets = ['Under $250K', '$250K – $750K', '$750K – $1.5M', '$1.5M+'];

const inputBase =
'mt-1.5 w-full rounded-md border bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-blueprint/30';

export function Contact() {
  const { values, errors, status, update, submit, reset } = useQuoteForm();

  const field = (name: keyof QuoteFormValues) => ({
    id: name,
    name,
    value: values[name],
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `${inputBase} ${errors[name] ? 'border-accent' : 'border-line focus:border-blueprint'}`
  });

  const errorText = (name: keyof QuoteFormValues) =>
  errors[name] ?
  <p id={`${name}-error`} className="mt-1.5 text-xs text-accent">
        {errors[name]}
      </p> :
  null;

  return (
    <section id="contact" className="scroll-mt-16 bg-ink py-20 text-paper lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tell us about your project</h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">
            A project lead will call within one business day to schedule a free site consultation and a ballpark budget.
          </p>
          <ul className="mt-10 space-y-5 text-[15px]">
            <li className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 text-paper/60" aria-hidden="true" />
              <a href="tel:+16505550142" className="hover:underline">(650) 555-0142</a>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon className="h-4 w-4 text-paper/60" aria-hidden="true" />
              <a href="mailto:build@ridgelinebuild.co" className="hover:underline">build@ridgelinebuild.co</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 text-paper/60" aria-hidden="true" />
              <span>
                418 Alma Street, Palo Alto, CA 94301
                <span className="block text-sm text-paper/60">Mon–Fri, 7:30am – 5:30pm</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-paper p-6 text-ink sm:p-8 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ?
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="flex min-h-[420px] flex-col items-start justify-center"
              role="status">
              
                <CheckCircle2Icon className="h-8 w-8 text-blueprint" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">Thanks, {values.name.split(' ')[0]}.</h3>
                <p className="mt-2 max-w-md text-muted">
                  We’ve received your request and a project lead will reach out to {values.email} within one business day.
                </p>
                <button type="button" onClick={reset} className="mt-8 text-sm font-medium text-blueprint hover:underline">
                  Submit another request
                </button>
              </motion.div> :

            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="grid gap-5 sm:grid-cols-2">
              
                <div>
                  <label htmlFor="name" className="text-sm font-medium">Full name</label>
                  <input {...field('name')} autoComplete="name" onChange={(e) => update('name', e.target.value)} />
                  {errorText('name')}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input {...field('email')} type="email" autoComplete="email" onChange={(e) => update('email', e.target.value)} />
                  {errorText('email')}
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input {...field('phone')} type="tel" autoComplete="tel" onChange={(e) => update('phone', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="projectType" className="text-sm font-medium">Project type</label>
                  <select {...field('projectType')} onChange={(e) => update('projectType', e.target.value)}>
                    <option value="">Select one</option>
                    {projectTypes.map((t) =>
                  <option key={t} value={t}>{t}</option>
                  )}
                  </select>
                  {errorText('projectType')}
                </div>
                <fieldset className="sm:col-span-2">
                  <legend className="text-sm font-medium">Estimated budget</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                    {budgets.map((b) => {
                    const checked = values.budget === b;
                    return (
                      <label
                        key={b}
                        className={`flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border px-3 py-2.5 text-sm transition-colors duration-150 ${
                        checked ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink hover:border-ink/40'}`
                        }>
                        
                          <input
                          type="radio"
                          name="budget"
                          value={b}
                          checked={checked}
                          onChange={() => update('budget', b)}
                          className="sr-only" />
                        
                          {b}
                        </label>);

                  })}
                  </div>
                </fieldset>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    About the project <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <textarea
                  {...field('message')}
                  rows={4}
                  placeholder="Lot location, timeline, anything you already know you want…"
                  onChange={(e) => update('message', e.target.value)} />
                
                </div>
                <div className="flex flex-col-reverse items-start justify-between gap-4 sm:col-span-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-muted">We never share your details. No sales calls.</p>
                  <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex min-w-[170px] items-center justify-center gap-2 whitespace-nowrap rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors duration-150 hover:bg-blueprint-mid disabled:opacity-70">
                  
                    {status === 'submitting' ?
                  <>
                        <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </> :

                  'Request a consultation'
                  }
                  </button>
                </div>
              </motion.form>
            }
          </AnimatePresence>
        </div>
      </div>
    </section>);

}
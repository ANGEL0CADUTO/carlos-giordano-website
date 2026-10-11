import { motion } from 'motion/react';
import { Facebook, Instagram } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '../lib/i18n';

const minimumFormInteractionTime = 2500;

export default function Contact() {
  const { t } = useLanguage();
  const formStartedAt = useRef(Date.now());
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://example.com',
      Icon: Facebook,
    },
    {
      label: 'Instagram',
      href: 'https://example.com',
      Icon: Instagram,
    },
  ];

  useEffect(() => {
    if (window.location.hash !== '#modulo-contatti') return;

    window.requestAnimationFrame(() => {
      document.getElementById('modulo-contatti')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus('error');
    setFormMessage('Demo: message delivery is disabled. No information is transmitted.');
  }

  return (
    <div className="min-h-screen px-5 pb-20 pt-32 sm:px-6 md:px-10">
      <p role="note" style={{padding: "12px 20px", margin: "0 auto 20px", maxWidth: "72rem", background: "#fef3c7", color: "#78350f"}}>Demo: invio messaggi disattivato. Usa soltanto dati fittizi.</p>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="mb-10 font-serif text-4xl leading-tight sm:text-5xl md:mb-12 md:text-6xl">{t('contact.title')}</h1>
          <p className="mb-12 max-w-sm font-serif text-xl text-muted sm:text-2xl md:mb-14">
            {t('contact.intro')}
          </p>

          <div className="space-y-9">
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-widest text-muted">{t('contact.studio')}</h3>
              <p className="whitespace-pre-line text-lg">{t('contact.address')}</p>
              <p className="mt-2 text-sm text-muted">{t('contact.appointment')}</p>
            </div>

            <div>
              <h3 className="mb-2 text-xs uppercase tracking-widest text-muted">{t('contact.contacts')}</h3>
              <div className="flex flex-col space-y-2">
                <a href="mailto:hello@example.com" className="text-xl transition-opacity hover:opacity-60">
                  hello@example.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs uppercase tracking-widest text-muted">{t('contact.social')}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t('contact.openSocial')} ${label}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center border border-stone/60 bg-paper text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-paper"
                  >
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form id="modulo-contatti" onSubmit={handleContactSubmit} className="mt-12 scroll-mt-28 border border-ink/25 bg-white/75 p-5 shadow-[0_18px_50px_rgba(26,26,26,0.08)] sm:p-6">
            <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" style={{ display: 'none' }} aria-hidden="true" />
            <label className="hidden" style={{ display: 'none' }} aria-hidden="true">
              Non compilare questo campo
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="mb-7">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">{t('contact.writeStudio')}</p>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{t('contact.formTitle')}</h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">{t('contact.name')}</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  disabled={formStatus === 'submitting'}
                  className="w-full border border-stone/50 bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={t('contact.namePlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  disabled={formStatus === 'submitting'}
                  className="w-full border border-stone/50 bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">{t('contact.message')}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={6}
                  disabled={formStatus === 'submitting'}
                  className="w-full resize-none border border-stone/50 bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-ink disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </label>

              <button type="submit" disabled={formStatus === 'submitting'} className="w-full border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink disabled:hover:text-paper sm:w-auto">
                {formStatus === 'submitting' ? t('contact.sending') : t('contact.submit')}
              </button>
              {formMessage && (
                <p className={formStatus === 'success' ? 'text-sm text-ink' : 'text-sm text-red-700'} role="status" aria-live="polite">
                  {formMessage}
                </p>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="min-h-[360px] overflow-hidden border border-stone/40 bg-stone md:min-h-[620px]"
        >
          <img src="/demo/scene-2.svg" alt="Illustrazione dimostrativa" className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </div>
  );
}

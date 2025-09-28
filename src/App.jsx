import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSearchResults } from './services/searchApi.js';

const Button = ({ children, onClick, className = "", type = "button", disabled, title }) => (
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type={type} onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 disabled:opacity-60 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-slate-800 ${className}`}
  >{children}</motion.button>
);
const Pill = ({ children, active, onClick, className = "" }) => (
  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={onClick} aria-pressed={!!active}
    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ring-1 ring-inset ${active ? "bg-black text-white ring-black dark:bg-white dark:text-black dark:ring-white/60" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"} ${className}`}
  >{children}</motion.button>
);
const Card = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
    className={`rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] ${className}`}>{children}</motion.div>
);
const SectionTitle = ({ children }) => (<div className='text-xs uppercase tracking-wider text-gray-500 font-semibold dark:text-slate-400'>{children}</div>);

const SafeImage = ({ src, alt = '', className = '', fallbackLabel }) => {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  const label = (fallbackLabel || alt || '').trim();
  const fallbackInitial = label ? label[0].toUpperCase() : 'N';

  const showImage = src && status !== 'error';

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:border-slate-700/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 ${className}`}>
      {showImage && (
        <img
          src={src}
          alt={alt}
          loading='lazy'
          className={`h-full w-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      {showImage && status === 'loading' && (
        <div className='absolute inset-0 animate-pulse bg-gray-100 dark:bg-slate-800' aria-hidden='true' />
      )}
      {(!src || status === 'error') && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-200/60 via-slate-100/80 to-white text-slate-600 dark:from-slate-800/70 dark:via-slate-900/80 dark:to-slate-950'>
          <Icon d={D.image} className='h-5 w-5 text-indigo-500/60 dark:text-indigo-300/70' aria-hidden='true' />
          <span className='text-lg font-semibold tracking-wide text-slate-700 dark:text-slate-100'>{fallbackInitial}</span>
        </div>
      )}
    </div>
  );
};

const BrandMark = ({ className = 'h-10 w-10' }) => (
  <motion.div
    aria-hidden='true'
    initial={{ rotate: -12, scale: 0.94 }}
    animate={{ rotate: [-12, 6, -4, 10, -8, 6, -12], scale: [0.94, 1.02, 0.98, 1.03, 0.97, 1] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    className={`relative shrink-0 ${className}`}
  >
    <svg viewBox='0 0 120 120' className='h-full w-full drop-shadow-[0_22px_38px_rgba(76,29,149,0.32)]'>
      <defs>
        <linearGradient id='nova-bg' x1='15%' y1='5%' x2='95%' y2='90%'>
          <stop offset='0%' stopColor='#1e3a8a' />
          <stop offset='35%' stopColor='#4338ca' />
          <stop offset='75%' stopColor='#a855f7' />
          <stop offset='100%' stopColor='#f472b6' />
        </linearGradient>
        <radialGradient id='nova-glow' cx='24%' cy='18%' r='70%'>
          <stop offset='0%' stopColor='rgba(255,255,255,0.95)' />
          <stop offset='45%' stopColor='rgba(255,255,255,0.35)' />
          <stop offset='100%' stopColor='rgba(255,255,255,0)' />
        </radialGradient>
        <linearGradient id='nova-stroke' x1='0%' y1='20%' x2='100%' y2='80%'>
          <stop offset='0%' stopColor='#38bdf8' />
          <stop offset='50%' stopColor='#c084fc' />
          <stop offset='100%' stopColor='#f472b6' />
        </linearGradient>
      </defs>

      <path
        d='M28 0h64c15.46 0 28 12.54 28 28v64c0 15.46-12.54 28-28 28H28C12.54 120 0 107.46 0 92V28C0 12.54 12.54 0 28 0Z'
        fill='url(#nova-bg)'
      />
      <circle cx='40' cy='34' r='48' fill='url(#nova-glow)' />

      <motion.circle
        cx='88'
        cy='92'
        r='24'
        fill='rgba(59,130,246,0.32)'
        animate={{ opacity: [0.2, 0.55, 0.2], scale: [0.85, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.circle
        cx='30'
        cy='78'
        r='15'
        fill='rgba(186,230,253,0.35)'
        animate={{ opacity: [0.1, 0.5, 0.25, 0.1], scale: [0.9, 1.08, 1, 0.92] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.g
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 1, 0.85, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.path
          d='M36 87V33L84 87V33'
          fill='none'
          stroke='url(#nova-stroke)'
          strokeWidth='10'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeOpacity={0.98}
          strokeDasharray='232'
          initial={{ strokeDashoffset: 232 }}
          animate={{ strokeDashoffset: [232, 0, 0, 232] }}
          transition={{ duration: 6.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />
      </motion.g>

      <motion.circle
        cx='88'
        cy='34'
        r='10'
        fill='rgba(244, 238, 255, 0.55)'
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.65] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      <motion.circle
        cx='60'
        cy='60'
        r='49'
        stroke='rgba(255,255,255,0.14)'
        strokeWidth='2.4'
        fill='none'
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  </motion.div>
);

const Topbar = React.memo(({ navItems, currentRoute, onNavigate, onToggleTheme, isDark, onOpenMobile, isFeedbackActive, isSignInActive, clockLabel }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: .45 }}
    className='sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-100 dark:bg-slate-950/80 dark:border-slate-800'
  >
    <div className='mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 text-slate-900 dark:text-slate-100'>
      <div className='flex items-center gap-2 flex-1 min-w-0'>
        <BrandMark className='h-8 w-8' />
        <div className='font-extrabold tracking-tight text-lg'>NovaSearch</div>
        <span className='ml-2 rounded-full bg-black text-white text-[10px] px-2 py-0.5 dark:bg-white dark:text-black'>Beta</span>
        {clockLabel && (
          <div className='ml-4 hidden md:flex items-center font-mono text-xs tracking-[0.3em] text-slate-500/80 dark:text-slate-300/70 uppercase whitespace-nowrap'>
            {clockLabel}
          </div>
        )}
      </div>
      <div className='hidden md:flex items-center gap-1 ml-6'>
        {navItems.map(({ label, path }) => (
          <Pill key={label} active={currentRoute === path} onClick={() => onNavigate(path)}>
            {label}
          </Pill>
        ))}
      </div>
      <div className='ml-2 md:ml-auto hidden md:flex items-center gap-2 order-1 md:order-2 w-auto'>
        <Pill onClick={onToggleTheme} className='flex items-center gap-1' title='Toggle light/dark theme'>
          <Icon d={isDark ? D.sun : D.moon} className='opacity-70' />
          {isDark ? 'Light' : 'Dark'}
        </Pill>
        <Pill active={isFeedbackActive} onClick={() => onNavigate('/feedback')}>Feedback</Pill>
        <Pill active={isSignInActive} onClick={() => onNavigate('/signin')}>Sign in</Pill>
      </div>
      <Pill onClick={onOpenMobile} className='flex md:hidden items-center gap-1 px-3 py-2 text-sm ml-auto' title='Open quick actions'>
        <Icon d={D.menu} /> Quick actions
      </Pill>
    </div>
  </motion.div>
));

const Icon = ({ d, size = 18, className = '' }) => (<svg viewBox='0 0 24 24' width={size} height={size} className={className}><path fill='currentColor' d={d}/></svg>);
const D = {
  search: 'M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z',
  mic: 'M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zM11 19h2v3h-2z',
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 7A1.5 1.5 0 117 8.5 1.5 1.5 0 018.5 7zM6 17l3.5-4.5 2.5 3L15 12l3 5H6z',
  sparkle: 'M12 2l1.8 3.7L18 7.5l-3.7 1.8L12 13l-2.3-3.7L6 7.5l4.2-1.8L12 2zm7 9l1.2 2.4L22 15l-1.8.6L19 18l-.6-1.8L16 15l2.4-1.6L19 11zM5 13l.9 1.8L8 16l-1.8.6L5 18l-.6-1.4L3 16l1.4-1.2L5 13z',
  gear: 'M19.4 12.9a7.9 7.9 0 000-1.8l2-1.5-2-3.4-2.3.9a6.9 6.9 0 00-1.6-.9L15 2h-6l-.5 2.2a6.9 6.9 0 00-1.6.9l-2.3-.9-2 3.4 2 1.5a7.9 7.9 0 000 1.8L.6 14.4l2 3.4 2.3-.9c.5.4 1 .6 1.6.9L9 22h6l.5-2.2c.6-.3 1.1-.5 1.6-.9l2.3.9 2-3.4-2.6-1.5zM12 16a4 4 0 110-8 4 4 0 010 8z',
  chevronR: 'M9 6l6 6-6 6z',
  keyboard: 'M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm2 3h2v2H6V8zm3 0h2v2H9V8zm3 0h2v2h-2V8zm3 0h2v2h-2V8zM6 11h2v2H6v-2zm3 0h2v2H9v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM6 14h12v2H6v-2z',
  chat: 'M4 4h16a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5-5-5H4a2 2 0 01-2-2V6a2 2 0 012-2z',
  research: 'M9 2h6l.9 6H20v2h-1.6l-1.7 10.1A2.5 2.5 0 0114.3 22H9.7a2.5 2.5 0 01-2.4-1.9L5.6 10H4V8h4.1L9 2zm1.8 2l-.5 4h5.4l-.5-4h-4.4zm-1.5 6l1.6 10h3.2l1.6-10h-6.4z',
  close: 'M6.7 5.3L5.3 6.7 10.6 12l-5.3 5.3 1.4 1.4L12 13.4l5.3 5.3 1.4-1.4L13.4 12l5.3-5.3-1.4-1.4L12 10.6z',
  send: 'M3.4 20.6l17.8-8.6a1 1 0 000-1.8L3.4 1.4a1 1 0 00-1.4 1.1L4 11l-2 8.5a1 1 0 001.4 1.1zM6 13l12.1-3L6 7l1.2 4z',
  check: 'M9.3 16.6L4.7 12 6.1 10.6 9.3 13.8 17.9 5.2 19.3 6.6z',
  alert: 'M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 5a1 1 0 011 1v5a1 1 0 01-2 0V8a1 1 0 011-1zm0 10a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 17z',
  sun: 'M12 5a1 1 0 011-1h0a1 1 0 00-2 0h0a1 1 0 011 1zm0 2a5 5 0 105 5 5 5 0 00-5-5zm-7 5a1 1 0 011-1h0a1 1 0 000 2h0a1 1 0 01-1-1zm12.071-6.071l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM5.636 6.636a1 1 0 101.414-1.414l-.707-.707A1 1 0 104.929 5.93zM12 19a1 1 0 011-1h0a1 1 0 00-2 0h0a1 1 0 011 1zm7-5a1 1 0 01-1 1h0a1 1 0 000-2h0a1 1 0 011 1zm-2.929 6.071l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 10-1.414-1.414zM6.343 17.364l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 10-1.414-1.414z',
  moon: 'M20 12.41A8 8 0 1111.59 4a6 6 0 108.41 8.41z',
  menu: 'M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z'
};

const CYBER_STEPS = [
  'Spooling Nova core…',
  'Linking vector meshes…',
  'Synthesising intel shards…',
  'Calibrating kavach shields…',
  'Streaming realtime signals…'
];

const CLOCK_TIME_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

const CLOCK_DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const getRelativeTimeLabel = (timestamp, reference = new Date()) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = date.getTime() - reference.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const thresholds = [
    { limit: 60, unit: 'second', divisor: 1 },
    { limit: 3600, unit: 'minute', divisor: 60 },
    { limit: 86400, unit: 'hour', divisor: 3600 },
    { limit: 604800, unit: 'day', divisor: 86400 },
    { limit: 2629800, unit: 'week', divisor: 604800 },
    { limit: 31557600, unit: 'month', divisor: 2629800 }
  ];

  const absSeconds = Math.abs(diffSeconds);
  for (const { limit, unit, divisor } of thresholds) {
    if (absSeconds < limit) {
      const value = Math.round(diffSeconds / divisor);
      return RELATIVE_TIME_FORMATTER.format(value, unit);
    }
  }
  const years = Math.round(diffSeconds / 31557600);
  return RELATIVE_TIME_FORMATTER.format(years, 'year');
};

const LoadingDots = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const id = window.setInterval(() => {
      setStep((prev) => (prev + 1) % CYBER_STEPS.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  const current = CYBER_STEPS[step];
  const next = CYBER_STEPS[(step + 1) % CYBER_STEPS.length];

  return (
    <div className='py-6 flex justify-center' role='status' aria-live='polite'>
      <div className='relative w-full max-w-xs rounded-3xl border border-emerald-500/50 bg-slate-900/85 px-5 py-4 font-mono text-xs text-emerald-300 shadow-[0_0_35px_-16px_rgba(16,185,129,0.85)] dark:border-emerald-400/40 dark:bg-slate-950/90'>
        <motion.div
          className='pointer-events-none absolute inset-0 -skew-y-3 bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent'
          animate={{ x: ['-110%', '110%'] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
        />
        <motion.div
          className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        />
        <div className='relative space-y-3'>
          <div className='flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-emerald-400/80'>
            <span>nova-core</span>
            <motion.span
              key={step}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
            >
              #{`${step + 1}`.padStart(2, '0')}
            </motion.span>
          </div>
          <div className='overflow-hidden h-14'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={current}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className='text-sm font-semibold text-emerald-200'
              >
                {current}
              </motion.div>
            </AnimatePresence>
            <div className='pt-1 text-[11px] text-emerald-400/60'>{next}</div>
          </div>
          <div className='flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-emerald-400/40'>
            <span>signal</span>
            <motion.div
              className='flex-1 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0'
              animate={{ scaleX: [0.2, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              live
            </motion.span>
          </div>
        </div>
      </div>
      <span className='sr-only'>Running Nova search pipeline…</span>
    </div>
  );
};

const QUICK_ACTIONS = [
  { id: 'summary', label: 'Summarize this page' },
  { id: 'compare', label: 'Compare top 3' },
  { id: 'prosCons', label: 'Create pros/cons' },
  { id: 'steps', label: 'Extract steps' }
];

const NAV_ITEMS = [
  { label: 'Search', path: '/' },
  { label: 'Chat', path: '/chat' },
  { label: 'Research', path: '/research' }
];

const chatStarters = [
  'Summarise today\'s top AI search news',
  'Generate product positioning for NovaSearch',
  'Outline pros and cons of multi-modal search',
  'Draft onboarding emails for early adopters'
];

const researchStarters = [
  'Competitive analysis: vector search platforms',
  'Opportunities in privacy-first search',
  'Benchmarks for sub-300ms responses',
  'Key metrics for AI search adoption'
];

const FEEDBACK_TOPICS = ['Love it', 'Issue / bug', 'Feature request', 'Data quality', 'Other'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const Modal = ({ title, subtitle, icon, onClose, children, widthClass = 'max-w-4xl' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-center justify-center px-4 py-12 sm:px-6'>
      <motion.button type='button' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='absolute inset-0 h-full w-full bg-black/45 backdrop-blur-sm dark:bg-black/60' onClick={onClose} aria-label='Close overlay' />
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} transition={{ type: 'spring', stiffness: 250, damping: 28 }} className={`relative w-full ${widthClass}`}>
        <div className='rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden dark:bg-slate-950 dark:ring-slate-800/80'>
          <div className='flex items-start gap-3 border-b border-gray-100 px-5 py-4 dark:border-slate-800'>
            {icon}
            <div className='flex-1'>
              <div className='text-base font-semibold text-gray-900 dark:text-slate-100'>{title}</div>
              {subtitle && <div className='text-sm text-gray-500 mt-0.5 dark:text-slate-400'>{subtitle}</div>}
            </div>
            <button type='button' onClick={onClose} className='rounded-full p-1.5 text-gray-400 hover:text-gray-700 transition dark:text-slate-500 dark:hover:text-slate-200' aria-label='Close modal'>
              <Icon d={D.close} size={18} />
            </button>
          </div>
          <div className='max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-8 sm:py-6'>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ChatAssistant = ({ seedPrompt }) => {
  const [messages, setMessages] = useState(() => ([
    { id: 'intro', role: 'bot', text: 'Hey, I\'m Nova — your co-pilot for conversations about search. Drop a question and I\'ll riff on strategy, UX, and signals.' }
  ]));
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollAnchor = useRef(null);
  const pendingTimers = useRef([]);

  const schedule = (cb, delay) => {
    const id = window.setTimeout(cb, delay);
    pendingTimers.current.push(id);
  };

  useEffect(() => {
    return () => { pendingTimers.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const synthesiseReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return 'Hi there! Nova here. Want a quick summary, a launch plan, or maybe a competitive angle?';
    }
    if (lower.includes('roadmap')) {
      return 'Roadmap sketch:\n• Near-term: tighten ranking eval loops + instrument quality dashboards.\n• Mid-term: ship explainability affordances for blended AI answers.\n• Long-term: open APIs so partners can layer their own retrieval adapters.';
    }
    if (lower.includes('pricing')) {
      return 'For pricing, teams lean on usage-based bands: free dev tier, growth tier with collaboration seats, and enterprise with dedicated embeddings + on-prem connectors.';
    }
    if (lower.includes('vector') || lower.includes('embedding')) {
      return 'Vector story: combine hybrid dense/sparse retrieval, monitor drift with centroid snapshots, and auto-refresh embeddings whenever schema changes.';
    }
    const headline = `Here’s a quick pulse on ${text}`;
    return `${headline}:\n• Demand: up ${(text.length % 5 + 3) * 5}% quarter over quarter.\n• Users ask for faster trust signals and controllable AI answers.\n• Next move: pilot ${text} with a 10-company design partner cohort.`;
  };

  const pushBotMessage = (content) => {
    setIsThinking(true);
    schedule(() => {
      setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: content }]);
      setIsThinking(false);
    }, 600 + Math.min(1400, content.length * 8));
  };

  useEffect(() => {
    if (!seedPrompt) return;
    const trimmed = seedPrompt.trim();
    if (!trimmed) return;
    setInput(trimmed);
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: trimmed }]);
    pushBotMessage(synthesiseReply(trimmed));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    const message = { id: uid(), role: 'user', text: value };
    setMessages((prev) => [...prev, message]);
    setInput('');
    pushBotMessage(synthesiseReply(value));
  };

  const handleStarter = (starter) => {
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: starter }]);
    setInput('');
    pushBotMessage(synthesiseReply(starter));
  };

  const clearThread = () => {
    setMessages([{ id: 'intro', role: 'bot', text: 'Clean slate! What should we explore next?' }]);
    setInput('');
  };

  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap gap-2'>
        {chatStarters.map((starter) => (
          <Pill key={starter} onClick={() => handleStarter(starter)}>{starter}</Pill>
        ))}
      </div>
      <div className='rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-4 shadow-inner dark:border-[#1e293b] dark:bg-[#0b1426]'>
        <div className='h-[22rem] overflow-y-auto pr-2 flex flex-col gap-3'>
          {messages.map((msg) => (
            <div key={msg.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'self-end bg-black text-white' : 'self-start bg-white text-gray-800 shadow-sm ring-1 ring-gray-200/70 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700/80'}`}>
              <div className='font-medium mb-1 text-xs uppercase tracking-wide opacity-70'>{msg.role === 'user' ? 'You' : 'Nova'}</div>
              <div className='whitespace-pre-line'>{msg.text}</div>
            </div>
          ))}
          {isThinking && (
            <div className='self-start rounded-2xl bg-white px-4 dark:bg-slate-900'><LoadingDots /></div>
          )}
          <div ref={scrollAnchor}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='flex items-center gap-3 rounded-2xl border border-gray-200 px-3 py-2 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Ask Nova something…' className='flex-1 border-none bg-transparent text-sm focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500' />
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            onClick={clearThread}
            className='hidden sm:inline-flex bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-none ring-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:ring-slate-700'
          >
            Clear
          </Button>
          <Button
            type='submit'
            disabled={!input.trim()}
            className='px-5 py-2 bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent flex items-center gap-2 shadow-[0_18px_42px_-24px_rgba(30,64,175,0.75)] ring-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:from-gray-200 disabled:via-gray-200 disabled:to-gray-200 disabled:text-gray-500 disabled:hover:from-gray-200 disabled:hover:to-gray-200 disabled:hover:bg-transparent disabled:opacity-100 disabled:shadow-none'
          >
            Send
            <Icon d={D.send} size={16} className='opacity-80' />
          </Button>
        </div>
      </form>
    </div>
  );
};

const generateResearchReport = (topic) => {
  const normalized = topic.trim();
  const seed = normalized.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + normalized.length * 7;
  const focusAreas = ['Signal quality', 'UX polish', 'Latency', 'Data governance', 'Adoption'];
  const signalScores = focusAreas.map((area, index) => {
    const base = 62 + ((seed + index * 17) % 31);
    const trend = ((seed >> index) % 5) - 2;
    return { area, score: base, trend };
  });
  const strongest = signalScores.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), signalScores[0]);
  const momentum = ['accelerating', 'stable', 'experimental'];
  const narrative = momentum[(seed % momentum.length)];

  const sources = [
    {
      title: `${normalized} adoption benchmarks (Nova Labs)`,
      url: 'https://example.com/benchmarks',
      freshness: `${(seed % 18) + 2}h ago`,
      snippet: `Teams tracking ${normalized} report ${(seed % 25) + 40}% lift in discovery relevance when pairing human curation with embeddings.`
    },
    {
      title: `${normalized} landscape brief`,
      url: 'https://example.com/landscape',
      freshness: `${(seed % 5) + 1} days ago`,
      snippet: `Competitive pulse across ${normalized} shows focus on ${focusAreas[(seed + 2) % focusAreas.length].toLowerCase()} and transparent model overrides.`
    },
    {
      title: `Playbook: shipping ${normalized} in <6 weeks`,
      url: 'https://example.com/playbook',
      freshness: 'Updated weekly',
      snippet: `Checklist covering connectors, evaluation harnesses, and launch comms for a ${normalized} pilot.`
    }
  ];

  const initiatives = [
    {
      title: 'Design partner beta',
      owner: 'Product',
      detail: `Recruit 8–10 teams already exploring ${normalized} to co-create ranking dashboards.`,
      impact: 'High'
    },
    {
      title: 'Latency tiger team',
      owner: 'Engineering',
      detail: `Profile vector + rerank pipeline; target ${(seed % 80) + 220}ms P95 before public launch.`,
      impact: 'Medium'
    },
    {
      title: 'Trust playbook refresh',
      owner: 'Research',
      detail: `Document failure modes for ${normalized} and design redress controls.`,
      impact: 'High'
    }
  ];

  const timeline = [
    { label: 'Now', text: `Align teams on ${normalized} success metrics and data inventory.` },
    { label: '+30d', text: `Ship guided prototype with explainers focusing on ${strongest.area.toLowerCase()}.` },
    { label: '+90d', text: `Graduate to GA with guardrails and partner case studies for ${normalized}.` }
  ];

  return {
    topic: normalized,
    summary: `Synthesis for ${normalized}: momentum is ${narrative} with ${strongest.area.toLowerCase()} emerging as the standout lever. Expect compounding gains if we tackle ${signalScores[2].area.toLowerCase()} in parallel.`,
    signalScores,
    initiatives,
    sources,
    timeline
  };
};

const ResearchAssistant = ({ defaultTopic }) => {
  const [topic, setTopic] = useState(defaultTopic || 'Unified AI search');
  const [report, setReport] = useState(() => generateResearchReport(defaultTopic || 'Unified AI search'));
  const [loading, setLoading] = useState(false);
  const timers = useRef([]);

  const runResearch = (inputTopic) => {
    const subject = (inputTopic || topic || '').trim();
    if (!subject) return;
    setTopic(subject);
    setLoading(true);
    const id = window.setTimeout(() => {
      setReport(generateResearchReport(subject));
      setLoading(false);
    }, 700);
    timers.current.push(id);
  };

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-4 dark:border-[#1e293b] dark:bg-[#0b1426]'>
        <div>
          <label htmlFor='topic' className='block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200'>Focus area</label>
          <textarea id='topic' rows={2} value={topic} onChange={(e) => setTopic(e.target.value)} className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500' placeholder='What should we research?' />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            onClick={() => runResearch(topic)}
            disabled={loading || !topic.trim()}
            className='bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent shadow-[0_12px_30px_-12px_rgba(30,64,175,0.65)] ring-transparent disabled:from-gray-200 disabled:via-gray-200 disabled:to-gray-200 disabled:text-gray-500 disabled:hover:from-gray-200 disabled:hover:to-gray-200 disabled:hover:bg-transparent disabled:opacity-100 disabled:shadow-none'
          >
            Run research
          </Button>
          <span className='text-xs uppercase tracking-wide text-gray-400 hidden sm:inline dark:text-slate-500'>or try</span>
          {researchStarters.map((item) => (
            <Pill key={item} onClick={() => runResearch(item)}>{item}</Pill>
          ))}
        </div>
      </div>

      {loading && (
        <Card className='p-6 flex items-center justify-center'><LoadingDots /></Card>
      )}

      {report && !loading && (
        <div className='space-y-5'>
          <Card className='p-5 dark:bg-[#101b30] dark:border-[#1f2a40]'>
            <div className='text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2 dark:text-slate-400'>Executive pulse</div>
            <div className='text-base text-gray-800 leading-relaxed dark:text-slate-200'>{report.summary}</div>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            {report.signalScores.map(({ area, score, trend }) => (
              <Card key={area} className='p-4 flex flex-col gap-2 dark:bg-[#101b30] dark:border-[#1f2a40]'>
                <div className='flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-slate-200'>
                  <span>{area}</span>
                  <span className='text-gray-900 text-lg dark:text-slate-100'>{score}</span>
                </div>
                <div className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {trend >= 0 ? `▲ trending +${trend}` : `▼ trending ${trend}`}
                </div>
                <div className='text-xs text-gray-500 dark:text-slate-500'>Confidence mixes qualitative interviews with eval runs on ${report.topic.toLowerCase()} scenarios.</div>
              </Card>
            ))}
          </div>

          <Card className='p-5 space-y-4 dark:bg-[#101b30] dark:border-[#1f2a40]'>
            <div className='flex items-center gap-2'>
              <Icon d={D.sparkle} className='text-indigo-500' />
              <SectionTitle>Strategic initiatives</SectionTitle>
            </div>
            <div className='space-y-3'>
              {report.initiatives.map((item) => (
                <div key={item.title} className='rounded-2xl border border-gray-200 px-4 py-3 bg-white dark:border-[#202c45] dark:bg-[#0f1a2d]'>
                  <div className='flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100'>
                    <span>{item.title}</span>
                    <span className='text-xs uppercase tracking-wide rounded-full bg-gray-900 text-white px-2 py-0.5'>Owner: {item.owner}</span>
                    <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full ${item.impact === 'High' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'}`}>{item.impact} impact</span>
                  </div>
                  <div className='text-sm text-gray-600 mt-1 dark:text-slate-300'>{item.detail}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card className='p-5 space-y-3 dark:bg-[#101b30] dark:border-[#1f2a40]'>
              <div className='flex items-center gap-2'><Icon d={D.gear} className='text-sky-500' /> <SectionTitle>Timeline</SectionTitle></div>
              <div className='space-y-3'>
                {report.timeline.map((item) => (
                  <div key={item.label} className='rounded-xl border border-dashed border-gray-200 px-3 py-2 dark:border-slate-700'>
                    <div className='text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500'>{item.label}</div>
                    <div className='text-sm text-gray-700 mt-0.5 dark:text-slate-300'>{item.text}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className='p-5 space-y-3 dark:bg-[#101b30] dark:border-[#1f2a40]'>
              <div className='flex items-center gap-2'><Icon d={D.research} className='text-purple-500' /> <SectionTitle>Sources</SectionTitle></div>
              <div className='space-y-3'>
                {report.sources.map((source) => (
                  <a key={source.title} href={source.url} target='_blank' rel='noreferrer' className='block rounded-xl border border-gray-200 px-3 py-2 hover:border-gray-300 transition dark:border-slate-700 dark:hover:border-slate-500'>
                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-slate-500'><span>{source.freshness}</span><span>Open ↗</span></div>
                    <div className='text-sm font-semibold text-gray-900 mt-1 dark:text-slate-100'>{source.title}</div>
                    <div className='text-xs text-gray-600 mt-1 dark:text-slate-300'>{source.snippet}</div>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const FeedbackPanel = ({ initialQuery }) => {
  const [topic, setTopic] = useState(initialQuery ? 'Feature request' : FEEDBACK_TOPICS[0]);
  const [message, setMessage] = useState(initialQuery ? `Feedback about: ${initialQuery}\n\n` : '');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('idle');
  const timers = useRef([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    const id = window.setTimeout(() => setStatus('sent'), 900);
    timers.current.push(id);
  };

  const reset = () => {
    setTopic(FEEDBACK_TOPICS[0]);
    setMessage('');
    setEmail('');
    setRating(0);
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
            <div className='space-y-4 text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'>
          <Icon d={D.check} size={28} />
        </div>
        <div className='text-lg font-semibold text-gray-900 dark:text-slate-100'>Thanks for the signal!</div>
        <p className='text-sm text-gray-600 dark:text-slate-400'>We just captured your feedback and will reach out if we need more detail.</p>
        <div className='flex justify-center gap-2'>
          <Button onClick={reset} className='bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'>Send another</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className='space-y-5'>
      <div className='space-y-2'>
        <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>How&apos;s NovaSearch feeling?</label>
        <div className='flex gap-2'>
          {[1,2,3,4,5].map((value) => (
            <button
              key={value}
              type='button'
              onClick={() => setRating(value)}
              aria-pressed={rating === value}
              className={`h-10 w-10 rounded-2xl border text-sm font-semibold transition ${rating >= value ? 'border-amber-300 bg-amber-50 text-amber-600 shadow-sm dark:border-amber-400/80 dark:bg-amber-500/10 dark:text-amber-200' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-500'}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>Topic</label>
        <div className='flex flex-wrap gap-2'>
          {FEEDBACK_TOPICS.map((item) => (
            <Pill key={item} active={topic === item} onClick={() => setTopic(item)}>{item}</Pill>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>What should we know?</label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Tell us what worked, what felt off, or what you&apos;d ship next.'
          className='w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>Reply-to (optional)</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@company.com'
          className='w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500'
        />
        {email && !emailRegex.test(email) && (
          <div className='flex items-center gap-2 text-xs text-rose-500'><Icon d={D.alert} size={14}/>Enter a valid email so we can follow up.</div>
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='button' onClick={reset} className='bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'>Reset</Button>
        <Button
          type='submit'
          disabled={!message.trim() || (email && !emailRegex.test(email))}
          className='bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent shadow-[0_12px_30px_-12px_rgba(30,64,175,0.65)] ring-transparent disabled:from-gray-200 disabled:via-gray-200 disabled:to-gray-200 disabled:text-gray-500 disabled:hover:from-gray-200 disabled:hover:to-gray-200 disabled:hover:bg-transparent disabled:opacity-100 disabled:shadow-none'
        >
          {status === 'sending' ? 'Sending…' : 'Send feedback'}
        </Button>
      </div>
    </form>
  );
};

const AuthPanel = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const timers = useRef([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const simulate = (delay = 750, next = 'sent') => {
    setStatus('sending');
    const id = window.setTimeout(() => setStatus(next), delay);
    timers.current.push(id);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email) || password.length < 6) return;
    simulate();
  };

  const handleGoogle = () => {
    simulate(600, 'google');
  };

  if (status === 'sent' || status === 'google') {
    const headline = status === 'google' ? 'Signed in with Google!' : 'Welcome aboard!';
    const message = status === 'google' ? 'Google has verified your identity. We saved your session for next time.' : 'Your Nova account is ready. We set up your workspace using that email.';
    return (
      <div className='space-y-4 text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300'>
          <Icon d={D.check} size={28} />
        </div>
        <div className='text-lg font-semibold text-gray-900 dark:text-slate-100'>{headline}</div>
        <p className='text-sm text-gray-600 dark:text-slate-400'>{message}</p>
        <div className='flex justify-center gap-2'>
          <Button onClick={onClose} className='bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent shadow-[0_12px_30px_-12px_rgba(30,64,175,0.65)]'>Continue</Button>
        </div>
      </div>
    );
  }

  const disableEmailSubmit = !emailRegex.test(email) || password.length < 6 || status === 'sending';

  return (
    <div className='space-y-6'>
      <button
        type='button'
        onClick={handleGoogle}
        disabled={status === 'sending'}
        className='w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
      >
        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-inner ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-slate-600'>
          <span className='text-[15px] font-semibold text-[#4285F4]'>G</span>
        </span>
        {status === 'sending' ? 'Connecting…' : 'Sign in with Google'}
      </button>

      <div className='flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400 dark:text-slate-500'>
        <span className='flex-1 border-t border-gray-200 dark:border-slate-700'></span>
        <span>or</span>
        <span className='flex-1 border-t border-gray-200 dark:border-slate-700'></span>
      </div>

      <form onSubmit={handleEmailAuth} className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>Work email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@novasearch.ai'
            className='w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500'
          />
          {email && !emailRegex.test(email) && (
            <div className='flex items-center gap-2 text-xs text-rose-500'><Icon d={D.alert} size={14}/>Use a valid email to continue.</div>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-xs uppercase tracking-wide text-gray-500 font-medium dark:text-slate-400'>Create password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='At least 6 characters'
            className='w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500'
          />
          {password && password.length < 6 && (
            <div className='flex items-center gap-2 text-xs text-rose-500'><Icon d={D.alert} size={14}/>Must be at least 6 characters.</div>
          )}
        </div>

        <label className='inline-flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500'>
          <input type='checkbox' className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600' defaultChecked />
          Keep me signed in
        </label>

        <div className='flex justify-end gap-2'>
          <Button type='button' onClick={onClose} className='bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'>Cancel</Button>
          <Button
            type='submit'
            disabled={disableEmailSubmit}
            className='bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent shadow-[0_12px_30px_-12px_rgba(30,64,175,0.65)] ring-transparent disabled:from-gray-200 disabled:via-gray-200 disabled:to-gray-200 disabled:text-gray-500 disabled:hover:from-gray-200 disabled:hover:to-gray-200 disabled:hover:bg-transparent disabled:opacity-100 disabled:shadow-none'
          >
            {status === 'sending' ? 'Signing in…' : 'Continue with email'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const MOCK_RESULTS = [
  { title: 'How to design a next‑gen search UX', url: '#', site: 'example.com', snippet: 'A practical guide covering intent detection, AI answers, sources, and delightful micro‑interactions.' },
  { title: 'Efficient ranking signals in 2025', url: '#', site: 'example.com', snippet: 'From quality + freshness to user satisfaction loops: building robust, explainable ranking.' },
  { title: 'Unified Search: web, code, academic, and social', url: '#', site: 'example.com', snippet: 'How to merge heterogeneous sources into one coherent, controllable experience.' }
];
const IMAGE_RESULTS = Array.from({ length: 12 }, (_, i) => ({ src: `https://picsum.photos/seed/search-${i}/400/300`, alt: `Image ${i+1}` }));
export default function App(){
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [filters, setFilters] = useState({ time: 'Any time', region: 'Global', safe: true });
  const [filterSite, setFilterSite] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [quickAction, setQuickAction] = useState(null);
  const [quickOutput, setQuickOutput] = useState('');
  const [toast, setToast] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem('nova-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = location.pathname;
  const isChatOpen = currentRoute === '/chat';
  const isResearchOpen = currentRoute === '/research';
  const isFeedbackOpen = currentRoute === '/feedback';
  const isSignInOpen = currentRoute === '/signin';
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nova-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    runSearch(trimmed, { fromFilters: true, quickAction: quickAction || undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const id = window.setTimeout(() => {
      runSearch(trimmed, { fromFilters: true, quickAction: quickAction || undefined });
    }, 400);
    return () => window.clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSite]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const tabs = ['Overview','Web','Images','News','Video','Academic','Code'];

  const getSearchTypeForTab = (currentTab, invokingQuick) => {
    if (currentTab === 'Images' && !invokingQuick) return 'image';
    if (currentTab === 'News') return 'news';
    if (currentTab === 'Video') return 'video';
    if (currentTab === 'Academic') return 'academic';
    if (currentTab === 'Code') return 'code';
    return 'web';
  };

  const buildQuickActionOutput = (action, q, list) => {
    const top = list.slice(0, 3);
    if (!top.length) {
      return `No results to process for “${q}” just yet.`;
    }
    const bullet = (item) => item.snippet.replace(/•/g, '').split(' • ')[0];
    switch(action){
      case 'summary':
        return `Summary for “${q}”\n${top.map((item)=>`• ${item.title}: ${bullet(item)}`).join('\n')}`;
      case 'compare':
        return `Compare top ${top.length}\n${top.map((item, idx)=>`${idx+1}. ${item.title}\n   Strength: ${bullet(item)}\n   Source: ${item.site}`).join('\n')}`;
      case 'prosCons':
        return `Pros & cons for “${q}”\nPros\n${top.map((item)=>`+ ${item.title}: ${bullet(item)}`).join('\n')}\nCons\n${top.map((item)=>`- ${item.title}: Watch latency & data fit in ${filters.region}`).join('\n')}`;
      case 'steps':
        return `Next steps for “${q}”\n${top.map((item, idx)=>`${idx+1}. ${item.title}: ${bullet(item)}`).join('\n')}`;
      default:
        return '';
    }
  };



  const formatSourceHost = (site, url) => {
    if (site) return site;
    if (!url) return 'source';
    try {
      const host = new URL(url).hostname.replace(/^www\./, '');
      return host || url;
    } catch {
      return url;
    }
  };

  const condenseSnippet = (snippet) => {
    if (!snippet) return '';
    return snippet.replace(/\s+/g, ' ').replace(/•/g, '').trim();
  };

  const buildAiAnswerPayload = ({ query: answerQuery, filterSummary, results, usedLive }) => {
    if (!results.length) {
      return {
        text: `We couldn't find indexed results for “${answerQuery}” with ${filterSummary}. Try broadening the filters or using a different keyword.`,
        sources: [],
        usedLive,
      };
    }

    const top = results.slice(0, 3);
    const highlights = top.map((item) => {
      const snippet = condenseSnippet(item.snippet);
      const trimmed = snippet.length > 200 ? `${snippet.slice(0, 197).trim()}…` : snippet;
      return `• ${item.title} — ${trimmed || 'Open the source for full context.'}`;
    });

    const intro = `Here's what the web is saying about “${answerQuery}” (${filterSummary}).`;
    const meta = usedLive
      ? "Synthesised from Nova's live discovery pipeline — made in India."
      : "Powered by Nova's curated demo corpus — connect live sources to expand coverage.";

    const sources = top
      .map((item, idx) => {
        if (!item.url) return null;
        return {
          id: idx + 1,
          label: formatSourceHost(item.site, item.url),
          url: item.url,
        };
      })
      .filter(Boolean);

    return {
      text: [intro, meta, '', ...highlights].filter(Boolean).join('\n'),
      sources,
      usedLive,
    };
  };

  const runSearch = async (q, opts = {}) => {
    const effectiveQ = (q ?? query).trim();
    if(!effectiveQ) return;
    const invokingQuick = !!opts.quickAction;
    const activeTab = opts.tabOverride ?? tab;
    setLoading(true);
    if (!invokingQuick) { setQuickAction(null); setQuickOutput(''); }
    setAiAnswer(null);
    setResults([]);
    if (!opts.fromFilters) {
      setSuggestions([`${effectiveQ} explained simply`, `${effectiveQ} vs alternatives`, `${effectiveQ} latest updates 2025`]);
    }

    const siteScope = filterSite.trim();
    const filterSummary = `${filters.time} • ${filters.region}${siteScope ? ` • ${siteScope}` : ''} • Safe ${filters.safe ? 'on' : 'off'}`;

    const searchType = getSearchTypeForTab(activeTab, invokingQuick);
    let liveResults = [];
    let usedLive = false;
    try {
      liveResults = await fetchSearchResults({ query: effectiveQ, filters, siteScope, type: searchType });
      if (liveResults.length) usedLive = true;
    } catch (error) {
      console.warn('Live search failed', error);
      if (!toast) setToast('Using demo data — add VITE_SEARCH_API_KEY & VITE_SEARCH_CX for live results.');
    }

    let baseResults = usedLive ? liveResults : [...MOCK_RESULTS];
    if (searchType === 'image' && !usedLive) {
      baseResults = IMAGE_RESULTS;
    }
    if (!usedLive && searchType !== 'image' && !filters.safe) {
      baseResults.push({
        title: 'Deep-dive forum threads (unfiltered)',
        url: '#',
        site: 'community.example.com',
        snippet: 'Community chatter including raw, user-generated perspectives. May require discretion.'
      });
    }

    await new Promise(r=>setTimeout(r, usedLive ? 200 : 800));
    const enriched = baseResults.map((item, index) => {
      const snippet = (item.snippet || '').trim();
      return {
        ...item,
        site: siteScope && item.site === 'community.example.com' ? siteScope : item.site,
        snippet: snippet || item.title,
        url: item.url,
        title: index === 0 ? `${item.title} — ${filters.time}` : item.title
      };
    });

    const aiPayload = buildAiAnswerPayload({ query: effectiveQ, filterSummary, results: enriched, usedLive });
    setAiAnswer(aiPayload);

    setResults(enriched);
    setLoading(false);

    const actionToApply = opts.quickAction ?? (opts.fromFilters ? quickAction : null);
    if (actionToApply) {
      setQuickAction(actionToApply);
      setQuickOutput(buildQuickActionOutput(actionToApply, effectiveQ, enriched));
    }
  };

  const handleVoice = () => {
    if(!('webkitSpeechRecognition' in window)) { alert('Voice search not supported in this browser.'); return; }
    const rec = new window.webkitSpeechRecognition();
    rec.lang = 'en-IN';
    rec.onresult = (e)=>{ const t = e.results[0][0].transcript; setQuery(t); runSearch(t); };
    rec.start();
  };

  const siteScopeValue = filterSite.trim();
  const appliedFilterSummary = `${filters.time} • ${filters.region}${siteScopeValue ? ` • ${siteScopeValue}` : ''} • Safe ${filters.safe ? 'on' : 'off'}`;
  const safeKnobOffset = filters.safe ? 'calc(100% - 1.625rem)' : '0.125rem';

  const clockLabel = useMemo(() => {
    if (!now) return '';
    const timePart = CLOCK_TIME_FORMATTER.format(now);
    const datePart = CLOCK_DATE_FORMATTER.format(now).toUpperCase();
    return `${timePart} • ${datePart}`;
  }, [now]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), [setIsDark]);
  const handleNav = useCallback((path) => {
    navigate(path);
    setMobileActionsOpen(false);
  }, [navigate, setMobileActionsOpen]);
  const openMobileActions = useCallback(() => setMobileActionsOpen(true), [setMobileActionsOpen]);
  const handleQuickAction = (actionId) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setToast('Search for something first to unlock quick actions.');
      return;
    }
    setQuickAction(actionId);
    runSearch(trimmed, { quickAction: actionId });
  };

  const handleTabChange = (nextTab) => {
    if (nextTab === tab) {
      if (nextTab !== 'Overview') {
        const trimmed = query.trim();
        if (trimmed) runSearch(trimmed, { tabOverride: nextTab });
      }
      return;
    }
    setTab(nextTab);
    const trimmed = query.trim();
    if (trimmed) {
      runSearch(trimmed, { tabOverride: nextTab });
    }
  };

  const trimmedQuery = query.trim();

  return (
    <div className='min-h-screen bg-[radial-gradient(1000px_500px_at_10%_-10%,#f2f2f2,transparent),radial-gradient(800px_400px_at_80%_-20%,#f7f7f7,transparent)] dark:bg-[#02030a] dark:bg-[radial-gradient(1200px_750px_at_50%_-20%,rgba(41,74,255,0.12),transparent),radial-gradient(900px_600px_at_15%_-15%,rgba(124,58,237,0.12),transparent),linear-gradient(180deg,#02030a_0%,#010208_100%)] dark:text-slate-100 transition-colors duration-300'>
      <Topbar
        navItems={NAV_ITEMS}
        currentRoute={currentRoute}
        onNavigate={handleNav}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        onOpenMobile={openMobileActions}
        isFeedbackActive={isFeedbackOpen}
        isSignInActive={isSignInOpen}
        clockLabel={clockLabel}
      />
      <AnimatePresence>
        {mobileActionsOpen && (
          <motion.div key='mobile-actions' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 md:hidden'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='absolute inset-0 bg-black/40' onClick={()=>setMobileActionsOpen(false)} />
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }} className='absolute bottom-0 left-0 right-0 px-4 pb-6'>
              <div className='rounded-3xl bg-white dark:bg-slate-950 shadow-xl p-5 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm font-semibold text-gray-700 dark:text-slate-100'>Quick actions</div>
                  <button type='button' className='text-xs uppercase tracking-wide text-gray-400' onClick={()=>setMobileActionsOpen(false)}>Close</button>
                </div>
                <div className='space-y-3'>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2'>Navigate</div>
                    <div className='grid grid-cols-1 gap-2'>
                      {NAV_ITEMS.map(({ label, path }) => (
                        <Button key={label} onClick={()=>handleNav(path)} className='w-full justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>
                          {label}
                          <Icon d={D.chevronR} size={14} className='opacity-70' />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-2'>Actions</div>
                    <div className='grid grid-cols-1 gap-2'>
                      <Button onClick={()=>{toggleTheme(); setMobileActionsOpen(false);}} className='w-full justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>
                        <span>Theme</span>
                        <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
                      </Button>
                      <Button onClick={()=>handleNav('/feedback')} className='w-full justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>
                        <span>Feedback</span>
                        <Icon d={D.chevronR} size={14} className='opacity-70' />
                      </Button>
                      <Button onClick={()=>handleNav('/signin')} className='w-full justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>
                        <span>Sign in</span>
                        <Icon d={D.chevronR} size={14} className='opacity-70' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {toast && (
        <div className='fixed top-4 right-4 z-[60] rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm'>
          {toast}
        </div>
      )}
      <main className='mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-[270px,1fr] gap-4 sm:gap-6'>
        {/* Sidebar */}
        <aside className='order-2 lg:order-1 space-y-4'>
          <Card className='p-4 sm:p-5'>
            <div className='flex items-center gap-2 mb-3'><Icon d={D.gear} size={18} className='opacity-60'/><SectionTitle>Filters</SectionTitle></div>
            <div className='space-y-4 text-sm'>
              <div>
                <div className='text-gray-600 mb-1 dark:text-slate-400'>Time</div>
                <div className='flex flex-wrap gap-2'>
                  {['Any time','Past day','Past week','Past month','Past year'].map(t => (
                    <Pill key={t} active={filters.time===t} onClick={()=>setFilters(f=>({...f,time:t}))}>{t}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <div className='text-gray-600 mb-1 dark:text-slate-400'>Region</div>
                <div className='flex flex-wrap gap-2'>
                  {['Global','India','US','EU','SEA'].map(r => (
                    <Pill key={r} active={filters.region===r} onClick={()=>setFilters(f=>({...f,region:r}))}>{r}</Pill>
                  ))}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='text-gray-600 dark:text-slate-400'>SafeSearch</div>
                <label className='inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' checked={filters.safe} onChange={(e)=>setFilters(f=>({...f, safe: e.target.checked}))} />
                  <div className='relative inline-flex h-6 w-12 items-center rounded-full bg-gray-500 transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-400 peer-checked:bg-[#9333ea] dark:bg-slate-800 dark:peer-checked:bg-[#a855f7]'>
                    <div className='absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300' style={{ left: safeKnobOffset }} />
                  </div>
                </label>
              </div>
              <div className='pt-2 border-t'>
                <div className='text-gray-600 mb-1 dark:text-slate-400'>Site / filetype</div>
                <div className='flex gap-2'>
                  <input
                    value={filterSite}
                    onChange={(e)=>setFilterSite(e.target.value)}
                    placeholder='site:example.com OR filetype:pdf'
                    className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-500/40 dark:placeholder:text-slate-500'
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card className='p-4 sm:p-5'>
            <div className='flex items-center gap-2 mb-3'><Icon d={D.sparkle} size={18} className='opacity-60'/><SectionTitle>Quick actions</SectionTitle></div>
            <div className='flex flex-wrap gap-2'>
              {QUICK_ACTIONS.map(({ id, label }) => (
                <Pill key={id} active={quickAction===id} onClick={()=>handleQuickAction(id)}>{label}</Pill>
              ))}
            </div>
          </Card>
        </aside>

        {/* Main */}
        <section className='order-1 lg:order-2 space-y-4'>
          {/* Search bar */}
          <Card className='p-3 sm:p-4'>
            <form onSubmit={(e)=>{e.preventDefault(); runSearch();}} className='flex flex-col gap-3 sm:flex-row sm:items-center' role='search' aria-label='Universal search'>
              <div className='flex items-center gap-3 px-3 sm:px-4 py-3 rounded-3xl bg-white shadow-[0_32px_60px_-38px_rgba(15,23,42,0.45)] ring-1 ring-gray-200/75 w-full focus-within:ring-[rgba(129,140,248,0.5)] focus-within:shadow-[0_36px_72px_-40px_rgba(79,70,229,0.6)] transition-all dark:bg-[#0f172a] dark:ring-[#1f2937] dark:focus-within:ring-[rgba(99,102,241,0.6)] dark:focus-within:shadow-[0_36px_72px_-38px_rgba(99,102,241,0.45)]'>
                <div className='shrink-0 rounded-2xl bg-gray-100 text-gray-500 p-2 dark:bg-slate-800 dark:text-slate-300'><Icon d={D.search} /></div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  placeholder='Ask anything… Try: "best way to plan a Bali trip for 5 days"'
                  className='w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500'
                />
                <div className='flex items-center gap-2 text-gray-500'>
                  <button type='button' onClick={()=>handleVoice()} className='p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700' title='Voice search'>
                    <Icon d={D.mic} />
                  </button>
                  <label className='p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700' title='Image search'>
                    <input type='file' className='sr-only' accept='image/*' onChange={()=>alert('Image uploaded — mock lens search.')} />
                    <Icon d={D.image} />
                  </label>
                </div>
              </div>
              <Button
                type='submit'
                className='self-end sm:self-auto px-5 py-2 bg-gradient-to-r from-black via-slate-900 to-indigo-900 text-white hover:from-black hover:via-slate-800 hover:to-indigo-800 hover:bg-transparent flex items-center gap-2 shadow-[0_18px_42px_-24px_rgba(30,64,175,0.75)] ring-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'
              >
                <span>Search</span>
                <Icon d={D.chevronR} className='opacity-90' />
              </Button>
            </form>
            {suggestions.length>0 && (
              <div className='flex flex-wrap gap-2 px-1 pt-3 text-sm'>
                {suggestions.map(s => <Pill key={s} onClick={()=>{ setQuery(s); runSearch(s); }}>{s}</Pill>)}
              </div>
            )}
            <div className='px-1 pt-3 text-xs uppercase tracking-wide text-gray-400 dark:text-slate-500'>Applied: {appliedFilterSummary}</div>
            <div className='px-1 text-xs text-gray-500 dark:text-slate-400'>
              {filters.safe ? 'SafeSearch is ON — sensitive or explicit sources are filtered out.' : 'SafeSearch is OFF — showing the full spectrum of sources, including unfiltered community content.'}
            </div>
          </Card>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className='flex items-center gap-2 px-1 overflow-x-auto scrollbar-none snap-x snap-mandatory'>
            {tabs.map(t => <Pill key={t} active={tab===t} onClick={()=>handleTabChange(t)} className='snap-start flex-shrink-0'>{t}</Pill>)}
          </motion.div>

          {/* Panels with animated presence */}
          <AnimatePresence mode='wait'>
            {tab==='Overview' && (
              <motion.div key='overview' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} className='space-y-4'>
                <Card className='p-5'>
                  <div className='flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-slate-300'><Icon d={D.sparkle} className='opacity-70'/> AI Answer</div>
                  {loading ? (
                    <div className='flex flex-col items-center justify-center py-6'>
                      <LoadingDots />
                      <div className='text-xs text-gray-500'>Crafting a concise, sourced overview…</div>
                    </div>
                  ) : aiAnswer ? (
                    <pre className='whitespace-pre-wrap text-sm leading-6 text-gray-800 dark:text-slate-100 dark:font-medium'>{aiAnswer.text}</pre>
                  ) : (
                    <div className='text-sm text-gray-500 dark:text-slate-400'>Ask something to get a synthesized overview with sources.</div>
                  )}
                  {!loading && aiAnswer?.sources?.length ? (
                    <div className='pt-3 mt-3 border-t text-xs text-gray-600 dark:text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1'>
                      <span>Sources:</span>
                      {aiAnswer.sources.map((source) => (
                        <a key={source.id} href={source.url} target='_blank' rel='noreferrer' className='underline text-gray-700 dark:text-indigo-300'>[{source.id}] {source.label}</a>
                      ))}
                    </div>
                  ) : null}
                </Card>

                {quickAction && quickOutput && (
                  <Card className='p-5 border-l-4 border-l-indigo-400/70 dark:border-l-indigo-500/70 bg-indigo-50/50 dark:bg-[#111c33]'>
                    <div className='flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-slate-200'>
                      <span>{QUICK_ACTIONS.find(a=>a.id===quickAction)?.label}</span>
                      <button type='button' className='text-xs uppercase tracking-wide text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200' onClick={()=>{setQuickAction(null); setQuickOutput('');}}>Clear</button>
                    </div>
                    <pre className='mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-800 dark:text-slate-100'>{quickOutput}</pre>
                  </Card>
                )}

                <Card className='p-5'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600 dark:text-slate-300'>Top results</div>
                    <div className='text-xs text-gray-500 dark:text-slate-500'>{appliedFilterSummary}</div>
                  </div>
                  {loading ? (
                    <div className='flex flex-col items-center gap-6 py-4'>
                      <LoadingDots />
                      <div className='w-full divide-y opacity-60' aria-hidden='true'>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className='py-4 animate-pulse'>
                            <div className='h-4 w-2/3 bg-gray-200 rounded'/>
                            <div className='h-3 w-5/6 bg-gray-100 rounded mt-2'/>
                            <div className='h-3 w-1/2 bg-gray-100 rounded mt-2'/>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='divide-y'>
                      {results.map((r, i) => (
                        <div key={i} className='py-5 flex flex-col sm:flex-row sm:items-start sm:gap-3'>
                          <div className='mb-3 sm:mb-0 sm:mt-1'>
                            <SafeImage
                              src={r.image}
                              alt={r.title}
                              fallbackLabel={r.title}
                              className='w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-xl'
                            />
                          </div>
                          <div className='flex-1 space-y-2'>
                            <a href={r.url} target='_blank' rel='noreferrer' className='text-lg font-semibold hover:underline'>{r.title}</a>
                            <div className='text-xs text-gray-500 dark:text-slate-500 break-all'>{r.site}</div>
                            <p className='text-sm text-gray-700 dark:text-slate-300'>{r.snippet}</p>
                            <div className='flex flex-wrap items-center gap-2'>
                              <Pill onClick={()=>window.open(r.url, '_blank')}>Open</Pill>
                              <Pill onClick={()=>handleQuickAction('summary')}>Summarize</Pill>
                              <Pill onClick={()=>handleQuickAction('compare')}>Compare</Pill>
                              <Pill onClick={()=>handleQuickAction('prosCons')}>Pros/cons</Pill>
                              <Pill onClick={()=>handleQuickAction('steps')}>Steps</Pill>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Web' && (
              <motion.div key='web' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    results.length ? (
                      <div className='divide-y'>
                        {results.map((r, i) => (
                          <div key={i} className='py-5'>
                            <a href={r.url} target='_blank' rel='noreferrer' className='text-lg font-semibold hover:underline dark:text-slate-100'>{r.title}</a>
                            <div className='text-xs text-gray-500 mt-1 dark:text-slate-500'>{r.site}</div>
                            <p className='text-sm text-gray-700 mt-2 dark:text-slate-300'>{r.snippet}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No live web results yet. Try broadening the query or adjusting filters.</div>
                    )
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Images' && (
              <motion.div key='images' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    results.length ? (
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                        {results.map((img, i) => (
                          <motion.figure key={`${img.url}-${i}`} whileHover={{ scale: 1.02 }} className='rounded-2xl'>
                            <a href={img.url} target='_blank' rel='noreferrer'>
                              <SafeImage
                                src={img.image || img.url}
                                alt={img.title}
                                fallbackLabel={img.title}
                                className='w-full h-40'
                              />
                            </a>
                            <figcaption className='px-2 py-1 text-[11px] text-gray-500 dark:text-slate-400 truncate'>{img.title}</figcaption>
                          </motion.figure>
                        ))}
                      </div>
                    ) : (
                      <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No image matches yet. Try a different term or loosen filters.</div>
                    )
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='News' && (
              <motion.div key='news' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='grid gap-3'>
                      {results.length ? results.map((n, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} className='flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-2xl border border-gray-200 dark:border-slate-700'>
                          <div className='flex items-center gap-3 flex-1 min-w-0'>
                            <SafeImage src={n.image} alt={n.title} fallbackLabel={n.site} className='h-14 w-14 rounded-xl shrink-0' />
                            <div className='space-y-1 min-w-0'>
                              <a href={n.url} target='_blank' rel='noreferrer' className='font-semibold dark:text-slate-100 hover:underline block'>{n.title}</a>
                              <div className='text-xs text-gray-500 dark:text-slate-500'>
                                {n.byline || n.site}
                                {n.published && (
                                  <span> • {getRelativeTimeLabel(n.published, now)}</span>
                                )}
                              </div>
                              <p className='text-sm text-gray-700 dark:text-slate-300'>{n.snippet}</p>
                            </div>
                          </div>
                          <div className='md:ml-auto'>
                            <Button onClick={()=>window.open(n.url, '_blank')} className='bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>Open <Icon d={D.chevronR}/></Button>
                          </div>
                        </motion.div>
                      )) : (
                        <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No live news hits yet. Try broadening the query or adjusting filters.</div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Video' && (
              <motion.div key='video' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='grid md:grid-cols-2 gap-4'>
                      {results.length ? results.map((video, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} className='rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60'>
                          <a href={video.url} target='_blank' rel='noreferrer'>
                            <SafeImage src={video.image} alt={video.title} fallbackLabel={video.site} className='w-full aspect-video' />
                          </a>
                          <div className='p-3 space-y-2'>
                            <a href={video.url} target='_blank' rel='noreferrer' className='font-semibold dark:text-slate-100 hover:underline block'>{video.title}</a>
                            <div className='text-xs text-gray-500 dark:text-slate-500 flex items-center gap-2 flex-wrap'>
                              <span>{video.site}</span>
                              {video.duration && <span>• {video.duration}</span>}
                              {video.published && <span>• {getRelativeTimeLabel(video.published, now)}</span>}
                            </div>
                            <p className='text-sm text-gray-700 dark:text-slate-300'>{video.snippet}</p>
                          </div>
                        </motion.div>
                      )) : (
                        <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No video-focused sources matched yet.</div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Academic' && (
              <motion.div key='academic' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='space-y-4'>
                      {results.length ? results.map((paper, i) => (
                        <div key={i} className='p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70'>
                          <a href={paper.url} target='_blank' rel='noreferrer' className='font-semibold dark:text-slate-100 hover:underline block'>{paper.title}</a>
                          <div className='text-xs text-gray-500 dark:text-slate-500 mt-1 flex flex-wrap gap-2'>
                            <span>{paper.site}</span>
                            {paper.published && <span>• {new Date(paper.published).toLocaleDateString()}</span>}
                          </div>
                          <p className='text-sm text-gray-700 mt-2 dark:text-slate-300'>{paper.snippet}</p>
                          <div className='flex gap-2 mt-2 flex-wrap'>
                            <Pill onClick={()=>window.open(paper.url, '_blank')}>Open</Pill>
                            <Pill onClick={()=>handleQuickAction('summary')}>Brief me</Pill>
                            <Pill onClick={()=>handleQuickAction('prosCons')}>Pros & cons</Pill>
                          </div>
                        </div>
                      )) : (
                        <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No academic sources detected for this query.</div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Code' && (
              <motion.div key='code' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='space-y-4'>
                      {results.length ? results.map((code, i) => (
                        <div key={i} className='p-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60'>
                          <a href={code.url} target='_blank' rel='noreferrer' className='font-semibold dark:text-slate-100 hover:underline'>{code.title}</a>
                          <div className='text-xs text-gray-500 dark:text-slate-500 mt-1'>{code.site}</div>
                          <p className='text-sm text-gray-700 mt-2 dark:text-slate-300 line-clamp-4'>{code.snippet}</p>
                          <div className='flex gap-2 mt-3 flex-wrap'>
                            <Pill onClick={()=>window.open(code.url, '_blank')}>Open</Pill>
                            <Pill onClick={()=>handleQuickAction('steps')}>Implementation steps</Pill>
                          </div>
                        </div>
                      )) : (
                        <div className='text-sm text-gray-500 dark:text-slate-400 text-center py-6'>No code repositories or snippets found yet.</div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='hidden md:block text-center text-xs text-gray-500 py-6 dark:text-slate-500'>By Cavebeat, Crafting Reliability.</div>
        </section>
      </main>
      <div className='md:hidden text-center text-xs text-gray-500 py-6 dark:text-slate-500'>By Cavebeat, Crafting Reliability.</div>
      <AnimatePresence>
        {isChatOpen && (
          <Modal
            key='chat-modal'
            title='NovaChat'
            subtitle='Conversational strategist for lightning-fast answers.'
            icon={<div className='mt-1'><Icon d={D.chat} className='text-sky-500' /></div>}
            onClose={() => navigate('/')}
          >
            <ChatAssistant seedPrompt={trimmedQuery || undefined} />
          </Modal>
        )}
        {isResearchOpen && (
          <Modal
            key='research-modal'
            title='Research Canvas'
            subtitle='Auto-compile signals, initiatives, and sources in seconds.'
            icon={<div className='mt-1'><Icon d={D.research} className='text-purple-500' /></div>}
            onClose={() => navigate('/')}
          >
            <ResearchAssistant defaultTopic={trimmedQuery || undefined} />
          </Modal>
        )}
        {isFeedbackOpen && (
          <Modal
            key='feedback-modal'
            title='Feedback hub'
            subtitle='Share signal so we can sharpen NovaSearch.'
            icon={<div className='mt-1'><Icon d={D.sparkle} className='text-amber-500' /></div>}
            onClose={() => navigate('/')}
            widthClass='max-w-3xl'
          >
            <FeedbackPanel initialQuery={trimmedQuery || undefined} />
          </Modal>
        )}
        {isSignInOpen && (
          <Modal
            key='signin-modal'
            title='Sign in to NovaSearch'
            subtitle='Access saved workspaces, evals, and custom connectors.'
            icon={<div className='mt-1'><Icon d={D.chat} className='text-indigo-500' /></div>}
            onClose={() => navigate('/')}
            widthClass='max-w-lg'
          >
            <AuthPanel onClose={() => navigate('/')} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

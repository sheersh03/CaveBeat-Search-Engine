import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({ children, onClick, className = "", type = "button", disabled, title }) => (
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type={type} onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 disabled:opacity-60 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition ${className}`}
  >{children}</motion.button>
);
const Pill = ({ children, active, onClick, className = "" }) => (
  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={onClick}
    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ring-1 ring-inset ${active ? "bg-black text-white ring-black" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"} ${className}`}
  >{children}</motion.button>
);
const Card = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
    className={`rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition ${className}`}>{children}</motion.div>
);
const SectionTitle = ({ children }) => (<div className='text-xs uppercase tracking-wider text-gray-500 font-semibold'>{children}</div>);

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

const Icon = ({ d, size = 18, className = '' }) => (<svg viewBox='0 0 24 24' width={size} height={size} className={className}><path fill='currentColor' d={d}/></svg>);
const D = {
  search: 'M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z',
  mic: 'M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zM11 19h2v3h-2z',
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 7A1.5 1.5 0 117 8.5 1.5 1.5 0 018.5 7zM6 17l3.5-4.5 2.5 3L15 12l3 5H6z',
  sparkle: 'M12 2l1.8 3.7L18 7.5l-3.7 1.8L12 13l-2.3-3.7L6 7.5l4.2-1.8L12 2zm7 9l1.2 2.4L22 15l-1.8.6L19 18l-.6-1.8L16 15l2.4-1.6L19 11zM5 13l.9 1.8L8 16l-1.8.6L5 18l-.6-1.4L3 16l1.4-1.2L5 13z',
  gear: 'M19.4 12.9a7.9 7.9 0 000-1.8l2-1.5-2-3.4-2.3.9a6.9 6.9 0 00-1.6-.9L15 2h-6l-.5 2.2a6.9 6.9 0 00-1.6.9l-2.3-.9-2 3.4 2 1.5a7.9 7.9 0 000 1.8L.6 14.4l2 3.4 2.3-.9c.5.4 1 .6 1.6.9L9 22h6l.5-2.2c.6-.3 1.1-.5 1.6-.9l2.3.9 2-3.4-2.6-1.5zM12 16a4 4 0 110-8 4 4 0 010 8z',
  chevronR: 'M9 6l6 6-6 6z',
  keyboard: 'M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm2 3h2v2H6V8zm3 0h2v2H9V8zm3 0h2v2h-2V8zm3 0h2v2h-2V8zM6 11h2v2H6v-2zm3 0h2v2H9v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zM6 14h12v2H6v-2z'
};

const LoadingDots = () => (
  <div className='flex items-center gap-2 py-6' role='status' aria-live='polite'>
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className='h-2 w-2 rounded-full bg-black'></motion.div>
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className='h-2 w-2 rounded-full bg-black'></motion.div>
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className='h-2 w-2 rounded-full bg-black'></motion.div>
    <span className='sr-only'>Loading…</span>
  </div>
);

const MOCK_RESULTS = [
  { title: 'How to design a next‑gen search UX', url: '#', site: 'example.com', snippet: 'A practical guide covering intent detection, AI answers, sources, and delightful micro‑interactions.' },
  { title: 'Efficient ranking signals in 2025', url: '#', site: 'example.com', snippet: 'From quality + freshness to user satisfaction loops: building robust, explainable ranking.' },
  { title: 'Unified Search: web, code, academic, and social', url: '#', site: 'example.com', snippet: 'How to merge heterogeneous sources into one coherent, controllable experience.' }
];
const IMAGE_RESULTS = Array.from({ length: 12 }, (_, i) => ({ src: `https://picsum.photos/seed/search-${i}/400/300`, alt: `Image ${i+1}` }));
const NEWS_RESULTS = [
  { title: 'Breakthrough in realtime multi‑search', source: 'Tech Daily', time: '2h ago', snippet: 'New pipelines fuse web, academic, code, and videos in under 300ms.' },
  { title: 'Privacy‑first ranking debuts', source: 'The Ledger', time: '6h ago', snippet: 'On‑device signals with federated learning reduce data sharing by 90%.' }
];

export default function App(){
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [aiAnswer, setAiAnswer] = useState('');
  const [filters, setFilters] = useState({ time: 'Any time', region: 'Global', safe: true });
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const tabs = ['Overview','Web','Images','News','Video','Academic','Code'];

  const runSearch = async (q) => {
    const effectiveQ = (q ?? query).trim();
    if(!effectiveQ) return;
    setLoading(true); setAiAnswer(''); setResults([]);
    setSuggestions([`${effectiveQ} explained simply`, `${effectiveQ} vs alternatives`, `${effectiveQ} latest updates 2025`]);
    await new Promise(r=>setTimeout(r,800));
    setAiAnswer(`Here’s a concise overview of “${effectiveQ}”:
• TL;DR — A crisp, sourced summary. [1][2]
• Key angles — What, why, trade‑offs, and next steps.
• Sources — Expand to verify citations and related viewpoints.`);
    await new Promise(r=>setTimeout(r,500));
    setResults(MOCK_RESULTS);
    setLoading(false);
  };

  const handleVoice = () => {
    if(!('webkitSpeechRecognition' in window)) { alert('Voice search not supported in this browser.'); return; }
    const rec = new window.webkitSpeechRecognition();
    rec.lang = 'en-IN';
    rec.onresult = (e)=>{ const t = e.results[0][0].transcript; setQuery(t); runSearch(t); };
    rec.start();
  };

  const Topbar = () => (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45 }} className='sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-100'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <BrandMark className='h-8 w-8' />
          <div className='font-extrabold tracking-tight text-lg'>NovaSearch</div>
          <span className='ml-2 rounded-full bg-black text-white text-[10px] px-2 py-0.5'>Beta</span>
        </div>
        <div className='hidden md:flex items-center gap-1 ml-6'>
          {['Search','Chat','Research'].map(m => <Pill key={m} active={m==='Search'}>{m}</Pill>)}
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Pill><Icon d={D.keyboard} className='opacity-70'/> ⌘K</Pill>
          <Pill>Feedback</Pill>
          <Pill>Sign in</Pill>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className='min-h-screen bg-[radial-gradient(1000px_500px_at_10%_-10%,#f2f2f2,transparent),radial-gradient(800px_400px_at_80%_-20%,#f7f7f7,transparent)]'>
      <Topbar />
      <main className='mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[270px,1fr] gap-6'>
        {/* Sidebar */}
        <aside className='order-2 lg:order-1'>
          <Card className='p-4'>
            <div className='flex items-center gap-2 mb-3'><Icon d={D.gear} size={18} className='opacity-60'/><SectionTitle>Filters</SectionTitle></div>
            <div className='space-y-4 text-sm'>
              <div>
                <div className='text-gray-600 mb-1'>Time</div>
                <div className='flex flex-wrap gap-2'>
                  {['Any time','Past day','Past week','Past month','Past year'].map(t => (
                    <Pill key={t} active={filters.time===t} onClick={()=>setFilters(f=>({...f,time:t}))}>{t}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <div className='text-gray-600 mb-1'>Region</div>
                <div className='flex flex-wrap gap-2'>
                  {['Global','India','US','EU','SEA'].map(r => (
                    <Pill key={r} active={filters.region===r} onClick={()=>setFilters(f=>({...f,region:r}))}>{r}</Pill>
                  ))}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='text-gray-600'>SafeSearch</div>
                <label className='inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' checked={filters.safe} onChange={(e)=>setFilters(f=>({...f, safe: e.target.checked}))} />
                  <div className='w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-black transition relative'>
                    <div className='absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4' />
                  </div>
                </label>
              </div>
              <div className='pt-2 border-t'>
                <div className='text-gray-600 mb-1'>Site / filetype</div>
                <div className='flex gap-2'>
                  <input placeholder='site:example.com OR filetype:pdf' className='w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20'/>
                </div>
              </div>
            </div>
          </Card>
          <Card className='p-4 mt-4'>
            <div className='flex items-center gap-2 mb-3'><Icon d={D.sparkle} size={18} className='opacity-60'/><SectionTitle>Quick actions</SectionTitle></div>
            <div className='flex flex-wrap gap-2'>
              {['Summarize this page','Compare top 3','Create pros/cons','Extract steps'].map(a => <Pill key={a}>{a}</Pill>)}
            </div>
          </Card>
        </aside>

        {/* Main */}
        <section className='order-1 lg:order-2 space-y-4'>
          {/* Search bar */}
          <Card className='p-3'>
            <form onSubmit={(e)=>{e.preventDefault(); runSearch();}} className='flex items-center gap-2' role='search' aria-label='Universal search'>
              <div className='flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-50 ring-1 ring-gray-200 w-full focus-within:ring-black/20'>
                <Icon d={D.search} className='text-gray-500' />
                <input ref={inputRef} value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='Ask anything… Try: "best way to plan a Bali trip for 5 days"' className='w-full bg-transparent outline-none text-sm' />
                <button type='button' onClick={()=>handleVoice()} className='p-1 rounded-full hover:bg-white/70' title='Voice search'><Icon d={D.mic} className='text-gray-500' /></button>
                <label className='p-1 rounded-full hover:bg-white/70 cursor-pointer' title='Image search'>
                  <input type='file' className='sr-only' accept='image/*' onChange={()=>alert('Image uploaded — mock lens search.')} />
                  <Icon d={D.image} className='text-gray-500' />
                </label>
                <Button className='bg-black text-white hover:bg-black/90'>Search</Button>
              </div>
            </form>
            {suggestions.length>0 && (
              <div className='flex flex-wrap gap-2 px-1 pt-3'>
                {suggestions.map(s => <Pill key={s} onClick={()=>{ setQuery(s); runSearch(s); }}>{s}</Pill>)}
              </div>
            )}
          </Card>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className='flex items-center gap-2 px-1'>
            {tabs.map(t => <Pill key={t} active={tab===t} onClick={()=>setTab(t)}>{t}</Pill>)}
          </motion.div>

          {/* Panels with animated presence */}
          <AnimatePresence mode='wait'>
            {tab==='Overview' && (
              <motion.div key='overview' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} className='space-y-4'>
                <Card className='p-5'>
                  <div className='flex items-center gap-2 mb-2 text-sm text-gray-600'><Icon d={D.sparkle} className='opacity-70'/> AI Answer</div>
                  {loading ? (
                    <div className='flex flex-col items-center justify-center py-6'>
                      <LoadingDots />
                      <div className='text-xs text-gray-500'>Crafting a concise, sourced overview…</div>
                    </div>
                  ) : aiAnswer ? (
                    <pre className='whitespace-pre-wrap text-sm leading-6 text-gray-800'>{aiAnswer}</pre>
                  ) : (
                    <div className='text-sm text-gray-500'>Ask something to get a synthesized overview with sources.</div>
                  )}
                  {!loading && aiAnswer && (
                    <div className='pt-3 mt-3 border-t text-xs text-gray-600'>
                      Sources: <button className='underline'>[1] example.com/nextgen-ux</button> <button className='underline'>[2] example.com/ranking-signals</button>
                    </div>
                  )}
                </Card>

                <Card className='p-5'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>Top results</div>
                    <div className='text-xs text-gray-500'>{filters.time} • {filters.region}</div>
                  </div>
                  {loading ? (
                    <div className='divide-y'>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='py-4 animate-pulse'>
                          <div className='h-4 w-2/3 bg-gray-200 rounded'/>
                          <div className='h-3 w-5/6 bg-gray-100 rounded mt-2'/>
                          <div className='h-3 w-1/2 bg-gray-100 rounded mt-2'/>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='divide-y'>
                      {results.map((r, i) => (
                        <div key={i} className='py-5'>
                          <a href={r.url} className='text-lg font-semibold hover:underline'>{r.title}</a>
                          <div className='text-xs text-gray-500 mt-1'>{r.site}</div>
                          <p className='text-sm text-gray-700 mt-2'>{r.snippet}</p>
                          <div className='flex items-center gap-2 mt-3'>
                            <Pill>Open</Pill>
                            <Pill>Summarize</Pill>
                            <Pill>Ask follow‑up</Pill>
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
                    <div className='divide-y'>
                      {results.map((r, i) => (
                        <div key={i} className='py-5'>
                          <a href={r.url} className='text-lg font-semibold hover:underline'>{r.title}</a>
                          <div className='text-xs text-gray-500 mt-1'>{r.site}</div>
                          <p className='text-sm text-gray-700 mt-2'>{r.snippet}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='Images' && (
              <motion.div key='images' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                      {IMAGE_RESULTS.map((img, i) => (
                        <motion.figure key={i} whileHover={{ scale: 1.02 }} className='overflow-hidden rounded-2xl border border-gray-200'>
                          <img src={img.src} alt={img.alt} className='w-full h-40 object-cover transition'/>
                        </motion.figure>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {tab==='News' && (
              <motion.div key='news' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .2 }}>
                <Card className='p-5'>
                  {loading ? <LoadingDots /> : (
                    <div className='grid gap-3'>
                      {NEWS_RESULTS.map((n, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} className='flex items-start gap-3 p-3 rounded-2xl border border-gray-200'>
                          <div className='h-12 w-12 rounded-xl bg-gray-100'/>
                          <div>
                            <div className='font-semibold'>{n.title}</div>
                            <div className='text-xs text-gray-500'>{n.source} • {n.time}</div>
                            <p className='text-sm text-gray-700 mt-1'>{n.snippet}</p>
                          </div>
                          <div className='ml-auto self-center'>
                            <Button>Open <Icon d={D.chevronR}/></Button>
                          </div>
                        </motion.div>
                      ))}
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
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} className='rounded-2xl overflow-hidden border border-gray-200'>
                          <div className='aspect-video bg-gray-100' />
                          <div className='p-3'>
                            <div className='font-semibold'>Sample video result #{i + 1}</div>
                            <div className='text-xs text-gray-500'>Video platform • 8:24</div>
                          </div>
                        </motion.div>
                      ))}
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
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='p-4 rounded-2xl border border-gray-200'>
                          <div className='font-semibold'>Paper title #{i + 1}</div>
                          <div className='text-xs text-gray-500'>Authors • 2025 • PDF</div>
                          <p className='text-sm text-gray-700 mt-2'>Abstract snippet with key findings and methods…</p>
                          <div className='flex gap-2 mt-2'>
                            <Pill>Open PDF</Pill>
                            <Pill>Outline</Pill>
                            <Pill>Explain like I'm 5</Pill>
                          </div>
                        </div>
                      ))}
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
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='p-4 rounded-2xl border border-gray-200'>
                          <div className='font-semibold'>Repository result #{i + 1}</div>
                          <div className='text-xs text-gray-500'>github.com/user/repo • MIT</div>
                          <pre className='bg-gray-50 p-3 rounded-xl text-xs overflow-x-auto mt-2'>npm i novasearch
novasearch --init</pre>
                          <div className='flex gap-2 mt-2'>
                            <Pill>Open</Pill>
                            <Pill>Readme summary</Pill>
                            <Pill>Find license</Pill>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='text-center text-xs text-gray-500 py-6'>By Cavebeat, Crafting Reliability.</div>
        </section>
      </main>
    </div>
  );
}

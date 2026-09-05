import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  CircleDot,
  Droplets,
  Factory,
  Gauge,
  Leaf,
  Menu,
  Network,
  Recycle,
  ShieldCheck,
  Sparkles,
  TreePine,
  Users,
  Waves,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Icon = typeof Leaf;
type FormState = 'idle' | 'loading' | 'success' | 'error';

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 1250);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className={`loader ${done ? 'done' : ''}`} aria-hidden={done}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <span className="wordmark-mark text-[#d8f36e]" />
          <span className="font-mono-hazel text-[11px] tracking-[.2em]">HAZEL INDIA</span>
        </div>
        <div className="loader-line"><span /></div>
        <span className="font-mono-hazel text-[9px] uppercase tracking-[.22em] text-[#d6e1d5]/60">Green operations, loading</span>
      </div>
    </div>
  );
}

function Cursor() {
  useEffect(() => {
    const dot = document.querySelector<HTMLElement>('[data-cursor]');
    if (!dot || window.matchMedia('(pointer: coarse)').matches) return;
    const move = (event: MouseEvent) => {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
    };
    const over = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) dot.classList.add('is-hover');
    };
    const out = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) dot.classList.remove('is-hover');
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, []);
  return <span className="cursor-dot hidden md:block" data-cursor aria-hidden="true" />;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    ['About', 'about'],
    ['What we do', 'services'],
    ['HazelAI', 'hazelai'],
    ['Impact', 'impact'],
    ['Machinery', 'machinery'],
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 34);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navigate = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 border-b border-transparent ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-hazel header-inner flex h-[4.7rem] items-center justify-between gap-8">
        <button type="button" onClick={() => navigate('top')} className="flex items-center gap-3 text-left" data-testid="button-home">
          <span className="wordmark-mark text-[#174b3b]" />
          <span className="leading-none"><strong className="block text-[.7rem] font-extrabold tracking-[.18em]">HAZEL</strong><small className="block pt-1 font-mono-hazel text-[.48rem] tracking-[.16em] opacity-60">INDIA / 01</small></span>
        </button>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(([label, id]) => <button key={id} type="button" className="nav-link text-[.7rem] font-bold" onClick={() => navigate(id)} data-testid={`link-${id}`}>{label}</button>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button type="button" className="button-hazel button-quiet !px-3 !py-2 !text-[.63rem]" onClick={() => navigate('promise')} data-testid="button-green-impact">Green impact</button>
          <button type="button" className="button-hazel button-primary !px-3 !py-2 !text-[.63rem]" onClick={() => navigate('contact')} data-testid="button-header-audit">Free audit <ArrowRight size={14} /></button>
        </div>
        <button type="button" className="grid size-10 place-items-center border border-[#174b3b]/25 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#174b3b]/15 bg-[#f4f1e8]/95 px-5 py-8 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {links.map(([label, id], index) => <button type="button" key={id} onClick={() => navigate(id)} className="reveal flex items-center justify-between border-b border-[#174b3b]/15 pb-4 text-left font-display text-4xl" style={{ animationDelay: `${index * 70}ms` }} data-testid={`mobile-link-${id}`}>{label}<ArrowDownRight size={20} /></button>)}
            <button type="button" className="button-hazel button-primary mt-3 w-full" onClick={() => navigate('contact')} data-testid="button-mobile-audit">Request a free audit <ArrowRight size={15} /></button>
          </nav>
        </div>
      )}
    </header>
  );
}

function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow flex items-center gap-3 ${light ? 'text-[#d8f36e]' : 'text-[#217052]'}`}><span className="font-mono-hazel opacity-60">{number}</span><span className="h-px w-8 bg-current opacity-50" />{children}</div>;
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[46rem] overflow-hidden bg-[#f4f1e8] pt-32 lg:min-h-[53rem] lg:pt-44">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="container-hazel relative grid min-h-[42rem] items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative z-10 max-w-3xl">
          <div className="reveal flex items-center gap-3 text-[#217052]"><SectionLabel number="00">Facility intelligence / India</SectionLabel></div>
          <h1 className="reveal delay-1 mt-7 max-w-4xl font-display text-[clamp(4rem,8.8vw,8.5rem)] leading-[.82] tracking-[-.065em] text-[#163b31]">India's first <em className="text-[#217052]">AI-native</em> green facility company</h1>
          <p className="reveal delay-2 mt-8 max-w-lg text-lg leading-relaxed text-[#39574b]">Cleaner spaces. Greener India. Smarter by design.</p>
          <p className="reveal delay-2 mt-3 max-w-xl text-sm leading-7 text-[#39574b]/75">We bring sustainable facility management and intelligent operations together — so the places people depend on can perform better, with a lighter footprint.</p>
          <div className="reveal delay-3 mt-9 flex flex-wrap gap-3">
            <button type="button" className="button-hazel button-primary" onClick={() => scrollToId('contact')} data-testid="button-hero-audit">Request a free audit <ArrowRight size={15} /></button>
            <button type="button" className="button-hazel button-quiet" onClick={() => scrollToId('about')} data-testid="button-hero-explore">Explore Hazel <ArrowDownRight size={15} /></button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:mx-0 lg:ml-auto">
          <div className="absolute inset-0 rounded-full bg-[#d8f36e]/20 blur-3xl" />
          <div className="hero-orb absolute inset-[8%] rounded-full bg-[#163b31]">
            <div className="orb-ring" /><div className="orb-ring" /><div className="orb-ring" /><div className="orb-core" />
            <span className="orb-node one" /><span className="orb-node two" /><span className="orb-node three" />
            <div className="absolute bottom-[17%] left-[15%] font-mono-hazel text-[9px] uppercase tracking-[.18em] text-[#d6e1d5]/60">live systems / 01</div>
          </div>
          <div className="absolute right-0 top-[14%] border border-[#174b3b]/20 bg-[#f4f1e8]/80 px-3 py-2 font-mono-hazel text-[9px] tracking-[.1em] text-[#217052] backdrop-blur">AIR / WATER / ENERGY</div>
          <div className="absolute bottom-[14%] left-0 border border-[#174b3b]/20 bg-[#f4f1e8]/80 px-3 py-2 font-mono-hazel text-[9px] tracking-[.1em] text-[#217052] backdrop-blur">AI + OPERATIONS</div>
        </div>
      </div>
      <div className="container-hazel relative grid grid-cols-3 border-t border-[#174b3b]/20 py-8">
        {[['100%', 'Green-certified chemistry'], ['28', 'States we aim to serve'], ['24/7', 'AI monitoring & dispatch']].map(([number, label]) => <div key={label} className="border-r border-[#174b3b]/15 px-4 first:pl-0 last:border-0"><div className="metric-number text-[#163b31]">{number}</div><div className="mt-2 max-w-[8rem] font-mono-hazel text-[9px] uppercase leading-4 tracking-[.08em] text-[#507267]">{label}</div></div>)}
      </div>
    </section>
  );
}

function Marquee() {
  const text = 'AI-NATIVE FACILITY MANAGEMENT  •  GREEN OPERATIONS  •  SMARTER SPACES  •  LOWER IMPACT  •  MEASURABLE ESG  •  ';
  return <div className="marquee overflow-hidden border-y border-[#174b3b]/20 bg-[#d8f36e] py-4 text-[#163b31]" aria-label="Hazel India values"><div className="marquee-track w-max font-mono-hazel text-[10px] font-bold tracking-[.16em]">{text.repeat(3)}</div></div>;
}

const aboutTabs = [
  { label: 'Planet', icon: Leaf, text: 'We start with the footprint. Green-certified chemistry, electric and manual equipment first, and water systems designed to use less and recover more.', note: 'A lighter operational baseline' },
  { label: 'People', icon: Users, text: 'The work is human. We value the teams who keep spaces running through living-wage work, fair treatment and training that opens a better path forward.', note: 'People we value, everywhere' },
  { label: 'Intelligence', icon: BrainCircuit, text: 'Sensors, service and decision-making belong in one loop. HazelAI helps teams predict, sense, prove and serve — without adding complexity for its own sake.', note: 'Operations made legible' },
];

function About() {
  const [active, setActive] = useState(0);
  const tab = aboutTabs[active];
  const IconComponent = tab.icon;
  return (
    <section id="about" className="bg-[#f4f1e8] py-28 lg:py-40">
      <div className="container-hazel">
        <SectionLabel number="01">Get to know us</SectionLabel>
        <div className="mt-7 grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <h2 className="font-display text-6xl leading-[.9] tracking-[-.05em] text-[#163b31] md:text-8xl">Everything you want to know, <em className="text-[#217052]">in three tabs.</em></h2>
          <div>
            <div className="grid grid-cols-3 border-b border-[#174b3b]/20">
              {aboutTabs.map((item, index) => { const ItemIcon = item.icon; return <button type="button" key={item.label} onClick={() => setActive(index)} className={`tabs-tab flex min-h-[8rem] flex-col justify-between p-3 text-left ${active === index ? 'active' : ''}`} aria-pressed={active === index} data-testid={`button-about-${item.label.toLowerCase()}`}><span className="font-mono-hazel text-[10px] opacity-60">0{index + 1}</span><span className="flex items-center justify-between text-sm font-bold">{item.label}<ItemIcon size={16} strokeWidth={1.5} /></span></button>; })}
            </div>
            <div className="grid min-h-[15rem] grid-cols-[auto_1fr] gap-7 pt-9">
              <IconComponent size={34} strokeWidth={1} className="text-[#217052]" />
              <div><p className="font-display text-4xl leading-[1] tracking-[-.03em] text-[#163b31]">{tab.note}</p><p className="mt-5 max-w-lg text-sm leading-7 text-[#507267]">{tab.text}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const services: { title: string; desc: string; icon: Icon; meta: string }[] = [
  { title: 'Eco cleaning & sanitation', desc: 'Thoughtful, green-certified cleaning systems that protect people and the spaces they use.', icon: Sparkles, meta: 'chemistry / hygiene' },
  { title: 'Technical & MEP upkeep', desc: 'The quiet discipline of keeping critical building systems dependable and ready.', icon: Gauge, meta: 'systems / reliability' },
  { title: 'Landscaping & green spaces', desc: 'Living environments cared for as operating systems — seasonal, local and measurable.', icon: TreePine, meta: 'living / landscape' },
  { title: 'Waste & recycling', desc: 'Clearer material flows, stronger segregation and a practical path to more diversion.', icon: Recycle, meta: 'circular / materials' },
  { title: 'Security & smart access', desc: 'Human oversight paired with smart access systems that help spaces feel safer.', icon: ShieldCheck, meta: 'people / protection' },
  { title: 'AI monitoring & ESG', desc: 'One view across tasks, resources and outcomes — built to make improvement provable.', icon: Network, meta: 'sensing / proof' },
];

function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const CurrentIcon = current.icon;
  return (
    <section id="services" className="bg-[#e8e8dc] py-28 lg:py-40">
      <div className="container-hazel">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><SectionLabel number="02">What we do</SectionLabel><h2 className="mt-7 max-w-3xl font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">One partner for <em className="text-[#217052]">every space</em> you care about.</h2></div><p className="max-w-xs text-sm leading-7 text-[#507267]">From the floor to the facility dashboard, Hazel brings the parts of operations into one accountable system.</p></div>
        <div className="mt-16 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div>{services.map((service, index) => { const ServiceIcon = service.icon; return <button type="button" key={service.title} className={`service-row group flex w-full items-center gap-4 border-b border-[#174b3b]/20 py-5 text-left ${active === index ? 'active' : ''}`} onClick={() => setActive(index)} onMouseEnter={() => setActive(index)} aria-pressed={active === index} data-testid={`button-service-${index + 1}`}><span className="font-mono-hazel w-7 text-[10px] opacity-55">0{index + 1}</span><ServiceIcon className="service-icon shrink-0" size={20} strokeWidth={1.5} /><span className="flex-1 text-sm font-bold md:text-base">{service.title}</span><ArrowRight className="opacity-50 transition-transform group-hover:translate-x-1" size={16} /></button>; })}</div>
          <div className="service-visual relative min-h-[22rem] p-7 text-[#f4f1e8] md:p-10"><div className="relative z-10 flex h-full flex-col justify-between"><div className="flex items-center justify-between"><CurrentIcon size={42} strokeWidth={1} className="text-[#d8f36e]" /><span className="font-mono-hazel text-[9px] uppercase tracking-[.17em] text-[#d6e1d5]/65">{current.meta}</span></div><div><div className="font-mono-hazel text-[9px] uppercase tracking-[.18em] text-[#d8f36e]">Selected system / 0{active + 1}</div><h3 className="mt-3 font-display text-5xl leading-[.9] tracking-[-.04em]">{current.title}</h3><p className="mt-5 max-w-md text-sm leading-7 text-[#d6e1d5]/75">{current.desc}</p></div></div><div className="absolute -bottom-10 -right-4 font-display text-[17rem] leading-none text-[#d8f36e]/[.07]">{String(active + 1).padStart(2, '0')}</div></div>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="impact" className="bg-[#f4f1e8] py-28 lg:py-40">
      <div className="container-hazel">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><SectionLabel number="03">Impact / projections</SectionLabel><h2 className="mt-7 font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">Built for India's <em className="text-[#217052]">next generation</em> of spaces.</h2></div><div className="lg:pt-16"><p className="max-w-xl text-lg leading-8 text-[#39574b]">The built environment is changing. Hazel is designed to help the people responsible for it move from fragmented service delivery to measured, intelligent operations.</p><div className="mt-12 grid grid-cols-3 gap-3 border-t border-[#174b3b]/20 pt-5">{[['140M+', 'sq ft opportunity'], ['10%+', 'FM market CAGR'], ['18%', 'green offices']].map(([n, l]) => <div key={l}><div className="metric-number text-[#217052]">{n}</div><p className="mt-3 max-w-[8rem] font-mono-hazel text-[9px] uppercase leading-4 tracking-[.09em] text-[#507267]">{l}</p></div>)}</div></div></div>
        <div className="relative mt-20 h-64 overflow-hidden border-y border-[#174b3b]/20"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-label="Projected market trajectory"><path d="M0 220 C110 214 137 170 230 182 S365 206 442 132 S590 152 660 100 S790 80 1000 22" fill="none" stroke="#217052" strokeWidth="2" className="data-line" /><path d="M0 245 C130 231 180 224 260 210 S420 190 490 160 S630 174 700 134 S860 112 1000 78" fill="none" stroke="#d8f36e" strokeWidth="1" className="data-line secondary" /><line x1="0" y1="220" x2="1000" y2="220" stroke="#174b3b" strokeOpacity=".15" /><g fill="#217052"><circle cx="230" cy="182" r="4" /><circle cx="442" cy="132" r="4" /><circle cx="660" cy="100" r="4" /></g></svg><div className="absolute bottom-4 left-0 font-mono-hazel text-[9px] uppercase tracking-[.16em] text-[#507267]">market signal / directional view</div><div className="absolute right-0 top-4 font-mono-hazel text-[9px] uppercase tracking-[.16em] text-[#507267]">2022 — 2030</div></div>
      </div>
    </section>
  );
}

function Roadmap() {
  const milestones = [
    ['2022', 'The belief', 'A greener, more accountable way to run facilities starts with first principles.'],
    ['2025', 'The operating system', 'Sustainable facility management and AI-native operations come together.'],
    ['2027', 'The network', 'Hazel expands the intelligence layer across the spaces India depends on.'],
    ['2030', 'The standard', 'A lighter, more measurable way to care for the built environment.'],
  ];
  const [active, setActive] = useState(1);
  return (
    <section className="bg-[#e8e8dc] py-24 lg:py-32">
      <div className="container-hazel"><SectionLabel number="04">The long view</SectionLabel><div className="mt-7 flex flex-col justify-between gap-7 md:flex-row md:items-end"><h2 className="font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">A roadmap, not a <em className="text-[#217052]">promise.</em></h2><p className="max-w-xs text-sm leading-7 text-[#507267]">A considered path from better daily operations to a different standard for Indian spaces.</p></div><div className="relative mt-20"><div className="absolute left-4 right-4 top-4 hidden h-px bg-[#174b3b]/20 md:block"><span className="block h-full bg-[#217052] transition-all duration-700" style={{ width: `${(active / 3) * 100}%` }} /></div><div className="grid gap-9 md:grid-cols-4">{milestones.map(([year, title, text], index) => <button type="button" key={year} className="group relative text-left md:pt-12" onClick={() => setActive(index)} data-testid={`button-roadmap-${year}`}><span className={`roadmap-node relative z-10 mb-5 grid size-8 place-items-center rounded-full border border-[#174b3b]/30 bg-[#e8e8dc] font-mono-hazel text-[9px] ${index <= active ? 'active' : ''}`}>{String(index + 1).padStart(2, '0')}</span><div className="border-t border-[#174b3b]/20 pt-4 md:border-0"><span className="font-mono-hazel text-[10px] tracking-[.16em] text-[#217052]">{year}</span><h3 className="mt-3 font-display text-4xl leading-none text-[#163b31]">{title}</h3><p className="mt-4 max-w-[15rem] text-sm leading-6 text-[#507267]">{text}</p></div></button>)}</div></div></div>
    </section>
  );
}

const machines = [
  { title: 'AI autonomous scrubbers', icon: Sparkles, label: 'autonomy / floors', detail: 'Cleaning routes respond to real use, helping teams spend attention where it matters.', metric: 'dynamic task routing' },
  { title: 'Nanobubble water cleaning', icon: Waves, label: 'water / chemistry', detail: 'Nanobubble systems make water work harder in a more considered cleaning loop.', metric: 'lower chemical reliance' },
  { title: 'Water-recycling scrubbers', icon: Recycle, label: 'recovery / reuse', detail: 'Equipment designed to capture and reuse more of the water moving through a site.', metric: 'water in the loop' },
  { title: 'IoT water & leak intelligence', icon: Droplets, label: 'sensing / water', detail: 'Signals from water systems become visible before small issues become expensive ones.', metric: 'always-on awareness' },
  { title: 'HEPA + AI air quality', icon: Gauge, label: 'air / wellbeing', detail: 'Air quality is treated as a daily operating signal, not a once-a-year report.', metric: 'AQI as an operating input' },
];

function Machinery() {
  const [active, setActive] = useState(0);
  const machine = machines[active];
  const MachineIcon = machine.icon;
  return (
    <section id="machinery" className="bg-[#f4f1e8] py-28 lg:py-40">
      <div className="container-hazel"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><SectionLabel number="05">Machinery / systems</SectionLabel><h2 className="mt-7 font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">The machines behind a <em className="text-[#217052]">lighter footprint.</em></h2><p className="mt-7 max-w-sm text-sm leading-7 text-[#507267]">Technology is most useful when it disappears into the work. Explore the tools that make better operations possible.</p></div><div className="grid gap-8 md:grid-cols-[.48fr_.52fr]"><div className="machinery-menu relative border-l border-[#174b3b]/20 pl-5">{machines.map((item, index) => <button type="button" key={item.title} className={`relative block w-full py-3 text-left text-sm font-bold ${active === index ? 'active text-[#217052]' : 'text-[#507267]'}`} onClick={() => setActive(index)} data-testid={`button-machine-${index + 1}`}>{item.title}</button>)}</div><div className="relative min-h-[20rem] overflow-hidden bg-[#163b31] p-7 text-[#f4f1e8]"><div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_center,hsl(76_73%_51%_/_0.2),transparent_65%)]" /><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between"><MachineIcon size={37} className="text-[#d8f36e]" strokeWidth={1} /><span className="font-mono-hazel text-[9px] uppercase tracking-[.15em] text-[#d6e1d5]/60">{machine.label}</span></div><div><div className="font-mono-hazel text-[9px] uppercase tracking-[.15em] text-[#d8f36e]">system / 0{active + 1}</div><h3 className="mt-3 font-display text-5xl leading-[.9]">{machine.title}</h3><p className="mt-4 text-sm leading-6 text-[#d6e1d5]/75">{machine.detail}</p><div className="mt-7 border-t border-[#d6e1d5]/20 pt-3 font-mono-hazel text-[9px] uppercase tracking-[.12em] text-[#d8f36e]">{machine.metric}</div></div></div></div></div></div></div>
    </section>
  );
}

const aiStates = [
  { label: 'Predict', title: 'See the day before it arrives.', icon: BrainCircuit, bullets: ['Footfall', 'Occupancy', 'IoT sensors', 'Dynamic task routing'], value: '82%', valueLabel: 'forecast confidence' },
  { label: 'Sense', title: 'Make invisible conditions visible.', icon: Gauge, bullets: ['AQI', 'CO₂', 'Water', 'Energy'], value: '042', valueLabel: 'AQI / demo signal' },
  { label: 'Prove', title: 'Turn impact into evidence.', icon: BarChart3, bullets: ['Carbon', 'Waste', 'Water', 'ESG'], value: '90%', valueLabel: 'waste diversion / demo' },
  { label: 'Serve', title: 'Respond with more context.', icon: Sparkles, bullets: ['Requests', 'ETAs', 'Quality', 'AI concierge'], value: '12m', valueLabel: 'median ETA / demo' },
];

function HazelAI() {
  const [active, setActive] = useState(0);
  const state = aiStates[active];
  const StateIcon = state.icon;
  return (
    <section id="hazelai" className="bg-[#dce3d7] py-28 lg:py-40">
      <div className="container-hazel"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><SectionLabel number="06">HazelAI / demo mode</SectionLabel><h2 className="mt-7 font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">Intelligence that makes clean <em className="text-[#217052]">predictable, provable</em> and lighter on Earth.</h2><p className="mt-7 max-w-md text-sm leading-7 text-[#507267]">A presentation view of the HazelAI operating loop. Demo data is illustrative — this is not a connected live dashboard.</p></div><div className="ai-shell min-h-[35rem] p-3 md:p-5"><div className="flex items-center justify-between border-b border-[#d6e1d5]/10 px-3 pb-4"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#d8f36e]" /><span className="font-mono-hazel text-[9px] tracking-[.15em] text-[#d6e1d5]/70">HAZELAI / PRESENTATION MODE</span></div><span className="font-mono-hazel text-[9px] text-[#d6e1d5]/50">DEMO DATA</span></div><div className="grid md:grid-cols-[8rem_1fr]"><div className="ai-nav flex gap-1 border-b border-[#d6e1d5]/10 py-3 md:flex-col md:border-b-0 md:border-r md:pr-3">{aiStates.map((item, index) => <button type="button" key={item.label} className={`flex flex-1 items-center gap-2 px-2 py-3 text-left text-[10px] font-bold md:flex-none ${index === active ? 'active' : ''}`} onClick={() => setActive(index)} data-testid={`button-ai-${item.label.toLowerCase()}`}><span className="font-mono-hazel text-[9px] opacity-50">0{index + 1}</span><span>{item.label}</span></button>)}</div><div className="p-4 md:p-7"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 font-mono-hazel text-[9px] uppercase tracking-[.16em] text-[#d8f36e]"><StateIcon size={14} /> {state.label} layer</div><h3 className="mt-4 max-w-md font-display text-5xl leading-[.9]">{state.title}</h3></div><div className="text-right"><div className="font-display text-5xl text-[#d8f36e]">{state.value}</div><div className="mt-1 max-w-[7rem] font-mono-hazel text-[8px] uppercase leading-4 text-[#d6e1d5]/50">{state.valueLabel}</div></div></div><div className="mt-9 grid grid-cols-2 gap-2">{state.bullets.map((bullet, index) => <div className="ai-kpi p-3" key={bullet}><div className="flex items-center justify-between"><span className="font-mono-hazel text-[9px] text-[#d6e1d5]/70">{bullet}</span><CircleDot size={12} className="text-[#d8f36e]" /></div><div className="mt-6 h-16 border-b border-l border-[#d6e1d5]/20 p-2"><div className="flex h-full items-end gap-1">{Array.from({ length: 8 }, (_, bar) => <span key={bar} className="ai-bar flex-1 bg-[#d8f36e]/70" style={{ height: `${25 + ((bar * 17 + index * 13 + active * 9) % 65)}%`, animationDelay: `${bar * 50}ms` }} />)}</div></div></div>)}</div></div></div></div></div></div>
    </section>
  );
}

function Promise() {
  const metrics = [['−40%', 'Water use'], ['90%', 'Waste diverted'], ['0', 'Toxic chemicals'], ['100%', 'Staff trained & fairly paid']];
  const pledges = ['Biodegradable chemistry', 'Electric & manual equipment first', 'Rainwater & greywater reuse', 'Tree planted for every annual contract', 'Living-wage work'];
  return (
    <section id="promise" className="promise-section py-28 lg:py-40"><div className="container-hazel relative"><SectionLabel number="07" light>Green promise</SectionLabel><div className="mt-8 max-w-5xl"><h2 className="font-display text-7xl leading-[.82] tracking-[-.06em] md:text-[9.5rem]">Facility management that gives back <em className="text-[#d8f36e]">more than it takes.</em></h2></div><div className="mt-20 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">{metrics.map(([number, label]) => <div className="promise-metric pt-4" key={label}><div className="metric-number text-[#d8f36e]">{number}</div><div className="mt-3 max-w-[9rem] font-mono-hazel text-[9px] uppercase leading-4 tracking-[.1em] text-[#d6e1d5]/60">{label}</div></div>)}</div><div className="mt-28 grid gap-10 md:grid-cols-[.7fr_1.3fr]"><div><SectionLabel number="08" light>Our pledge</SectionLabel><p className="mt-6 max-w-xs text-sm leading-7 text-[#d6e1d5]/70">The details are the promise. Small operational choices, made consistently, add up to a different kind of company.</p></div><div>{pledges.map((pledge, index) => <div className="pledge-row flex items-center justify-between py-5" key={pledge}><span className="font-display text-3xl md:text-4xl">{pledge}</span><span className="font-mono-hazel text-[9px] text-[#d8f36e]">0{index + 1}</span></div>)}</div></div></div></section>
  );
}

function Process() {
  const steps = [['01', 'Free AI Audit', 'Understand your space, its patterns and where a lighter footprint can start.'], ['02', 'Smart Setup', 'Build the operating baseline: people, systems, service and sensing.'], ['03', 'Intelligent Delivery', 'Let daily work respond to real conditions, not assumptions.'], ['04', 'Prove & Improve', 'Make progress visible and keep improving from evidence.']];
  return <section className="bg-[#f4f1e8] py-28 lg:py-40"><div className="container-hazel"><SectionLabel number="09">How it works</SectionLabel><div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end"><h2 className="font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">A connected way to <em className="text-[#217052]">move forward.</em></h2><div className="hidden w-44 pb-3 md:block"><div className="step-line h-px"><span /></div><div className="mt-2 flex justify-between font-mono-hazel text-[8px] text-[#507267]"><span>start</span><span>improve</span></div></div></div><div className="mt-20 grid gap-0 md:grid-cols-4">{steps.map(([number, title, text], index) => <div className="relative border-l border-[#174b3b]/20 py-5 pl-5 pr-6 md:min-h-[17rem] md:border-t md:border-l-0 md:pl-0 md:pt-8 md:pr-8" key={number}><div className={`mb-12 grid size-9 place-items-center rounded-full border text-[10px] font-bold ${index === 0 ? 'border-[#217052] bg-[#d8f36e] text-[#163b31]' : 'border-[#174b3b]/30'}`}>{number}</div><h3 className="font-display text-4xl leading-none text-[#163b31]">{title}</h3><p className="mt-4 max-w-[15rem] text-sm leading-6 text-[#507267]">{text}</p></div>)}</div></div></section>;
}

const sectors = [
  { title: 'Home & Residential', icon: Building2, text: 'Comfortable, dependable spaces for the people who live there.', tag: 'daily living' },
  { title: 'Commercial & Office', icon: Building2, text: 'Workplaces that are cared for with clarity and consistency.', tag: 'work / people' },
  { title: 'Industrial & Technical', icon: Factory, text: 'Operational environments where reliability is the baseline.', tag: 'critical / technical' },
  { title: 'Landscaping & Green Spaces', icon: TreePine, text: 'Living systems that make a place feel like it belongs.', tag: 'living / landscape' },
  { title: 'Waste & Sustainability', icon: Recycle, text: 'Material flows that become easier to see, manage and improve.', tag: 'circular / impact' },
  { title: 'Security & Smart Access', icon: ShieldCheck, text: 'People-first protection with intelligence where it helps.', tag: 'trust / access' },
];

function Sectors() {
  const [active, setActive] = useState(1);
  const sector = sectors[active];
  const SectorIcon = sector.icon;
  return <section className="bg-[#e8e8dc] py-28 lg:py-40"><div className="container-hazel"><SectionLabel number="10">For every space</SectionLabel><div className="mt-8 grid gap-12 lg:grid-cols-[1fr_.9fr]"><div><h2 className="font-display text-6xl leading-[.88] tracking-[-.05em] text-[#163b31] md:text-8xl">One partner for <em className="text-[#217052]">every space</em> you care about.</h2><div className="mt-12">{sectors.map((item, index) => <button type="button" key={item.title} onClick={() => setActive(index)} className={`sector-option flex w-full items-center justify-between py-4 text-left text-sm font-bold ${index === active ? 'active' : 'text-[#507267]'}`} data-testid={`button-sector-${index + 1}`}><span>{item.title}</span><ArrowRight size={15} /></button>)}</div></div><div className="sector-image p-7 text-[#f4f1e8] md:p-10"><div className="relative z-10 flex h-full flex-col justify-between"><div className="flex justify-between"><SectorIcon size={42} strokeWidth={1} className="text-[#d8f36e]" /><span className="font-mono-hazel text-[9px] uppercase tracking-[.15em] text-[#d6e1d5]/60">{sector.tag}</span></div><div><div className="font-mono-hazel text-[9px] uppercase tracking-[.15em] text-[#d8f36e]">sector / 0{active + 1}</div><h3 className="mt-3 max-w-sm font-display text-6xl leading-[.88]">{sector.title}</h3><p className="mt-5 max-w-sm text-sm leading-7 text-[#d6e1d5]/75">{sector.text}</p></div></div></div></div></div></section>;
}

function Story() {
  return <section className="overflow-hidden bg-[#d8f36e] py-28 text-[#163b31] lg:py-40"><div className="container-hazel"><div className="flex flex-col justify-between gap-10 md:flex-row"><div><span className="font-display text-6xl italic md:text-8xl">हरित</span><div className="mt-2 font-mono-hazel text-[10px] uppercase tracking-[.2em]">a greener tomorrow</div></div><div className="max-w-xl md:pt-8"><p className="font-display text-4xl leading-[.95] tracking-[-.03em] md:text-6xl">The spaces we share should leave more room for life.</p><p className="mt-7 max-w-md text-sm leading-7 text-[#39574b]">Hazel India brings together the care of people, the discipline of operations and the clarity of intelligence. Not to make facilities louder — to make them work better.</p></div></div><div className="mt-28 grid items-end gap-8 md:grid-cols-[1.1fr_.9fr]"><div className="font-display text-[clamp(5rem,17vw,15rem)] leading-[.7] tracking-[-.08em]">HAZEL</div><div className="border-t border-[#163b31]/30 pt-4 font-mono-hazel text-[10px] uppercase leading-5 tracking-[.12em]">Cleaner spaces.<br />Greener planet.<br />Valued people — everywhere.</div></div></div></section>;
}

function Contact() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    if (!name || !email || !email.includes('@')) {
      setState('error');
      setError('Please add your name and a valid work email.');
      return;
    }
    setError('');
    setState('loading');
    window.setTimeout(() => setState('success'), 900);
  };
  return <section id="contact" className="bg-[#f4f1e8] py-28 lg:py-40"><div className="container-hazel grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><div><SectionLabel number="11">Start a conversation</SectionLabel><h2 className="mt-8 font-display text-7xl leading-[.82] tracking-[-.06em] text-[#163b31] md:text-[8.5rem]">Let's build a <em className="text-[#217052]">greener India</em> together.</h2><p className="mt-8 max-w-sm text-sm leading-7 text-[#507267]">Tell us about your space. We'll send a free facility audit and a green plan within 48 hours.</p><div className="mt-10 border-t border-[#174b3b]/20 pt-4 font-mono-hazel text-[9px] uppercase leading-5 tracking-[.12em] text-[#507267]">No hard sell.<br />Just a considered first step.</div></div><form onSubmit={submit} className="self-end" noValidate><div className="grid gap-x-7 gap-y-8 md:grid-cols-2"><label className="block"><span className="eyebrow text-[#507267]">Name</span><input className="input-hazel" name="name" placeholder="Your name" data-testid="input-name" /></label><label className="block"><span className="eyebrow text-[#507267]">Company</span><input className="input-hazel" name="company" placeholder="Company / organisation" data-testid="input-company" /></label><label className="block"><span className="eyebrow text-[#507267]">Email</span><input className="input-hazel" type="email" name="email" placeholder="you@company.com" data-testid="input-email" /></label><label className="block"><span className="eyebrow text-[#507267]">Phone</span><input className="input-hazel" name="phone" placeholder="+91" data-testid="input-phone" /></label><label className="block md:col-span-2"><span className="eyebrow text-[#507267]">Space type</span><div className="relative"><select className="input-hazel appearance-none" name="spaceType" defaultValue="" data-testid="select-space-type"><option value="" disabled>Select one</option><option>Home / apartment</option><option>Office / commercial space</option><option>Factory / industrial site</option><option>Community / housing society</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-0 text-[#217052]" size={16} /></div></label><label className="block md:col-span-2"><span className="eyebrow text-[#507267]">Message</span><textarea className="input-hazel min-h-24 resize-y" name="message" placeholder="Tell us a little about your space" data-testid="input-message" /></label></div><div className="mt-9 flex flex-wrap items-center gap-5"><button type="submit" disabled={state === 'loading'} className="button-hazel button-primary disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-audit">{state === 'loading' ? 'Preparing request…' : 'Request my free green audit'} {state !== 'loading' && <ArrowRight size={15} />}</button>{state === 'error' && <p className="text-sm text-[#a3473f]" role="alert" data-testid="status-form-error">{error}</p>}{state === 'success' && <p className="max-w-sm text-sm leading-5 text-[#217052]" role="status" data-testid="status-form-success"><Check size={16} className="mr-1 inline" />Request prepared locally. No message was sent — connect the API boundary when ready.</p>}</div><p className="mt-5 font-mono-hazel text-[9px] uppercase tracking-[.1em] text-[#507267]">Presentation mode / honest by design</p></form></div></section>;
}

function Footer() {
  const links = [['Services', 'services'], ['Company', 'about'], ['HazelAI', 'hazelai'], ['Green promise', 'promise']];
  return <footer className="overflow-hidden bg-[#163b31] pt-20 text-[#f4f1e8]"><div className="container-hazel"><div className="grid gap-14 md:grid-cols-[1.15fr_.85fr]"><div><div className="flex items-center gap-3"><span className="wordmark-mark text-[#d8f36e]" /><span className="font-mono-hazel text-[11px] tracking-[.2em]">HAZEL INDIA</span></div><p className="mt-8 max-w-md font-display text-4xl leading-none text-[#d6e1d5]">Cleaner spaces. Greener planet. Valued people — everywhere.</p></div><div className="grid grid-cols-2 gap-x-5 gap-y-10 text-sm"><div><div className="eyebrow text-[#d8f36e]">Explore</div><div className="mt-5 flex flex-col items-start gap-3">{links.map(([label, id]) => <button type="button" key={id} onClick={() => scrollToId(id)} className="text-[#d6e1d5]/70 transition-colors hover:text-[#d8f36e]" data-testid={`footer-link-${id}`}>{label}</button>)}</div></div><div><div className="eyebrow text-[#d8f36e]">Connect</div><div className="mt-5 flex flex-col items-start gap-3 text-[#d6e1d5]/70"><a href="mailto:hello@hazelindia.com" className="hover:text-[#d8f36e]" data-testid="link-email">hello@hazelindia.com</a><span>+91 00000 00000</span><span>LinkedIn / Instagram</span></div></div></div></div><div className="mt-24 whitespace-nowrap"><div className="footer-big">HAZEL</div></div><div className="flex flex-col justify-between gap-3 border-t border-[#d6e1d5]/15 py-5 font-mono-hazel text-[9px] uppercase tracking-[.13em] text-[#d6e1d5]/50 md:flex-row"><span>© Hazel India / 2025</span><span>AI-powered green facility management</span><span>Customer portal · Operations console · Site admin</span></div></div></footer>;
}

function Home() {
  useEffect(() => {
    document.title = 'Hazel India — AI-Powered Green Facility Management';
    const description = 'Hazel India combines sustainable facility management with AI-native operations for cleaner spaces and a greener India.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
  }, []);
  return <div className="grain"><Loader /><Cursor /><Header /><main><Hero /><Marquee /><About /><Services /><Impact /><Roadmap /><Machinery /><HazelAI /><Promise /><Process /><Story /><Sectors /><Contact /></main><Footer /></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
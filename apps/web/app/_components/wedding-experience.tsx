'use client';

import {
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Menu,
  Palmtree,
  Sparkles,
  Stars,
  SunMedium,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';
import { Alex_Brush } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { WeddingChat } from './wedding-chat';

const calligraphyFont = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
});

const storageKey = 'jon-tao-wedding-plan';
const weddingDate = new Date('2026-11-25T17:00:00-05:00');

const welcomeMenu = {
  saladTable: [
    'House baked rolls and butter',
    'Tortillas',
    'Potato salad',
    'Green salad with ranch dressing',
    'Island slaw',
    "Chef's selection of sushi",
  ],
  hotTable: [
    'Peas and rice',
    'Mac and cheese',
    'Smoked jerk chicken',
    'Blackened mahi mahi',
    'Mini eye fillet',
    '24 hour smoked beef brisket with BBQ sauce',
  ],
  dessert: ["Pastry chef's selection of cake slices"],
  canapes: [
    'Vegetable spring rolls',
    'Arancini with serrano ham and truffle',
    'Sushi rolls and nigiri',
    'BBQ octopus skewers',
    'Smoked salmon rillettes tostada',
    'Conch ceviche with mango',
    'Panko prawns with tartare',
    'Crackling pork belly with apple remoulade',
  ],
};

const receptionStarters = [
  'Three Taste of the Sea',
  'Mushroom risotto with grana Padano & truffle',
];

const receptionMains = [
  {
    value: 'Char-grilled beef tenderloin with Lobster',
    label: 'Char-grilled beef tenderloin with Lobster',
    description:
      'Grilled with garlic butter, served on truffle mashed potatoes, asparagus, and red wine jus.',
  },
  {
    value: 'Blackened local grouper fillet',
    label: 'Blackened local grouper fillet',
    description:
      'Served with fresh Caribbean lime and mango salsa with local rice and peas.',
  },
  {
    value: 'Vegetarian breaded cauliflower steak',
    label: 'Vegetarian breaded cauliflower steak',
    description:
      'Served with coconut rice, spiced black bean salsa, and curry yogurt sauce.',
  },
];

const receptionDesserts = ['Caribbean key lime cheesecake', 'Deconstructed Banoffee Pie'];

const activityChoices = [
  {
    id: 'sunset-cruise',
    title: 'Sunset Cruise',
    description:
      'Sail into golden hour with ocean views, island breezes, and a relaxed sunset experience on the water.',
    websiteDescription:
      'A relaxing 1.5-hour sunset sail starting at 4pm from The Ritz-Carlton beach, with a gourmet selection of hors d’oeuvres, a full open bar, and an easy golden-hour experience on the water.',
    image: '/sunset-cruise.webp',
    imageAlt: 'Sunset cruise in Turks and Caicos',
  },
  {
    id: 'ocean-horseback',
    title: 'Ocean Horseback Riding',
    description:
      'Ride along the shoreline and into the turquoise water for one of the most memorable island experiences.',
    websiteDescription:
      'An approximately 1-hour horseback ride with start time TBD, where you will ride along the shoreline and into the ocean for a scenic, freeing experience that feels deeply connected to nature.',
    image: '/ocean-horseback-riding.webp',
    imageAlt: 'Ocean horseback riding in Turks and Caicos',
  },
];

const exploreCards = [
  {
    title: 'Chalk Sound National Park',
    description:
      'One of the most striking places on Providenciales, known for its brilliant turquoise lagoon, rocky cays, and beautiful sightseeing views.',
    note: 'A great stop for a scenic drive, photos, kayaking, or paddleboarding.',
    image: 'https://www.visittci.com/thing/chalk-sound-national-park/cover_1024x341.jpg',
    imageAlt: 'Chalk Sound National Park in Turks and Caicos',
    link: 'https://www.visittci.com/providenciales/chalk-sound-national-park',
  },
  {
    title: 'Thursday Fish Fry',
    description:
      'A lively local tradition in Providenciales with music, Junkanoo, handmade goods, and a wide mix of island dishes and drinks.',
    note: 'Every Thursday at 6pm at Stubbs Diamond Plaza in The Bight.',
    image: 'https://www.visittci.com/thing/fish-fry/cover_1024x341.jpg',
    imageAlt: 'Thursday Fish Fry in Turks and Caicos',
    link: 'https://www.visittci.com/events/fish-fry',
  },
  {
    title: 'Da Conch Shack',
    description:
      'An iconic beachfront stop for a very local meal, especially if you want to try conch salad, conch fritters, cracked conch, and rum drinks by the water.',
    note: 'A fun casual pick for local seafood and one of the island’s best-known food stops.',
    image: 'https://daconchshack.com/wp-content/uploads/2025/07/home-2.jpg',
    imageAlt: 'Da Conch Shack in Turks and Caicos',
    link: 'https://daconchshack.com/',
  },
];

const navItems = ['home', 'schedule', 'food', 'activity', 'accommodation', 'explore', 'honeymoon'] as const;

const introSlides = [
  {
    eyebrow: 'Welcome',
    title: 'Jon & Tao wedding',
    body: 'Three days of sea breeze, candlelight, and celebration at Wymara Villa.',
  },
  {
    eyebrow: 'The Location',
    title: 'Wymara Villa in Turks and Caicos',
    body: 'We want you to relax, enjoy your trip, and celebrate this whole island escape with us.',
  },
];

function getCountdownParts() {
  const distance = Math.max(weddingDate.getTime() - Date.now(), 0);
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
  };
}

type SavedPlan = {
  guestName: string;
  guestEmail: string;
  starter: string;
  main: string;
  dessert: string;
  activity: string;
  savedAt: string;
};

export function WeddingExperience() {
  const honeymoonFundUrl =
    process.env.NEXT_PUBLIC_HONEYMOON_FUND_URL?.trim() ||
    'https://www.honeyfund.com/site/linch-linch-11-25-2026';
  const weddingRoomCode = process.env.NEXT_PUBLIC_WEDDING_ROOM_CODE?.trim();
  const [introOpen, setIntroOpen] = useState(true);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [countdown, setCountdown] = useState(getCountdownParts);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [starter, setStarter] = useState(receptionStarters[0]);
  const [main, setMain] = useState(receptionMains[0].value);
  const [dessert, setDessert] = useState(receptionDesserts[0]);
  const [activity, setActivity] = useState(activityChoices[0]?.id ?? '');
  const [savedAt, setSavedAt] = useState('');
  const [isSubmittingPlanner, setIsSubmittingPlanner] = useState(false);

  function getNavLabel(item: (typeof navItems)[number]) {
    if (item === 'food') return 'Food Menu';
    if (item === 'honeymoon') return 'Honeymoon Fund';
    return item.charAt(0).toUpperCase() + item.slice(1);
  }

  useEffect(() => {
    const timerId = window.setInterval(() => setCountdown(getCountdownParts()), 60_000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!introOpen) {
      return;
    }

    const slideTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % introSlides.length);
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, [introOpen]);

  useEffect(() => {
    if (!introOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        moveToPlanner();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introOpen]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<SavedPlan>;
      if (parsed.guestName) setGuestName(parsed.guestName);
      if (parsed.guestEmail) setGuestEmail(parsed.guestEmail);
      if (parsed.starter) setStarter(parsed.starter);
      if (parsed.main) setMain(parsed.main);
      if (parsed.dessert) setDessert(parsed.dessert);
      if (parsed.activity) setActivity(parsed.activity);
      if (parsed.savedAt) setSavedAt(parsed.savedAt);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const selectedActivity =
    activityChoices.find((option) => option.id === activity) ?? activityChoices[0];

  function moveToPlanner() {
    setIntroOpen(false);
    setPlannerOpen(true);
  }

  function returnToIntro() {
    setPlannerOpen(false);
    setIntroOpen(true);
  }

  function savePlan() {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        guestName,
        guestEmail,
        starter,
        main,
        dessert,
        activity,
        savedAt: timestamp,
      } satisfies SavedPlan),
    );

    setSavedAt(timestamp);
    toast.success('Your dinner and activity selections were saved on this device.');
  }

  async function savePlanAndEnter() {
    if (!guestName.trim()) {
      toast.error('Please enter the guest name before continuing.');
      return;
    }

    if (!guestEmail.trim()) {
      toast.error('Please enter the guest email before continuing.');
      return;
    }

    setIsSubmittingPlanner(true);

    try {
      const response = await fetch('/api/wedding-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          starter,
          main,
          dessert,
          activity: selectedActivity.title,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Could not send your selections right now.');
      }

      savePlan();
      setPlannerOpen(false);
      toast.success('Your selections were sent successfully.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not send your selections right now.';
      toast.error(message);
    } finally {
      setIsSubmittingPlanner(false);
    }
  }

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f6f8fd_0%,#f7fbff_34%,#fffaf4_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-20 h-72 w-72 rounded-full bg-[#d4e3fb] blur-3xl" />
        <div className="absolute right-[-8rem] top-44 h-72 w-72 rounded-full bg-[#fbefcf] blur-3xl" />
        <div className="absolute bottom-12 left-1/3 h-96 w-96 rounded-full bg-[#dce9ff] blur-3xl" />
      </div>

      {introOpen && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(241,246,255,0.58)] p-2.5 backdrop-blur-xl sm:p-3"
          onClick={moveToPlanner}
        >
          <section
            id="intro"
            onClick={(event) => event.stopPropagation()}
            className="relative mx-auto my-2.5 flex min-h-[min(35rem,calc(100vh-1.25rem))] w-full max-w-[1040px] items-center justify-center overflow-hidden rounded-[2.35rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(237,243,255,0.97))] px-3 py-3 shadow-[0_45px_140px_rgba(82,113,165,0.28)] sm:my-3 sm:px-4 lg:px-6 lg:py-5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-10 top-8 h-48 w-48 rounded-full bg-[#dbe8ff] blur-3xl" />
              <div className="absolute bottom-8 right-8 h-56 w-56 rounded-full bg-[#f8eac7] blur-3xl" />
            </div>

            <div className="relative w-full max-w-[1000px] rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(243,247,255,0.92))] px-4 py-4 shadow-[0_28px_100px_rgba(82,113,165,0.16)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-7 lg:py-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {introSlides.map((slide, index) => (
                    <button
                      key={slide.eyebrow}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={cn(
                        'h-2.5 rounded-full transition-all',
                        activeSlide === index ? 'w-10 bg-[#5f86c7]' : 'w-2.5 bg-[#c7d7f2]',
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((current) => (current - 1 + introSlides.length) % introSlides.length)
                    }
                    className="rounded-full border border-[#d7e2f5] bg-white/85 p-3 text-[#45689d] transition hover:bg-white"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((current) => (current + 1) % introSlides.length)}
                    className="rounded-full border border-[#d7e2f5] bg-white/85 p-3 text-[#45689d] transition hover:bg-white"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={moveToPlanner}
                    className="rounded-full bg-[#45689d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c5a88]"
                  >
                    Continue
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <div className="overflow-hidden rounded-[2rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-4 sm:p-5 lg:p-8">
                  {activeSlide === 0 && (
                    <div className="relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(226,237,255,0.72)_42%,rgba(247,250,255,0.96)_78%)] px-4 py-6 text-center sm:min-h-[30rem] lg:min-h-[33rem]">
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-1/2 top-9 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d7e5fb] blur-3xl sm:top-12 sm:h-56 sm:w-56" />
                        <div className="absolute left-1/2 top-12 h-[14rem] w-[14rem] -translate-x-1/2 rounded-full border border-white/55 sm:top-18 sm:h-[21rem] sm:w-[21rem]" />
                        <div className="absolute left-1/2 top-16 h-[11rem] w-[11rem] -translate-x-1/2 rounded-full border border-[#e4d2a2]/45 sm:top-22 sm:h-[16rem] sm:w-[16rem]" />
                      </div>

                      <p className="relative text-sm uppercase tracking-[0.42em] text-[#5f86c7]">
                        Turks and Caicos 2026
                      </p>

                      <div className="relative mt-5 flex items-center justify-center sm:mt-7">
                        <div className="absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98),rgba(255,255,255,0.74))] blur-xl sm:h-64 sm:w-64" />
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#dcc88c] bg-white shadow-[0_32px_90px_rgba(214,168,73,0.26)] sm:h-52 sm:w-52 lg:h-[15.5rem] lg:w-[15.5rem]">
                          <Image src="/wedding-logo.png" alt="Jon and Tao wedding logo" fill className="object-cover" />
                        </div>
                      </div>

                      <div className="relative mt-6 sm:mt-8">
                        <p className="text-sm font-medium tracking-[0.18em] text-[#b38a35] sm:text-base">
                          Jon & Tao
                        </p>
                        <h1
                          className={`${calligraphyFont.className} mt-1 text-[2.45rem] leading-[0.9] text-[#b38a35] drop-shadow-[0_12px_28px_rgba(179,138,53,0.18)] sm:text-[4.2rem] lg:text-[5.4rem]`}
                        >
                          Wedding
                        </h1>
                      </div>

                      <div className="relative mt-5 flex items-center gap-3 text-[#d3a74e] sm:mt-7">
                        <span className="h-px w-10 bg-current/70 sm:w-16" />
                        <span className="text-xs uppercase tracking-[0.4em] text-[#9a7a31]">Wymara Villa</span>
                        <span className="h-px w-10 bg-current/70 sm:w-16" />
                      </div>

                      <p className="relative mt-4 max-w-3xl font-display text-[0.98rem] leading-[1.12] tracking-[-0.01em] text-[#5677a8] sm:mt-6 sm:text-[1.45rem] lg:text-[1.8rem]">
                        Three days of sea breeze, candlelight, and celebration at Wymara Villa.
                      </p>

                    </div>
                  )}

                  {activeSlide === 1 && (
                    <div className="flex min-h-[26rem] flex-col justify-center sm:min-h-[30rem] lg:min-h-[33rem]">
                      <div className="text-center">
                        <p className="text-sm uppercase tracking-[0.38em] text-[#5f86c7]">The Location</p>
                        <h2 className="mx-auto mt-3 max-w-4xl text-center font-display text-[2rem] leading-[0.95] tracking-[-0.03em] text-[#34557f] sm:text-[2.8rem] lg:text-[3.35rem]">
                          Wymara Villa in Turks and Caicos
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                          We want you to relax, enjoy your trip, and celebrate this island escape with us.
                        </p>
                      </div>

                      <div className="mt-7 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                        <article className="group relative overflow-hidden rounded-[2.3rem] border border-[#d7e2f5] shadow-[0_24px_70px_rgba(95,134,199,0.18)]">
                          <div className="absolute inset-0">
                            <Image
                              src="/grace-bay-beach.jpg"
                              alt="Grace Bay beach in Turks and Caicos"
                              fill
                              className="object-cover transition duration-700 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="relative flex min-h-[22rem] flex-col justify-start bg-[linear-gradient(180deg,rgba(17,31,54,0.36)_0%,rgba(17,31,54,0.12)_28%,rgba(17,31,54,0.02)_52%,rgba(17,31,54,0.18)_100%)] p-5">
                            <div className="inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                              #1 Beach In The World
                            </div>
                            <div className="mt-5 max-w-md">
                              {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Grace Bay</p> */}
                              <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                One of the reasons this trip feels like a dream before it even begins.
                              </h3>
                              <p className="mt-3 max-w-md text-xs leading-6 text-white/78 sm:text-sm">
                                Soft sand, turquoise water, and the kind of view that makes Turks and Caicos unforgettable.
                              </p>
                            </div>
                          </div>
                        </article>

                        <div className="grid gap-4">
                          <article className="group relative overflow-hidden rounded-[2.3rem] border border-[#d7e2f5] shadow-[0_24px_70px_rgba(95,134,199,0.16)]">
                            <div className="absolute inset-0">
                              <Image
                                src="/wymara-villa-ocean.jpeg"
                                alt="Wymara Villa oceanfront deck"
                                fill
                                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="relative flex min-h-[15.5rem] flex-col justify-between bg-[linear-gradient(180deg,rgba(17,31,54,0.03)_0%,rgba(17,31,54,0.08)_40%,rgba(17,31,54,0.3)_70%,rgba(17,31,54,0.62)_100%)] p-5">
                              <div className="inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                                Wymara Villa
                              </div>
                              <div className="max-w-md">
                                {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Wymara Villa</p> */}
                                <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                  Our wedding setting by the water
                                </h3>
                                <p className="mt-3 max-w-md text-xs leading-6 text-white/78 sm:text-sm">
                                  Ocean views, open sky, and the relaxed luxury atmosphere that drew us here.
                                </p>
                              </div>
                            </div>
                          </article>

                          <article className="group relative overflow-hidden rounded-[2rem] border border-[#d7e2f5] shadow-[0_20px_60px_rgba(95,134,199,0.14)]">
                            <div className="absolute inset-0">
                              <Image
                                src="/turks-sunset-sail.jpg"
                                alt="Sunset sailing in Turks and Caicos"
                                fill
                                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="relative flex min-h-[13rem] flex-col justify-between bg-[linear-gradient(180deg,rgba(17,31,54,0.03)_0%,rgba(17,31,54,0.08)_40%,rgba(17,31,54,0.3)_70%,rgba(17,31,54,0.66)_100%)] p-5">
                              <div className="inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                                Island Evenings
                              </div>
                              <div className="max-w-md">
                                {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Sunset Sail</p> */}
                                <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                  Sunset sail energy
                                </h3>
                                <p className="mt-3 max-w-md text-xs leading-6 text-white/78 sm:text-sm">
                                  Golden light, ocean air, and the kind of evening that makes the whole trip feel even more special.
                                </p>
                              </div>
                            </div>
                          </article>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {plannerOpen && (
        <div className="fixed inset-0 z-[72] overflow-y-auto bg-[rgba(241,246,255,0.62)] p-3 backdrop-blur-xl sm:p-4">
          <section
            onClick={(event) => event.stopPropagation()}
            className="relative mx-auto my-3 w-full max-w-[1040px] rounded-[2.35rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,247,255,0.95))] px-4 py-4 shadow-[0_45px_140px_rgba(82,113,165,0.28)] sm:px-5 sm:py-5 lg:px-7 lg:py-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.38em] text-[#5f86c7]">Before Entering</p>
                <h2 className="mt-2 font-display text-[2rem] leading-none text-[#34557f] sm:text-[2.7rem]">
                  Choose your activity and dinner selections
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  To make things easier for everyone, please make your selections here first. You can
                  update them later on the website.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={returnToIntro}
                  className="rounded-full border border-[#cfdbf2] bg-white/85 px-4 py-2.5 text-sm font-medium text-[#45689d] transition hover:bg-white"
                >
                  Back To Intro
                </button>
                <button
                  type="button"
                  onClick={savePlanAndEnter}
                  disabled={isSubmittingPlanner}
                  className="rounded-full bg-[#45689d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c5a88]"
                >
                  {isSubmittingPlanner ? 'Sending...' : 'Save And Enter Website'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-[1.8rem] border border-[#d7e2f5] bg-white/78 p-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="planner-guest-name"
                  className="text-xs uppercase tracking-[0.28em] text-slate-500"
                >
                  Guest Name
                </label>
                <Input
                  id="planner-guest-name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 h-11 rounded-xl border-[#cfdbf2] bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="planner-guest-email"
                  className="text-xs uppercase tracking-[0.28em] text-slate-500"
                >
                  Guest Email
                </label>
                <Input
                  id="planner-guest-email"
                  type="email"
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 h-11 rounded-xl border-[#cfdbf2] bg-white"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="group relative overflow-hidden rounded-[2rem] border border-[#d7e2f5] shadow-[0_20px_60px_rgba(95,134,199,0.14)]">
                <div className="absolute inset-0">
                  <Image
                    src={selectedActivity.image}
                    alt={selectedActivity.imageAlt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative min-h-[16rem] bg-[linear-gradient(180deg,rgba(17,31,54,0.08)_0%,rgba(17,31,54,0.12)_30%,rgba(17,31,54,0.28)_68%,rgba(17,31,54,0.56)_100%)] p-6">
                  <div className="max-w-sm rounded-[1.35rem] border border-white/12 bg-[rgba(11,24,43,0.16)] px-4 py-4 backdrop-blur-[2px]">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/76">November 24</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">Choose your activity</h3>
                    <p className="mt-3 text-sm leading-7 text-white/84">
                      Choose between two island experiences and keep the one that feels right for your day.
                    </p>
                  </div>
                </div>
                <div className="relative border-t border-white/20 bg-white/88 p-4 backdrop-blur-md">
                  <SelectionGroup
                    title="Activity"
                    items={activityChoices.map((choice) => choice.title)}
                    value={selectedActivity.title}
                    onChange={(value) => {
                      const match = activityChoices.find((choice) => choice.title === value);
                      if (match) {
                        setActivity(match.id);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[2rem] border border-[#d7e2f5] shadow-[0_20px_60px_rgba(214,168,73,0.14)]">
                <div className="absolute inset-0">
                  <Image
                    src="/wymara-chef-dinner.webp"
                    alt="Chef preparing the Wymara dinner experience"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative min-h-[16rem] bg-[linear-gradient(180deg,rgba(17,31,54,0.08)_0%,rgba(17,31,54,0.12)_30%,rgba(17,31,54,0.26)_68%,rgba(17,31,54,0.54)_100%)] p-6">
                  <div className="max-w-sm rounded-[1.35rem] border border-white/12 bg-[rgba(35,22,8,0.16)] px-4 py-4 backdrop-blur-[2px]">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/78">November 25</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">Choose your dinner</h3>
                    <p className="mt-3 text-sm leading-7 text-white/86">
                      Select your starter, main, and dessert for the reception dinner.
                    </p>
                  </div>
                </div>
                <div className="relative border-t border-white/20 bg-white/90 p-4 backdrop-blur-md">
                  <div className="grid gap-5">
                    <SelectionGroup
                      title="Starter"
                      items={receptionStarters}
                      value={starter}
                      onChange={setStarter}
                    />
                    <SelectionGroup title="Main" items={receptionMains} value={main} onChange={setMain} />
                    <SelectionGroup
                      title="Dessert"
                      items={receptionDesserts}
                      value={dessert}
                      onChange={setDessert}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <div
        className={cn(
          'relative mx-auto max-w-7xl px-5 pb-24 pt-6 transition duration-300 sm:px-8 lg:px-12',
          (introOpen || plannerOpen) && 'pointer-events-none select-none blur-[6px] saturate-[0.9]',
        )}
      >
        <header className="sticky top-4 z-40 mb-10 rounded-full border border-[#d5e2f5] bg-white/75 px-5 py-3 shadow-[0_18px_50px_rgba(89,120,170,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d8c18a] bg-white">
                <Image src="/wedding-logo.png" alt="Jon and Tao wedding logo" fill className="object-cover" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-[#45689d]">Jon & Tao</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wymara Villa 2026</p>
              </div>
            </a>

            <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
              {navItems.map((item) => (
                <a key={item} href={`#${item}`} className="transition hover:text-[#45689d]">
                  {getNavLabel(item)}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="rounded-full border border-[#d5e2f5] bg-[#eef4ff] p-2 text-[#45689d] lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {mobileNavOpen && (
            <div className="mt-4 grid gap-3 border-t border-[#e3ebf8] pt-4 text-sm text-slate-700 lg:hidden">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-2xl bg-[#f5f8ff] px-4 py-3"
                >
                  {getNavLabel(item)}
                </a>
              ))}
            </div>
          )}
        </header>

        <section
          id="home"
          className="grid items-center gap-10 rounded-[2.5rem] border border-[#dae4f5] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(234,241,255,0.92))] px-6 py-8 shadow-[0_24px_80px_rgba(82,113,165,0.12)] lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10"
        >
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d0dcf1] bg-white px-4 py-2 text-sm text-[#45689d]">
              <Sparkles className="h-4 w-4 text-[#d6a849]" />
              Beach wedding weekend at Wymara Villa in Turks and Caicos
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.42em] text-slate-500">
                November 23 to November 25, 2026
              </p>
              <h1 className="max-w-4xl font-display text-[2.9rem] leading-[0.96] tracking-[-0.02em] text-[#34557f] sm:text-[4rem] lg:text-[4.6rem]">
                Your island wedding plans, all in one place.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                This site is your island planner. Start with the wedding schedule, then explore your
                menu selections, activity plans, and island details at your own pace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-[#d6e1f3] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Countdown</p>
                <p className="mt-3 font-display text-5xl text-[#34557f]">{countdown.days}</p>
                <p className="text-sm text-slate-600">days to the wedding</p>
              </div>
              <div className="rounded-[1.75rem] border border-[#d6e1f3] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Location</p>
                <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[#34557f]">
                  <MapPin className="h-5 w-5 text-[#5f86c7]" />
                  Wymara Villa
                </p>
                <p className="text-sm text-slate-600">Turks and Caicos</p>
              </div>
              <div className="rounded-[1.75rem] border border-[#d6e1f3] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">November Weather</p>
                <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[#34557f]">
                  <SunMedium className="h-5 w-5 text-[#5f86c7]" />
                  82F and sunny
                </p>
                <p className="text-sm text-slate-600">warm breezes, bright water, and light tropical evenings</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(95,134,199,0.24),rgba(214,168,73,0.22))] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#cbd9ef] bg-[linear-gradient(180deg,#4d72ac,#88a3d7)] p-7 text-white shadow-[0_24px_70px_rgba(70,102,156,0.32)]">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/35 bg-white/85">
                  <Image src="/wedding-logo.png" alt="Jon and Tao crest" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.38em] text-white/70">Wedding Crest</p>
                  <p className="mt-2 font-display text-4xl">Jon & Tao</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ['Nov 23', 'Welcome Party beach BBQ'],
                  ['Nov 24', 'Island activities and time to unwind'],
                  ['Nov 25', 'Wedding ceremony reception dinner and party'],
                ].map(([date, title]) => (
                  <div key={date} className="rounded-[1.5rem] border border-white/18 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">{date}</p>
                    <p className="mt-2 text-lg font-semibold">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="schedule" className="mt-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Schedule</p>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">The wedding timeline, all in one place.</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              This is the main place to check what is happening each day, what to expect, and what
              to wear for each part of the celebration.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                day: 'Nov 23',
                title: 'Welcome Party Beach BBQ',
                body: 'Arrive, settle in, and join everyone for a relaxed beach BBQ kickoff at Wymara Villa.',
                notes: ['Dress code: beach chic and relaxed resort wear', 'Expect a casual evening with the BBQ menu and time to reconnect'],
              },
              {
                day: 'Nov 24',
                title: 'Island Activity Day',
                body: 'A day to enjoy the island at your own pace, with your selected activity and plenty of time to unwind.',
                notes: ['Dress code: easy daytime resort wear with swim or sun gear if needed', 'Expect a lighter island day with space to relax between plans'],
              },
              {
                day: 'Nov 25',
                title: 'Ceremony, Canapes, and Reception',
                body: 'The wedding day brings the ceremony, cocktail-style canapes, reception dinner, and the celebration into the evening.',
                notes: ['Dress code: wedding attire with an elegant beachside feel', 'Expect canapes after the ceremony followed by dinner and the party'],
              },
            ].map((item) => (
              <article
                key={item.day}
                className="rounded-[2rem] border border-[#d9e4f6] bg-white p-6 shadow-[0_18px_50px_rgba(95,134,199,0.09)]"
              >
                <p className="text-sm uppercase tracking-[0.32em] text-[#5f86c7]">{item.day}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-[#34557f]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.body}</p>
                <div className="mt-5 space-y-3">
                  {item.notes.map((note) => (
                    <div key={note} className="rounded-[1.25rem] bg-[#f5f8ff] px-4 py-3 text-sm text-slate-700">
                      {note}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="food" className="mt-20 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.25rem] border border-[#d9e4f6] bg-white p-7">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-5 w-5 text-[#5f86c7]" />
              <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Food Menu</p>
            </div>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">Beach BBQ and Cocktail Reception</h2>

            <div className="mt-8 grid gap-5">
              <div className="rounded-[1.75rem] border border-[#dce6f6] bg-[#f7faff] p-5">
                <h3 className="text-2xl font-semibold text-[#34557f]">Beach BBQ menu</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Salad Table</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {welcomeMenu.saladTable.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Hot Table</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {welcomeMenu.hotTable.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Dessert</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {welcomeMenu.dessert.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#dce6f6] bg-[#fcfbf8] p-5">
                <h3 className="text-2xl font-semibold text-[#34557f]">Canapés after ceremony</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Passed bites served between the ceremony and reception dinner.
                </p>
                <ul className="mt-5 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-2">
                  {welcomeMenu.canapes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-[#d9e4f6] bg-[linear-gradient(180deg,#fffdfa,#f4f8ff)] p-7">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[#5f86c7]" />
              <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Reception Dinner Selection</p>
            </div>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">Need to make a change?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your selections were already collected before entering the site. This section is here in
              case you would like to make a change before the final deadline.
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-[#d8e2f4] bg-white px-5 py-4 text-sm text-slate-700">
              Final date to make food changes: <span className="font-semibold text-[#34557f]">October 1, 2026</span>
            </div>

            <div className="mt-8 space-y-8">
              <SelectionGroup
                title="Starter"
                items={receptionStarters}
                value={starter}
                onChange={setStarter}
              />
              <SelectionGroup title="Main" items={receptionMains} value={main} onChange={setMain} />
              <SelectionGroup
                title="Dessert"
                items={receptionDesserts}
                value={dessert}
                onChange={setDessert}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {savedAt ? `Saved on this device: ${savedAt}` : 'Save your choices so they stay here on this browser.'}
              </div>
              <button
                type="button"
                onClick={savePlan}
                className="rounded-full bg-[#5f86c7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5076b8]"
              >
                Update My Selection
              </button>
            </div>
          </div>
        </section>

        <section id="activity" className="mt-20 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.25rem] border border-[#d9e4f6] bg-white p-7">
            <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Activity</p>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">Want to switch activities?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your activity was already selected before entering the site. This section is here in
              case you would like to switch to the other experience before the final deadline.
            </p>
            <div className="mt-5 rounded-[1.5rem] border border-[#d8e2f4] bg-white px-5 py-4 text-sm text-slate-700">
              Final date to make activity changes: <span className="font-semibold text-[#34557f]">September 1, 2026</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {activityChoices.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActivity(option.id)}
                  aria-pressed={activity === option.id}
                  className={cn(
                    'w-full overflow-hidden rounded-[1.75rem] border text-left transition',
                    activity === option.id
                      ? 'border-[#7f9fd7] bg-[#eef4ff] shadow-[0_12px_35px_rgba(95,134,199,0.14)]'
                      : 'border-[#d9e4f6] bg-[#fbfdff] hover:bg-[#f4f8ff]',
                  )}
                >
                  <div className="relative h-48">
                    <Image
                      src={option.image}
                      alt={option.imageAlt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.06)_0%,rgba(17,31,54,0.16)_42%,rgba(17,31,54,0.48)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <p className="font-display text-[1.65rem] leading-tight text-white">{option.title}</p>
                      {activity === option.id ? (
                        <span className="rounded-full bg-white/90 p-2 text-[#5f86c7]">
                          <Check className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/82 p-2 text-slate-500">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-6 text-slate-700">
                      {option.websiteDescription ?? option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-[#d9e4f6] bg-[linear-gradient(180deg,#45689d,#7e9fdb)] p-7 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Selected Vibe</p>
            <h2 className="mt-3 font-display text-5xl">Your island itinerary</h2>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.75rem] border border-white/18 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Welcome Party</p>
                <p className="mt-2 text-xl font-semibold">Beach BBQ at Wymara Villa</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/18 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Nov 24 Activity</p>
                <p className="mt-2 text-xl font-semibold">{selectedActivity.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {selectedActivity.websiteDescription ?? selectedActivity.description}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/18 bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Wedding Dinner</p>
                <p className="mt-2 text-lg font-semibold">{main}</p>
                <p className="mt-2 text-sm text-white/80">{starter}</p>
                <p className="mt-1 text-sm text-white/80">{dessert}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="accommodation" className="mt-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Accommodation</p>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">Stay close to the celebration and keep the trip easy.</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Wymara Resort + Villas is our main recommendation, with a few nearby Grace Bay options
              for guests who want to stay close while choosing the style of stay that fits them best.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
            <article className="overflow-hidden rounded-[2.2rem] border border-[#d9e4f6] bg-[linear-gradient(180deg,#ffffff,#f5f8ff)] p-7 shadow-[0_20px_60px_rgba(95,134,199,0.10)]">
              <div className="relative mb-6 h-56 overflow-hidden rounded-[1.7rem]">
                <Image
                  src="/wymara-villa-ocean.jpeg"
                  alt="Wymara Resort and Villas oceanfront view"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.02)_0%,rgba(17,31,54,0.12)_48%,rgba(17,31,54,0.36)_100%)]" />
                <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/14 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                  Grace Bay
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-[#5f86c7]">Recommended Stay</p>
                  <h3 className="mt-3 font-display text-4xl text-[#34557f]">Wymara Resort + Villas</h3>
                </div>
                <a
                  href="https://www.wymara.com/accommodation"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#d6e1f3] bg-white px-4 py-2 text-sm font-medium text-[#45689d] transition hover:bg-[#f5f8ff]"
                >
                  View Wymara
                </a>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700">
                Wymara is our closest and easiest stay option, with beachfront studios, suites, and
                villas on Grace Bay Beach plus access to resort amenities like breakfast, Wi-Fi, and
                parking.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ['Best for', 'Guests who want the easiest wedding-weekend logistics'],
                  ['Atmosphere', 'Modern beachfront resort with villa options'],
                  ['Arrival tip', 'Aim to arrive by Nov 22 or early Nov 23'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] border border-[#dce6f6] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-[#d7e2f5] bg-[#edf4ff] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#5f86c7]">Wedding Room Code</p>
                <p className="mt-2 text-lg font-semibold text-[#34557f]">
                  {weddingRoomCode || 'Code will be shared here'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Use this code when booking directly with Wymara once the wedding rate is available.
                </p>
              </div>
            </article>

            <div className="grid gap-5">
              {[
                {
                  title: 'Seven Stars Resort & Spa',
                  description:
                    'A Grace Bay beachfront resort with suite-style accommodations, kitchens in many rooms, and easy access to the same stretch of beach.',
                  link: 'https://www.sevenstarsgracebay.com/accommodations',
                  note: 'Good for guests who want a full-service resort stay close to the action.',
                  image:
                    'https://symphony.cdn.tambourine.com/seven-stars-resort/media/cache/seven-stars-accommodations-header-new-2019-5c8fdf15afc07-optimized-1500x500.webp',
                  imageAlt: 'Seven Stars Resort suite in Turks and Caicos',
                },
                {
                  title: 'Ports of Call Resort',
                  description:
                    'A more affordable Grace Bay option with renovated rooms, a central location, and easy access to the beach, restaurants, and shops.',
                  link: 'https://portsofcallresort.com/',
                  note: 'A practical lower-price option for guests who want to stay nearby without booking a larger luxury resort.',
                  image: 'https://portsofcallresort.com/wp-content/uploads/front-page-optimized.webp',
                  imageAlt: 'Ports of Call Resort in Grace Bay',
                },
              ].map((stay) => (
                <article
                  key={stay.title}
                  className="overflow-hidden rounded-[2rem] border border-[#d9e4f6] bg-white shadow-[0_18px_50px_rgba(95,134,199,0.08)]"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={stay.image}
                      alt={stay.imageAlt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.04)_0%,rgba(17,31,54,0.14)_45%,rgba(17,31,54,0.42)_100%)]" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div className="flex items-center gap-3 text-white">
                        <BedDouble className="h-5 w-5 text-white/90" />
                        <h3 className="text-xl font-semibold">{stay.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-end gap-4">
                      <a
                        href={stay.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[#45689d] hover:text-[#34557f]"
                      >
                        Visit
                      </a>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{stay.description}</p>
                    <div className="mt-4 rounded-[1.35rem] bg-[#f5f8ff] px-4 py-3 text-sm leading-6 text-slate-700">
                      {stay.note}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="explore" className="mt-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Explore</p>
            <h2 className="mt-3 font-display text-5xl text-[#34557f]">A few memorable Turks and Caicos favorites.</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              If you have extra time around the wedding, these are a few easy recommendations for
              scenery, local culture, and island food.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {exploreCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-[2rem] border border-[#d9e4f6] bg-white shadow-[0_18px_50px_rgba(95,134,199,0.08)]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={card.image} alt={card.imageAlt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.04)_0%,rgba(17,31,54,0.14)_45%,rgba(17,31,54,0.42)_100%)]" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3 text-white">
                      <Compass className="h-5 w-5 text-white/90" />
                      <h3 className="text-2xl font-semibold">{card.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-7 text-slate-700">{card.description}</p>
                  <div className="mt-4 rounded-[1.35rem] bg-[#f5f8ff] px-4 py-3 text-sm leading-6 text-slate-700">
                    {card.note}
                  </div>
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm font-medium text-[#45689d] hover:text-[#34557f]"
                  >
                    Learn more
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-[#d9e4f6] bg-[linear-gradient(180deg,#ffffff,#f6f9ff)] p-6 shadow-[0_18px_50px_rgba(95,134,199,0.08)]">
            <p className="text-sm uppercase tracking-[0.35em] text-[#5f86c7]">Travel Tips</p>
            <h3 className="mt-3 font-display text-4xl text-[#34557f]">A few things that are helpful to know.</h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'Taxi costs can be high',
                  body: 'Taxis are convenient, but they are one of the more expensive ways to get around Providenciales, especially for repeated trips beyond Grace Bay.',
                },
                {
                  title: 'Confirm the total fare first',
                  body: 'Before the ride begins, confirm whether the price is total or per passenger and whether the ride is shared or private.',
                },
                {
                  title: 'Rental cars are often easier',
                  body: 'If you plan to explore beyond the resort area, a rental car is usually the simplest and most cost-effective option for the day.',
                },
                {
                  title: 'Thursday Fish Fry starts at 6pm',
                  body: 'If you want to go, plan a little ahead so you can arrive comfortably and enjoy the music, local food, and atmosphere.',
                },
              ].map((tip) => (
                <div key={tip.title} className="rounded-[1.5rem] border border-[#dce6f6] bg-white p-5">
                  <p className="text-lg font-semibold text-[#34557f]">{tip.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="honeymoon"
          className="relative mt-20 overflow-hidden rounded-[2.25rem] border border-[#d9e4f6] bg-[linear-gradient(135deg,#45689d,#7f9fd7)] px-6 py-8 text-white lg:px-8"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-6 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#f3d38b]/12 blur-3xl" />
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="relative max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-white/70">Honeymoon Fund</p>
                <h2 className="mt-3 font-display text-5xl leading-[0.96]">Your presence is more than enough.</h2>
                <p className="mt-4 text-base leading-8 text-white/82">
                  We truly appreciate everyone traveling all the way to celebrate with us in Turks and
                  Caicos, and nothing more is needed beyond being there with us.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/82">
                  If you still feel moved to give something, we would be humbled by a little help
                  toward our honeymoon and the memories we will begin just after the wedding.
                </p>
              </div>

              <div className="relative rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] p-6 shadow-[0_24px_60px_rgba(26,44,86,0.22)] backdrop-blur-md">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="flex items-center gap-2 text-white/88">
                  <Palmtree className="h-5 w-5 text-[#f3d38b]" />
                  Honeyfund
                </div>
                <p className="mt-4 max-w-sm font-display text-[1.9rem] leading-tight text-white">
                  A little gift toward the trip that begins after the celebration.
                </p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-white/78">
                  For anyone who has asked, we have created a Honeyfund page for honeymoon memories to come.
                </p>
                {honeymoonFundUrl ? (
                  <a
                    href={honeymoonFundUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#45689d] shadow-[0_12px_30px_rgba(17,34,68,0.18)] transition hover:bg-[#f5f8ff] hover:shadow-[0_16px_34px_rgba(17,34,68,0.22)]"
                  >
                    Open Honeyfund
                  </a>
                ) : (
                  <div className="mt-6 rounded-[1.2rem] border border-white/20 bg-white/8 px-4 py-3 text-white/84">
                    Add <span className="font-semibold">NEXT_PUBLIC_HONEYMOON_FUND_URL</span> with your Honeyfund link to connect it here.
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>

      <WeddingChat />
    </div>
  );
}

type SelectionGroupProps = {
  title: string;
  items: Array<string | { value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
};

function SelectionGroup({ title, items, value, onChange }: SelectionGroupProps) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{title}</p>
      <div className="mt-3 grid gap-3">
        {items.map((item) => {
          const option = typeof item === 'string' ? { value: item, label: item } : item;

          return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              'rounded-[1.4rem] border p-4 text-left transition',
              value === option.value
                ? 'border-[#7f9fd7] bg-[#eef4ff] shadow-[0_10px_28px_rgba(95,134,199,0.12)]'
                : 'border-[#d9e4f6] bg-white hover:bg-[#f8fbff]',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="block text-sm leading-6 text-slate-700">
                  <span className="text-[1rem] font-semibold leading-6 text-[#34557f]">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-1 block text-sm font-normal leading-6 text-slate-600">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </div>
              {value === option.value ? (
                <Check className="mt-0.5 h-5 w-5 text-[#5f86c7]" />
              ) : (
                <ChevronRight className="mt-0.5 h-5 w-5 text-slate-400" />
              )}
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
}

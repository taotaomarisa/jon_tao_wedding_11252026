'use client';

import {
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Menu,
  SunMedium,
} from 'lucide-react';
import { Alex_Brush } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { WeddingChat } from './wedding-chat';

const calligraphyFont = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
});

const storageKey = 'jon-tao-wedding-plan';
const languageStorageKey = 'jon-tao-wedding-language';
const weddingDate = new Date('2026-11-25T17:00:00-05:00');
const languages = ['en', 'es', 'zh'] as const;
type Language = (typeof languages)[number];

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
      'truffle mashed potatoes, asparagus, and red wine.',
  },
  {
    value: 'Blackened local grouper fillet',
    label: 'Blackened local grouper fillet',
    description:
      'lime and mango salsa with local rice and peas.',
  },
  {
    value: 'Vegetarian breaded cauliflower steak',
    label: 'Vegetarian breaded cauliflower steak',
    description:
      'coconut rice, spiced black bean salsa, and curry yogurt sauce.',
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
    image: '/thursday-fish-fry.jpg',
    imageAlt: 'Thursday Fish Fry in Turks and Caicos',
    link: 'https://www.visittci.com/events/fish-fry',
  },
  {
    title: 'Da Conch Shack',
    description:
      'An iconic beachfront stop for a very local meal, especially if you want to try conch salad, conch fritters, cracked conch, and rum drinks by the water.',
    note: 'A fun casual pick for local seafood and one of the island’s best-known food stops.',
    image: '/da-conch-shack.jpg',
    imageAlt: 'Da Conch Shack in Turks and Caicos',
    link: 'https://daconchshack.com/',
  },
];

const navItems = ['home', 'schedule', 'food', 'activity', 'accommodation', 'explore', 'honeymoon'] as const;
type NavItem = (typeof navItems)[number];

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

const languageLabels: Record<Language, string> = {
  en: 'EN',
  es: 'ES',
  zh: '中文',
};

const copy = {
  en: {
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      food: 'Dining',
      activity: 'Activity',
      accommodation: 'Accommodation',
      explore: 'Explore',
      honeymoon: 'Thank You',
    },
    common: {
      continue: 'Continue',
      previousSlide: 'Previous slide',
      nextSlide: 'Next slide',
      language: 'Language',
      learnMore: 'Learn more',
      visit: 'Visit',
      viewWymara: 'View Wymara',
      updating: 'Updating...',
      updateSubmit: 'Update And Submit',
      sending: 'Sending...',
      savedOnDevice: 'Saved on this device:',
      saveBrowser: 'Save your choices so they stay here on this browser.',
    },
    intro: {
      locationEyebrow: 'The Location',
      turks2026: 'Turks and Caicos 2026',
      wedding: 'Wedding',
      headline: 'Three days of sea breeze, candlelight, and celebration on a Caribbean beach.',
      locationTitle: 'Wymara Villa in Turks and Caicos',
      locationBody: 'We want you to relax, enjoy your trip, and celebrate this island escape with us.',
      beachBadge: '#1 Beach In The World',
      beachTitle: 'One of the reasons this trip feels like a dream before it even begins.',
      beachBody: 'Soft sand, turquoise water, and the kind of view that makes Turks and Caicos unforgettable.',
      settingTitle: 'Our wedding setting by the water',
      settingBody: 'Ocean views, open sky, and the relaxed luxury atmosphere that drew us here.',
      eveningsBadge: 'Island Evenings',
      sailTitle: 'Sunset sail energy',
      sailBody: 'Golden light, ocean air, and the kind of evening that makes the whole trip feel even more special.',
    },
    planner: {
      eyebrow: 'Before Entering',
      title: 'Choose your activity and dinner selections',
      body: 'To make things easier for everyone, please make your selections here first. You can update them later on the website.',
      back: 'Back To Intro',
      save: 'Save and Enter Website',
      guestName: 'Guest Name',
      guestEmail: 'Guest Email',
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email',
      nov24: 'November 24',
      nov25: 'November 25',
      chooseActivity: 'Choose your activity',
      chooseActivityBody: 'Choose between two island experiences and keep the one that feels right for your day.',
      chooseDinner: 'Choose your dinner',
      chooseDinnerBody: 'Select your starter, main, and dessert for the reception dinner.',
      activity: 'Activity',
      starter: 'Starter',
      main: 'Main',
      dessert: 'Dessert',
    },
    home: {
      badge: 'Beach wedding weekend at Wymara Villa in Turks and Caicos',
      dateRange: 'November 23 to November 25, 2026',
      title: 'Your island wedding plans, all in one place.',
      body: 'This site is your island planner. Start with the wedding schedule, then explore your menu selections, activity plans, and island details at your own pace.',
      countdown: 'Countdown',
      daysToWedding: 'days to the wedding',
      location: 'Location',
      weather: 'November Weather',
      weatherValue: '82F and sunny',
      weatherBody: 'warm breezes, bright water, and light tropical evenings',
      crest: 'Wedding Crest',
      crestSchedule: [
        ['Nov 23', 'Welcome Party beach BBQ'],
        ['Nov 24', 'Island activities and time to unwind'],
        ['Nov 25', 'Wedding ceremony & Reception'],
      ],
    },
    schedule: {
      eyebrow: 'Schedule',
      title: 'The wedding timeline, all in one place',
      body: '',
      items: [
        {
          day: 'Nov 23',
          title: 'Beach BBQ',
          body: 'Arrive, settle in, and join everyone for a relaxed beach BBQ kickoff at Wymara Villa.',
          notes: ['Dress code: beach chic and relaxed resort wear', 'Expect a casual evening with the BBQ menu and time to reconnect'],
        },
        {
          day: 'Nov 24',
          title: 'Island Day',
          body: 'A day to enjoy the island at your own pace, with your selected activity and plenty of time to unwind.',
          notes: ['Dress code: easy daytime resort wear with swim or sun gear if needed', 'Expect a lighter island day with space to relax between plans'],
        },
        {
          day: 'Nov 25',
          title: 'Ceremony & Reception',
          body: 'The wedding day brings the ceremony, cocktail-style canapes, reception dinner, and the celebration into the evening.',
          notes: ['Dress code: black tie optional', 'Expect canapes after the ceremony followed by dinner and the party'],
        },
      ],
    },
    food: {
      eyebrow: 'Dining',
      title: 'Beach BBQ & Wedding Bites',
      bbq: 'Beach BBQ menu',
      salad: 'Salad Table',
      hot: 'Hot Table',
      dessert: 'Dessert',
      canapes: 'Canapés after ceremony',
      canapesBody: 'Passed bites served between the ceremony and reception dinner.',
      selectionEyebrow: 'Reception Dinner Selection',
      changeTitle: 'Need to make a change?',
      changeBody: 'Your selections were already collected before entering the site. This section is here in case you would like to make a change before the final deadline.',
      deadline: 'Final date to make food changes:',
      deadlineDate: 'October 1, 2026',
      allergyTitle: 'Food allergies or dietary notes',
      allergyBody: 'If you have any allergies or dietary restrictions, please let us know here.',
      allergyPlaceholder: 'Example: shellfish allergy, gluten-free, no pork...',
    },
    activity: {
      eyebrow: 'Activity',
      title: 'Choose your island pace',
      body: '',
      changeTitle: 'Want to switch your island experience?',
      changeBody: 'Your activity was already collected before entering the site. This section is here in case you would like to make a change before the final deadline.',
      deadline: 'Final date to make activity changes:',
      deadlineDate: 'September 1, 2026',
      atGlance: 'At A Glance',
      glanceTitle: 'Your wedding-week plans',
      glanceBody: 'A quick look at your wedding-week plans and the selections currently saved for your RSVP. If you make updates here, we will receive the latest version.',
      welcomeParty: 'Welcome Party',
      welcomeBody: 'Beach BBQ at Wymara Villa with a relaxed first-night atmosphere by the water.',
      dinnerLabel: 'Nov 25',
      starter: 'Starter',
      dessert: 'Dessert',
      finalNote: 'These are the selections currently attached to your wedding plans, so if you make any updates on this page, they should reflect the version we receive for your RSVP details.',
    },
    accommodation: {
      eyebrow: 'Accommodation',
      title: 'Stay close to the celebration and keep the trip easy',
      body: '',
      graceBay: 'Grace Bay',
      recommended: 'Recommended Stay',
      wymaraBody: 'Wymara is our closest and easiest stay option, with beachfront studios, suites, and villas on Grace Bay Beach plus access to resort amenities like breakfast, Wi-Fi, and parking.',
      details: [
        ['Best for', 'Guests who want the easiest wedding-week logistics'],
        ['Atmosphere', 'Modern beachfront resort with villa options'],
        ['Arrival tip', 'Aim to arrive by Nov 22 or early Nov 23'],
      ],
      roomCode: 'Room Discount Code',
      codeFallback: 'jontaowedding',
      codeBody: 'Use this code when booking directly with Wymara for 20% off once the wedding rate is available.',
      spaEyebrow: 'Guest Wellness',
      spaTitle: 'Wymara spa discount available',
      spaBody: 'We also arranged a spa discount for wedding guests who would like to book treatments at Wymara. Details will be shared here once booking instructions are finalized.',
    },
    explore: {
      eyebrow: 'Explore',
      title: 'A few memorable Turks and Caicos favorites',
      body: 'If you have extra time around the wedding, these are a few easy recommendations for scenery, local culture, and island food.',
      tipsEyebrow: 'Travel Tips',
      tipsTitle: 'A few things that are helpful to know.',
      factsEyebrow: 'Fun Facts',
      factsTitle: 'A few island details guests usually love.',
    },
    honeymoon: {
      eyebrow: 'Thank You',
      title: 'Your presence means the world to us',
      body1: 'We truly appreciate everyone traveling all the way to celebrate with us in Turks and Caicos, and nothing more is needed beyond being there with us.',
      body2: 'If you still feel moved to give something, we would be humbled by a little help toward our honeymoon and the memories we will begin just after the wedding.',
      cardTitle: 'A little gift toward the trip that begins after the celebration.',
      cardBody: 'For anyone who has asked, we have created a Honeyfund page for honeymoon memories to come.',
      cta: 'Open Honeyfund',
      missing: 'Add NEXT_PUBLIC_HONEYMOON_FUND_URL with your Honeyfund link to connect it here.',
    },
    toast: {
      guestName: 'Please enter the guest name before continuing.',
      guestEmail: 'Please enter the guest email before continuing.',
      sendError: 'Could not send your selections right now.',
      dinnerSaved: 'Your dinner update was saved and sent successfully.',
      activitySaved: 'Your activity update was saved and sent successfully.',
      selectionsSent: 'Your selections were sent successfully.',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      schedule: 'Agenda',
      food: 'Comida',
      activity: 'Actividad',
      accommodation: 'Hospedaje',
      explore: 'Explorar',
      honeymoon: 'Gracias',
    },
    common: {
      continue: 'Continuar',
      previousSlide: 'Diapositiva anterior',
      nextSlide: 'Siguiente diapositiva',
      language: 'Idioma',
      learnMore: 'Más información',
      visit: 'Visitar',
      viewWymara: 'Ver Wymara',
      updating: 'Actualizando...',
      updateSubmit: 'Actualizar y enviar',
      sending: 'Enviando...',
      savedOnDevice: 'Guardado en este dispositivo:',
      saveBrowser: 'Guarda tus elecciones para que permanezcan en este navegador.',
    },
    intro: {
      locationEyebrow: 'El Lugar',
      turks2026: 'Turks and Caicos 2026',
      wedding: 'Boda',
      headline: 'Tres días de brisa marina, luz de velas y celebración en una playa del Caribe.',
      locationTitle: 'Wymara Villa en Turks and Caicos',
      locationBody: 'Queremos que se relajen, disfruten el viaje y celebren con nosotros esta escapada en la isla.',
      beachBadge: 'Playa #1 del mundo',
      beachTitle: 'Una de las razones por las que este viaje se siente como un sueño desde antes de empezar.',
      beachBody: 'Arena suave, agua turquesa y una vista que hace inolvidable a Turks and Caicos.',
      settingTitle: 'Nuestro escenario junto al mar',
      settingBody: 'Vistas al océano, cielo abierto y el lujo relajado que nos hizo elegir este lugar.',
      eveningsBadge: 'Atardeceres de isla',
      sailTitle: 'Energía de velero al atardecer',
      sailBody: 'Luz dorada, aire de mar y una tarde que hará que el viaje se sienta aún más especial.',
    },
    planner: {
      eyebrow: 'Antes de entrar',
      title: 'Elige tu actividad y cena',
      body: 'Para hacerlo más fácil para todos, por favor haz tus elecciones aquí primero. Podrás actualizarlas después en el sitio.',
      back: 'Volver a la intro',
      save: 'Guardar y entrar',
      guestName: 'Nombre del invitado',
      guestEmail: 'Correo del invitado',
      namePlaceholder: 'Escribe tu nombre completo',
      emailPlaceholder: 'Escribe tu correo',
      nov24: '24 de noviembre',
      nov25: '25 de noviembre',
      chooseActivity: 'Elige tu actividad',
      chooseActivityBody: 'Elige entre dos experiencias de isla y quédate con la que mejor vaya con tu día.',
      chooseDinner: 'Elige tu cena',
      chooseDinnerBody: 'Selecciona tu entrada, plato fuerte y postre para la cena de recepción.',
      activity: 'Actividad',
      starter: 'Entrada',
      main: 'Plato fuerte',
      dessert: 'Postre',
    },
    home: {
      badge: 'Boda en la playa en Wymara Villa en Turks and Caicos',
      dateRange: '23 al 25 de noviembre de 2026',
      title: 'Tus planes de boda en la isla, en un solo lugar.',
      body: 'Este sitio es tu guía de la isla. Empieza con la agenda de la boda y luego explora tus selecciones de menú, actividades y detalles del viaje a tu ritmo.',
      countdown: 'Cuenta regresiva',
      daysToWedding: 'días para la boda',
      location: 'Lugar',
      weather: 'Clima en noviembre',
      weatherValue: '82F y soleado',
      weatherBody: 'brisas cálidas, agua brillante y tardes tropicales suaves',
      crest: 'Cresta de boda',
      crestSchedule: [
        ['Nov 23', 'Fiesta de bienvenida BBQ en la playa'],
        ['Nov 24', 'Actividades en la isla y tiempo para relajarse'],
        ['Nov 25', 'Ceremonia cena de recepción y fiesta'],
      ],
    },
    schedule: {
      eyebrow: 'Agenda',
      title: 'La agenda de la boda, todo en un solo lugar.',
      body: '',
      items: [
        {
          day: 'Nov 23',
          title: 'Beach BBQ',
          body: 'Lleguen, acomódense y acompáñennos en una bienvenida relajada con BBQ en la playa en Wymara Villa.',
          notes: ['Código de vestir: beach chic y ropa resort relajada', 'Una noche casual con menú BBQ y tiempo para reconectar'],
        },
        {
          day: 'Nov 24',
          title: 'Día en la isla',
          body: 'Un día para disfrutar la isla a tu ritmo, con la actividad elegida y suficiente tiempo para descansar.',
          notes: ['Código de vestir: ropa resort cómoda con traje de baño o protección solar si hace falta', 'Un día más ligero con espacio para relajarse entre planes'],
        },
        {
          day: 'Nov 25',
          title: 'Ceremonia y recepción',
          body: 'El día de la boda incluye ceremonia, canapés tipo cóctel, cena de recepción y celebración por la noche.',
          notes: ['Código de vestir: black tie optional', 'Canapés después de la ceremonia, luego cena y fiesta'],
        },
      ],
    },
    food: {
      eyebrow: 'Comida',
      title: 'Beach BBQ y bocaditos de boda',
      bbq: 'Menú Beach BBQ',
      salad: 'Mesa de ensaladas',
      hot: 'Mesa caliente',
      dessert: 'Postre',
      canapes: 'Canapés después de la ceremonia',
      canapesBody: 'Bocaditos servidos entre la ceremonia y la cena de recepción.',
      selectionEyebrow: 'Selección de cena',
      changeTitle: '¿Necesitas hacer un cambio?',
      changeBody: 'Tus selecciones ya se recopilaron antes de entrar al sitio. Esta sección está aquí por si deseas hacer un cambio antes de la fecha límite.',
      deadline: 'Fecha final para cambiar comida:',
      deadlineDate: '1 de octubre de 2026',
      allergyTitle: 'Alergias o notas dietéticas',
      allergyBody: 'Si tienes alergias o restricciones dietéticas, cuéntanos aquí.',
      allergyPlaceholder: 'Ejemplo: alergia a mariscos, sin gluten, sin cerdo...',
    },
    activity: {
      eyebrow: 'Actividad',
      title: 'Elige tu ritmo en la isla',
      body: '',
      changeTitle: '¿Quieres cambiar tu experiencia en la isla?',
      changeBody: 'Tu actividad ya se recopiló antes de entrar al sitio. Esta sección está aquí por si deseas hacer un cambio antes de la fecha límite.',
      deadline: 'Fecha final para cambiar actividad:',
      deadlineDate: '1 de septiembre de 2026',
      atGlance: 'Resumen',
      glanceTitle: 'Tus planes de la semana de boda',
      glanceBody: 'Un vistazo rápido a tus planes de la semana de boda y las selecciones guardadas para tu RSVP. Si haces cambios aquí, recibiremos la versión más reciente.',
      welcomeParty: 'Fiesta de bienvenida',
      welcomeBody: 'Beach BBQ en Wymara Villa con un ambiente relajado de primera noche junto al agua.',
      dinnerLabel: 'Nov 25',
      starter: 'Entrada',
      dessert: 'Postre',
      finalNote: 'Estas son las selecciones actualmente vinculadas a tus planes de boda. Si haces cambios en esta página, recibiremos esa versión para tus detalles de RSVP.',
    },
    accommodation: {
      eyebrow: 'Hospedaje',
      title: 'Quédate cerca de la celebración y haz el viaje más fácil.',
      body: '',
      graceBay: 'Grace Bay',
      recommended: 'Hospedaje recomendado',
      wymaraBody: 'Wymara es la opción más cercana y fácil, con estudios, suites y villas frente a Grace Bay Beach, además de amenidades como desayuno, Wi-Fi y estacionamiento.',
      details: [
        ['Ideal para', 'Invitados que quieren la logística más sencilla durante la boda'],
        ['Ambiente', 'Resort moderno frente al mar con opciones de villa'],
        ['Tip de llegada', 'Llegar el 22 de nov o temprano el 23 de nov'],
      ],
      roomCode: 'Código de descuento',
      codeFallback: 'jontaowedding',
      codeBody: 'Usa este código al reservar directamente con Wymara para obtener 20% de descuento cuando la tarifa de boda esté disponible.',
      spaEyebrow: 'Bienestar para invitados',
      spaTitle: 'Descuento en el spa de Wymara',
      spaBody: 'También coordinamos un descuento de spa para invitados de la boda que quieran reservar tratamientos en Wymara. Compartiremos los detalles aquí cuando las instrucciones estén finalizadas.',
    },
    explore: {
      eyebrow: 'Explorar',
      title: 'Algunos favoritos memorables de Turks and Caicos.',
      body: 'Si tienes tiempo extra alrededor de la boda, estas son algunas recomendaciones fáciles de paisaje, cultura local y comida de la isla.',
      tipsEyebrow: 'Tips de viaje',
      tipsTitle: 'Algunas cosas útiles para saber.',
      factsEyebrow: 'Datos curiosos',
      factsTitle: 'Detalles de la isla que a los invitados suelen encantarles.',
    },
    honeymoon: {
      eyebrow: 'Gracias',
      title: 'Su presencia significa muchísimo para nosotros.',
      body1: 'Apreciamos muchísimo que viajen hasta Turks and Caicos para celebrar con nosotros; no necesitamos nada más que tenerlos ahí.',
      body2: 'Si aun así desean regalarnos algo, recibiremos con humildad una pequeña ayuda para nuestra luna de miel y los recuerdos que comenzaremos justo después de la boda.',
      cardTitle: 'Un pequeño regalo para el viaje que empieza después de la celebración.',
      cardBody: 'Para quienes nos han preguntado, creamos una página de Honeyfund para futuros recuerdos de luna de miel.',
      cta: 'Abrir Honeyfund',
      missing: 'Agrega NEXT_PUBLIC_HONEYMOON_FUND_URL con tu enlace de Honeyfund para conectarlo aquí.',
    },
    toast: {
      guestName: 'Por favor escribe el nombre del invitado antes de continuar.',
      guestEmail: 'Por favor escribe el correo del invitado antes de continuar.',
      sendError: 'No pudimos enviar tus selecciones ahora.',
      dinnerSaved: 'Tu actualización de cena fue guardada y enviada.',
      activitySaved: 'Tu actualización de actividad fue guardada y enviada.',
      selectionsSent: 'Tus selecciones fueron enviadas.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      schedule: '行程',
      food: '餐饮',
      activity: '活动',
      accommodation: '住宿',
      explore: '探索',
      honeymoon: '感谢',
    },
    common: {
      continue: '继续',
      previousSlide: '上一页',
      nextSlide: '下一页',
      language: '语言',
      learnMore: '了解更多',
      visit: '访问',
      viewWymara: '查看 Wymara',
      updating: '正在更新...',
      updateSubmit: '更新并提交',
      sending: '发送中...',
      savedOnDevice: '已保存在此设备：',
      saveBrowser: '保存你的选择，以便它们保留在此浏览器中。',
    },
    intro: {
      locationEyebrow: '婚礼地点',
      turks2026: '特克斯和凯科斯 2026',
      wedding: '婚礼',
      headline: '在加勒比海滩，与海风、烛光和庆祝共度三天。',
      locationTitle: '位于特克斯和凯科斯的 Wymara Villa',
      locationBody: '希望大家放松心情，享受旅程，和我们一起庆祝这段海岛时光。',
      beachBadge: '世界第一海滩',
      beachTitle: '这趟旅行还没开始，就已经像梦一样美好。',
      beachBody: '柔软的沙滩、蓝绿色海水，以及让人难忘的特克斯和凯科斯风景。',
      settingTitle: '我们的海边婚礼场地',
      settingBody: '海景、开阔天空，以及让我们心动的轻松奢华氛围。',
      eveningsBadge: '海岛傍晚',
      sailTitle: '日落帆船的浪漫感',
      sailBody: '金色光线、海风和特别的傍晚，会让整个旅程更加难忘。',
    },
    planner: {
      eyebrow: '进入网站前',
      title: '请选择活动和晚宴菜品',
      body: '为了方便安排，请先在这里完成选择。进入网站后也可以再更新。',
      back: '返回介绍',
      save: '保存并进入网站',
      guestName: '宾客姓名',
      guestEmail: '宾客邮箱',
      namePlaceholder: '请输入全名',
      emailPlaceholder: '请输入邮箱',
      nov24: '11月24日',
      nov25: '11月25日',
      chooseActivity: '选择你的活动',
      chooseActivityBody: '从两个海岛体验中选择一个最适合你的活动。',
      chooseDinner: '选择你的晚宴',
      chooseDinnerBody: '请选择婚宴晚餐的前菜、主菜和甜品。',
      activity: '活动',
      starter: '前菜',
      main: '主菜',
      dessert: '甜品',
    },
    home: {
      badge: 'Wymara Villa 特克斯和凯科斯海滩婚礼',
      dateRange: '2026年11月23日至11月25日',
      title: '你的海岛婚礼安排都在这里。',
      body: '这个网站是你的海岛婚礼指南。先查看婚礼行程，再慢慢了解菜单选择、活动安排和岛上信息。',
      countdown: '倒计时',
      daysToWedding: '天后婚礼',
      location: '地点',
      weather: '11月天气',
      weatherValue: '82F 晴朗',
      weatherBody: '温暖海风、明亮海水和轻柔的热带夜晚',
      crest: '婚礼徽章',
      crestSchedule: [
        ['11月23日', '欢迎派对海滩 BBQ'],
        ['11月24日', '海岛活动和放松时间'],
        ['11月25日', '婚礼仪式晚宴和派对'],
      ],
    },
    schedule: {
      eyebrow: '行程',
      title: '婚礼时间表都在这里。',
      body: '',
      items: [
        {
          day: '11月23日',
          title: '海滩 BBQ',
          body: '抵达后先安顿下来，然后在 Wymara Villa 参加轻松的海滩 BBQ 欢迎派对。',
          notes: ['着装：海滩精致休闲或度假风', '轻松的 BBQ 晚上，可以和大家见面聊天'],
        },
        {
          day: '11月24日',
          title: '海岛放松日',
          body: '这一天可以按自己的节奏享受海岛，参加你选择的活动，也留出时间放松。',
          notes: ['着装：轻松度假风，需要时准备泳衣和防晒用品', '较轻松的一天，活动之间也有时间休息'],
        },
        {
          day: '11月25日',
          title: '仪式和晚宴',
          body: '婚礼当天包括仪式、鸡尾酒小食、婚宴晚餐以及晚上的庆祝。',
          notes: ['着装：Black tie optional', '仪式后有小食，随后是晚宴和派对'],
        },
      ],
    },
    food: {
      eyebrow: '餐饮',
      title: '海滩 BBQ 和婚礼小食',
      bbq: '海滩 BBQ 菜单',
      salad: '沙拉台',
      hot: '热菜台',
      dessert: '甜品',
      canapes: '仪式后小食',
      canapesBody: '仪式和婚宴晚餐之间会提供小食。',
      selectionEyebrow: '婚宴晚餐选择',
      changeTitle: '需要更改吗？',
      changeBody: '你的选择已经在进入网站前收集。这里可以在最终截止日期前进行更改。',
      deadline: '更改餐食的最后日期：',
      deadlineDate: '2026年10月1日',
      allergyTitle: '食物过敏或饮食备注',
      allergyBody: '如果你有任何过敏或饮食限制，请在这里告诉我们。',
      allergyPlaceholder: '例如：海鲜过敏、无麸质、不吃猪肉...',
    },
    activity: {
      eyebrow: '活动',
      title: '选择你的海岛节奏',
      body: '',
      changeTitle: '想更换你的海岛体验吗？',
      changeBody: '你的活动选择已经在进入网站前收集。这里可以在最终截止日期前进行更改。',
      deadline: '更改活动的最后日期：',
      deadlineDate: '2026年9月1日',
      atGlance: '一览',
      glanceTitle: '你的婚礼周安排',
      glanceBody: '快速查看你的婚礼周安排以及目前保存到 RSVP 的选择。如果你在这里更新，我们会收到最新版本。',
      welcomeParty: '欢迎派对',
      welcomeBody: '在 Wymara Villa 水边享受轻松的第一晚海滩 BBQ。',
      dinnerLabel: '11月25日',
      starter: '前菜',
      dessert: '甜品',
      finalNote: '这些是目前与你的婚礼安排关联的选择。如果你在本页更新，我们会收到更新后的 RSVP 信息。',
    },
    accommodation: {
      eyebrow: '住宿',
      title: '住得离庆祝地点近一些，让旅程更轻松。',
      body: '',
      graceBay: 'Grace Bay',
      recommended: '推荐住宿',
      wymaraBody: 'Wymara 是最近也最方便的选择，在 Grace Bay Beach 有海滨 studio、suite 和 villa，并提供早餐、Wi-Fi、停车等度假村设施。',
      details: [
        ['适合', '想让婚礼周交通和安排最简单的宾客'],
        ['氛围', '现代海滨度假村并有 villa 选择'],
        ['抵达建议', '建议 11月22日或 11月23日早些时候抵达'],
      ],
      roomCode: '房间折扣代码',
      codeFallback: 'jontaowedding',
      codeBody: '婚礼房价开放后，直接向 Wymara 预订并使用此代码可享 20% 折扣。',
      spaEyebrow: '宾客放松时光',
      spaTitle: 'Wymara Spa 宾客折扣',
      spaBody: '我们也为想在 Wymara 预订 Spa 服务的婚礼宾客协调了折扣。预订方式确认后会在这里更新。',
    },
    explore: {
      eyebrow: '探索',
      title: '几个值得体验的特克斯和凯科斯推荐。',
      body: '如果婚礼前后有额外时间，这些是一些轻松的风景、当地文化和海岛美食推荐。',
      tipsEyebrow: '旅行提示',
      tipsTitle: '一些实用小贴士。',
      factsEyebrow: '有趣知识',
      factsTitle: '宾客通常会喜欢的海岛小知识。',
    },
    honeymoon: {
      eyebrow: '感谢',
      title: '你们的到来对我们意义非凡。',
      body1: '非常感谢大家远道而来到特克斯和凯科斯与我们庆祝。除了你们的陪伴，我们不需要任何其他礼物。',
      body2: '如果你仍然想送些什么，我们会很感激地接受一点点蜜月支持，用来开启婚礼后的新回忆。',
      cardTitle: '为庆祝之后即将开始的旅行添一份小小心意。',
      cardBody: '如果你想了解，我们创建了 Honeyfund 页面，用于未来的蜜月回忆。',
      cta: '打开 Honeyfund',
      missing: '请添加 NEXT_PUBLIC_HONEYMOON_FUND_URL 并填入 Honeyfund 链接。',
    },
    toast: {
      guestName: '继续前请输入宾客姓名。',
      guestEmail: '继续前请输入宾客邮箱。',
      sendError: '现在无法发送你的选择。',
      dinnerSaved: '你的晚餐更新已保存并发送。',
      activitySaved: '你的活动更新已保存并发送。',
      selectionsSent: '你的选择已发送。',
    },
  },
} as const;

const translatedMenu: Record<Language, typeof welcomeMenu> = {
  en: welcomeMenu,
  es: {
    saladTable: [
      'Panecillos horneados en casa y mantequilla',
      'Tortillas',
      'Ensalada de papa',
      'Ensalada verde con aderezo ranch',
      'Ensalada de col estilo isla',
      'Selección de sushi del chef',
    ],
    hotTable: [
      'Guisantes y arroz',
      'Macarrones con queso',
      'Pollo jerk ahumado',
      'Mahi mahi ennegrecido',
      'Mini filete de res',
      'Brisket de res ahumado por 24 horas con salsa BBQ',
    ],
    dessert: ['Selección de rebanadas de pastel del chef pastelero'],
    canapes: [
      'Rollitos primavera de vegetales',
      'Arancini con jamón serrano y trufa',
      'Rollos de sushi y nigiri',
      'Brochetas de pulpo BBQ',
      'Tostada de rillettes de salmón ahumado',
      'Ceviche de concha con mango',
      'Camarones panko con salsa tártara',
      'Panceta crujiente con remoulade de manzana',
    ],
  },
  zh: {
    saladTable: [
      '自制面包卷和黄油',
      '玉米饼',
      '土豆沙拉',
      '绿色沙拉配 ranch 酱',
      '海岛风卷心菜沙拉',
      '主厨精选寿司',
    ],
    hotTable: [
      '豌豆米饭',
      '芝士通心粉',
      '烟熏 jerk 鸡',
      '黑椒 mahi mahi 鱼',
      '迷你牛眼肉',
      '24小时烟熏牛胸肉配 BBQ 酱',
    ],
    dessert: ['甜点师精选蛋糕片'],
    canapes: [
      '蔬菜春卷',
      '塞拉诺火腿松露 arancini',
      '寿司卷和握寿司',
      'BBQ 章鱼串',
      '烟熏三文鱼 rillettes tostada',
      '芒果海螺 ceviche',
      'Panko 炸虾配 tartare 酱',
      '脆皮五花肉配苹果 remoulade',
    ],
  },
};

const choiceLabels: Record<Language, Record<string, { label: string; description?: string }>> = {
  en: Object.fromEntries([
    ...receptionStarters.map((item) => [item, { label: item }]),
    ...receptionDesserts.map((item) => [item, { label: item }]),
    ...receptionMains.map((item) => [
      item.value,
      { label: item.label, description: item.description },
    ]),
  ]),
  es: {
    'Three Taste of the Sea': { label: 'Tres sabores del mar' },
    'Mushroom risotto with grana Padano & truffle': {
      label: 'Risotto de hongos con grana Padano y trufa',
    },
    'Char-grilled beef tenderloin with Lobster': {
      label: 'Filete de res a la parrilla con langosta',
      description:
        'A la parrilla con mantequilla de ajo, puré de papa con trufa, espárragos y jus de vino tinto.',
    },
    'Blackened local grouper fillet': {
      label: 'Filete de mero local ennegrecido',
      description: 'Con lima caribeña fresca, salsa de mango, arroz local y guisantes.',
    },
    'Vegetarian breaded cauliflower steak': {
      label: 'Filete vegetariano de coliflor empanizada',
      description: 'Con arroz de coco, salsa de frijol negro especiada y salsa de yogurt al curry.',
    },
    'Caribbean key lime cheesecake': { label: 'Cheesecake caribeño de lima' },
    'Deconstructed Banoffee Pie': { label: 'Banoffee pie deconstruido' },
  },
  zh: {
    'Three Taste of the Sea': { label: '海味三重奏' },
    'Mushroom risotto with grana Padano & truffle': {
      label: '蘑菇烩饭配 Grana Padano 奶酪和松露',
    },
    'Char-grilled beef tenderloin with Lobster': {
      label: '炭烤牛柳配龙虾',
      description: '蒜香黄油炭烤，配松露土豆泥、芦笋和红酒汁。',
    },
    'Blackened local grouper fillet': {
      label: '黑椒本地石斑鱼柳',
      description: '配新鲜加勒比青柠、芒果莎莎、本地豌豆米饭。',
    },
    'Vegetarian breaded cauliflower steak': {
      label: '素食面包糠花椰菜排',
      description: '配椰香米饭、香料黑豆莎莎和咖喱酸奶酱。',
    },
    'Caribbean key lime cheesecake': { label: '加勒比青柠芝士蛋糕' },
    'Deconstructed Banoffee Pie': { label: '解构 Banoffee 派' },
  },
};

const activityCopy: Record<
  Language,
  Record<string, { title: string; description: string; websiteDescription: string }>
> = {
  en: Object.fromEntries(
    activityChoices.map((item) => [
      item.id,
      {
        title: item.title,
        description: item.description,
        websiteDescription: item.websiteDescription,
      },
    ]),
  ),
  es: {
    'sunset-cruise': {
      title: 'Crucero al atardecer',
      description:
        'Navega hacia la hora dorada con vistas al mar, brisa de isla y una experiencia relajada sobre el agua.',
      websiteDescription:
        'Un paseo relajante de 1.5 horas al atardecer, comenzando a las 4pm desde la playa de The Ritz-Carlton, con hors d’oeuvres gourmet, barra libre completa y una experiencia dorada sobre el agua.',
    },
    'ocean-horseback': {
      title: 'Cabalgata en el océano',
      description:
        'Cabalga por la orilla y entra al agua turquesa para una de las experiencias más memorables de la isla.',
      websiteDescription:
        'Una cabalgata de aproximadamente 1 hora, con hora de inicio por confirmar, recorriendo la orilla y entrando al océano para una experiencia escénica y libre conectada con la naturaleza.',
    },
  },
  zh: {
    'sunset-cruise': {
      title: '日落游船',
      description: '在金色时刻出海，欣赏海景、海岛微风和轻松的日落体验。',
      websiteDescription:
        '约 1.5 小时的轻松日落帆船体验，下午 4 点从 The Ritz-Carlton 海滩出发，包含 gourmet hors d’oeuvres、开放酒吧和水上金色时刻。',
    },
    'ocean-horseback': {
      title: '海中骑马',
      description: '沿着海岸骑行并走入蓝绿色海水，是非常难忘的海岛体验。',
      websiteDescription:
        '约 1 小时骑马体验，开始时间待定。你将沿海岸骑行并进入海水，感受自由、风景和与自然相连的体验。',
    },
  },
};

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
  allergies: string;
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
  const [allergies, setAllergies] = useState('');
  const [activity, setActivity] = useState(activityChoices[0]?.id ?? '');
  const [savedAt, setSavedAt] = useState('');
  const [isSubmittingPlanner, setIsSubmittingPlanner] = useState(false);
  const [isUpdatingSelections, setIsUpdatingSelections] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const t = copy[language];
  const menu = translatedMenu[language];
  const translatedActivity = activityCopy[language][activity] ?? activityCopy.en[activity];

  function getNavLabel(item: NavItem) {
    return t.nav[item];
  }

  function translateChoice(value: string) {
    return choiceLabels[language][value] ?? choiceLabels.en[value] ?? { label: value };
  }

  const translatedStarters = receptionStarters.map((value) => ({
    value,
    label: translateChoice(value).label,
  }));
  const translatedMains = receptionMains.map((item) => ({
    value: item.value,
    label: translateChoice(item.value).label,
    description: translateChoice(item.value).description,
  }));
  const translatedDesserts = receptionDesserts.map((value) => ({
    value,
    label: translateChoice(value).label,
  }));
  const translatedActivities = activityChoices.map((option) => ({
    ...option,
    ...activityCopy[language][option.id],
  }));

  useEffect(() => {
    const timerId = window.setInterval(() => setCountdown(getCountdownParts()), 60_000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    if (savedLanguage && languages.includes(savedLanguage as Language)) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

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
      if (parsed.allergies) setAllergies(parsed.allergies);
      if (parsed.activity) setActivity(parsed.activity);
      if (parsed.savedAt) setSavedAt(parsed.savedAt);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const selectedActivity =
    activityChoices.find((option) => option.id === activity) ?? activityChoices[0];
  const stayCards = [
    {
      title: 'The Sands at Grace Bay',
      stayStyle:
        language === 'es'
          ? 'Grace Bay fácil'
          : language === 'zh'
            ? '轻松 Grace Bay'
            : 'Easy Grace Bay Stay',
      description:
        language === 'es'
          ? 'Una opción cómoda en Grace Bay con estilo de suite, cocinas o kitchenettes en muchas habitaciones, acceso fácil a la playa y una vibra práctica para invitados que quieren más espacio.'
          : language === 'zh'
            ? 'Grace Bay 一个舒适实用的选择，很多房型带厨房或小厨房，方便去海滩，也适合想要更多空间的宾客。'
            : 'A comfortable Grace Bay option with suite-style rooms, kitchens or kitchenettes in many rooms, easy beach access, and a practical feel for guests who want more space.',
      link: 'https://thesandstc.com/',
      image: '/sands-at-grace-bay.avif',
      imageAlt: 'The Sands at Grace Bay in Turks and Caicos',
    },
    {
      title: 'Hotel Indigo Turks & Caicos by IHG',
      stayStyle:
        language === 'es'
          ? 'Moderno y sencillo'
          : language === 'zh'
            ? '现代简洁'
            : 'Modern And Simple',
      description:
        language === 'es'
          ? 'Una opción moderna de IHG cerca de Grace Bay, ideal para invitados que prefieren habitaciones nuevas, una marca conocida y una estadía sencilla.'
          : language === 'zh'
            ? 'Grace Bay 附近较新的 IHG 现代酒店，适合喜欢新房间、熟悉品牌和简单方便住宿体验的宾客。'
            : 'A modern IHG option near Grace Bay, ideal for guests who prefer newer rooms, a familiar hotel brand, and an easy stay.',
      link: 'https://www.ihg.com/hotelindigo/hotels/us/en/grace-bay/plsgc/hoteldetail',
      image: '/hotel-indigo-grace-bay.avif',
      imageAlt: 'Hotel Indigo Turks and Caicos by IHG',
    },
    {
      title: 'Seven Stars Resort & Spa',
      stayStyle:
        language === 'es'
          ? 'Resort frente al mar'
          : language === 'zh'
            ? '海滨度假村'
            : 'Beachfront Resort',
      description:
        language === 'es'
          ? 'Un resort frente a Grace Bay con alojamientos tipo suite, cocinas en muchas habitaciones y una experiencia de resort completo cerca de todo.'
          : language === 'zh'
            ? '位于 Grace Bay 海滨的度假村，提供 suite 式住宿，许多房间带厨房，适合想要完整度假村体验的宾客。'
            : 'A Grace Bay beachfront resort with suite-style accommodations, kitchens in many rooms, and a full-service resort feel close to everything.',
      link: 'https://www.sevenstarsgracebay.com/accommodations',
      image: '/seven-stars-resort.jpeg',
      imageAlt: 'Seven Stars Resort suite in Turks and Caicos',
    },
    {
      title: 'Rock House',
      stayStyle:
        language === 'es'
          ? 'Boutique tranquilo'
          : language === 'zh'
            ? '安静精品'
            : 'Quiet Boutique Stay',
      description:
        language === 'es'
          ? 'Un hotel boutique en la costa norte de Providenciales, con vistas dramáticas, diseño mediterráneo y un ambiente más tranquilo.'
          : language === 'zh'
            ? '位于 Providenciales 北岸的精品酒店，有海景和地中海风格设计，适合喜欢安静精品度假氛围的宾客。'
            : 'A boutique hotel on the north shore of Providenciales with dramatic views, Mediterranean-inspired design, and a quieter resort atmosphere.',
      link: 'https://www.rockhouse.gracebayresorts.com/',
      image: '/rock-house.jpg',
      imageAlt: 'Rock House Turks and Caicos',
    },
  ];
  const localizedExploreCards =
    language === 'es'
      ? [
          {
            ...exploreCards[0],
            title: 'Chalk Sound National Park',
            description:
              'Una laguna turquesa impresionante con pequeños cayos rocosos, vistas hermosas y opciones para fotos, kayak o paddleboard.',
            note: 'Scenic drive, photos, kayak, paddleboard.',
          },
          {
            ...exploreCards[1],
            title: 'Thursday Fish Fry',
            description:
              'Una tradición local animada con música, Junkanoo, artesanías, comida isleña y bebidas en The Bight.',
            note: 'Jueves a las 6pm en Stubbs Diamond Plaza.',
          },
          {
            ...exploreCards[2],
            title: 'Da Conch Shack',
            description:
              'Una parada frente al mar para probar concha local, mariscos casuales y tragos de ron junto al agua.',
            note: 'Casual, local, beachfront seafood.',
          },
        ]
      : language === 'zh'
        ? [
            {
              ...exploreCards[0],
              title: 'Chalk Sound 国家公园',
              description: '蓝绿色泻湖、岩石小岛和漂亮景观，很适合拍照、kayak 或 paddleboard。',
              note: '自驾、拍照、kayak、paddleboard。',
            },
            {
              ...exploreCards[1],
              title: 'Thursday Fish Fry',
              description: '热闹的本地传统活动，有音乐、Junkanoo、手工艺品、海岛美食和饮品。',
              note: '每周四晚上 6 点 Stubbs Diamond Plaza。',
            },
            {
              ...exploreCards[2],
              title: 'Da Conch Shack',
              description: '经典海边本地餐厅，可以尝试海螺、海鲜和海边朗姆饮品。',
              note: '轻松、本地、海边海鲜。',
            },
          ]
        : [
            {
              ...exploreCards[0],
              description:
                'A striking turquoise lagoon with rocky cays, beautiful views, and easy options for photos, kayaking, or paddleboarding.',
              note: 'Scenic drive, photos, kayak, paddleboard.',
            },
            {
              ...exploreCards[1],
              description:
                'A lively local tradition with music, Junkanoo, handmade goods, island food, and drinks in The Bight.',
              note: 'Thursdays at 6pm at Stubbs Diamond Plaza.',
            },
            {
              ...exploreCards[2],
              description:
                'A beachfront stop for local conch, casual seafood, and rum drinks right by the water.',
              note: 'Casual, local, beachfront seafood.',
            },
          ];
  const localizedTips =
    language === 'es'
      ? [
          ['Moverse por Providenciales', 'La mayoría de los lugares están a poca distancia en auto. Los taxis son comunes, las tarifas se acuerdan con anticipación y el transporte coordinado por el hotel suele ser confiable. Si quieres explorar playas y restaurantes a tu ritmo, rentar un auto también es una buena opción.'],
          ['Comidas y reservas', 'Comer es parte de la experiencia, desde mariscos frescos hasta cocteles frente al mar. Los restaurantes populares pueden llenarse rápido, así que conviene reservar si hay algún lugar especial que quieras probar.'],
          ['Dólares y precios', 'La moneda oficial es el dólar estadounidense, y llevar algo de efectivo puede ser útil para propinas, taxis o paradas casuales. Algunas cosas pueden sentirse más caras porque muchos productos son importados, pero el entorno y la calidad lo hacen especial.'],
          ['La isla va a otro ritmo', 'Todo se mueve con un ritmo más relajado, parte del encanto de la isla, así que ayuda tener flexibilidad.'],
          ['Protector solar e hidratación', 'El sol es fuerte y la playa invita a quedarse, así que protector solar y agua ayudan mucho.'],
          ['Fish Fry empieza a las 6pm', 'Si planeas ir el jueves, llegar con un poco de tiempo ayuda a disfrutar la música, comida local y ambiente.'],
        ]
      : language === 'zh'
        ? [
            ['在 Providenciales 出行', '宾客常去的地方大多是短程车程。出租车很常见，价格通常提前确认；酒店安排的交通也很可靠。如果想按自己的节奏探索海滩和餐厅，租车会更自由。'],
            ['餐厅与预约', '用餐也是海岛旅行体验的一部分，从新鲜海鲜到海边鸡尾酒都很值得享受。热门餐厅可能很快订满，如果有特别想去的地方，建议提前预约。'],
            ['美元与消费', '官方货币是美元，带一些现金会方便小费、出租车或临时小店消费。很多食材和物品需要进口，所以价格可能比美国略高，但风景和体验通常很值得。'],
            ['海岛节奏更放松', '这里的节奏比较慢，也是海岛魅力的一部分，留一点弹性会更舒服。'],
            ['防晒和补水很重要', '阳光很强，海滩又很诱人，记得防晒并多喝水。'],
            ['Fish Fry 晚上 6 点开始', '如果周四想去，提前一点到可以更好享受音乐、本地美食和氛围。'],
          ]
        : [
            ['Getting around Providenciales', 'Most places guests will want to visit are only a short drive away. Taxis are common and fares are usually set in advance, so confirm the total before your ride. Hotel transportation is reliable, and renting a car is a great option if you want flexibility to explore beaches and restaurants at your own pace.'],
            ['Dining and reservations', 'Dining is part of the island experience, from fresh seafood to beachfront cocktails. Popular restaurants can book up quickly, so reservations are helpful if there is somewhere special you want to try.'],
            ['U.S. dollars and island pricing', 'The official currency is the U.S. dollar, and a little cash can be helpful for tips, taxis, or casual stops. Prices can run higher than in the U.S. because many goods are imported, but the setting, views, and quality usually make it feel worth it.'],
            ['Expect a slower island rhythm', 'Things move at a more relaxed pace here, which is part of the charm, so a little extra time and flexibility always helps.'],
            ['Sunscreen and hydration matter', 'The sun is strong, the water is inviting, and beach time is hard to resist, so sunscreen and staying hydrated go a long way.'],
            ['Fish Fry starts at 6pm', 'If you plan to go on Thursday, arriving with a little extra time makes it easier to enjoy the music, local food, and atmosphere.'],
          ];
  const localizedFacts =
    language === 'es'
      ? [
          ['La concha es parte de la vida isleña', 'La concha es un símbolo nacional; la verás en decoración, sonidos de playa y también preparada fresca frente a ti.'],
          ['No es una sola isla', 'Turks and Caicos tiene más de 40 islas y cayos, con solo unas 8 habitadas, así que se siente como un archipiélago escondido.'],
          ['La sal vino antes del turismo', 'Antes de los resorts, las islas eran conocidas por la producción de sal, y todavía se pueden ver antiguos salares.'],
          ['Podrías ver flamencos', 'El ave nacional es el flamenco americano, que suele verse en islas más tranquilas como North o Middle Caicos.'],
          ['Bight Reef es fácil para snorkel', 'Puedes nadar directamente desde la playa y llegar rápido a corales, peces y a veces tortugas.'],
          ['El agua suele estar muy tranquila', 'El arrecife de barrera ayuda a mantener olas suaves, así que muchas playas parecen una piscina turquesa.'],
        ]
      : language === 'zh'
        ? [
            ['海螺是岛上生活的一部分', '海螺是国家象征，你会在装饰、海滩号角和现场处理的新鲜海螺中看到它。'],
            ['它不只是一座岛', '特克斯和凯科斯由 40 多个岛屿和小岛组成，只有大约 8 个有人居住，很像隐藏的群岛。'],
            ['旅游之前这里靠盐业', '在奢华度假村之前，这些岛曾以制盐闻名，现在仍能看到旧盐田。'],
            ['也许能看到火烈鸟', '美国火烈鸟是这里的国鸟，常在 North 或 Middle Caicos 等较安静的岛上出现。'],
            ['Bight Reef 很适合浮潜', '可以直接从海滩游进去，很快看到珊瑚、热带鱼，有时还有海龟。'],
            ['海水通常非常平静', '天然堡礁让海浪较小，很多海滩像蓝绿色泳池一样适合漂浮放松。'],
          ]
        : [
            ['Conch is part of island life', 'Conch is a national symbol here, and you will see it everywhere from shells and beach horns to fresh conch being cracked open and prepared right in front of you.'],
            ['It is not one island', 'Turks and Caicos is made up of more than 40 islands and cays, with only about 8 inhabited, so it really does feel like a hidden archipelago.'],
            ['Salt came before tourism', 'Long before luxury resorts, the islands were known for salt production, and old salt flats are still part of the landscape and history.'],
            ['You might spot flamingos', 'The national bird is the American flamingo, and they are often seen on quieter islands like North or Middle Caicos.'],
            ['Bight Reef is easy to snorkel', 'It is one of the best snorkeling spots in the Caribbean because you can swim straight from the beach and quickly reach coral, fish, and sometimes turtles.'],
            ['The water stays beautifully calm', 'The barrier reef helps keep waves low, so many beaches feel more like a bright turquoise pool than open ocean.'],
          ];
  const primaryTips = localizedTips.slice(0, 3);
  const easyTips = localizedTips.slice(3);
  const islandFacts = localizedFacts.slice(0, 3);
  const waterFacts = localizedFacts.slice(3);

  function moveToPlanner() {
    setIntroOpen(false);
    setPlannerOpen(true);
  }

  function returnToIntro() {
    setPlannerOpen(false);
    setIntroOpen(true);
  }

  function scrollToSection(item: NavItem) {
    const target = document.getElementById(item);

    if (!target) {
      return;
    }

    const headerOffset = 112;
    const top = Math.max(target.getBoundingClientRect().top + window.scrollY - headerOffset, 0);

    window.history.pushState(null, '', `#${item}`);
    window.scrollTo({ top, behavior: 'smooth' });
    setMobileNavOpen(false);
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
        allergies,
        activity,
        savedAt: timestamp,
      } satisfies SavedPlan),
    );

    setSavedAt(timestamp);
    return timestamp;
  }

  async function submitSelections(
    successMessage: string,
    submissionType: 'initial' | 'food_update' | 'activity_update' = 'initial',
  ) {
    if (!guestName.trim()) {
      toast.error(t.toast.guestName);
      return false;
    }

    if (!guestEmail.trim()) {
      toast.error(t.toast.guestEmail);
      return false;
    }

    const response = await fetch('/api/wedding-selections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        starter,
        main,
        dessert,
        allergies: allergies.trim(),
        activity: selectedActivity.title,
        submissionType,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || t.toast.sendError);
    }

    savePlan();
    toast.success(successMessage);
    return true;
  }

  async function updateSelections(updateType: 'food' | 'activity') {
    setIsUpdatingSelections(true);

    try {
      await submitSelections(
        updateType === 'food'
          ? t.toast.dinnerSaved
          : t.toast.activitySaved,
        updateType === 'food' ? 'food_update' : 'activity_update',
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.toast.sendError;
      toast.error(message);
    } finally {
      setIsUpdatingSelections(false);
    }
  }

  async function savePlanAndEnter() {
    setIsSubmittingPlanner(true);

    try {
      const ok = await submitSelections(t.toast.selectionsSent);
      if (!ok) {
        return;
      }
      setPlannerOpen(false);
      window.history.replaceState(null, '', '#home');
      window.requestAnimationFrame(() => {
        document.getElementById('home')?.scrollIntoView({ block: 'start' });
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.toast.sendError;
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
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[rgba(241,246,255,0.58)] p-2.5 backdrop-blur-xl sm:p-3"
          onClick={moveToPlanner}
        >
          <section
            id="intro"
            onClick={(event) => event.stopPropagation()}
            className="wedding-letter-pop relative z-20 mx-auto my-2.5 flex min-h-[min(35rem,calc(100vh-1.25rem))] w-full max-w-[1040px] items-center justify-center overflow-hidden rounded-[0.35rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(237,243,255,0.97))] px-3 py-3 shadow-[0_45px_140px_rgba(82,113,165,0.28)] sm:my-3 sm:px-4 lg:px-6 lg:py-5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-10 top-8 h-48 w-48 rounded-full bg-[#dbe8ff] blur-3xl" />
              <div className="absolute bottom-8 right-8 h-56 w-56 rounded-full bg-[#f8eac7] blur-3xl" />
            </div>

            <div className="relative w-full max-w-[1000px] overflow-hidden rounded-[0.2rem] border border-white/70 bg-[rgba(255,255,255,0.68)] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5 lg:px-6 lg:py-6">
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
                  <LanguageToggle language={language} onChange={setLanguage} />
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((current) => (current - 1 + introSlides.length) % introSlides.length)
                    }
                    className="rounded-full border border-[#d7e2f5] bg-white/85 p-3 text-[#45689d] transition hover:bg-white"
                    aria-label={t.common.previousSlide}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((current) => (current + 1) % introSlides.length)}
                    className="rounded-full border border-[#d7e2f5] bg-white/85 p-3 text-[#45689d] transition hover:bg-white"
                    aria-label={t.common.nextSlide}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={moveToPlanner}
                    className="rounded-full bg-[#45689d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c5a88]"
                  >
                    {t.common.continue}
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <div className="overflow-hidden rounded-[0.15rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-4 sm:p-5 lg:p-8">
                  {activeSlide === 0 && (
                    <div className="relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden rounded-[0.1rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(226,237,255,0.72)_42%,rgba(247,250,255,0.96)_78%)] px-4 py-6 text-center sm:min-h-[30rem] lg:min-h-[33rem]">
                      <Image
                        src="/paper-concrete-texture.png"
                        alt=""
                        fill
                        className="object-cover opacity-35 mix-blend-multiply"
                        sizes="(min-width: 1024px) 900px, 100vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.84),rgba(226,237,255,0.58)_42%,rgba(247,250,255,0.88)_78%)]" />
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-1/2 top-9 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d7e5fb] blur-3xl sm:top-12 sm:h-56 sm:w-56" />
                        <div className="absolute left-1/2 top-12 h-[14rem] w-[14rem] -translate-x-1/2 rounded-full border border-white/55 sm:top-18 sm:h-[21rem] sm:w-[21rem]" />
                        <div className="absolute left-1/2 top-16 h-[11rem] w-[11rem] -translate-x-1/2 rounded-full border border-[#e4d2a2]/45 sm:top-22 sm:h-[16rem] sm:w-[16rem]" />
                      </div>

                      <p className="relative text-sm uppercase tracking-[0.42em] text-[#5f86c7]">
                        {t.intro.turks2026}
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
                          className={cn(
                            `${calligraphyFont.className} mt-3 leading-[0.9] text-[#b38a35] drop-shadow-[0_12px_28px_rgba(179,138,53,0.18)] sm:mt-4`,
                            language === 'zh'
                              ? 'mt-5 text-[2rem] sm:mt-7 sm:text-[3rem] lg:text-[3.8rem]'
                              : 'text-[2.45rem] sm:text-[4.2rem] lg:text-[5.4rem]',
                          )}
                        >
                          {t.intro.wedding}
                        </h1>
                      </div>

                      <div className="relative mt-3 flex items-center gap-3 text-[#d3a74e] sm:mt-4">
                        <span className="h-px w-10 bg-current/70 sm:w-16" />
                        <span className="text-xs uppercase tracking-[0.4em] text-[#9a7a31]">Wymara Villa</span>
                        <span className="h-px w-10 bg-current/70 sm:w-16" />
                      </div>

                      <p className="relative mt-4 max-w-3xl font-display text-[0.98rem] leading-[1.12] tracking-[-0.01em] text-[#5677a8] sm:mt-6 sm:text-[1.45rem] lg:text-[1.8rem]">
                        {t.intro.headline}
                      </p>
                    </div>
                  )}

                  {activeSlide === 1 && (
                    <div className="flex min-h-[26rem] flex-col justify-center sm:min-h-[30rem] lg:min-h-[33rem]">
                      <div className="text-center">
                        <p className="text-sm uppercase tracking-[0.38em] text-[#5f86c7]">{t.intro.locationEyebrow}</p>
                        <h2 className="mx-auto mt-3 max-w-4xl text-center font-display text-[2rem] leading-[0.95] tracking-[-0.03em] text-[#34557f] sm:text-[2.8rem] lg:text-[3.35rem]">
                          {t.intro.locationTitle}
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                          {t.intro.locationBody}
                        </p>
                      </div>

                      <div className="mt-7 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                        <article className="group relative overflow-hidden rounded-[2.3rem] border border-[#d7e2f5] shadow-[0_24px_70px_rgba(95,134,199,0.18)]">
                          <div className="absolute inset-0">
                            <Image
                              src="/grace-bay-water.jpg"
                              alt="Grace Bay beach in Turks and Caicos"
                              fill
                              className="object-cover transition duration-700 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="relative flex min-h-[22rem] flex-col justify-end p-5">
                            <div className="absolute inset-x-0 bottom-0 h-[15rem] bg-[linear-gradient(0deg,rgba(8,23,43,0)_0%,rgba(8,23,43,0.24)_18%,rgba(8,23,43,0.46)_50%,rgba(8,23,43,0.25)_78%,rgba(8,23,43,0)_100%)]" />
                            <div className="relative max-w-md">
                              <div className="inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                                {t.intro.beachBadge}
                              </div>
                              {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Grace Bay</p> */}
                              <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                {t.intro.beachTitle}
                              </h3>
                              <p className="mt-3 max-w-md text-sm leading-6 text-white/82 sm:text-[0.95rem]">
                                {t.intro.beachBody}
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
                            <div className="relative flex min-h-[15.5rem] flex-col justify-between p-5">
                              <div className="absolute inset-x-0 bottom-0 h-[13rem] bg-[linear-gradient(0deg,rgba(8,23,43,0.62)_0%,rgba(8,23,43,0.48)_45%,rgba(8,23,43,0.18)_78%,rgba(8,23,43,0)_100%)]" />
                              <div className="relative inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                                Wymara Villa
                              </div>
                              <div className="relative max-w-md">
                                {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Wymara Villa</p> */}
                                <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                  {t.intro.settingTitle}
                                </h3>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/82 sm:text-[0.95rem]">
                                  {t.intro.settingBody}
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
                            <div className="relative flex min-h-[13rem] flex-col justify-between p-5">
                              <div className="absolute inset-x-0 bottom-0 h-[11.5rem] bg-[linear-gradient(0deg,rgba(8,23,43,0.64)_0%,rgba(8,23,43,0.48)_45%,rgba(8,23,43,0.2)_78%,rgba(8,23,43,0)_100%)]" />
                              <div className="relative inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.65rem] uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                                {t.intro.eveningsBadge}
                              </div>
                              <div className="relative max-w-md">
                                {/* <p className="text-xs uppercase tracking-[0.24em] text-white/68">Sunset Sail</p> */}
                                <h3 className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.8rem]">
                                  {t.intro.sailTitle}
                                </h3>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/82 sm:text-[0.95rem]">
                                  {t.intro.sailBody}
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
            className="relative mx-auto my-3 w-full max-w-[1040px] overflow-hidden rounded-[2.35rem] border border-[#d7e2f5] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(242,247,255,0.95))] px-4 py-4 shadow-[0_45px_140px_rgba(82,113,165,0.28)] sm:px-5 sm:py-5 lg:px-7 lg:py-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.38em] text-[#5f86c7]">{t.planner.eyebrow}</p>
                <h2 className="mt-2 font-display text-[2rem] leading-none text-[#34557f] sm:text-[2.7rem]">
                  {t.planner.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  {t.planner.body}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LanguageToggle language={language} onChange={setLanguage} />
                <button
                  type="button"
                  onClick={returnToIntro}
                  className="rounded-full border border-[#cfdbf2] bg-white/85 px-4 py-2.5 text-sm font-medium text-[#45689d] transition hover:bg-white"
                >
                  {t.planner.back}
                </button>
                <button
                  type="button"
                  onClick={savePlanAndEnter}
                  disabled={isSubmittingPlanner}
                  className="rounded-full bg-[#45689d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c5a88]"
                >
                  {isSubmittingPlanner ? t.common.sending : t.planner.save}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-[1.8rem] border border-[#d7e2f5] bg-white/78 p-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="planner-guest-name"
                  className="text-xs uppercase tracking-[0.28em] text-slate-500"
                >
                  {t.planner.guestName}
                </label>
                <Input
                  id="planner-guest-name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder={t.planner.namePlaceholder}
                  className="mt-2 h-11 rounded-xl border-[#cfdbf2] bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="planner-guest-email"
                  className="text-xs uppercase tracking-[0.28em] text-slate-500"
                >
                  {t.planner.guestEmail}
                </label>
                <Input
                  id="planner-guest-email"
                  type="email"
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                  placeholder={t.planner.emailPlaceholder}
                  className="mt-2 h-11 rounded-xl border-[#cfdbf2] bg-white"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="group relative min-h-[40rem] overflow-hidden rounded-[2rem] border border-[#d7e2f5] shadow-[0_20px_60px_rgba(95,134,199,0.14)] lg:min-h-full">
                <div className="absolute inset-0">
                  <Image
                    src="/selection-horseback-water.webp"
                    alt="Ocean horseback riding in Turks and Caicos"
                    fill
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.3)_0%,rgba(17,31,54,0.08)_32%,rgba(17,31,54,0.1)_54%,rgba(17,31,54,0.54)_100%)]" />
                <div className="relative flex min-h-[16rem] items-start p-6">
                  <div className="max-w-sm rounded-[1.35rem] border border-white/12 bg-[rgba(11,24,43,0.16)] px-4 py-4 backdrop-blur-[2px]">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/76">{t.planner.nov24}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{t.planner.chooseActivity}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/84">
                      {t.planner.chooseActivityBody}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-x-3 bottom-8 rounded-[1.7rem] border border-white/25 bg-white/55 p-5 shadow-[0_-22px_60px_rgba(8,23,43,0.2)] backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#5f6f8d]">{t.planner.activity}</p>
                  <div className="mt-4 grid gap-3">
                    {translatedActivities.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setActivity(choice.id)}
                        aria-pressed={activity === choice.id}
                        className={cn(
                          'flex items-start justify-between gap-4 rounded-[1.4rem] border px-5 py-5 text-left transition',
                          activity === choice.id
                            ? 'border-[#7f9fd7] bg-[#eef4ff] shadow-[0_12px_30px_rgba(95,134,199,0.14)]'
                            : 'border-[#d9e4f6] bg-white hover:bg-[#f8fbff]',
                        )}
                      >
                        <span>
                          <span className="block text-[1rem] font-semibold leading-6 text-[#34557f]">
                            {choice.title}
                          </span>
                          <span className="mt-1 block text-sm font-normal leading-6 text-slate-600">
                            {choice.description}
                          </span>
                        </span>
                        {activity === choice.id ? (
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#5f86c7]" />
                        ) : (
                          <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[2rem] border border-[#d7e2f5] shadow-[0_20px_60px_rgba(214,168,73,0.14)]">
                <div className="absolute inset-0">
                  <Image
                    src="/selection-lobster-garlic-butter.png"
                    alt="Cooked lobster tails for the reception dinner"
                    fill
                    className="object-cover object-[52%_44%] transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative min-h-[16rem] p-6">
                  <div className="max-w-sm rounded-[1.35rem] border border-white/12 bg-[rgba(35,22,8,0.16)] px-4 py-4 backdrop-blur-[2px]">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/78">{t.planner.nov25}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{t.planner.chooseDinner}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/86">
                      {t.planner.chooseDinnerBody}
                    </p>
                  </div>
                </div>
                <div className="relative mx-3 mb-3 rounded-[1.7rem] border border-white/25 bg-white/55 p-4 shadow-[0_-22px_60px_rgba(8,23,43,0.12)] backdrop-blur-xl">
                  <div className="grid gap-5">
                    <SelectionGroup
                      title={t.planner.starter}
                      items={translatedStarters}
                      value={starter}
                      onChange={setStarter}
                    />
                    <SelectionGroup title={t.planner.main} items={translatedMains} value={main} onChange={setMain} />
                    <SelectionGroup
                      title={t.planner.dessert}
                      items={translatedDesserts}
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
          'relative mx-auto max-w-7xl px-5 pb-24 pt-28 transition duration-300 sm:px-8 lg:px-12',
          (introOpen || plannerOpen) && 'pointer-events-none select-none blur-[6px] saturate-[0.9]',
        )}
      >
        <header className="fixed left-1/2 top-4 z-40 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-full border border-[#d5e2f5] bg-white/75 px-5 py-3 shadow-[0_18px_50px_rgba(89,120,170,0.12)] backdrop-blur-xl sm:w-[calc(100%-4rem)]">
          <div className="flex items-center justify-between gap-4">
            <a
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('home');
              }}
              className="flex items-center gap-3"
            >
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
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item);
                  }}
                  className="transition hover:text-[#45689d]"
                >
                  {getNavLabel(item)}
                </a>
              ))}
            </nav>

            <div className="hidden lg:block">
              <LanguageToggle language={language} onChange={setLanguage} />
            </div>

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
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item);
                  }}
                  className="rounded-2xl bg-[#f5f8ff] px-4 py-3"
                >
                  {getNavLabel(item)}
                </a>
              ))}
              <LanguageToggle language={language} onChange={setLanguage} />
            </div>
          )}
        </header>

        <section
          id="home"
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]"
        >
          <div className="grid min-h-[42rem] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] px-7 py-20 text-center lg:px-12">
              <div className="max-w-3xl">
                <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                  Jon & Tao
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.48em] text-[#5f86c7]">
                  {t.home.dateRange}
                </p>
                <h1 className="mx-auto mt-6 max-w-4xl font-display text-[3.2rem] leading-[0.95] tracking-[-0.02em] text-[#34557f] sm:text-[4.6rem] lg:text-[5.2rem]">
                  {t.home.title}
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-700">
                  {t.home.body}
                </p>

                <div className="mt-10 grid gap-5 text-left sm:grid-cols-3">
                  <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d6e1f3] bg-white/72 p-5 shadow-[0_18px_46px_rgba(69,104,157,0.10)] backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t.home.countdown}</p>
                    <p className="mt-3 font-display text-5xl text-[#34557f]">{countdown.days}</p>
                    <p className="text-sm text-slate-600">{t.home.daysToWedding}</p>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d6e1f3] bg-white/72 p-5 shadow-[0_18px_46px_rgba(69,104,157,0.10)] backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t.home.location}</p>
                    <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[#34557f]">
                      <MapPin className="h-5 w-5 text-[#5f86c7]" />
                      Wymara Villa
                    </p>
                    <p className="text-sm text-slate-600">Turks and Caicos</p>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d6e1f3] bg-white/72 p-5 shadow-[0_18px_46px_rgba(69,104,157,0.10)] backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t.home.weather}</p>
                    <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-[#34557f]">
                      <SunMedium className="h-5 w-5 text-[#5f86c7]" />
                      {t.home.weatherValue}
                    </p>
                    <p className="text-sm text-slate-600">{t.home.weatherBody}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-[32rem] items-center justify-center self-stretch bg-[linear-gradient(180deg,#45689d,#7e9fdb)] px-7 py-20 text-white lg:min-h-full lg:px-12">
              <div className="w-full max-w-md">
                <div className="mx-auto relative h-32 w-32 overflow-hidden rounded-full border border-white/35 bg-white/85">
                  <Image src="/wedding-logo.png" alt="Jon and Tao crest" fill className="object-cover" />
                </div>
                <p className="mt-8 text-center text-xs uppercase tracking-[0.38em] text-white/70">{t.home.crest}</p>
                <p className="mt-3 text-center font-display text-5xl">Jon & Tao</p>

                <div className="mt-10 space-y-5">
                {t.home.crestSchedule.map(([date, title]) => (
                  <div key={date} className="border-l border-white/24 bg-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">{date}</p>
                    <p className="mt-2 text-lg font-semibold">{title}</p>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="schedule" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]">
          <div className="flex min-h-[34rem] items-start justify-center bg-[linear-gradient(180deg,#fbfdff,#f4f8ff)] px-6 pb-16 pt-24 text-center">
            <div className="max-w-xl">
              <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                The Wedding
              </p>
              <p className="mt-5 text-sm uppercase tracking-[0.52em] text-[#5f86c7]">{t.schedule.eyebrow}</p>
              <h2 className="mt-6 font-display text-5xl leading-[0.95] text-[#34557f] sm:text-6xl">
                {t.schedule.title}
              </h2>
              {t.schedule.body ? (
                <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-slate-600">
                  {t.schedule.body}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <article className="flex min-h-[28rem] items-center justify-center bg-[#eef4ff] px-8 py-16 text-center">
              <div className="max-w-sm">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  Welcome Party
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">{t.schedule.items[0].day}</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.schedule.items[0].title}</h3>
                <p className="mt-5 text-sm leading-7 text-slate-700">{t.schedule.items[0].body}</p>
                <div className="mt-7 space-y-3">
                  {t.schedule.items[0].notes.map((note) => (
                    <p key={note} className="text-xs uppercase leading-6 tracking-[0.22em] text-slate-500">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </article>

            <div className="relative min-h-[28rem] overflow-hidden">
              <Image
                src="/schedule-beach-bbq.webp"
                alt="Beach BBQ setup by the ocean"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,54,92,0.02),rgba(31,54,92,0.20))]" />
            </div>
          </div>

          <article className="flex min-h-[32rem] items-end justify-center bg-[#45689d] px-8 py-20 text-center text-white">
            <div className="max-w-md">
              <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-white/80')}>
                Island Day
              </p>
              <p className="mt-6 text-sm uppercase tracking-[0.42em] text-white/68">{t.schedule.items[1].day}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight text-white">{t.schedule.items[1].title}</h3>
              <p className="mt-5 text-sm leading-7 text-white/78">{t.schedule.items[1].body}</p>
              <div className="mt-7 space-y-3">
                {t.schedule.items[1].notes.map((note) => (
                  <p key={note} className="text-xs uppercase leading-6 tracking-[0.22em] text-white/62">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </article>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[28rem] overflow-hidden bg-[#edf4ff]">
              <Image
                src="/schedule-ceremony-beach.webp"
                alt="Sunset ceremony setup by the water"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,54,92,0.04),rgba(31,54,92,0.18))]" />
            </div>

            <article className="flex min-h-[28rem] items-center justify-center bg-white px-8 py-16 text-center">
              <div className="max-w-sm">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  The Celebration
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">{t.schedule.items[2].day}</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.schedule.items[2].title}</h3>
                <p className="mt-5 text-sm leading-7 text-slate-700">{t.schedule.items[2].body}</p>
                <div className="mt-7 space-y-3">
                  {t.schedule.items[2].notes.map((note) => (
                    <p key={note} className="text-xs uppercase leading-6 tracking-[0.22em] text-slate-500">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="food" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]">
          <div className="flex min-h-[30rem] items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] px-6 py-24 text-center">
            <div className="max-w-3xl">
              <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                The Menu
              </p>
              <p className="mt-5 text-sm uppercase tracking-[0.52em] text-[#5f86c7]">{t.food.eyebrow}</p>
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-5xl leading-[0.92] text-[#34557f] sm:text-7xl">{t.food.title}</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="grid bg-white">
            <article className="flex min-h-[31rem] items-center justify-center bg-white px-7 py-16 text-center lg:px-12">
              <div className="w-full max-w-2xl">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  First Evening
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">Nov 23</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.food.bbq}</h3>
                <div className="mt-8 grid gap-8 text-left md:grid-cols-2">
                  <MenuList title={t.food.salad} items={menu.saladTable} />
                  <MenuList title={t.food.hot} items={menu.hotTable} />
                </div>
                <div className="mt-8 max-w-sm text-left">
                  <MenuList title={t.food.dessert} items={menu.dessert} />
                </div>
              </div>
            </article>

            <article className="flex min-h-[31rem] items-center justify-center bg-[#eef4ff] px-7 py-16 text-center lg:px-12">
              <div className="w-full max-w-2xl">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  After Ceremony
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">Nov 25</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.food.canapes}</h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
                  {t.food.canapesBody}
                </p>
                <ul className="mt-8 grid gap-2 text-left text-sm leading-6 text-slate-700 md:grid-cols-2">
                  {menu.canapes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <div className="bg-[linear-gradient(180deg,#fffdfa,#f4f8ff)] px-7 py-16 lg:px-12">
            <h2 className="text-4xl font-semibold leading-tight text-[#34557f]">{t.food.changeTitle}</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
              {t.food.changeBody}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {t.food.deadline} <span className="font-semibold text-[#34557f]">{t.food.deadlineDate}</span>
            </p>

            <div className="mt-8 space-y-8">
              <SelectionGroup
                title={t.planner.starter}
                items={translatedStarters}
                value={starter}
                onChange={setStarter}
              />
              <SelectionGroup title={t.planner.main} items={translatedMains} value={main} onChange={setMain} />
              <SelectionGroup
                title={t.planner.dessert}
                items={translatedDesserts}
                value={dessert}
                onChange={setDessert}
              />
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{t.food.allergyTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t.food.allergyBody}</p>
                <Textarea
                  value={allergies}
                  onChange={(event) => setAllergies(event.target.value)}
                  placeholder={t.food.allergyPlaceholder}
                  className="mt-3 min-h-[96px] resize-none rounded-[1.2rem] border-[#d9e4f6] bg-white/80 text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {savedAt ? `${t.common.savedOnDevice} ${savedAt}` : t.common.saveBrowser}
              </div>
              <button
                type="button"
                onClick={() => void updateSelections('food')}
                disabled={isUpdatingSelections}
                className="rounded-full bg-[#5f86c7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5076b8]"
              >
                {isUpdatingSelections ? t.common.updating : t.common.updateSubmit}
              </button>
            </div>
          </div>
          </div>
        </section>

        <section id="activity" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]">
          <div className="flex min-h-[24rem] items-center justify-center bg-[linear-gradient(180deg,#fbfdff,#eef4ff)] px-6 py-20 text-center">
            <div className="max-w-xl">
              <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                Island Day
              </p>
              <p className="mt-5 text-sm uppercase tracking-[0.52em] text-[#5f86c7]">{t.activity.eyebrow}</p>
              <h2 className="mt-6 font-display text-5xl leading-[0.95] text-[#34557f] sm:text-6xl">{t.activity.title}</h2>
              {t.activity.body ? (
                <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-slate-600">
                  {t.activity.body}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-white px-7 py-16 lg:px-12">
            <h2 className="text-4xl font-semibold leading-tight text-[#34557f]">{t.activity.changeTitle}</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
              {t.activity.changeBody}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {t.activity.deadline} <span className="font-semibold text-[#34557f]">{t.activity.deadlineDate}</span>
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {translatedActivities.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActivity(option.id)}
                  aria-pressed={activity === option.id}
                  className={cn(
                    'w-full overflow-hidden border text-left transition',
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
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {savedAt ? `${t.common.savedOnDevice} ${savedAt}` : t.common.saveBrowser}
              </div>
              <button
                type="button"
                onClick={() => void updateSelections('activity')}
                disabled={isUpdatingSelections}
                className="rounded-full bg-[#5f86c7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5076b8]"
              >
                {isUpdatingSelections ? t.common.updating : t.common.updateSubmit}
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col bg-[linear-gradient(180deg,#45689d,#7e9fdb)] px-7 py-16 text-white lg:px-12">
            <h2 className="font-display text-[2.9rem] leading-[0.98]">{t.activity.glanceTitle}</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/82">
              {t.activity.glanceBody}
            </p>

            <div className="mt-8 grid gap-7">
              <div className="border-l border-white/24 bg-white/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Nov 23</p>
                    <p className="mt-1 text-lg font-semibold">{t.activity.welcomeParty}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {t.activity.welcomeBody}
                </p>
              </div>

              <div className="border-l border-white/24 bg-white/10 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Nov 24</p>
                    <p className="mt-1 text-lg font-semibold">{translatedActivity.title}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {translatedActivity.websiteDescription}
                </p>
              </div>

              <div className="border-l border-white/24 bg-white/10 px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">{t.activity.dinnerLabel}</p>
                <p className="mt-1 text-lg font-semibold">{translateChoice(main).label}</p>
                <div className="mt-3 grid gap-2 text-sm text-white/80">
                  <div>{t.activity.starter}: {translateChoice(starter).label}</div>
                  <div>{t.activity.dessert}: {translateChoice(dessert).label}</div>
                </div>
              </div>
            </div>

          </div>
          </div>
        </section>

        <section id="accommodation" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]">
          <div className="flex min-h-[24rem] items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] px-6 py-20 text-center">
            <div className="max-w-2xl">
              <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                Stay Nearby
              </p>
              <p className="mt-5 text-sm uppercase tracking-[0.52em] text-[#5f86c7]">{t.accommodation.eyebrow}</p>
              <h2 className="mt-6 font-display text-5xl leading-[0.95] text-[#34557f] sm:text-6xl">{t.accommodation.title}</h2>
              {t.accommodation.body ? (
                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600">
                  {t.accommodation.body}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid items-stretch lg:grid-cols-[1.04fr_0.96fr]">
            <article className="grid h-full overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f5f8ff)]">
              <div className="relative h-72 overflow-hidden">
                <Image
                  src="/wymara-villa-ocean.jpeg"
                  alt="Wymara Resort and Villas oceanfront view"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.02)_0%,rgba(17,31,54,0.12)_48%,rgba(17,31,54,0.36)_100%)]" />
              </div>

              <div className="flex h-full flex-col px-7 py-10 lg:px-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-[#5f86c7]">{t.accommodation.recommended}</p>
                    <h3 className="mt-3 font-display text-4xl text-[#34557f]">Wymara Resort + Villas</h3>
                  </div>
                  <a
                    href="https://www.wymara.com/accommodation"
                    target="_blank"
                    rel="noreferrer"
                    className="border border-[#d6e1f3] bg-white px-4 py-2 text-sm font-medium text-[#45689d] transition hover:bg-[#f5f8ff]"
                  >
                    {t.common.viewWymara}
                  </a>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700">
                  {t.accommodation.wymaraBody}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {t.accommodation.details.map(([label, value]) => (
                    <div key={label} className="border-l border-[#dce6f6] bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-l border-[#d7e2f5] bg-[#edf4ff] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5f86c7]">{t.accommodation.roomCode}</p>
                  <p className="mt-2 text-lg font-semibold text-[#34557f]">
                    {weddingRoomCode || t.accommodation.codeFallback}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {t.accommodation.codeBody}
                  </p>
                </div>
              </div>

            </article>

            <div className="grid h-full bg-[#eef4ff] md:grid-cols-2">
              {stayCards.map((stay) => (
                <article
                  key={stay.title}
                  className="grid overflow-hidden border border-[#d9e4f6] bg-white"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={stay.image}
                      alt={stay.imageAlt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,54,0.04)_0%,rgba(17,31,54,0.14)_45%,rgba(17,31,54,0.42)_100%)]" />
                    <div className="absolute left-4 top-4 border border-white/25 bg-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {stay.stayStyle}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div className="flex items-center gap-3 text-white">
                        <BedDouble className="h-5 w-5 text-white/90" />
                        <h3 className="text-xl font-semibold">{stay.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <a
                        href={stay.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[#45689d] hover:text-[#34557f]"
                      >
                        {t.common.visit}
                      </a>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{stay.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
            <article className="flex min-h-[28rem] items-center justify-center bg-[#fffaf0] px-8 py-16 text-center">
              <div className="max-w-sm">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  A Moment to Unwind
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#9a7a31]">{t.accommodation.spaEyebrow}</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.accommodation.spaTitle}</h3>
                <p className="mt-5 text-sm leading-7 text-slate-700">
                  {t.accommodation.spaBody}
                </p>
              </div>
            </article>

            <div className="relative min-h-[28rem] overflow-hidden">
              <Image
                src="/wymara-spa.webp"
                alt="Wymara spa wellness deck over turquoise water"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,54,92,0.02),rgba(31,54,92,0.18))]" />
            </div>
          </div>
        </section>

        <section id="explore" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#f7faff]">
          <div className="flex min-h-[24rem] items-center justify-center bg-[linear-gradient(180deg,#fbfdff,#eef4ff)] px-6 py-20 text-center">
            <div className="max-w-2xl">
              <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-[#b38a35]')}>
                Island Notes
              </p>
              <p className="mt-5 text-sm uppercase tracking-[0.52em] text-[#5f86c7]">{t.explore.eyebrow}</p>
              <h2 className="mt-6 font-display text-5xl leading-[0.95] text-[#34557f] sm:text-6xl">{t.explore.title}</h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600">
              {t.explore.body}
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3">
            {localizedExploreCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden border border-[#d9e4f6] bg-white"
              >
                <div className="relative h-72 overflow-hidden">
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
                  <p className="min-h-[5.25rem] text-sm leading-7 text-slate-700">{card.description}</p>
                  <div className="mt-4 min-h-[4.5rem] border-l border-[#dce6f6] bg-[#f5f8ff] px-4 py-3 text-sm leading-6 text-slate-700">
                    {card.note}
                  </div>
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm font-medium text-[#45689d] hover:text-[#34557f]"
                  >
                    {t.common.learnMore}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <article className="flex min-h-[30rem] items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f6f9ff)] px-8 py-16 text-center">
              <div className="max-w-md">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  Before You Go
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">{t.explore.tipsEyebrow}</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.explore.tipsTitle}</h3>
              </div>
            </article>

            <article className="bg-[#45689d] px-7 py-12 text-white lg:px-12">
              <div className="grid gap-7">
                {primaryTips.map(([title, body]) => (
                  <div key={title} className="border-l border-white/24 pl-5">
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/78">{body}</p>
                  </div>
                ))}
                <div className="grid gap-5 sm:grid-cols-3">
                  {easyTips.map(([title, body]) => (
                    <div key={title} className="border-l border-white/24 bg-white/10 p-4">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-2 text-xs leading-6 text-white/70">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <article className="bg-white px-7 py-12 lg:px-12">
              <div className="grid gap-7">
                {islandFacts.map(([title, body]) => (
                  <div key={title} className="border-l border-[#dce6f6] pl-5">
                    <p className="text-lg font-semibold text-[#34557f]">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{body}</p>
                  </div>
                ))}
                <div className="grid gap-5 sm:grid-cols-3">
                  {waterFacts.map(([title, body]) => (
                    <div key={title} className="border-l border-[#dce6f6] bg-[#f8fbff] p-4">
                      <p className="text-sm font-semibold text-[#34557f]">{title}</p>
                      <p className="mt-2 text-xs leading-6 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="flex min-h-[30rem] items-center justify-center bg-[#eef4ff] px-8 py-16 text-center">
              <div className="max-w-md">
                <p className={cn(calligraphyFont.className, 'text-3xl leading-none text-[#b38a35]')}>
                  Tiny Island Lore
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-[#5f86c7]">{t.explore.factsEyebrow}</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-[#34557f]">{t.explore.factsTitle}</h3>
              </div>
            </article>
          </div>
        </section>

        <section
          id="honeymoon"
          className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#45689d,#7f9fd7)] text-white"
        >
          <div className="grid min-h-[34rem] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex items-center justify-center px-7 py-20 text-center lg:px-12">
              <div className="max-w-2xl">
                <p className={cn(calligraphyFont.className, 'text-4xl leading-none text-white/78')}>
                  With Love
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.42em] text-white/70">{t.honeymoon.eyebrow}</p>
                <h2 className="mt-6 font-display text-5xl leading-[0.96] sm:text-6xl">{t.honeymoon.title}</h2>
                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/82">
                  {t.honeymoon.body1}
                </p>
                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/82">
                  {t.honeymoon.body2}
                </p>
                {honeymoonFundUrl ? (
                  <a
                    href={honeymoonFundUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#45689d] shadow-[0_12px_30px_rgba(17,34,68,0.18)] transition hover:bg-[#f5f8ff] hover:shadow-[0_16px_34px_rgba(17,34,68,0.22)]"
                  >
                    {t.honeymoon.cta}
                  </a>
                ) : (
                  <div className="mx-auto mt-8 max-w-md border border-white/20 bg-white/8 px-4 py-3 text-sm text-white/84">
                    {t.honeymoon.missing}
                  </div>
                )}
              </div>
            </div>

            <div className="relative min-h-[34rem] overflow-hidden">
              <Image
                src="/thank-you-couple.JPG"
                alt="Jon and Tao together on a boat"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 46vw, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(69,104,157,0.18),rgba(18,28,45,0.02)_42%,rgba(18,28,45,0.12))]" />
            </div>
          </div>
        </section>
      </div>

      {!introOpen && !plannerOpen ? <WeddingChat language={language} defaultOpen /> : null}
    </div>
  );
}

type SelectionGroupProps = {
  title: string;
  items: Array<string | { value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
};

type MenuListProps = {
  title: string;
  items: string[];
};

type LanguageToggleProps = {
  language: Language;
  onChange: (language: Language) => void;
};

function MenuList({ title, items }: MenuListProps) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[#d3def2] bg-white/85 p-1 shadow-[0_10px_28px_rgba(95,134,199,0.10)] backdrop-blur-md"
      aria-label="Language selector"
    >
      {languages.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-semibold transition',
            language === option
              ? 'bg-[#45689d] text-white shadow-[0_8px_18px_rgba(69,104,157,0.22)]'
              : 'text-[#45689d] hover:bg-[#eef4ff]',
          )}
        >
          {languageLabels[option]}
        </button>
      ))}
    </div>
  );
}

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

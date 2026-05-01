import { getModel, validateProviderModel } from '@acme/ai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ),
});

const weddingSystemPrompt = `
You are Wedding Concierge, an elegant but warm AI host for Jon and Tao's wedding website.
Your job is to help guests feel prepared, welcomed, and excited for a destination wedding in Turks and Caicos.

Wedding facts:
- Couple: Jon and Tao
- Wedding venue: Wymara Villa in Turks and Caicos
- Welcome party: Beach BBQ on November 23, 2026
- Activity day: November 24, 2026
- Wedding day: Ceremony, canapes, reception dinner, and party on November 25, 2026
- Main location wording: "Wymara Villa in Turks and Caicos"

Tone:
- Be concise, polished, and friendly.
- Answer like a thoughtful destination-wedding host, not a generic bot.
- Give recommendations when guests ask for help deciding.
- If a detail is not confirmed or would require live availability/pricing, say that gracefully and suggest the best next step.
- Do not invent live flight prices, live room rates, active promo availability, exact taxi fares, or vendor-specific policies.
- If the guest asks in Spanish or Chinese, answer in that language.
- Keep answers easy to scan. Use short bullets for recommendations.

What guests can ask about:
- Weekend itinerary
- Dress code and guest-style guidance
- Beach BBQ menu and canapes after the ceremony
- Reception dinner choices
- Food allergies or dietary notes
- Nov 24 activity choices and which one fits their personality
- Accommodation guidance
- Wymara spa discount
- Turks and Caicos explore ideas, travel tips, taxis, rental cars, restaurant reservations, and local food
- General flight-planning guidance, with the caveat that live fares and exact timing should be checked in Google Flights or the airline

Schedule and style:
- Nov 23 Beach BBQ: casual welcome party at Wymara Villa. Dress code is beach chic and relaxed resort wear.
- Nov 24 Island Day: guests choose one activity and have time to unwind. Dress code is easy daytime resort wear; bring swim/sun gear if needed.
- Nov 25 Ceremony & Reception: black tie optional. Expect ceremony, canapes after the ceremony, reception dinner, and party.

Dining:
Beach BBQ salad table:
- House baked rolls and butter
- Tortillas
- Potato salad
- Green salad with ranch dressing
- Island slaw
- Chef's selection of sushi

Beach BBQ hot table:
- Peas and rice
- Mac and cheese
- Smoked jerk chicken
- Blackened mahi mahi
- Mini eye fillet
- 24 hour smoked beef brisket with BBQ sauce

Beach BBQ dessert:
- Pastry chef's selection of cake slices

Canapes:
- Vegetable spring rolls
- Arancini with serrano ham and truffle
- Sushi rolls and nigiri
- BBQ octopus skewers
- Smoked salmon rillettes tostada
- Conch ceviche with mango
- Panko prawns with tartare
- Crackling pork belly with apple remoulade

Reception starters:
- Three Taste of the Sea
- Mushroom risotto with grana Padano & truffle

Reception mains:
- Char-grilled beef tenderloin
  - grilled with garlic butter, truffle mashed potatoes, asparagus, and red wine jus
- Blackened local grouper fillet
  - served with fresh Caribbean lime and mango salsa plus local rice and peas
- Vegetarian breaded cauliflower steak
  - coconut rice, spiced black bean salsa, and curry yogurt sauce

Reception desserts:
- Caribbean key lime cheesecake
- Deconstructed Banoffee Pie

Dining changes and dietary notes:
- Guests choose dinner before entering the site, but they can update dinner selections on the Dining page.
- Final date to make food changes: October 1, 2026.
- Guests can also leave food allergies or dietary restrictions, such as shellfish allergy, gluten-free, vegetarian, or no pork.

Activity choices:
- Sunset Cruise: relaxed, scenic, social, low-effort. A 1.5-hour sunset sail starting at 4pm from The Ritz-Carlton beach, with a gourmet selection of hors d'oeuvres, full open bar, ocean views, and golden-hour island breeze.
- Ocean Horseback Riding: more adventurous and memorable. About 1 hour, start time TBD, riding along the shoreline and into the water with guides.
- Final date to make activity changes: September 1, 2026.
- If someone says they are not adventurous, want to relax, do not want to get wet, prefer cocktails, or want an easy experience, recommend Sunset Cruise.
- If someone wants a once-in-a-lifetime photo memory, loves animals, wants something active, or is comfortable getting wet, recommend Ocean Horseback Riding.

Accommodation guidance:
- Wymara Resort + Villas: closest and easiest option for wedding-week logistics. Beachfront studios, suites, and villas on Grace Bay Beach, modern resort feel, easiest access to the celebration. Wedding room discount/code will be shared when available.
- The Sands at Grace Bay: gentle under-$500/night-style recommendation when available; comfortable Grace Bay option with suite-style rooms, kitchens or kitchenettes in many rooms, easy beach access, and practical value for guests who want more space.
- Hotel Indigo Turks & Caicos by IHG: gentle under-$500/night-style recommendation when available; modern IHG option near Grace Bay, good for guests who prefer newer rooms, a familiar hotel brand, and a simple stay.
- Seven Stars Resort & Spa: mid-to-upscale Grace Bay beachfront resort with suite-style accommodations, kitchens in many rooms, and a full-service resort feel close to restaurants and beach life.
- Rock House: mid-to-upscale boutique stay on the north shore of Providenciales with dramatic views, Mediterranean-inspired design, and a quieter romantic feel.
- For "under $500/night, which hotel is best?", recommend The Sands for beach access, space, and practical resort comfort; recommend Hotel Indigo for newer rooms, brand familiarity, and simpler modern convenience. Tell them to compare live rates because Turks and Caicos pricing changes by date and availability.
- If a guest prioritizes easiest wedding logistics, recommend Wymara if budget allows.
- If a guest wants a quieter boutique feel, recommend Rock House.
- If a guest wants a polished beachfront resort near everything, recommend Seven Stars.

Wymara spa discount:
- Jon and Tao arranged a Wymara spa discount for wedding guests who want to book treatments.
- Booking details and exact discount instructions will be shared once finalized.
- Best place to mention it: Accommodation/Guest Wellness because it connects to staying at or visiting Wymara, but it can also be recommended as a relaxing island-day idea.

Explore suggestions:
- Chalk Sound National Park: turquoise lagoon, rocky cays, scenic drive, photos, kayaking, paddleboarding.
- Thursday Fish Fry: local music, Junkanoo, handmade goods, island food and drinks. Thursdays at 6pm at Stubbs Diamond Plaza in The Bight.
- Da Conch Shack: iconic casual beachfront stop for conch salad, conch fritters, cracked conch, seafood, and rum drinks.
- Grace Bay / Bight Reef: calm water, beach time, snorkeling, turtles, coral, tropical fish; easy for guests who want a low-effort beach day.
- Wymara spa or resort beach time: best for guests who want a slower, restful day.

Travel tips:
- Providenciales is easy to navigate; many guest destinations are a short drive apart.
- Taxis are common, but fares are usually set in advance, so guests should confirm the total before getting in.
- There is no Uber or Lyft on the island.
- Hotel-arranged transportation is reliable and convenient.
- Renting a car is helpful if guests want flexibility to explore beaches and restaurants on their own schedule.
- The official currency is the U.S. dollar. A little cash is useful for tips, taxis, or casual stops.
- Prices can run higher than in the U.S. because many goods are imported, but the scenery and quality make dining and experiences feel special.
- Popular restaurants can book up quickly; reservations are recommended.
- Island time is real: build in a little extra time and flexibility.
- Sunscreen, hydration, sunglasses, and beach-friendly shoes are strongly encouraged.

Guest-style guidance:
- Beach BBQ: beach chic, relaxed resort wear, breezy dresses, linen, polos, sandals, elevated but comfortable.
- Island Day: resort casual, swim/sun gear if relevant, sandals, hat, sunscreen. For horseback riding, choose clothes that can get wet and are comfortable for riding.
- Ceremony and Reception: black tie optional. Think polished formal or semi-formal evening attire with a beachside setting in mind; avoid overly heavy fabrics and consider shoes that work near grass or sand.

Flights:
- You do not have live flight search. If asked "how much does a flight cost from X city" or "how long is the flight", explain that prices and routing change often.
- Give general planning advice: search for Providenciales International Airport, airport code PLS; many U.S. guests connect through Miami, Charlotte, Atlanta, New York, or other major hubs unless a direct flight is available.
- Encourage checking Google Flights or airlines for exact fare, connection, and travel time.
`;

function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };
}

function buildFallbackText(question: string) {
  const message = question.toLowerCase();

  if (
    message.includes('relax') ||
    message.includes('not adventurous') ||
    message.includes('activity') ||
    message.includes('nov 24') ||
    message.includes('horse') ||
    message.includes('cruise')
  ) {
    if (message.includes('relax') || message.includes('not adventurous')) {
      return 'I would choose the Sunset Cruise. It is the easier, more relaxed option: a 1.5-hour golden-hour sail starting at 4pm with hors d’oeuvres, open bar, ocean views, and very little planning or effort. Ocean Horseback Riding is the more adventurous, get-in-the-water memory.';
    }

    return 'For November 24, guests can choose between Sunset Cruise and Ocean Horseback Riding. Sunset Cruise is best for a relaxed, scenic, social golden-hour experience. Ocean Horseback Riding is best for guests who want something more adventurous, memorable, and photo-worthy.';
  }

  if (
    message.includes('bbq') ||
    message.includes('welcome') ||
    message.includes('menu') ||
    message.includes('dinner') ||
    message.includes('food') ||
    message.includes('allerg')
  ) {
    if (message.includes('allerg')) {
      return 'Guests can share food allergies or dietary notes in the Dining section. Dinner selections can be updated until October 1, 2026, and allergy notes should be included there as well.';
    }

    return 'The welcome party beach BBQ includes salad table favorites like island slaw and sushi, hot dishes including jerk chicken, mahi mahi, mini eye fillet, and smoked brisket, plus pastry chef cake slices for dessert.';
  }

  if (message.includes('vegetarian')) {
    return 'The main vegetarian reception option is the breaded cauliflower steak with coconut rice, spiced black bean salsa, and curry yogurt sauce. There is also a mushroom risotto starter.';
  }

  if (
    message.includes('under $500') ||
    message.includes('under 500') ||
    message.includes('cheap') ||
    message.includes('budget') ||
    message.includes('stay') ||
    message.includes('hotel') ||
    message.includes('accommodation')
  ) {
    if (
      message.includes('under $500') ||
      message.includes('under 500') ||
      message.includes('cheap') ||
      message.includes('budget')
    ) {
      return 'For a gentler price point, I would compare The Sands at Grace Bay and Hotel Indigo Turks & Caicos by IHG. The Sands is better if you want beach access, more space, and suite-style practicality. Hotel Indigo is better if you prefer newer rooms, a familiar brand, and a simpler modern stay. Always check live rates because island pricing changes by date and availability.';
    }

    return 'For the easiest wedding logistics, Wymara Resort + Villas is the closest choice. Other suggested stays are The Sands at Grace Bay and Hotel Indigo for a gentler price point, Seven Stars for a polished beachfront resort feel, and Rock House for a quieter boutique stay.';
  }

  if (
    message.includes('taxi') ||
    message.includes('uber') ||
    message.includes('lyft') ||
    message.includes('car') ||
    message.includes('reservation') ||
    message.includes('restaurant')
  ) {
    return 'Providenciales is fairly easy to get around, but there is no Uber or Lyft. Taxis are common, and it is best to confirm the fare before the ride. Hotel-arranged transportation is reliable, and renting a car is helpful if you want flexibility. Restaurant reservations are recommended for popular spots.';
  }

  if (
    message.includes('explore') ||
    message.includes('turks') ||
    message.includes('caicos') ||
    message.includes('conch') ||
    message.includes('fish fry') ||
    message.includes('snorkel')
  ) {
    return 'Great easy ideas: Chalk Sound for turquoise lagoon views, Thursday Fish Fry for local music and food, Da Conch Shack for conch and beachfront drinks, Grace Bay or Bight Reef for calm water and snorkeling, and Wymara spa if you want a slower relaxing day.';
  }

  if (message.includes('when') || message.includes('schedule') || message.includes('itinerary')) {
    return 'The weekend schedule is: beach BBQ welcome party on November 23, 2026, choose-your-own activity day on November 24, 2026, and the wedding plus reception dinner on November 25, 2026 at Wymara Villa.';
  }

  if (
    message.includes('wear') ||
    message.includes('dress') ||
    message.includes('attire') ||
    message.includes('style')
  ) {
    return 'For the Beach BBQ, think beach chic and relaxed resort wear. For island day, wear easy daytime resort clothes with swim or sun gear if needed. For the wedding, the dress code is black tie optional: polished formal or semi-formal evening attire with the beachside setting in mind.';
  }

  if (message.includes('spa') || message.includes('massage') || message.includes('wellness')) {
    return 'Jon and Tao arranged a Wymara spa discount for wedding guests who would like to book treatments. Exact booking instructions will be shared once finalized. It is a lovely option if you want a slower, relaxing island moment.';
  }

  if (message.includes('flight') || message.includes('fly') || message.includes('airport')) {
    return 'For flights, search for Providenciales International Airport, airport code PLS. I cannot see live fares or schedules, but many U.S. guests connect through hubs like Miami, Charlotte, Atlanta, or New York unless a direct flight is available. Google Flights or the airline will give the exact price and travel time.';
  }

  return 'I can help with the wedding schedule, dress code, dining choices, allergies, activity matching, hotel recommendations, Wymara spa, taxis, restaurant reservations, flights into PLS, and Turks and Caicos explore ideas. Try asking what to choose if you want to relax, where to stay under $500/night, or what to know about taxis.';
}

function createFallbackStream(question: string) {
  const encoder = new TextEncoder();
  const answer = buildFallbackText(question);

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = answer.match(/.{1,28}(\s|$)/g) ?? [answer];

      for (const chunk of chunks) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'text', text: chunk })}\n\n`),
        );
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validated = validateProviderModel(undefined, undefined);
  const lastQuestion = parsed.data.messages[parsed.data.messages.length - 1]?.content ?? '';

  if (!validated) {
    return createFallbackStream(lastQuestion);
  }

  const model = getModel(validated.provider, validated.model) as
    | Parameters<typeof streamText>[0]['model']
    | null;

  if (!model) {
    return createFallbackStream(lastQuestion);
  }

  const result = streamText({
    model,
    system: weddingSystemPrompt,
    messages: parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'text', text: part.text })}\n\n`,
              ),
            );
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'The wedding concierge ran into an error.';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

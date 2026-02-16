export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;

    const systemPrompt = `
      You are the AI Receptionist for Bhakti Dental Clinic (Nikol, Ahmedabad).
      
      KEY INFO:
      - Doctor: Dr. Bhakti Gokani (BDS, Gold Medalist, 15+ Yrs Exp).
      - Address: A-117, Blueberry Complex, Nikol, Ahmedabad.
      - Map Link: https://maps.app.goo.gl/WbMUYt4kEbSNcWvH9
      - Phone: +91 77373 86962.
      - Services: Painless RCT, Laser Dentistry, Implants, Smile Design.
      
      INSTRUCTIONS:
      - Keep answers short (under 30 words).
      - If asked for location, provide the address and mention the Map Link is on the site.
      - If asked for booking, ask them to use the "Book Now" form or WhatsApp button.
      - Be polite and professional.
    `;

    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GH_MODELS_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        model: "gpt-4o-mini",
        temperature: 0.7
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Service unavailable." }), { status: 500 });
  }
}

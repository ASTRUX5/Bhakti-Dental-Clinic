export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;

    const systemPrompt = `
      You are the AI Assistant for Bhakti Dental Clinic in Nikol, Ahmedabad.
      
      KEY FACTS:
      - Doctor: Dr. Bhakti Gokani (BDS, Gold Medalist).
      - Experience: 15+ Years.
      - Location: A-117, Blueberry Complex, Nikol.
      - Map: https://maps.app.goo.gl/WbMUYt4kEbSNcWvH9
      - Phone: +91 77373 86962.
      - Services: Painless Root Canal, Implants, Smile Design, Kids Dentistry.
      
      INSTRUCTIONS:
      - Keep answers short and professional.
      - If asked for appointment, say "You can book using the form above or WhatsApp us."
      - If emergency, tell them to call +91 77373 86962.
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
    return new Response(JSON.stringify({ reply: "I am offline. Please call the clinic directly." }), { status: 200 });
  }
}

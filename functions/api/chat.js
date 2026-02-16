export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;

    // 2026 AI Persona Instructions
    const systemPrompt = `
      You are "Aura", the advanced AI receptionist for Bhakti Dental Clinic.
      
      CORE DETAILS:
      - Dentist: Dr. Bhakti Gokani (Gold Medalist, 15+ Yrs Exp).
      - Location: A-117, Blueberry Complex, Nikol, Ahmedabad.
      - Map Link: https://maps.app.goo.gl/WbMUYt4kEbSNcWvH9
      - Phone: +91 77373 86962.
      - Key Tech: Painless Root Canals, Laser Dentistry, Digital Smile Design.
      
      BEHAVIOR:
      - Your tone is professional, warm, and futuristic.
      - Keep answers short (max 2 sentences).
      - If asked for location, ALWAYS provide the Map Link.
      - If asked to book, guide them to the WhatsApp button.
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
    
    // Safety check for API response
    const reply = data.choices && data.choices[0] ? data.choices[0].message.content : "I am currently updating my systems. Please call the clinic directly.";

    return new Response(JSON.stringify({ reply: reply }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "System overload." }), { status: 500 });
  }
}

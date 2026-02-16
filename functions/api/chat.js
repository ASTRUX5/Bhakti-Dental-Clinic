export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;

    // --- CONTEXT: This makes the AI smart about Dr. Bhakti ---
    const systemPrompt = `
      You are the AI Receptionist for Bhakti Dental Clinic in Ahmedabad.
      
      KEY DETAILS:
      - Doctor: Dr. Bhakti Gokani (BDS, Gold Medalist, 15+ Years Exp).
      - Specialty: Painless Root Canals, Implants, Laser Dentistry, Kids Dentistry.
      - Location: A-117, Blueberry Complex, Nikol, Ahmedabad.
      - Phone: +91 77373 86962.
      - Timings: Mon-Sat (9 AM - 9 PM), Sun (10 AM - 1 PM).
      - Prices: Consultation is affordable. Root Canal starts from ₹2500 (approx).
      
      TONE:
      - Professional, warm, and inviting.
      - Keep answers short (under 50 words).
      - If asked about appointments, ask them to click the "Book Visit" or WhatsApp button.
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
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userMessage = body.message;

    const systemPrompt = `
      You are the AI Receptionist for Bhakti Dental Clinic.
      Details: Dr. Bhakti Gokani, Gold Medalist, 15+ Yrs Exp.
      Location: Nikol, Ahmedabad. Phone: +91 77373 86962.
      Services: Painless RCT, Implants, Whitening.
      Tone: Professional, Short, Helpful.
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

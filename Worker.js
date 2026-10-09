export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=UTF-8"
        }
      });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();

        if (!message) {
          return json({ error: "پیغام خالی ہے۔" }, 400);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content: `You are the official AI assistant for Charcoal-grilled burger (برغر مشوي على الفحم) in Riyadh, Saudi Arabia.

YOUR JOB:

- Answer the customer's actual question directly. Do not repeat the same restaurant information in every reply.
- If asked "What do you do?", explain simply: "I am the restaurant's AI assistant. I can help you with menu questions, prices, location, opening hours, and ordering guidance."
- If the customer says hello, greet them naturally and briefly.
- If the customer says they have many questions, invite them to ask one at a time.
- Never describe yourself as an ISP, doctor, human, or another unrelated role.
- Do not ask personal questions unless relevant to the customer's request.
- Keep replies short, clear, friendly, and natural.
- Reply in the same language and writing style the customer uses: Urdu script, Roman Urdu, Arabic, or English.
- For Urdu and Roman Urdu, always use respectful wording: آپ، آپ کو، آپ کی. Never use تم، تمہیں، تمہارا.
- Do not invent menu items, prices, promotions, or availability. If you do not know the answer, say so honestly.
- Never claim an order was placed, confirmed, or sent unless that actually happened.

RESTAURANT DETAILS:
Name: Charcoal-grilled burger
Arabic name: برغر مشوي على الفحم
Location: Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia
Opening hours: 12:10 PM to 4:50 AM
WhatsApp: +966 59 487 5938
Google Maps: https://maps.app.goo.gl/gMPyqkJzcxW1v5Hm7

Remember: answer what the customer asked first. Do not add unrelated information.
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return json({
          reply: result.response || "معذرت، ابھی جواب نہیں مل سکا۔"
        });
      } catch (error) {
        return json({
          error: "AI سروس میں مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔"
        }, 500);
      }
    }

    if (url.pathname === "/api/health") {
      return json({ status: "ok", service: "Charcoal-grilled burger AI" });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders
    });
  }
};

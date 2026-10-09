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
                content: `You are the AI assistant for Charcoal-grilled burger in Riyadh, Saudi Arabia.

Reply in the same language as the customer: Urdu, Roman Urdu, Arabic, or English.

For Urdu and Roman Urdu, always use respectful wording: آپ، آپ کو، آپ کی. Never use تم، تمہیں، تمہارا.

Be friendly, natural, concise, and helpful. Do not invent menu items, prices, availability, or order confirmations. If you do not know something, say so clearly.

Restaurant:
Charcoal-grilled burger
Location: Al Arijha Al Wusta, Aisha bint Abi Bakr Street, Riyadh.
Hours: 12:10 PM to 4:50 AM.
WhatsApp: +966594875938
Google Maps: https://maps.app.goo.gl/gMPyqkJzcxW1v5Hm7

Help customers with general questions. Do not claim an order has been placed or sent unless that actually happened.`
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

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

    // AI connection test
    if (url.pathname === "/api/health") {
      return json({
        status: "ok",
        service: "Charcoal-grilled burger AI"
      });
    }

    // AI chat
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();

        if (!message) {
          return json({
            error: "براہ کرم پہلے اپنا پیغام لکھیں۔"
          }, 400);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content: `You are the official AI assistant for Charcoal-grilled burger (برغر مشوي على الفحم), a restaurant in Riyadh, Saudi Arabia.

YOUR IDENTITY:
You are a restaurant AI assistant. Never claim to be an ISP, doctor, human, or any unrelated profession.

HOW TO RESPOND:
1. Answer the customer's actual question directly.
2. Keep answers short, clear, friendly, and natural.
3. Do not repeat restaurant information unless it is relevant.
4. If greeted, greet the customer briefly.
5. If asked "What do you do?", explain that you help with restaurant information, menu questions, prices, location, opening hours, and ordering guidance.
6. If the customer says they have many questions, invite them to ask one at a time.
7. Reply in the same language and writing style as the customer: Urdu script, Roman Urdu, Arabic, or English.
8. For Urdu and Roman Urdu, use respectful wording: آپ، آپ کو، آپ کی. Never use تم، تمہیں، تمہارا.
9. Never mix languages unnecessarily.
10. Never invent menu items, prices, offers, availability, or order confirmations.
11. If you do not know an answer, say so honestly.
12. Do not claim an order was sent, placed, or confirmed unless the system actually completed that action.
13. Do not ask unrelated personal questions.
14. If the customer says "no" or "نہیں", respond naturally and do not push them to order.

RESTAURANT INFORMATION:
Name: Charcoal-grilled burger
Arabic name: برغر مشوي على الفحم
Location: Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia
Opening hours: 12:10 PM to 4:50 AM
WhatsApp: +966 59 487 5938
Google Maps: https://maps.app.goo.gl/gMPyqkJzcxW1v5Hm7

MENU AND ORDERS:
Only provide specific menu items and prices when they are available in verified menu data. Do not guess prices. You may guide customers to contact the restaurant through WhatsApp for menu confirmation.

IMPORTANT:
Focus on what the customer asked. Be helpful, respectful, accurate, and concise.`
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        const reply =
          result && typeof result.response === "string"
            ? result.response.trim()
            : "";

        if (!reply) {
          return json({
            error: "معذرت، ابھی جواب نہیں مل سکا۔ براہ کرم دوبارہ کوشش کریں۔"
          }, 502);
        }

        return json({ reply });

      } catch (error) {
        return json({
          error: "AI سروس سے رابطہ نہیں ہو سکا۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔"
        }, 500);
      }
    }

    // Serve the website files
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders
    });
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "Charcoal-grilled burger AI",
        status: "online"
      });
    }

    if (url.pathname === "/api/restaurant") {
      return json({
        name: "Charcoal-grilled burger",
        arabicName: "برغر مشوي على الفحم",
        location:
          "Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia",
        hours: "12:10 PM – 4:50 AM",
        whatsapp: "+966594875938",
        mapsUrl:
          "https://maps.app.goo.gl/gMPyqkJzcxW1v5Hm7"
      });
    }

    return json({
      ok: true,
      message: "Charcoal-grilled burger AI Worker is running."
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...corsHeaders()
    }
  });
}

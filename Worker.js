export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Charcoal-grilled burger AI تیار ہے۔"
        }),
        {
          headers: {
            ...corsHeaders,
            "content-type": "application/json; charset=UTF-8"
          }
        }
      );
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();

        if (!message) {
          return new Response(
            JSON.stringify({
              error: "پیغام خالی ہے۔"
            }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "content-type": "application/json; charset=UTF-8"
              }
            }
          );
        }

        const aiResponse = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "آپ Charcoal-grilled burger کے AI assistant ہیں۔ آپ کا انداز ایک قدرتی، باادب، دوستانہ اور سمجھدار انسانی assistant جیسا ہونا چاہیے۔ آپ صارف سے عام انسانوں کی طرح گفتگو کریں۔\n\n" +
                  "زبان کے اصول:\n" +
                  "- صارف اردو میں لکھے تو اردو میں جواب دیں۔\n" +
                  "- صارف Roman Urdu میں لکھے تو Roman Urdu میں جواب دیں۔\n" +
                  "- صارف اردو اور Roman Urdu ملا کر لکھے تو اسے سمجھ کر مناسب جواب دیں۔\n" +
                  "- صارف English میں لکھے تو English میں جواب دیں۔\n" +
                  "- صارف Arabic میں لکھے تو Arabic میں جواب دیں۔\n" +
                  "- زبان خود سے تبدیل نہ کریں جب تک صارف زبان تبدیل نہ کرے۔\n\n" +
                  "احترام:\n" +
                  "- ہمیشہ آپ، آپ کو، آپ کی، آپ سے استعمال کریں۔\n" +
                  "- تم، تمہیں، تمہارا، تیرا، تیری استعمال نہ کریں۔\n" +
                  "- لہجہ دوستانہ ہو لیکن حد سے زیادہ رسمی نہ ہو۔\n\n" +
                  "گفتگو:\n" +
                  "- سلام کا مختصر اور قدرتی جواب دیں۔\n" +
                  "- اگر صارف پوچھے آپ کیسے ہیں تو مختصر جواب دیں۔\n" +
                  "- اگر صارف صرف بات چیت کرنا چاہے تو عام دوستانہ گفتگو کریں۔\n" +
                  "- صارف کے سوال کا سیدھا جواب دیں۔\n" +
                  "- غیر متعلقہ معلومات شامل نہ کریں۔\n" +
                  "- Wikipedia، Google یا دوسرے ذرائع کا بلاوجہ ذکر نہ کریں۔\n" +
                  "- غیر ضروری لمبی فہرستیں نہ بنائیں۔\n" +
                  "- اگر بات واضح نہ ہو تو مختصر وضاحت مانگیں۔\n" +
                  "- صارف کے الفاظ کا غلط مطلب خود سے نہ بنائیں۔\n\n" +
                  "اپنی شناخت:\n" +
                  "- خود کو کسی حقیقی انسان یا کسی مخصوص شخص کے نام سے منسوب نہ کریں۔\n" +
                  "- اپنی فرضی ذاتی زندگی، جسم یا حقیقی دنیا کے کام کرنے کا دعویٰ نہ کریں۔\n" +
                  "- اگر صارف پوچھے آپ کیا ہیں تو کہیں کہ آپ Charcoal-grilled burger کے AI assistant ہیں۔\n" +
                  "- اگر صارف تصویر مانگے تو یہ دعویٰ نہ کریں کہ آپ کے پاس اپنی حقیقی تصویر موجود ہے۔\n\n" +
                  "درستگی:\n" +
                  "- ایسی معلومات نہ گھڑیں جو معلوم نہ ہوں۔\n" +
                  "- اگر کسی چیز کا علم نہ ہو تو صاف بتائیں کہ آپ کو معلوم نہیں۔\n" +
                  "- صارف کے سوال سے ہٹ کر موضوع تبدیل نہ کریں۔\n\n" +
                  "خاص اصول:\n" +
                  "- ابھی restaurant menu، prices یا ordering کے بارے میں کوئی معلومات فرض نہ کریں۔\n" +
                  "- وہ معلومات بعد میں الگ سے دی جائیں گی۔"
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return new Response(
          JSON.stringify({
            reply: aiResponse.response || "AI نے کوئی جواب نہیں دیا۔"
          }),
          {
            headers: {
              ...corsHeaders,
              "content-type": "application/json; charset=UTF-8"
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: String(error)
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "content-type": "application/json; charset=UTF-8"
            }
          }
        );
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders
    });
  }
};

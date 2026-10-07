// app.js
// Charcoal-grilled burger — Main application logic

(function () {
  "use strict";

  const state = {
    language: "en",
    currentOrder: [],
    confirmedOrder: [],
    orderState: "IDLE",
    conversation: [],
    recognition: null,
    listening: false
  };

  const $ = (selector) => document.querySelector(selector);

  const chat = $("#chat");
  const input = $("#messageInput");
  const sendButton = $("#sendButton");
  const voiceButton = $("#voiceButton");
  const menuButton = $("#menuButton");
  const locationButton = $("#locationButton");
  const whatsappButton = $("#whatsappButton");

  // --------------------------------------------------
  // LANGUAGE
  // --------------------------------------------------

  function detectLanguage(text) {
    const value = String(text || "").trim();

    if (!value) return state.language;

    // Arabic script
    if (/[\u0600-\u06FF]/.test(value)) {
      return "ar";
    }

    // Common Roman Urdu words
    const romanUrdu = [
      "mujhe", "mujhy", "mujhay", "chahiye", "chaahiye",
      "hai", "hain", "kya", "kea", "kitna", "kitne",
      "aur", "bas", "bhej", "bejh", "do", "dein",
      "aap", "ap", "order", "karna", "karo", "krna",
      "chicken", "burger", "fries", "pepsi", "pani",
      "nuggets", "roll", "chahiy"
    ];

    const lower = value.toLowerCase();

    const romanUrduHits = romanUrdu.filter(word =>
      new RegExp(`\\b${word}\\b`, "i").test(lower)
    ).length;

    if (romanUrduHits >= 1) {
      return "ur";
    }

    return "en";
  }

  function rememberLanguage(text) {
    state.language = detectLanguage(text);
    return state.language;
  }

  // --------------------------------------------------
  // TEXT
  // --------------------------------------------------

  const TEXT = {
    en: {
      welcome:
        "Welcome to Charcoal-grilled burger! 🍔🔥\nI can help with our menu, prices, orders, opening hours and location.",

      more:
        "Would you like anything else?",

      finished:
        "Here is your order summary:",

      whatsappQuestion:
        "Would you like me to prepare this order for WhatsApp?",

      whatsappReady:
        "Your order is ready. Tap the button below to send it to us on WhatsApp.",

      cancelled:
        "Your order has been cancelled.",

      noOrder:
        "There is no active order to cancel.",

      location:
        "We are located at Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia.",

      hours:
        "Our opening hours are 12:10 PM – 4:50 AM.",

      contact:
        "You can contact us on WhatsApp.",

      unknown:
        "I can help with the menu, prices, orders, opening hours and location. What would you like to know?"
    },

    ar: {
      welcome:
        "مرحباً بكم في برغر مشوي على الفحم! 🍔🔥\nيمكنني مساعدتكم في القائمة والأسعار والطلبات وأوقات العمل والموقع.",

      more:
        "هل ترغبون في إضافة شيء آخر؟",

      finished:
        "هذا ملخص طلبكم:",

      whatsappQuestion:
        "هل ترغبون في إرسال هذا الطلب عبر واتساب؟",

      whatsappReady:
        "طلبكم جاهز. اضغطوا الزر أدناه لإرساله لنا عبر واتساب.",

      cancelled:
        "تم إلغاء طلبكم.",

      noOrder:
        "لا يوجد طلب نشط لإلغائه.",

      location:
        "موقعنا: العريجاء الوسطى – شارع عائشة بنت أبي بكر، الرياض، السعودية.",

      hours:
        "أوقات العمل: 12:10 ظهراً – 4:50 صباحاً.",

      contact:
        "يمكنكم التواصل معنا عبر واتساب.",

      unknown:
        "يمكنني مساعدتكم في القائمة والأسعار والطلبات وأوقات العمل والموقع. ماذا ترغبون في معرفة؟"
    },

    ur: {
      welcome:
        "Charcoal-grilled burger mein khush aamdeed! 🍔🔥\nMain menu, prices, order, timing aur location mein aap ki madad kar sakta hoon.",

      more:
        "Kya aap aur koi item lena chahenge?",

      finished:
        "Aap ke order ka summary:",

      whatsappQuestion:
        "Kya aap is order ko WhatsApp par bhejna chahenge?",

      whatsappReady:
        "Aap ka order tayyar hai. Neeche button daba kar WhatsApp par bhej dein.",

      cancelled:
        "Aap ka order cancel kar diya gaya hai.",

      noOrder:
        "Koi active order nahi hai.",

      location:
        "Hamari location Al Arijha Al Wusta – Aisha bint Abi Bakr Street, Riyadh, Saudi Arabia hai.",

      hours:
        "Hamare opening hours 12:10 PM se 4:50 AM tak hain.",

      contact:
        "Aap WhatsApp par hum se rabta kar sakte hain.",

      unknown:
        "Main menu, prices, order, timing aur location mein madad kar sakta hoon. Aap kya maloom karna chahte hain?"
    }
  };

  function t(key) {
    return TEXT[state.language]?.[key] || TEXT.en[key];
  }

  // --------------------------------------------------
  // CHAT UI
  // --------------------------------------------------

  function addMessage(message, sender = "bot") {
    if (!chat) return;

    const wrapper = document.createElement("div");
    wrapper.className = `message ${sender}`;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;

    wrapper.appendChild(content);
    chat.appendChild(wrapper);

    chat.scrollTop = chat.scrollHeight;
  }

  function addButton(label, action) {
    if (!chat) return;

    const button = document.createElement("button");
    button.className = "chat-action";
    button.textContent = label;

    button.addEventListener("click", action);

    chat.appendChild(button);
    chat.scrollTop = chat.scrollHeight;
  }

  function showWhatsAppButton() {
    if (!chat) return;

    // Remove old WhatsApp action buttons
    chat.querySelectorAll(".whatsapp-order-action")
      .forEach(el => el.remove());

    const button = document.createElement("button");
    button.className = "chat-action whatsapp-order-action";
    button.textContent = "📲 Send Order via WhatsApp";

    button.addEventListener("click", sendConfirmedOrderToWhatsApp);

    chat.appendChild(button);
    chat.scrollTop = chat.scrollHeight;
  }

  // --------------------------------------------------
  // ORDER
  // --------------------------------------------------

  function clearOrder() {
    state.currentOrder = [];
    state.confirmedOrder = [];
    state.orderState = "IDLE";

    chat?.querySelectorAll(".whatsapp-order-action")
      .forEach(el => el.remove());
  }

  function addToOrder(item, quantity = 1) {
    quantity = Math.max(1, Number(quantity) || 1);

    const existing = state.currentOrder.find(
      orderItem => orderItem.id === item.id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.currentOrder.push({
        id: item.id,
        name: item.name,
        arabic: item.arabic,
        price: item.price,
        quantity
      });
    }

    state.orderState = "ADDING_ITEMS";
  }

  function calculateTotal(order) {
    return order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  function formatMoney(value) {
    return `${Number(value).toFixed(2)} SAR`;
  }

  function orderSummary(order, language) {
    const total = calculateTotal(order);

    if (language === "ar") {
      let text = "📋 ملخص الطلب:\n";

      order.forEach(item => {
        text += `• ${item.arabic} × ${item.quantity} = ${formatMoney(item.price * item.quantity)}\n`;
      });

      text += `\n💰 الإجمالي: ${formatMoney(total)}`;
      return text;
    }

    if (language === "ur") {
      let text = "📋 Order summary:\n";

      order.forEach(item => {
        text += `• ${item.name} × ${item.quantity} = ${formatMoney(item.price * item.quantity)}\n`;
      });

      text += `\n💰 Total: ${formatMoney(total)}`;
      return text;
    }

    let text = "📋 Order summary:\n";

    order.forEach(item => {
      text += `• ${item.name} × ${item.quantity} = ${formatMoney(item.price * item.quantity)}\n`;
    });

    text += `\n💰 Total: ${formatMoney(total)}`;

    return text;
  }

  function finishOrder() {
    if (!state.currentOrder.length) {
      addMessage(t("noOrder"));
      return;
    }

    // Freeze a copy
    state.confirmedOrder = state.currentOrder.map(item => ({
      ...item
    }));

    state.orderState = "WAITING_FOR_WHATSAPP_PERMISSION";

    addMessage(orderSummary(state.confirmedOrder, state.language));
    addMessage(t("finished"));
    addMessage(t("whatsappQuestion"));
  }

  // --------------------------------------------------
  // WHATSAPP
  // --------------------------------------------------

  function getWhatsAppLanguage() {
    // English and Arabic only.
    // Urdu/Roman Urdu and other languages use English.
    if (state.language === "ar") return "ar";
    return "en";
  }

  function createWhatsAppOrderMessage() {
    const language = getWhatsAppLanguage();
    const order = state.confirmedOrder;

    if (!order.length) return "";

    const total = calculateTotal(order);

    if (language === "ar") {
      let message = "مرحباً، أريد طلب:\n\n";

      order.forEach(item => {
        message += `${item.arabic} × ${item.quantity} = ${formatMoney(item.price * item.quantity)}\n`;
      });

      message += `\nالإجمالي: ${formatMoney(total)}`;

      return message;
    }

    let message = "Hello, I would like to order:\n\n";

    order.forEach(item => {
      message += `${item.name} × ${item.quantity} = ${formatMoney(item.price * item.quantity)}\n`;
    });

    message += `\nTotal: ${formatMoney(total)}`;

    return message;
  }

  function sendConfirmedOrderToWhatsApp() {
    if (!state.confirmedOrder.length) {
      addMessage(t("noOrder"));
      return;
    }

    const orderMessage = createWhatsAppOrderMessage();

    const whatsappUrl =
      `https://wa.me/966594875938?text=${encodeURIComponent(orderMessage)}`;

    state.orderState = "WHATSAPP_READY";

    window.open(whatsappUrl, "_blank");
  }

  // --------------------------------------------------
  // CANCELLATION
  // --------------------------------------------------

  function isCancellation(text) {
    const value = String(text || "").toLowerCase().trim();

    const phrases = [
      "cancel",
      "cancel order",
      "cancel my order",
      "لغو",
      "الغي",
      "إلغاء",
      "الغاء",
      "منسوخ",
      "cancel karna hai",
      "order cancel",
      "order cancel karo",
      "order cancel kar do",
      "order cancel kr do",
      "order cancel krna hai"
    ];

    return phrases.some(phrase => value.includes(phrase));
  }

  // --------------------------------------------------
  // FINISH / YES
  // --------------------------------------------------

  function isFinishPhrase(text) {
    const value = String(text || "").toLowerCase().trim();

    const phrases = [
      "bas",
      "bas itna",
      "bas itna hi",
      "that's all",
      "that is all",
      "thats all",
      "done",
      "finish",
      "finished",
      "complete",
      "order complete",
      "no more",
      "nothing else",
      "بس",
      "بس اتنا",
      "بس اتنا ہی",
      "خلاص",
      "انتهى",
      "هذا كل شيء",
      "كفى"
    ];

    return phrases.includes(value);
  }

  function isWhatsAppPermission(text) {
    const value = String(text || "").toLowerCase().trim();

    const yesWords = [
      "yes",
      "yes please",
      "send",
      "send it",
      "send order",
      "send it please",
      "please send",
      "haan bhej do",
      "han bhej do",
      "haan send kar do",
      "han send kar do",
      "جی",
      "جی بھیج دیں",
      "ہاں بھیج دیں",
      "نعم",
      "نعم أرسل",
      "ارسل",
      "أرسل",
      "نعم ارسل"
    ];

    return yesWords.includes(value);
  }

  // --------------------------------------------------
  // QUANTITY
  // --------------------------------------------------

  function extractQuantity(text) {
    const value = String(text || "").toLowerCase();

    // Explicit quantity expressions only.
    const explicitPatterns = [
      /\b(\d+)\s*(?:x|times)\b/,
      /\bx\s*(\d+)\b/,
      /\b(\d+)\s*(?:pcs|pieces|piece)\b/,
      /\bquantity\s*(\d+)\b/,
      /\bqty\s*(\d+)\b/
    ];

    for (const pattern of explicitPatterns) {
      const match = value.match(pattern);

      if (match) {
        const quantity = Number(match[1]);

        if (quantity > 0 && quantity <= 50) {
          return quantity;
        }
      }
    }

    // English number words
    const words = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10
    };

    for (const [word, number] of Object.entries(words)) {
      if (new RegExp(`\\b${word}\\b`).test(value)) {
        return number;
      }
    }

    // Otherwise 1.
    return 1;
  }

  // --------------------------------------------------
  // FUZZY SEARCH
  // --------------------------------------------------

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshtein(a, b) {
    a = normalize(a);
    b = normalize(b);

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b.charAt(i - 1) === a.charAt(j - 1)
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + 1
              );
      }
    }

    return matrix[b.length][a.length];
  }

  function itemScore(query, item) {
    const q = normalize(query);

    const names = [
      normalize(item.name),
      normalize(item.arabic)
    ];

    let best = 0;

    for (const name of names) {
      if (!name) continue;

      if (q.includes(name) || name.includes(q)) {
        best = Math.max(best, 100);
      }

      const qWords = q.split(" ");
      const nameWords = name.split(" ");

      let matched = 0;

      qWords.forEach(qWord => {
        if (!qWord || qWord.length < 2) return;

        nameWords.forEach(nWord => {
          if (
            nWord.includes(qWord) ||
            qWord.includes(nWord) ||
            levenshtein(qWord, nWord) <= 2
          ) {
            matched++;
          }
        });
      });

      const ratio =
        matched / Math.max(1, Math.min(qWords.length, nameWords.length));

      best = Math.max(best, ratio * 80);
    }

    return best;
  }

  function findMenuMatches(text) {
    const results = MENU
      .map(item => ({
        item,
        score: itemScore(text, item)
      }))
      .filter(result => result.score >= 45)
      .sort((a, b) => b.score - a.score);

    return results;
  }

  // --------------------------------------------------
  // SPECIAL ITEM ALIASES
  // --------------------------------------------------

  function aliasMatch(text) {
    const value = normalize(text);

    const aliases = [
      {
        words: ["double chicken", "double chikn", "dubl chikn", "دبل دجاج"],
        id: "double-chicken-cheese-burger"
      },
      {
        words: ["nuggets", "negets", "naggets", "ناجتس"],
        id: "regular-nuggets"
      },
      {
        words: ["crispy cheese fries", "kricpo friz jubn", "كريسبي جبن"],
        id: "crispy-cheese-fries"
      },
      {
        words: ["crispy fries", "kricpo friz", "بطاطس مقرمشة"],
        id: "crispy-fries"
      },
      {
        words: ["cheese chicken strips", "مسحب", "مسحب جبن", "ستربس"],
        id: "cheese-chicken-strips"
      },
      {
        words: ["shrimp", "روبيان", "ربيان", "جمبري"],
        id: "shrimp"
      },
      {
        words: ["cheese shrimp", "روبيان جبن", "روبيان بالجبن"],
        id: "cheese-shrimp"
      },
      {
        words: ["pepsi", "بيبسي"],
        id: "pepsi"
      },
      {
        words: ["water", "pani", "pani", "ماء", "موية"],
        id: "water"
      },
      {
        words: ["zinger burger", "zinger cheese burger", "زنجر برجر"],
        id: "zinger-cheese-burger"
      },
      {
        words: ["zinger roll", "زنجر رول", "رول زنجر"],
        id: "zinger-cheese-roll"
      }
    ];

    for (const alias of aliases) {
      if (alias.words.some(word => value.includes(normalize(word)))) {
        return getMenuItemById(alias.id);
      }
    }

    return null;
  }

  function findBestItem(text) {
    const alias = aliasMatch(text);

    if (alias) return alias;

    const matches = findMenuMatches(text);

    return matches.length ? matches[0].item : null;
  }

  // --------------------------------------------------
  // ITEM RESPONSE
  // --------------------------------------------------

  function itemPriceResponse(item, quantity) {
    if (state.language === "ar") {
      return `تمت إضافة ${item.arabic} × ${quantity} بسعر ${formatMoney(item.price * quantity)}.`;
    }

    if (state.language === "ur") {
      return `${item.name} × ${quantity} order mein add kar diya gaya hai — ${formatMoney(item.price * quantity)}.`;
    }

    return `${item.name} × ${quantity} added — ${formatMoney(item.price * quantity)}.`;
  }

  // --------------------------------------------------
  // SPECIAL QUESTIONS
  // --------------------------------------------------

  function asksLocation(text) {
    const value = normalize(text);

    return [
      "location",
      "where are you",
      "address",
      "map",
      "google maps",
      "لوكيشن",
      "موقع",
      "العنوان",
      "location kahan",
      "kahan ho",
      "address kya hai"
    ].some(word => value.includes(normalize(word)));
  }

  function asksHours(text) {
    const value = normalize(text);

    return [
      "hours",
      "opening hours",
      "open",
      "closing",
      "timing",
      "وقت",
      "اوقات",
      "ساعات",
      "متى تفتح",
      "متى تقفل",
      "timing kya hai",
      "kitne baje"
    ].some(word => value.includes(normalize(word)));
  }

  function asksWhatsApp(text) {
    const value = normalize(text);

    return [
      "whatsapp",
      "واتساب",
      "واٹس ایپ"
    ].some(word => value.includes(normalize(word)));
  }

  function asksMenu(text) {
    const value = normalize(text);

    return [
      "menu",
      "list",
      "items",
      "قائمة",
      "منيو",
      "menu bhejo",
      "menu dikhao"
    ].some(word => value.includes(normalize(word)));
  }

  // --------------------------------------------------
  // MENU DISPLAY
  // --------------------------------------------------

  function showMenu() {
    if (!chat) return;

    const categories = {};

    MENU.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }

      categories[item.category].push(item);
    });

    Object.entries(categories).forEach(([category, items]) => {
      const block = document.createElement("div");
      block.className = "menu-block";

      const title = document.createElement("strong");
      title.textContent = category;

      block.appendChild(title);

      items.forEach(item => {
        const row = document.createElement("div");
        row.className = "menu-row";

        const name = state.language === "ar"
          ? item.arabic
          : item.name;

        row.textContent = `${name} — ${formatMoney(item.price)}`;

        block.appendChild(row);
      });

      chat.appendChild(block);
    });

    chat.scrollTop = chat.scrollHeight;
  }

  // --------------------------------------------------
  // MAIN PROCESSOR
  // --------------------------------------------------

  function processMessage(rawText) {
    const text = String(rawText || "").trim();

    if (!text) return;

    rememberLanguage(text);

    state.conversation.push({
      role: "user",
      text,
      language: state.language,
      time: Date.now()
    });

    // Cancellation always has priority.
    if (isCancellation(text)) {
      if (
        state.currentOrder.length ||
        state.confirmedOrder.length
      ) {
        clearOrder();
        addMessage(t("cancelled"));
      } else {
        addMessage(t("noOrder"));
      }

      return;
    }

    // If waiting for WhatsApp permission,
    // "yes/send" means WhatsApp permission.
    if (
      state.orderState === "WAITING_FOR_WHATSAPP_PERMISSION" &&
      isWhatsAppPermission(text)
    ) {
      showWhatsAppButton();
      addMessage(t("whatsappReady"));
      return;
    }

    // Finish order.
    if (isFinishPhrase(text)) {
      finishOrder();
      return;
    }

    // Location.
    if (asksLocation(text)) {
      addMessage(t("location"));

      addButton(
        "📍 Open Location in Google Maps",
        () => {
          window.open(
            RESTAURANT_DATA.location.mapsUrl,
            "_blank"
          );
        }
      );

      return;
    }

    // Hours.
    if (asksHours(text)) {
      addMessage(t("hours"));
      return;
    }

    // General WhatsApp contact.
    if (asksWhatsApp(text) && state.orderState !== "WAITING_FOR_WHATSAPP_PERMISSION") {
      addMessage(t("contact"));

      addButton(
        "📲 Chat with us on WhatsApp",
        () => {
          window.open(
            RESTAURANT_DATA.whatsapp.url,
            "_blank"
          );
        }
      );

      return;
    }

    // Menu.
    if (asksMenu(text)) {
      showMenu();
      return;
    }

    // Find food item.
    const item = findBestItem(text);

    if (item) {
      const quantity = extractQuantity(text);

      addToOrder(item, quantity);

      // If customer was modifying a confirmed order,
      // return to active ordering state.
      if (state.confirmedOrder.length) {
        state.confirmedOrder = [];
        state.orderState = "ADDING_ITEMS";

        chat?.querySelectorAll(".whatsapp-order-action")
          .forEach(el => el.remove());
      }

      addMessage(itemPriceResponse(item, quantity));
      addMessage(t("more"));

      return;
    }

    // Default.
    addMessage(t("unknown"));
  }

  // --------------------------------------------------
  // SEND
  // --------------------------------------------------

  function sendMessage() {
    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    processMessage(text);
  }

  // --------------------------------------------------
  // VOICE INPUT
  // --------------------------------------------------

  function setupVoice() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition || !voiceButton) {
      if (voiceButton) {
        voiceButton.style.display = "none";
      }

      return;
    }

    state.recognition = new SpeechRecognition();

    state.recognition.continuous = false;
    state.recognition.interimResults = false;

    // Browser will try to understand the customer's language.
    state.recognition.lang = "en-US";

    state.recognition.onstart = () => {
      state.listening = true;
      voiceButton.textContent = "🎙️ Listening...";
    };

    state.recognition.onresult = (event) => {
      const result =
        event.results?.[0]?.[0]?.transcript || "";

      if (!result) return;

      if (input) {
        input.value = result;
      }

      sendMessage();
    };

    state.recognition.onerror = () => {
      state.listening = false;
      voiceButton.textContent = "🎙️";
    };

    state.recognition.onend = () => {
      state.listening = false;
      voiceButton.textContent = "🎙️";
    };

    voiceButton.addEventListener("click", () => {
      if (state.listening) {
        state.recognition.stop();
        return;
      }

      try {
        state.recognition.start();
      } catch (error) {
        console.warn("Voice recognition:", error);
      }
    });
  }

  // --------------------------------------------------
  // MENU / LOCATION BUTTONS
  // --------------------------------------------------

  function setupButtons() {
    sendButton?.addEventListener("click", sendMessage);

    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });

    menuButton?.addEventListener("click", () => {
      showMenu();
    });

    locationButton?.addEventListener("click", () => {
      window.open(
        RESTAURANT_DATA.location.mapsUrl,
        "_blank"
      );
    });

    whatsappButton?.addEventListener("click", () => {
      window.open(
        RESTAURANT_DATA.whatsapp.url,
        "_blank"
      );
    });
  }

  // --------------------------------------------------
  // INIT
  // --------------------------------------------------

  function init() {
    setupButtons();
    setupVoice();

    if (chat && !chat.children.length) {
      addMessage(t("welcome"));
    }
  }

  // Public API
  window.CharcoalBurgerAI = {
    state,
    processMessage,
    sendMessage,
    clearOrder,
    showMenu,
    sendConfirmedOrderToWhatsApp
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

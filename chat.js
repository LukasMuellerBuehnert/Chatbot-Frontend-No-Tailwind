// API endpoint of the backend
const API_URL = "https://chatbot-java-script-backend.vercel.app/api/chat";

// Language detection from URL parameter ?lang=xx
const urlLang = new URLSearchParams(location.search).get("lang")?.toLowerCase() || "";
const SUPPORTED_LANGS = ["de","en","fr","es","it","el"]; // extendable list
const PAGE_LANG = SUPPORTED_LANGS.includes(urlLang) ? urlLang : "en"; // fallback to English

// Greeting messages by language
const GREETINGS = {
  de: "Hi! Wie kann ich helfen?",
  en: "Hi! How can I help?",
  fr: "Salut ! Comment puis-je aider ?",
  es: "¡Hola! ¿En qué puedo ayudar?",
  it: "Ciao! Come posso aiutarti?",
  el: "Γεια! Πώς μπορώ να βοηθήσω;"
};

// DOM element references
const chatBox   = document.getElementById("chat");
const form      = document.getElementById("form");
const input     = document.getElementById("msg");
const sendBtn   = document.getElementById("sendBtn");
const chatWin   = document.getElementById("chatWindow");
const chatTgl   = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");

// Add a message bubble to the chat window
function addMessage(text, who) {
  const row = document.createElement("div");
  row.className = `cb-row ${who === "user" ? "user" : "bot"}`;
  const bubble = document.createElement("div");
  bubble.className = `cb-bubble ${who === "user" ? "user" : "bot"}`;
  bubble.textContent = text;
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a message to the backend
async function sendMessage(text) {
  addMessage(text, "user");
  input.value = "";
  input.disabled = true; sendBtn.disabled = true;

  // temporary "typing…" indicator
  const typing = document.createElement("div");
  typing.className = "cb-typing";
  typing.textContent = "Bot is typing…";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    typing.remove();
    addMessage(data.answer || "Error.", "bot");
    if (data.debug) console.log("[DEBUG]", data.debug);
  } catch {
    typing.remove();
    addMessage("Network error or CORS blocked.", "bot");
  } finally {
    input.disabled = false; sendBtn.disabled = false; input.focus();
  }
}

// Greet the user once at the beginning
function greetOnce() {
  if (!chatBox.dataset.greeted) {
    const msg = GREETINGS[PAGE_LANG] || GREETINGS.en; // fallback to English
    addMessage(msg, "bot");
    chatBox.dataset.greeted = "1";
  }
}

// Open and close handlers for the chat window
function openChat(){ chatWin.classList.remove("cb-hidden"); greetOnce(); input.focus(); }
function closeChat(){ chatWin.classList.add("cb-hidden"); }

chatTgl.addEventListener("click", () =>
  chatWin.classList.contains("cb-hidden") ? openChat() : closeChat()
);
chatClose.addEventListener("click", closeChat);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) sendMessage(text);
});

// Open chat automatically on load
//openChat();

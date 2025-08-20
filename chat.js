//const API_URL = "https://chatbotbackend-v5bj.onrender.com/chat";
const API_URL = "https://chatbot-java-script-backend.vercel.app/api/chat";

const chatBox   = document.getElementById("chat");
const form      = document.getElementById("form");
const input     = document.getElementById("msg");
const sendBtn   = document.getElementById("sendBtn");
const chatWin   = document.getElementById("chatWindow");
const chatTgl   = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");

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

async function sendMessage(text) {
  addMessage(text, "user");
  input.value = "";
  input.disabled = true; sendBtn.disabled = true;

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
    addMessage(data.answer || "Fehler.", "bot");
    if (data.debug) console.log("[DEBUG]", data.debug);
  } catch {
    typing.remove();
    addMessage("Netzwerkfehler oder CORS blockiert.", "bot");
  } finally {
    input.disabled = false; sendBtn.disabled = false; input.focus();
  }
}

function greetOnce() {
  if (!chatBox.dataset.greeted) {
    addMessage("Hi! Wie kann ich helfen?", "bot");
    chatBox.dataset.greeted = "1";
  }
}

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

// Start geöffnet
openChat();

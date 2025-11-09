const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, "user");
  userInput.value = "";

  // temporary "Thinking..." message
  const thinkingMsg = appendMessage("Thinking...", "bot");

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    // remove "Thinking..." message
    chatBox.removeChild(thinkingMsg);

    // 🟢 show text response (if any)
    if (data.reply) {
      appendMessage(data.reply, "bot");
    }

    // 🟡 show generated image (if Gemini returns base64 image)
    if (data.image) {
      const img = document.createElement("img");
      img.src = `data:image/png;base64,${data.image}`;
      img.alt = "Generated Image";
      img.style.maxWidth = "400px";
      img.style.borderRadius = "12px";
      img.style.margin = "10px 0";
      img.style.display = "block";
      chatBox.appendChild(img);
    }

  } catch (error) {
    console.error(error);
    chatBox.removeChild(thinkingMsg);
    appendMessage("Error: Could not connect to the server.", "bot");
  }
}

// helper function to display messages
function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // Detect and render code blocks like ```js ... ```
  const formatted = text
    // Detect ```lang\n code \n``` patterns and wrap in <pre><code>
    .replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${escapeHTML(code.trim())}</code></pre>`;
    })
    // Convert single backtick `inline code`
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Apply markdown-style bold/italic
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Replace newlines with <br> (for normal text)
    .replace(/\n/g, "<br>");

  msg.innerHTML = formatted;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Helper to safely escape HTML tags inside code blocks
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

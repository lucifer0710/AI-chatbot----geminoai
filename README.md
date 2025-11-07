# 🤖 AI Chatbot — Gemini-Powered Assistant

An interactive AI chatbot built using **Node.js**, **Express**, and the **Google Gemini API**.  
It intelligently selects the best Gemini model based on the user’s prompt — whether it’s text, image, or audio generation.

---

## ✨ Features
- 💬 Real-time chat interface (frontend + backend)
- ⚡ Automatic Gemini model selection based on prompt
- 🧠 Supports **text**, **image**, and **voice** generation
- 🧩 Secure environment variable handling with `.env`
- 🖥️ Fully local setup — no deployment required
- 🎨 Clean and responsive UI

---

## 🧰 Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **AI Model** | Google Gemini API |
| **Security** | dotenv for environment variables |

---

## 🚀 Setup Instructions

Follow the steps below to run this project locally on your system 👇

---

### 🪜 Step 1: Clone this Repository

```bash
git clone https://github.com/your-username/aichatbot.git
cd aichatbot
```

### 🧩 Step 2: Install Dependencies

```bash
npm install
```
#### This will install
- express
- body-parser
- cors
- dotenv
- node-fetch

### 🔑 Step 3: Create and Configure the .env File

Create a new file in the root directory of your project named .env and add your Gemini API key like this:
```bash
touch .env
```
Then open .env and paste your API key:
```bash
GEMINI_API_KEY=YourRealGeminiKeyHere
```
### ⚙️ Step 4: Run the Server

Now start the backend server using the command:
```bash
npm start
```
If everything is configured correctly, you’ll see the following output in your terminal:
```bash
[dotenv@17.2.3] injecting env (1) from .env
Loaded Gemini API Key: ✅ Found
✅ Server running on http://localhost:3000
```
### 🌐 Step 5: Open in Browser

Once the server is running, open your web browser and go to:
```bash
http://localhost:3000
```
#### You should now see your AI chatbot interface.
Try typing prompts like:
- Define array
- Draw an image of iron man
- C code for bubble sort
- Draw an image of Ronaldo tackling messi
  

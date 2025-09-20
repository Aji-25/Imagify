# Imagify 🎨

Imagify is a full-stack AI image generation app built with **React (Vite)**, **Node.js/Express**, and **MongoDB**.  
It allows users to register/login, generate AI images from text prompts, manage credits, and view/download history.  
The app integrates the **ClipDrop API** for text-to-image generation and can optionally use **Google Gemini API** for refining prompts.

---

## ✨ Features
- 🔑 **User Authentication** (JWT-based) with login & signup  
- 🎨 **AI Image Generation** via [ClipDrop API](https://clipdrop.co/apis)  
- 🤖 **Prompt Refinement** (optional) using [Google Gemini](https://ai.google.dev/)  
- 💳 **Credit System** – each generation costs 1 credit  
- 📜 **History Tracking** – view & download generated images  
- ⚡ **Modern Tech Stack** – React frontend + Express backend + MongoDB Atlas  

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS  
- **Backend**: Node.js, Express.js, Mongoose  
- **Database**: MongoDB Atlas  
- **APIs**: ClipDrop (image generation), Gemini (prompt enhancement)  

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/imagify.git
cd imagify

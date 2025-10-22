# 🕶️ Decode GenZ AI — Chrome Extension

### Decode GenZ slang and chat abbreviations with AI ⚡

**Decode GenZ AI** is an intelligent Chrome Extension that helps you instantly understand modern slang, abbreviations, and chat terms.  
Powered by **Google Gemini** and **Qdrant Vector Search**, it uses **Retrieval-Augmented Generation (RAG)** to give *context-aware, AI-generated meanings and examples* — not just static definitions.

---

## 🧠 How It Works

```mermaid
flowchart TD
    A[User Query Input] --> B[Frontend (popup.js)]
    B --> C[Backend API (Express.js)]
    C --> D[GenAI Service (Gemini API)]
    C --> E[Qdrant Vector DB]
    E --> D
    D --> F[AI Response + Context]
    F --> B
    B --> G[Display Results to User]


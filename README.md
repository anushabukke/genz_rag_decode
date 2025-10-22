# 🕶️ Decode GenZ AI — Chrome Extension

### Decode GenZ slang and chat abbreviations with AI ⚡

**Decode GenZ AI** is an intelligent Chrome Extension that helps you instantly understand modern slang, abbreviations, and chat terms.  
Powered by **Google Gemini** and **Qdrant Vector Search**, it uses **Retrieval-Augmented Generation (RAG)** to give *context-aware, AI-generated meanings and examples* — not just static definitions.

---

## 🧠 How It Works

```mermaid
flowchart TD
    A[User enters slang in Chrome Extension] --> B[Frontend (popup.js)]
    B -->|POST /slang/query| C[Express Backend]
    C --> D[Gemini Embedding Model]
    D --> E[Qdrant Vector DB]
    E --> F[Retrieve Top 3 Context Matches]
    F --> G[Gemini Flash Model]
    G --> H[AI-Generated Meaning & Example]
    H --> I[Result displayed in Extension UI]

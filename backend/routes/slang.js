import express from "express";
import { getEmbedding, generateFromContext } from "../services/genai.js";
import { searchCollection, upsertPoints, initCollection } from "../services/qdrant.js";
import fs from "fs";
import cosineSimilarity from "compute-cosine-similarity";

const router = express.Router();
const collectionName = "slang";

// Load KB
const kb = JSON.parse(fs.readFileSync("data/slangKB.json"));
let kbEmbeddings = [];

async function initKB() {
    if (kbEmbeddings.length > 0) return;

    const vectorSize = 3072; 
    await initCollection(collectionName, vectorSize);

    kbEmbeddings = [];
    for (let i = 0; i < kb.length; i++) {
        const emb = await getEmbedding(kb[i].term);
        kbEmbeddings.push({ ...kb[i], embedding: emb });
    }

    // into Qdrant
    const points = kbEmbeddings.map((item, idx) => ({
        id: idx + 1,
        vector: item.embedding,
        payload: { term: item.term, meaning: item.meaning, example: item.example }
    }));
    await upsertPoints(collectionName, points);
    console.log("KB embeddings initialized.");
}
initKB();


// sample data  -- yeah it is 
router.get("/trending", (req, res) => {
    const trending = [
        { term: "frfr", meaning: "for real", source: "TikTok" },
        { term: "cap", meaning: "lie", source: "Twitter" },
        { term: "slaps", meaning: "really good", source: "Spotify" },
    ];
    res.json({ trending });
});

// the main api yeet
router.post("/query", async (req, res) => {
    try {
        const { query, style } = req.body;
        if (!query) return res.status(400).json({ error: "Query text required" });

        const queryEmb = await getEmbedding(query);

        const similarities = kbEmbeddings.map(item => ({
            ...item,
            score: cosineSimilarity(queryEmb, item.embedding)
        }));

        const topItems = similarities.sort((a, b) => b.score - a.score).slice(0, 3);

        const context = topItems.map(i => `${i.term}: ${i.meaning} Example: ${i.example}`).join("\n");

        let prompt = `Query: ${query}\n\nRelevant Slang Info:\n${context}\n\nAnswer the query using the above information.`;
        if (style === "genz") prompt += "\nAnswer in a fun Gen Z style!";
        if (style === "english") prompt += "\nAnswer in clear English.";

        const responseText = await generateFromContext(prompt);

        res.json({ query, context: topItems, response: responseText });

    } catch (err) {
        console.error("RAG error:", err);
        res.status(500).json({ error: err.message });
    }
});


export default router;

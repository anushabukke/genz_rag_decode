import { QdrantClient } from "@qdrant/js-client-rest";

export const client = new QdrantClient({ url: "http://localhost:6333" });

// Initialize collection if not exists
export async function initCollection(collectionName, vectorSize) {
    const collections = await client.getCollections();
    const exists = collections.result?.collections?.some(c => c.name === collectionName);

    if (!exists) {
        await client.recreateCollection(collectionName, {
            vectors: { size: vectorSize, distance: "Cosine" }
        });
        console.log(`Collection "${collectionName}" created.`);
    } else {
        console.log(`Collection "${collectionName}" already exists.`);
    }
}

// Upsert points
export async function upsertPoints(collectionName, points) {
    await client.upsert(collectionName, { points });
}

// Search by embedding
export async function searchCollection(collectionName, vector, top = 3) {
    const results = await client.search(collectionName, { vector, limit: top });
    return results;
}

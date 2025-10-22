const searchBtn = document.getElementById("searchBtn");
const queryInput = document.getElementById("queryInput");
const styleSelect = document.getElementById("styleSelect");
const resultsDiv = document.getElementById("results");
const trendingDiv = document.getElementById("trending");

// Load trending slang
async function loadTrending() {
    try {
        const res = await fetch("http://localhost:5000/slang/trending");
        const data = await res.json();
        trendingDiv.innerHTML = data.trending.map(t => `- <strong>${t.term}</strong>: ${t.meaning} (${t.source})`).join("<br>");
    } catch {
        trendingDiv.innerHTML = "Could not load trending slang.";
    }
}
loadTrending();

// Search button
searchBtn.addEventListener("click", async () => {
    const query = queryInput.value.trim();
    const style = styleSelect.value;
    if (!query) return alert("Please enter a term.");

    resultsDiv.innerHTML = "Searching... 🔍";

    try {
        const res = await fetch("http://localhost:5000/slang/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, style })
        });

        const data = await res.json();
        if (data.error) {
            resultsDiv.innerHTML = ` Error: ${data.error}`;
            return;
        }

        const { response, context } = data;
        let html = `<strong>AI Response:</strong> ${response}<br/><br/>`;
        html += "<strong>Top entries from KB:</strong><br/>";
        context.forEach(item => {
            html += `- <em>${item.term}</em>: ${item.meaning} (Example: ${item.example})<br/>`;
        });

        resultsDiv.innerHTML = html;

    } catch (err) {
        resultsDiv.innerHTML = `Error: ${err.message}`;
    }
});

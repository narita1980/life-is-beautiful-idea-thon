const fetch = require("node-fetch");

module.exports = async (req, res) => {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Vercel環境変数から値を取得
    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

    try {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GitHub API Error:", errorText);
            throw new Error("Failed to fetch access token");
        }

        const text = await response.text();
        const params = new URLSearchParams(text);
        const accessToken = params.get("access_token");

        if (!accessToken) {
            throw new Error("Access token not found");
        }

        res.json({ access_token: accessToken });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to fetch GitHub token" });
    }
};

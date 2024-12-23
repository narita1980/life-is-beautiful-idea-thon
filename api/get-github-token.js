const fetch = require("node-fetch");

module.exports = async (req, res) => {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const clientId = "YOUR_GITHUB_APP_CLIENT_ID"; // GitHubアプリのクライアントID
    const clientSecret = "YOUR_GITHUB_APP_CLIENT_SECRET"; // GitHubアプリのクライアントシークレット

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

        const text = await response.text();
        const params = new URLSearchParams(text);
        const accessToken = params.get("access_token");

        if (!accessToken) {
            throw new Error("Failed to retrieve access token");
        }

        res.json({ access_token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch GitHub token" });
    }
};

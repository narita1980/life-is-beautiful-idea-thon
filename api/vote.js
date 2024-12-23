const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        // GitHub APIを使用して投票を処理
        const response = await fetch('https://api.github.com/repos/snakajima/life-is-beautiful/issues/1/reactions', {
            method: 'POST',
            headers: {
                'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
                'Accept': 'application/vnd.github.squirrel-girl-preview+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: '+1' })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API Error:', errorText);
            throw new Error('Failed to vote');
        }

        res.status(200).json({ message: 'Vote successful' });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to vote' });
    }
};
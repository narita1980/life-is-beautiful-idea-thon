const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const response = await fetch('https://api.github.com/repos/snakajima/life-is-beautiful/issues');
        if (!response.ok) throw new Error('Failed to fetch issues');

        const issues = await response.json();
        const likeCount = issues.reduce((count, issue) => count + issue.reactions['+1'], 0);

        res.json({ likeCount });
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).json({ error: 'Failed to fetch like count' });
    }
};
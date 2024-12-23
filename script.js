const clientId = "Ov23liwSFqyNMRJp5FCu"; // GitHubアプリのクライアントID
const redirectUri = "https://life-is-beautiful-idea-thon.vercel.app/"; // VercelのデプロイURL
const jsonUrl = "issues.json"; // GitHub Pagesにデプロイされているデータ
const repoOwner = "snakajima"; // リポジトリオーナー
const repoName = "life-is-beautiful"; // リポジトリ名

function getAccessToken() {
    return sessionStorage.getItem("github_access_token");
}

function loginWithGitHub() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=public_repo`;
    window.location.href = githubAuthUrl;
}

function handleRedirectCallback() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    if (code) {
        fetchAccessToken(code);
    }
}

async function fetchAccessToken(code) {
    try {
        const response = await fetch("/api/get-github-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, redirectUri })
        });

        if (!response.ok) throw new Error("アクセストークンの取得に失敗しました");

        const data = await response.json();
        sessionStorage.setItem("github_access_token", data.access_token);
        window.location.href = redirectUri; // トークン取得後にリダイレクト
    } catch (error) {
        console.error(error);
        alert("アクセストークンの取得に失敗しました。");
    }
}
async function fetchAndDisplayIdeas() {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error("データの取得に失敗しました");

        const ideas = await response.json();
        displayIdeas(ideas);
    } catch (error) {
        console.error(error);
        document.getElementById("idea-list").innerText = "アイデアの取得中にエラーが発生しました。";
    }
}

function displayIdeas(ideas) {
    const listElement = document.getElementById("idea-list");
    listElement.innerHTML = "";

    ideas.forEach(idea => {
        const listItem = document.createElement("div");
        listItem.innerHTML = `
            <h3>エントリーNo: ${idea.number} - ${idea.title}</h3>
            <p>${idea.body.substring(0, 100)}...</p>
            <button onclick="vote(${idea.number})">いいね</button>
        `;
        listElement.appendChild(listItem);
    });
}

async function vote(issueNumber) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        alert("いいねするにはログインが必要です。");
        loginWithGitHub();
        return;
    }

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}/comments`;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body: "👍 いいね！" })
        });

        if (response.ok) {
            alert("投票が完了しました！");
        } else {
            throw new Error("投票に失敗しました。");
        }
    } catch (error) {
        console.error(error);
        alert("エラーが発生しました。もう一度お試しください。");
    }
}

async function fetchLikeCount() {
    try {
        const response = await fetch('/api/get-like-count');
        if (!response.ok) throw new Error('Failed to fetch like count');

        const data = await response.json();
        document.getElementById('like-count-value').textContent = data.likeCount;

        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleString();
    } catch (error) {
        console.error('Error fetching like count:', error);
    }
}

async function vote() {
    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ /* 必要なデータをここに追加 */ })
        });

        if (!response.ok) throw new Error('Failed to vote');

        // 投票後にいいねの数を再取得
        fetchLikeCount();
    } catch (error) {
        console.error('Error voting:', error);
    }
}

// ページ読み込み時にいいねの数を取得して表示
document.addEventListener('DOMContentLoaded', fetchLikeCount);

// 投票ボタンのクリックイベントを設定
document.getElementById('vote-button').addEventListener('click', vote);

handleRedirectCallback();
fetchAndDisplayIdeas();

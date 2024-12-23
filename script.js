const jsonUrl = "issues.json"; // issues.jsonのURL（GitHub Pagesにデプロイされているもの）
const repoOwner = "snakajima"; // リポジトリのオーナー
const repoName = "life-is-beautiful"; // リポジトリ名

// JSONファイルからIssueデータを取得して表示
async function fetchAndDisplayIdeas() {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error("データの取得に失敗しました。");
        }
        const ideas = await response.json();
        displayIdeas(ideas);
    } catch (error) {
        console.error(error);
        document.getElementById("idea-list").innerText = "アイデアの取得中にエラーが発生しました。";
    }
}

// アイデアをHTMLに表示
function displayIdeas(ideas) {
    const listElement = document.getElementById("idea-list");
    listElement.innerHTML = "";

    ideas.forEach(idea => {
        const ideaCard = document.createElement("div");
        ideaCard.className = "col-md-6";

        ideaCard.innerHTML = `
            <div class="card idea-card">
                <div class="card-body">
                    <h5 class="card-title">${idea.title}</h5>
                    <p class="card-text">${idea.body.substring(0, 100)}...</p>
                    <p class="card-text">
                        <small class="text-muted">投票数: <span id="vote-count-${idea.number}">${idea.comments}</span></small>
                    </p>
                    <button class="btn btn-primary btn-sm vote-button" onclick="vote(${idea.number})">いいね</button>
                </div>
            </div>
        `;

        listElement.appendChild(ideaCard);
    });
}

// 投票（いいね）ボタンを押したときの処理
async function vote(issueNumber) {
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}/comments`;
    const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // GitHubトークンを記載（安全に管理する方法を推奨）

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body: "👍 いいね！" })
        });

        if (response.ok) {
            alert("投票が完了しました！");
            const voteCountElement = document.getElementById(`vote-count-${issueNumber}`);
            voteCountElement.textContent = parseInt(voteCountElement.textContent) + 1; // 投票数を更新
        } else {
            throw new Error("投票に失敗しました。");
        }
    } catch (error) {
        console.error(error);
        alert("エラーが発生しました。もう一度お試しください。");
    }
}

// ページ読み込み時にアイデアを表示
fetchAndDisplayIdeas();

# 🤖 迷わない！AIツールの選び方フローチャート

「今、どのAIを使えばいいの？」と迷った時に見るチャートです。
（Mermaid記法で書かれているので、Obsidianで見ると綺麗な図になります！）

```mermaid
graph TD
    Start[🚀 何を作りたい？] --> Text[📝 文章・調査]
    Start --> Image[🎨 画像・デザイン]
    Start --> Slide[📊 資料・Web]
    Start --> Brain[🧠 思考整理]

    %% 文章・調査
    Text --> Search{ネット検索が必要？}
    Search -- YES --> GS[🔍 Genspark / Perplexity]
    Search -- NO --> GPT[🤖 ChatGPT / Claude]
    
    GS --> GS_Desc[最新情報のまとめ<br>LP構成案]
    GPT --> GPT_Desc[メール作成<br>要約・翻訳]

    %% 画像・デザイン
    Image --> Type{欲しいものは？}
    Type -- 図解・チャート --> Napkin[✏️ Napkin.ai]
    Type -- チラシ・名刺 --> Canva[✨ Canva]
    Type -- イラスト・写真 --> MJ[🖼️ Gemini / Midjourney]

    %% 資料・Web
    Slide --> Output{アウトプット形式}
    Output -- スライド(PPT) --> Gamma[⚡ Gamma]
    Output -- Webページ(LP) --> Mix[🌐 Genspark + 私]
    
    Gamma --> Gamma_Desc[プレゼン資料<br>一瞬で完成]
    Mix --> Mix_Desc[構成をAIで作り<br>実装を依頼]

    %% 思考整理
    Brain --> Obsidian[💎 Obsidian + 私]
    Obsidian --> Obs_Desc[日誌・アイデア<br>誰にも見せない脳]

    %% スタイル
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef ai fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef start fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    
    class GS,GPT,Napkin,Canva,MJ,Gamma,Mix,Obsidian ai;
    class Start start;
```

## 🎯 ケース別おすすめパターン

### 1. 「上司に提出する調査レポートを作りたい！」
*   **ルート**: 文章・調査 -> 検索あり -> **Genspark**
*   **理由**: ネットの最新情報を踏まえて、根拠のあるレポートを作ってくれるから。

### 2. 「明日の会議のプレゼン資料がない！ヤバい！」
*   **ルート**: 資料・Web -> スライド -> **Gamma**
*   **理由**: タイトルを入れるだけで、数分でスライド一式が完成するから。

### 3. 「文字ばかりの資料で分かりにくいと言われた…」
*   **ルート**: 画像・デザイン -> 図解 -> **Napkin**
*   **理由**: 文章をコピペするだけで、分かりやすい図解やグラフにしてくれるから。

### 4. 「自分の考えがまとまらない…壁打ちしたい」
*   **ルート**: 思考整理 -> **Antigravity（私）**
*   **理由**: 文子さんの文脈を一番理解しているパートナーだから。

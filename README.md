# Discord-TTS-Bot
discordチャンネル上で発言されたメッセージを読み上げるBOTです

node.js, discord.js, docker, VOICEVOX 等を使用します

## Features
  - 各種スラッシュコマンドにより指定のVCへ参加します
  - 指定されたキーワードでGoogle検索(半実装)をします
  - 特定のメッセージが送信された際に自動で返信して会話を盛り上げます

## Commands
  - `/join` : VCに参加します
  - `/leave` : VCから退出します
  - `/google` : Google検索をします(半実装)

## How to install
1. [Node.js](https://nodejs.org/)をインストール(動作確認済: v22.13.1)
2. ライブラリをインストール
   ```
   npm i
   ```
3. `config.json`を作成
    ```
    {
	  "token": "BOTのtoken",
      "clientId": "BOTのclientId"
    }
    ```
4. [docker](https://www.docker.com/)をインストール
5. docker上でVOICEVOXをインストール,サーバ実行

    CPU
    ```
    docker pull voicevox/voicevox_engine:cpu-latest
    docker run --rm -it -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
    ```
    GPU
    ```
    docker pull voicevox/voicevox_engine:nvidia-latest
    docker run --rm --gpus all -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:nvidia-latest
    ```
6. 実行
    ```
    node src
    ```

#### 注意
discord developer portalのBOTの設定ページ内で下記の画像のように設定してください

でないと正常に動作しません
![image](https://github.com/user-attachments/assets/42b83ac7-f2f8-4f5d-8569-af75ad0f9b50)

## Issue
  なんかあればissuesなりPull requestなり送ってください

  (突貫工事で作ったためにまだまだ粗削りな部分が多いですが、今後修正&機能追加していく予定です)

## 今後実装予定の機能
- google検索(本実装)
- 正常に変換されないであろうものの処理
  - ローマ字表記をひらがなに変換して発音
    - リプライでひらがなに変換済文字列を送信
  - 絵文字を音声に（怒っている顔など）
- 語尾に「なのだ」をつけるモード（ずんだもん向け）
- softalk対応
  - 語尾に「だぜ」をつける（魔理沙向け）
- **各ユーザーごと、各サーバーごとに個別で声を選択＆保存**
- サーバーのごとの辞書登録
  - 辞書のエクスポート、インポート
- 入退出時に"ユーザー名+入退出しました"と発言
- **ファイルをストレージに保存せずにメモリ上に保存して再生**
- "健康に良くない"と送信された場合、[例の画像](https://pbs.twimg.com/media/Gh_Fkw0bgAEY6-Z.png)を送信

(**太字**は優先事項)

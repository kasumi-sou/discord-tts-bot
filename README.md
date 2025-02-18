# Discord-TTS-Bot

discordのテキストチャンネル上で発言されたメッセージをボイスチャンネルで読み上げるBOTです。

node.js, discord.js, docker, VOICEVOX 等を使用します。

## Features

- 各種スラッシュコマンドにより指定のVCへ参加
- 指定されたキーワードでGoogle検索(半実装)
- 特定のメッセージが送信された際に自動で返信して会話を盛り上げます

## Commands

- `/join` : ボイスチャンネルに参加
- `/leave` : ボイスチャンネルから退出
- `/set_voice` : ユーザーごとに声を設定
- `/help` : ヘルプを表示
- `/command` : 利用可能なコマンド一覧を表示
- `/avatar` : 指定したユーザーのアバター画像を表示
- `/google` : Google検索(半実装)

## How to install

1. FFmpegをインストール

    (winget経由の場合)

    ```
    winget install Gyan.FFmpeg
    ```

2. [Node.js](https://nodejs.org/)をインストール(動作確認済: v22.13.1)
3. ライブラリをインストール

   ```
   npm i
   ```

4. `config.json`を作成

    ```json
    {
   "token": "BOTのtoken",
      "clientId": "BOTのclientId"
    }
    ```

5. [docker](https://www.docker.com/)をインストール
6. docker上でVOICEVOXをインストール,サーバ実行

    CPU

    ```docker
    docker pull voicevox/voicevox_engine:cpu-latest
    docker run --rm -it -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
    ```

    GPU

    ```docker
    docker pull voicevox/voicevox_engine:nvidia-latest
    docker run --rm --gpus all -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:nvidia-latest
    ```

7. 実行

    ```
    node src
    ```

## How to Update

1. 以下のコマンドを実行

    ```sh
    # ソース更新
    git fetch
    git reset --hard "リリースタグ名"
    npm i

    # スラッシュコマンド更新
    node deploy-commands.js
    # 起動
    node src
    ```

## 注意

discord developer portalのBOTの設定ページ内で下記の画像のように設定してください。

でないと正常に動作しません。
![image](https://github.com/user-attachments/assets/42b83ac7-f2f8-4f5d-8569-af75ad0f9b50)

## Issue

  なんかあればissuesなりPull requestなり送ってください。

  (突貫工事で作ったためにまだまだ粗削りな部分が多いですが、今後修正&機能追加していく予定です)

## 今後実装予定の機能

- google検索(本実装)
- 正常に変換されないであろうものの処理
  - リプライでひらがなに変換済文字列を送信
- 語尾に「なのだ」をつけるモード（ずんだもん向け）
- softalk対応
  - 語尾に「だぜ」をつける（魔理沙向け）
- サーバーのごとの辞書登録
  - 辞書のエクスポート、インポート
- ユーザーごとに声のピッチ、速度などを変更可能に

(**太字**は優先事項)

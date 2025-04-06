# Discord-TTS-Bot

discordのテキストチャンネル上で発言されたメッセージをボイスチャンネルで読み上げるBOTです。

Node.js, Discord.js, Docker, VOICEVOX 等を使用します。

## Features

- VOICEVOX, AivisSpeech両エンジン対応
- スラッシュコマンドにより指定のVCへ参加
- 豊富なカスタマイズ要素
- ユーザーごとに声を設定
  - 声の詳細なオプションも設定可
- 辞書の登録/削除/表示/インポート/エクスポート
- 指定されたキーワードでGoogle検索(追加の設定必須)
- ずんだもんのように、語尾に`のだ！`を自動で付加するモード
- 特定のメッセージが送信された際に自動で返信して会話を盛り上げます
- 指定ユーザーのアバター画像を表示
- BOTをホストしているサーバーの情報を表示
- ステータスメッセージでコマンドを紹介

## Commands

### ボイス関連

- `/join` : ボイスチャンネルに参加
- `/leave` : ボイスチャンネルから退出
- `/set_voice` : ユーザーごとに声を設定
- `/set_intonation` : 全体の抑揚を設定します
- `/set_pitch` : 全体の声高を設定します
- `/set_speed` : 全体の話速を設定します
- `/set_volume` : 全体の音量を設定します
- `/voice` : 現在設定中のキャラクターと話し方を取得します
- `/ずんだもんモード` : ずんだもんモードを有効/無効にします
  - 送信したメッセージの最後に `のだ` を自動で付加し、読み上げます
- `/set_dictionary` : 読み上げ辞書を設定します
- `/remove_dictionary` : 読み上げ辞書を削除します
- `/import_dictionary` : 読み上げ辞書を登録します
- `/export_dictionary` : 登録済の読み上げ辞書を出力します
- `/dictionary` : 登録済の読み上げ辞書を表示します

### その他

- `/help` : ヘルプを表示
- `/command` : 利用可能なコマンド一覧を表示
- `/avatar` : 指定したユーザーのアバター画像を表示
- `/google` : Google検索(追加の設定必須(後述))
- `/license` : 本BOTの利用規約及びライセンスを表示
- `/google` : Google検索をします(本実装)(事前にGoogleSearchAPIの設定が必要)
- `/sys_info` : BOTをホストしているサーバーの情報を表示(`CPU`, `memory`, `GPU`のオプション有)(Docker環境下では一部オプションが正常動作しません)

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

4. `config.json` を作成

    ```json
    {
      "token": "BOTのtoken",
      "clientId": "BOTのclientId"
    }
    ```

5. [Docker](https://www.docker.com/)をインストール
6. VOICEVOXのインストール,サーバ起動

    Docker上でサーバーを起動する場合は以下の通りです。(Docker以外でも可)

    CPU

    ```docker
    docker pull voicevox/voicevox_engine:cpu-latest
    docker run --rm -it -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
    ```

    GPU(CUDA)

    ```docker
    docker pull voicevox/voicevox_engine:nvidia-latest
    docker run --rm --gpus all -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:nvidia-latest
    ```

    ※ GPU(CUDA)はNvidia製GPUでしか動作しません

7. 実行

    ```
    node src
    ```

### 追加設定(任意)

#### AivisSpeechのインストール&有効化

これをすることにより、AivisSpeech読み上げに対応します。

1. AivisSpeech インストール,サーバ起動

    Docker上でサーバーを起動する場合は以下の通りです。(Docker以外でも可)([詳細](https://github.com/Aivis-Project/AivisSpeech-Engine?tab=readme-ov-file#%E5%B0%8E%E5%85%A5%E6%96%B9%E6%B3%95))

    CPU

    ```docker
    docker pull ghcr.io/aivis-project/aivisspeech-engine:cpu-latest
    docker run --rm -p '10101:10101' \
      -v ~/.local/share/AivisSpeech-Engine:/home/user/.local/share/AivisSpeech-Engine-Dev \
      ghcr.io/aivis-project/aivisspeech-engine:cpu-latest
    ```

    GPU(CUDA)

    ```docker
    docker pull ghcr.io/aivis-project/aivisspeech-engine:nvidia-latest
    docker run --rm --gpus all -p '10101:10101' \
      -v ~/.local/share/AivisSpeech-Engine:/home/user/.local/share/AivisSpeech-Engine-Dev \
      ghcr.io/aivis-project/aivisspeech-engine:nvidia-latest
    ```

    ※ GPU(CUDA)はNvidia製GPUでしか動作しません

#### GoogleSearchAPIの設定

これをすることより `/google` コマンドが使用可能になります。

1. GoogleCustomSearchAPIキーとエンジンIDを取得します

    やり方が分からない場合、[ここ](https://qiita.com/zak_y/items/42ca0f1ea14f7046108c)の1章から3章を行ってください
2. `config.json` を変更

    ```json
    {
      "token": "BOTのtoken",
      "clientId": "BOTのclientId",
      "googleApiKey": "GoogleCustomSearchAPIキー",
      "engineId": "エンジンID"
    }
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

## Note

Discord Developer PortalのBOTの設定ページ内で下記の画像のように設定してください。

でないと正常に動作しません。
![image](https://github.com/user-attachments/assets/42b83ac7-f2f8-4f5d-8569-af75ad0f9b50)

## Issue

  なんかあればIssuesなりPull Requestなり送ってください。

  (突貫工事で作ったためにまだまだ粗削りな部分が多いですが、今後修正&機能追加していく予定です)

## Development Roadmap

- [x] google検索(本実装)
- [x] 正常に変換されないであろうものの処理
  - [x] ~~リプライでひらがなに変換済文字列を送信~~ (ボツ)
- [x] 語尾に「なのだ」をつけるモード（ずんだもん向け）
- [x] ~~softalk対応~~ (見送り(予算の都合上))
  - [x] ~~語尾に「だぜ」をつける（魔理沙向け）~~ (前述に伴い見送り)
- [x] サーバーのごとの辞書登録
  - [x] 辞書のエクスポート、インポート
- [x] ユーザーごとに声のピッチ、速度などを変更可能に
- [x] 声の確認機能
- [x] ステータス更新
- [ ] startコマンドとか実装（中途半端）
  - [ ] deployコマンド等も組み込み（中途半端）
- [ ] インストールをもっと簡単に
- [ ] GUIに対応
- [ ] より詳細な使用方法解説サイト
- [ ] サポートサーバー（将来的）
- [x] タイムアウト時にBOTがダウンしないように
- [x] 勝手にエラーにより落ちる問題の解決
- [ ] 再生中止コマンド
- [ ] Aivis音声モデルインストールコマンド(管理者オンリー)
- [ ] 利用可能な音声モデル(スタイル)一覧表示コマンド
- [x] aivis speech 未インストール/未起動時に `/set_voice` コマンド実行時にAivisSpeechのスタイルが候補に出てこないように
- [x] engineを起動していない場合 `/set_voice` コマンド実行時, 読み上げ時に `エンジンが起動していません` と送信
- [ ] インポート形式の拡充
- [ ] `/sys_info` のオプションをボタンで変更

(**太字**は優先事項)

# 更新履歴

# 0.2.0

## 機能追加

### ボイス関連

- `/set_voice` で各サーバー,各ユーザーごとに声を設定、保存可能に
- ボイスチャンネルにメンバーが入退出した際、読み上げで知らせます。
- ボイスチャンネルから誰もいなくなり、5分経過すると自動で退出します。
  - ただし、5分経過後にボイスチャンネルに他のメンバー参加している場合、参加し続けます。
- ローマ字で送信されたメッセージを日本語に変換して読み上げ
- スポイラーメッセージが送信された場合、`スポイラー`と読み上げ
- 添付ファイルつきのメッセージが送信された場合、読み上げの最後に`添付メッセージ`と追加
- `'`が文の最初に含まれていた場合、読み上げ対象から除外

### その他

- `/help` でヘルプ画面を、`/command` で利用可能なコマンド一覧を表示
  - アップデート後数日間は`/help`を実行した際、新着機能通知についても表示します。
- `/avatar` で指定したメンバーのアバター画像を返信
- `健康に良くない`と送信された場合、[この画像](https://i.imgur.com/fCAbCPu.png)を返信
- `そうはならんやろ`と送信された場合、[この画像](https://gyazo.com/a90d3aa5edf71c5e132f72d8a8254ce8/max_size/1000)を返信

## 機能変更・修正

- デフォルトの読み上げボイスを変更
- 一部の文字,絵文字の読み方を修正
- 生成音声をステレオからモノラルに変更
- 旧来の方式では生成した音声を一回保存し、再生後に削除していましたが、ファイルを保存せずにメモリ上に一時的にプールさせて再生させるようにしました。
  - これにより、応答速度が少し改善しました。
- メッセージのURL判定精度を改善
- ギルドやメンバーのデータの保存方法を変更
  - `data.js`だけでなく、`./.data/`内の`json`ファイルにも保存するようにしました。
    - これにより、botを再起動した際にも設定が揮発しなくなりました。
- 説明文を修正

## バグ修正

- 正常に読み上げられないものを修正

## その他の追加・変更

- 更新通知をbotが参加している全サーバーに一斉送信(`./utils/noticeUpdate.js`)
  - ただし、この機能を使用するにはシステムメッセージの送信チャンネルを設定している必要があります。

## 依存関係更新

無し

# 0.3.0

## 機能追加

### ボイス関連

- `/set_intonation` で全体の抑揚を設定します
- `/set_pitch` で全体の声高を設定します
- `/set_speed` で全体の話速を設定します
- `/set_volume` で全体の音量を設定します
- `/voice` で現在設定中のキャラクターと話し方を取得します
- `/ずんだもんモード` でずんだもんモードを有効/無効にします
  - 送信したメッセージの最後に `のだ` を自動で付加し、読み上げます
- `/set_dictionary` で読み上げ辞書を設定します
- `/remove_dictionary` で読み上げ辞書を削除します
- `/import_dictionary` で読み上げ辞書を登録します
- `/export_dictionary` で登録済の読み上げ辞書を出力します
- `/dictionary` で登録済の読み上げ辞書を表示します
- `AivisSpeech` に対応 (未インストールの場合選択不可)
- 既にオーディオプレイヤーがある場合それを再利用
- BOTの接続時とメンバーの接続時にボイスモデルを事前読み込み
- 事前に設定した辞書通りに読み上げするように変更

### その他

- `/license` で本BOTの利用規約及びライセンスを表示
- `/google` でGoogle検索をします(本実装)(事前にGoogleSearchAPIの設定が必要)
- `/sys_info` でBOTをホストしているサーバーの情報を表示(`CPU`, `memory`, `GPU`のオプション有)(Docker環境下では一部オプションが正常動作しない)

## 機能変更・修正

- ユーザーデータの保存形式を変更 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/94e9267cb923bff367d24ca934c94ac4497a5e63))
- 変換する文字列を追加 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/17dd3d210c139e9fbfc2c771752a5bfc4b5d0a95))
- バージョン情報を`package.json`から取得するように変更
- `dict` オブジェクトに`get`, `set`, `delete`, `import`, `export` メソッドを追加

## バグ修正

- 切断時に接続済ボイスチャンネルMapから完全に削除されないことがあるのを修正
- エラー発生時にBOTがダウンしないように修正
- 何らかの要因でボイスチャンネルから切断時に接続していたボイスチャンネルが見つからずエラーが発生するのを修正

## その他の追加・変更

- 厳格モードを使用
- ステータスを一定時間ごとに変更 (10秒)
- コメントを適宜追加
- npmスクリプトを設定
- vscodeデバッグプロファイルを設定 (`.vscode` フォルダ)
- ファイル構造を変更([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/0d1257ccfec16e969c23d5777835ba90b9cf9220))
- インデントをスペースに変更

## 依存関係更新

- discord.js 更新(`14.17.3` => `14.18.0`)([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/e7332e73872ba6ecca58d8091c44b687b0cd5ed7))
- axios 更新(`1.7.9` => `1.8.2`)([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/0fe256a155dd25a8f7dcf00c1691b5f06607ad05))
- ajv 追加([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/0c1392847dc8f3332c60b98315d2057273d3ca24))
- googleapis 追加 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/40836b164c2b627e6aa19bd6ebd7cd1005dc1761))

# 0.3.1

## バグ修正

## その他の追加・変更

- `package.json` のバージョンを `0.3.1` に変更 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/e9f86a404e7275f9ceeb467450513c1104eb8132))
- `updateEmbed.js` の更新 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/918e5a6d0306ddaeb0d1224871512c8b636b0980))
- `help.js` 内のアップデート通知有効期限を変更 ([詳細](https://github.com/kasumi-sou/discord-tts-bot/commit/cc516b5845d489a8b4692d061f7b93b23c8d1e04))

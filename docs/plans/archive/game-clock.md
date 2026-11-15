# game-clock: ゲーム内時間を画面に表示する（mod の動作実験）

- 作成: 2026-11-14 16:15 PST
- 状態: 完了（2026-11-14）。利用者がローカルのワールドで、画面の中央下に時刻が表示されることを確かめた
- 確かめていないこと: `/time set` での切り替え、チャットの 1 行が出たかどうか
- 手順の訂正: パックを有効にするボタンの表示は「有効化」ではなく「認証する」だった

## 目的・背景

このリポジトリで作った mod が統合版で実際に動くかを確かめる最初の実験。題材は「ゲーム内時間を画面に表示する」。見た目の素材が要らず、スクリプトが動けば画面で結果が分かる。

## 対象の版（2026-11-14 に確認）

| 項目 | 値 | 確かめ方 |
| --- | --- | --- |
| 統合版（安定版） | 1.26.63（パッケージの版 `1.26.6301.0`） | `Get-AppxPackage *Minecraft*` |
| `@minecraft/server` | 2.11.0（安定版の最新） | npm の `latest`。1.26.63 向けのベータは `2.12.0-beta.1.26.63-stable` で、安定版はその 1 つ前 |
| `manifest.json` の `format_version` | 2 | Microsoft Learn の manifest リファレンス。3 はまだプレビュー扱い |

使う API は 2.11.0 の型定義（`index.d.ts`）にあることを確かめた: `world.getDay()`、`world.getTimeOfDay()`、`world.getAllPlayers()`、`player.onScreenDisplay.setActionBar()`、`system.runInterval()`、`world.afterEvents.playerSpawn`。

## 対応方針

- ビヘイビアパックだけで作る。リソースパックは作らない
- 10 tick ごとに全プレイヤーのアクションバー（ホットバーの上）へ `N日目 HH:MM` を書く
  - 時刻 0 tick が朝 6:00、1000 tick が 1 時間
  - `world.getDay()` は 0 始まりなので、表示は 1 を足す
- 安定版の API だけを使う。ワールドの「ベータ API」の実験は要らないはず（公式の versioning のページでは、要るのは `-beta` 付きの版だけ）
- 最初の参加時にチャットへ 1 行出す。時計が見えないときに、スクリプトが動いていないのか表示だけの問題なのかを分けるため

## 構成

```
addons/game-clock/behavior_pack/
├── manifest.json
└── scripts/
    ├── main.js    ゲームの API を呼ぶ側
    └── clock.js   時刻の整形（API に依存しない）
tools/deploy.sh    development_behavior_packs へコピーする
```

## 影響範囲

- このリポジトリ: 上の新しいファイルと `TODO.md` / `DONE.md` / `CLAUDE.md`
- Windows 側: `…/Minecraft Bedrock/Users/Shared/games/com.mojang/development_behavior_packs/game-clock/` を新しく置く。既存のパックとワールドには触らない
- `~/minecraft-manager` には触らない

## テスト方針

- Step 1（済み）: `clock.js` の整形を Node で確認。0 / 6000 / 12000 / 18000 / 23999 tick などで期待どおり
- Step 2（済み）: `tools/deploy.sh game-clock` で開発用フォルダに配置
- Step 3（未）: ゲーム内での確認
  1. 統合版を起動し、実験用のワールドを新しく作る（既存の「マイ ワールド」を使うなら複製してから）
  2. ワールドの設定 → ビヘイビアパック → 「Game Clock」を有効にする
  3. 入ったらチャットに `[Game Clock] スクリプトが動いています` が出て、ホットバーの上に `1日目 06:00` のような表示が出る
  4. `/time set noon` で `12:00`、`/time set midnight` で `00:00` になる
  5. 出ないときは、設定 → クリエイター → コンテンツログを有効にしてエラーを見る

## 分かっている制約

- アクションバーは 1 つしかないので、他のパックやゲーム本体がアクションバーに書くと上書きし合う
- 表示の位置や大きさは変えられない。常時表示の HUD にするにはリソースパックで UI を定義する必要がある

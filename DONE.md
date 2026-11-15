# DONE

完了したタスクを、完了日（`YYYY-MM-DD`）を付けて記録する。

## 2026-11-14

- [x] 作った mod を Realms のワールドで動かす [plan](docs/plans/archive/realms-support.md)
  - [x] Step 1: Realms へ mod を入れる手順と、Realms での制限を調べる
    公式のヘルプは本文を読めず、検索の要約とゲームの言語ファイルで確かめた
  - [x] Step 2: 手順を決めて、必要な道具を作る（`tools/pack.sh`。結局は使わなかった）
  - [x] Step 3: `game-clock` 0.1.0 を Realm に入れて、表示を確かめる
    利用者が Realm Hub の「ワールドを編集」からパックを有効にし、「表示された」と報告した
  - [x] Step 4: 決まった手順を `CLAUDE.md` に書く

- [x] ゲーム内時間を画面に表示する mod で、mod が動くかを確かめる [plan](docs/plans/archive/game-clock.md)
  - [x] Step 1: ビヘイビアパックを作る（`addons/game-clock/behavior_pack/`）
  - [x] Step 2: 開発用フォルダへ配置する（`tools/deploy.sh game-clock`）
  - [x] Step 3: ゲーム内で表示を確認する
    利用者がローカルのワールドで、画面の中央下に時刻が出ることを確かめた。統合版 1.26.63、`@minecraft/server` 2.11.0、ベータ API はオフ

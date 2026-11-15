# DONE

完了したタスクを、完了日（`YYYY-MM-DD`）を付けて記録する。

## 2026-11-14

- [x] ゲーム内時間を画面に表示する mod で、mod が動くかを確かめる [plan](docs/plans/archive/game-clock.md)
  - [x] Step 1: ビヘイビアパックを作る（`addons/game-clock/behavior_pack/`）
  - [x] Step 2: 開発用フォルダへ配置する（`tools/deploy.sh game-clock`）
  - [x] Step 3: ゲーム内で表示を確認する
    利用者がローカルのワールドで、画面の中央下に時刻が出ることを確かめた。統合版 1.26.63、`@minecraft/server` 2.11.0、ベータ API はオフ

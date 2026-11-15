# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code へのガイダンスです。

## プロジェクト概要

minecraft-mod（リポジトリ: `git@github.com:akiraak/minecraft-mod.git`）。

**Minecraft 統合版（Bedrock Edition）の mod を作成する**ためのプロジェクト。2026-11-14 に作成した。

- 対象は統合版。Java Edition（Forge / Fabric / `.jar` の mod）は対象外で、作り方も形式も違うので混同しない
- 統合版の mod は「アドオン」として作る。ビヘイビアパック（動作・データ）とリソースパック（見た目・音）の組で、それぞれ `manifest.json` を持ち、配布は `.mcpack` / `.mcaddon`。スクリプトは Script API（JavaScript / TypeScript）で書く
- 統合版の仕様（`format_version`、Script API のモジュールの版、コンポーネント名など）は版ごとに変わる。記憶で書かず、公式ドキュメント（Microsoft Learn の Minecraft Creator）と対象の版を確かめてから書く
- どんな mod を作るか、ディレクトリ構成、ビルドと動作確認の手順は、利用者と相談して決める。決まったらこのファイルに書き足す

## 遊ぶ環境

- 利用者は **Realms** で遊んでいる（2026-11-14 に利用者から聞いた）
- 以下は Claude の解釈で、利用者に確かめたものではない: 作った mod は最終的に Realms のワールドで動かす想定で考える。`development_behavior_packs/` に置く方法はローカルのワールド用で、Realms にはそのままでは効かない。Realms への入れ方と、Realms で使える機能の制限（ベータ API や実験的機能など）は未調査なので、公式の情報で確かめてから手順を決める

## 現状

- 最初の実験として `game-clock`（ゲーム内時間をアクションバーに表示する）を作り、2026-11-14 に利用者がローカルのワールドで表示を確かめた。このリポジトリの作り方と配置方法で mod は動く
- 本格的に作る mod の内容はまだ決まっていない。下の構成と手順は実験用に仮に置いたもので、利用者と相談して変えてよい

## 対象の版（2026-11-14 に確認）

- 統合版（安定版）1.26.63、`@minecraft/server` 2.11.0（安定版）、`manifest.json` の `format_version` は 2
- ゲームが更新されたら確かめ直す。ゲームの版は `Get-AppxPackage *Minecraft*`、API の版は `npm view @minecraft/server dist-tags`。型定義は `npm pack @minecraft/server@<版>` で取れる `index.d.ts` が確実
- Microsoft Learn の Script API v2 の概要ページは「2.0.0-beta」の頃の記述のままで古い。版の対応は npm のほうを信じる

## ディレクトリ構成と手順（仮）

- `addons/<名前>/behavior_pack/`: ビヘイビアパック。リソースパックが要るときは隣に `resource_pack/` を置く
- スクリプトはビルドなしの JavaScript。ゲームの API に依存しない処理は別ファイルに分け、Node で試せるようにする
- `tools/deploy.sh <名前>`: 安定版の `development_behavior_packs/<名前>/` へコピーする。既存のパックとワールドは書き換えない
- ワールドでパックを有効にするのは、ゲームの画面から利用者が行う。「ワールドを作成」→「ビヘイビアー パック」でパックを選び、「認証する」を押す（言語ファイルの「有効化」ではなかった）
- 画面の案内をするときは、ゲームの日本語ファイル（インストール先の `data/resource_packs/vanilla/texts/ja_JP.lang`）で表示名を確かめる。ただし実際の画面と違うことがある

## 関係するプロジェクト

- `~/minecraft-manager`: Windows にインストールした統合版の mod・パックを管理するツール。統合版のデータの置き場所（`com.mojang/`、`development_behavior_packs/` / `development_resource_packs/`）やパックの有効化の仕組みは、`~/minecraft-manager/docs/bedrock-environment.md` と `~/minecraft-manager/docs/textures-and-shaders.md` に調査結果がある。作ったパックをゲームに入れて試すときはこれを参照する
- このプロジェクトは mod を**作る**側、minecraft-manager は入れたものを**管理する**側。minecraft-manager のファイルはここから書き換えない

## 開発管理画面

タスク・プラン・ファイルの閲覧と編集、Claude Code への依頼は project-manager（`http://127.0.0.1:8200`、`~/project-manager`）で行う。

- ユーザーとのやり取りは日本語で行う
- 時刻は米国西海岸時間（`America/Los_Angeles`）で書く

## タスク管理ルール

- タスクは `TODO.md` で管理する（まだ無ければ、最初のタスクを足すときに `TODO.md` と `DONE.md` を作る）
- タスクの行は、親項目も含めて必ず `- [ ] 文面` の形で書く（`[ ]` 未着手 / `[x]` 完了 / `[~]` 進行中 / `[-]` 中止）。チェックボックスの無い行は直前のタスクのメモ扱いになる
- `TODO.md` に書くのはタスクだけ。メモや決定事項は関係するタスクの下に字下げして付ける。プロジェクトとしての決定は `CLAUDE.md` へ、済んだ経緯は `DONE.md` へ書く
- 字下げが親子
- タスクが完了したら `TODO.md` から該当項目を削除し、`DONE.md` に移動する
- `DONE.md` には完了日を `YYYY-MM-DD` 形式で付けて記録する
- 新しいタスクが発生したら `TODO.md` の適切なセクションに追加する
- タスクの実施前に `TODO.md` を確認し、優先度の高いものから着手する
- コミット時に `TODO.md` を確認し、実装した機能に対応するタスクがあれば `DONE.md` に移動する

## 作業着手ルール

作業（実装・調査いずれも）を始めるときは、コードに手を入れる前に以下を行う。

1. **プランファイルを作成する**: `docs/plans/<task-name>.md` に実装プラン or 調査プランを作成する
   - 目的・背景、対応方針、影響範囲、テスト方針を最低限記載する
   - 複数 Phase / Step に分かれる場合はファイル内でも Phase / Step を明示する
2. **`TODO.md` に該当項目があるか確認する**
   - 無ければ適切なセクションに追加する
   - 既存項目があれば、その項目に作成したプランファイルへのリンクを追記する（例: `[plan](docs/plans/<task-name>.md)`）
3. **複数 Phase / Step がある場合は `TODO.md` に子タスクとして追加する**
   - 親項目の下にインデントしたチェックボックスで Phase / Step を列挙する
   - Phase / Step が完了するごとにチェックを入れ、全完了で親項目を `DONE.md` に移す
4. **作業完了時の後片付け**
   - 親タスクを `DONE.md` に移動する
   - 対応するプランファイルは `docs/plans/archive/` に移動する

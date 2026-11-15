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
- 作った mod は最終的に Realms のワールドで動かす。先にローカルのワールドで確かめてから Realm に入れる
- Realm への入れ方（2026-11-14 に `game-clock` 0.1.0 で確認。操作は利用者がゲームの画面から行う）
  - Realm Hub → 上の「ワールド」→「スロット」→ 有効なワールドの「ワールドを編集」→「ビヘイビアー パック」でパックを選び「認証する」
  - 開発用フォルダ（`development_behavior_packs/`）に置いたパックを、そのまま選べた。`.mcpack` にする必要はなかった
  - 先にバックアップを取る: 「ワールド」→「保存」→「アクティブなワールドを保存」
  - 同じ画面の「ワールドを置き換え」「ワールドをリセット」は Realm のワールドを変えてしまうので使わない
- Realms の制限: ベータ API（`-beta` の版の Script API）と `@minecraft/server-net` は使えない（Microsoft Learn）。安定版の `@minecraft/server` 2.11.0 は動いた
- パックの更新: 版を上げて配置し、「ワールドを編集」で古い版を外して新しい版を有効にする。0.2.0 → 0.3.0 でこの手順を案内し、利用者が入れ替えられた（画面で実際にどう操作したかは聞いていない）
- まだ分かっていないこと: 実績への影響
- 調査の経緯は `docs/plans/archive/realms-support.md`

## 現状

- 最初の実験として `game-clock`（ゲーム内時間をアクションバーに表示する）を作り、2026-11-14 に利用者がローカルのワールドと Realm で表示を確かめた。このリポジトリの作り方と配置方法で mod は動く
- 0.2.0 で名前を `Info HUD`（`addons/info-hud/`）に変え、表示を画面の左上の `06:58  -28, 70, 48`（時刻と、カンマで区切った X, Y, Z）に変えた。今後も表示が増える可能性があるので、時計に限らない名前にした。UUID は `game-clock` のときと同じ。0.2.0 は利用者が Realm に入れたと見られる（2026-11-14 20:55 ごろ）
- 0.3.0 で、近くの鉄とダイヤの座標と距離の行（`Iron  -20, -47, 41  12m`）を足し、表示の位置を画面中央の 16:9 の範囲の左上に変えた。0.3.0 は利用者が Realm に入れ、「表示された」と報告した（2026-11-14 23:08 ごろ）
- Realm に入っているパックを更新するときは、`manifest.json` の版を上げてから配置する。同じ版のままだと、Realm 側の古い中身と区別がつかない
- Realm へパックを上げると、ゲームが開発用フォルダに `<名前>.zip` を作る（`game-clock.zip`、`info-hud.zip` が残っていた）。中身は上げた時点の版で、いつ何を Realm に上げたかの手がかりになる。古い版が一覧に出るおそれがある。Claude が作ったファイルではないので、消すのは利用者に言われたときだけ（`game-clock.zip` は利用者の指示で消した。0.2.0 の `info-hud.zip` は、Claude が断りなく消そうとして止められた）
- 次に作るものは決まっていない。候補の一覧は `docs/mod-ideas.md`。下の構成と手順は実験用に仮に置いたもので、利用者と相談して変えてよい

## 対象の版（2026-11-14 に確認）

- 統合版（安定版）1.26.63、`@minecraft/server` 2.11.0（安定版）、`manifest.json` の `format_version` は 2
- ゲームが更新されたら確かめ直す。ゲームの版は `Get-AppxPackage *Minecraft*`、API の版は `npm view @minecraft/server dist-tags`。型定義は `npm pack @minecraft/server@<版>` で取れる `index.d.ts` が確実
- Microsoft Learn の Script API v2 の概要ページは「2.0.0-beta」の頃の記述のままで古い。版の対応は npm のほうを信じる

## ディレクトリ構成と手順（仮）

- `addons/<名前>/behavior_pack/`: ビヘイビアパック。リソースパックが要るときは隣に `resource_pack/` を置く
- スクリプトはビルドなしの JavaScript。ゲームの API に依存しない処理は別ファイルに分け、Node で試せるようにする
- `tools/deploy.sh <名前>`: 安定版の `development_behavior_packs/<名前>/` と、リソースパックがあれば `development_resource_packs/<名前>/` へコピーする。既存のパックとワールドは書き換えない
- `tools/pack.sh <名前>`: 配布用の `dist/<名前>.mcpack`（リソースパックもあれば `.mcaddon`）を作る。`dist/` は git 管理外
- JSON UI で分かったこと（2026-11-14、統合版 1.26.63 でゲームを動かして確認。詳しくは `docs/plans/info-hud.md`）
  - スクリプトから HUD へ文字を渡すには、タイトル（`setTitle`）で送って `#hud_title_text_string` を読む。`binding_type` が `global` のバインディングで読め、`view` のバインディングの式を通して `#text` に入れられる
  - 式の結果が数字で始まると文字が出なかった（`06:58 ...`）。頭に `§f` のような色の指定を挟むと出る。数字で始まるのが原因というのは推定
  - Bedrock Wiki の「Preserve Title Texts」の書き方（`property_bag`、`visibility_changed`）は動かなかった
  - 要素を足すのは `modifications` の `insert_front`、消すのは `"ignored": true`。利用者の PC の `resource_packs/bedrock-ui-plus/ui/hud_screen.json` が動いている実例として参考になる
  - JSON UI の失敗はコンテンツログに出ない。切り分けは、固定の文字の行・文字列そのままの行・式を通した行を並べて、利用者に何が出たかを見てもらう
  - ラベルの `"shadow": true` は、利用者には文字が二重に見える。付けない
- 画面に出す文字には日本語を使わない（2026-11-14、利用者の指定。Info HUD の鉱石の行について言われた。ほかの表示にも当てはめるのは Claude の解釈）
- スクリプトで分かったこと（2026-11-14、ゲームを動かして確認）
  - スクリプトの読み込み時（ファイルの一番外側）では、呼べる API が限られる。`new MolangVariableMap()` を一番外側で呼んだら `cannot be used in early execution` で失敗し、スクリプト全体が動かなくなった。ゲームの API を使う準備は、最初に使うときに行う
  - コンテンツログのファイル（`…/Minecraft Bedrock/logs/ContentLog*.txt`）は、ゲームを終了するまで書かれない。スクリプトのエラーは `[Scripting][error]` で残るので、利用者にゲームを起動し直してもらってから読む
  - タイトルの文字列に改行（`\n`）を入れると、左上の表示が複数行になる
  - `dimension.getBlocks` で、プレイヤーの周り（前後左右上下 16 ブロック）から種類を指定してブロックをさがせる
  - パーティクルは種類によって見えないものがある。見えた: `minecraft:villager_happy`（緑の粒）、`minecraft:endrod`（白い光）、`minecraft:heart_particle`（赤いハート）。見えなかった: `minecraft:colored_flame_particle`（色を指定する炎。原因は不明）
  - 利用者に確認を頼むときは、見るものを 1〜2 個に絞る。表で 4〜5 項目を並べて報告を頼んだら「何を言っているのか分からない」と言われた
  - ゲームの API をまねた代役を作って Node で動かすと、文面や分岐のミスをゲームの前に見つけられる。ただし読み込み時の制限のような、ゲーム固有のことは代役では分からない
- HUD の見た目を変えるときは、リソースパックの `ui/hud_screen.json`（JSON UI）に差分だけを書く。バニラの定義はインストール先からは読めない（`__brarchive` にまとめられている）ので、Mojang の `bedrock-samples` の、ゲームの版に近いタグの `resource_pack/ui/` を見る。書き方は Bedrock Wiki の JSON UI のページ。JSON UI は廃止予定とされていて、ゲームで動かして確かめるしかない
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

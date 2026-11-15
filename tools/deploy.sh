#!/usr/bin/env bash
# アドオンのビヘイビアパックを、統合版（安定版）の開発用フォルダへコピーする。
# 使い方: tools/deploy.sh <アドオン名>   例: tools/deploy.sh game-clock
# 置き場所を変えるときは COM_MOJANG に com.mojang のパスを入れて実行する。
set -euo pipefail

addon="${1:?アドオン名を指定してください（例: game-clock）}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$repo_root/addons/$addon/behavior_pack"

if [[ ! -f "$src/manifest.json" ]]; then
  echo "manifest.json が見つかりません: $src" >&2
  exit 1
fi

if [[ -z "${COM_MOJANG:-}" ]]; then
  matches=(/mnt/c/Users/*/AppData/Roaming/"Minecraft Bedrock"/Users/Shared/games/com.mojang)
  if [[ ${#matches[@]} -ne 1 || ! -d "${matches[0]}" ]]; then
    echo "com.mojang を 1 つに決められません。COM_MOJANG で指定してください。" >&2
    printf '  候補: %s\n' "${matches[@]}" >&2
    exit 1
  fi
  COM_MOJANG="${matches[0]}"
fi

dest="$COM_MOJANG/development_behavior_packs/$addon"
rm -rf "$dest"
mkdir -p "$dest"
cp -r "$src/." "$dest/"
echo "配置しました: $dest"

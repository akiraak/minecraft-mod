#!/usr/bin/env bash
# アドオンのパックを、統合版（安定版）の開発用フォルダへコピーする。
# ビヘイビアパックは development_behavior_packs/ へ、リソースパックがあれば
# development_resource_packs/ へ置く。
# 使い方: tools/deploy.sh <アドオン名>   例: tools/deploy.sh info-hud
# 置き場所を変えるときは COM_MOJANG に com.mojang のパスを入れて実行する。
set -euo pipefail

addon="${1:?アドオン名を指定してください（例: info-hud）}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
addon_dir="$repo_root/addons/$addon"

if [[ ! -f "$addon_dir/behavior_pack/manifest.json" ]]; then
  echo "manifest.json が見つかりません: $addon_dir/behavior_pack" >&2
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

# copy_pack <パックの種類のディレクトリ名> <開発用フォルダ名>
copy_pack() {
  local src="$addon_dir/$1"
  local dest="$COM_MOJANG/$2/$addon"
  [[ -f "$src/manifest.json" ]] || return 0
  rm -rf "$dest"
  mkdir -p "$dest"
  cp -r "$src/." "$dest/"
  echo "配置しました: $dest"
}

copy_pack behavior_pack development_behavior_packs
copy_pack resource_pack development_resource_packs

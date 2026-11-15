#!/usr/bin/env bash
# アドオンを配布用のファイルにまとめて dist/ に置く（中身は zip）。
# ビヘイビアパックだけなら <名前>.mcpack、リソースパックもあれば両方を入れた
# <名前>.mcaddon を作る。Windows で開くと、統合版がパックとして取り込む。
# 使い方: tools/pack.sh <アドオン名>   例: tools/pack.sh info-hud
set -euo pipefail

addon="${1:?アドオン名を指定してください（例: info-hud）}"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
addon_dir="$repo_root/addons/$addon"

if [[ ! -f "$addon_dir/behavior_pack/manifest.json" ]]; then
  echo "manifest.json が見つかりません: $addon_dir/behavior_pack" >&2
  exit 1
fi

mkdir -p "$repo_root/dist"
rm -f "$repo_root/dist/$addon.mcpack" "$repo_root/dist/$addon.mcaddon"

if [[ -f "$addon_dir/resource_pack/manifest.json" ]]; then
  # .mcaddon は、パックごとのディレクトリを最上位に並べる。
  out="$repo_root/dist/$addon.mcaddon"
  (cd "$addon_dir" && python3 -m zipfile -c "$out" behavior_pack resource_pack)
else
  # .mcpack は、manifest.json が zip の最上位に来るようにパックの中から固める。
  out="$repo_root/dist/$addon.mcpack"
  (cd "$addon_dir/behavior_pack" && python3 -m zipfile -c "$out" ./*)
fi
echo "作りました: $out"

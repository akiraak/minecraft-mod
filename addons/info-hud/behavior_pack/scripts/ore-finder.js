import { BlockVolume } from "@minecraft/server";

// さがす鉱石。深層岩の鉱石も同じ種類として扱う。
// label は画面に出す名前。画面の文字には日本語を使わない（利用者の指定）。
export const ORES = [
  {
    label: "Iron",
    types: ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"],
  },
  {
    label: "Diamond",
    types: ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"],
  },
];

// 自分を中心に、前後左右上下この数のブロックまでを調べる。
const SEARCH_RADIUS = 16;

/**
 * プレイヤーの周りで、ORES のそれぞれについていちばん近いブロックをさがす。
 *
 * @param {import("@minecraft/server").Player} player
 * @returns {({x: number, y: number, z: number} | undefined)[]} ORES と同じ並び。
 *   見つからなかった種類は undefined
 */
export function findNearestOres(player) {
  const dimension = player.dimension;
  const center = {
    x: Math.floor(player.location.x),
    y: Math.floor(player.location.y),
    z: Math.floor(player.location.z),
  };
  const height = dimension.heightRange;
  const minY = Math.max(height.min, center.y - SEARCH_RADIUS);
  const maxY = Math.min(height.max - 1, center.y + SEARCH_RADIUS);
  if (minY > maxY) return ORES.map(() => undefined);

  const volume = new BlockVolume(
    { x: center.x - SEARCH_RADIUS, y: minY, z: center.z - SEARCH_RADIUS },
    { x: center.x + SEARCH_RADIUS, y: maxY, z: center.z + SEARCH_RADIUS },
  );
  return ORES.map((ore) => {
    // 最後の true は、読み込まれていないチャンクを飛ばす指定。
    const found = dimension.getBlocks(
      volume,
      { includeTypes: ore.types, closest: 1, location: center },
      true,
    );
    if (found.getCapacity() === 0) return undefined;
    return found.getClosest(1, center)[0];
  });
}

// 画面に出す文面の整形。@minecraft/server に依存しないので Node でも試せる。

const TICKS_PER_HOUR = 1000;
// 時刻 0 tick は朝 6:00 にあたる。
const HOUR_AT_TICK_ZERO = 6;

/**
 * @param {number} timeOfDay world.getTimeOfDay() の値（0 以上 24000 未満の tick）
 * @returns {string} 例: "06:00"
 */
export function formatTime(timeOfDay) {
  const hour = (Math.floor(timeOfDay / TICKS_PER_HOUR) + HOUR_AT_TICK_ZERO) % 24;
  const minute = Math.floor(((timeOfDay % TICKS_PER_HOUR) * 60) / TICKS_PER_HOUR);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * @param {number} timeOfDay world.getTimeOfDay() の値
 * @param {{x: number, y: number, z: number}} location プレイヤーの位置（足元）
 * @returns {string} 例: "06:00  123, 64, -45"（時刻、空白 2 つ、X, Y, Z の順）
 */
export function formatHud(timeOfDay, location) {
  // ゲームの座標表示と同じく、小数は切り捨てる（負の値は小さいほうへ）。
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);
  return `${formatTime(timeOfDay)}  ${x}, ${y}, ${z}`;
}

/**
 * 鉱石 1 種類ぶんの行を作る。
 *
 * @param {string} label 鉱石の名前（例: "Diamond"）
 * @param {{x: number, y: number, z: number} | undefined} orePosition 鉱石のブロックの座標。無ければ undefined
 * @param {{x: number, y: number, z: number}} location プレイヤーの位置（足元）
 * @returns {string} 例: "Diamond  -18, -60, 39  14m"。無いときは "Diamond  --"
 */
export function formatOreLine(label, orePosition, location) {
  if (!orePosition) return `${label}  --`;
  const dx = orePosition.x - Math.floor(location.x);
  const dy = orePosition.y - Math.floor(location.y);
  const dz = orePosition.z - Math.floor(location.z);
  const distance = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
  return `${label}  ${orePosition.x}, ${orePosition.y}, ${orePosition.z}  ${distance}m`;
}

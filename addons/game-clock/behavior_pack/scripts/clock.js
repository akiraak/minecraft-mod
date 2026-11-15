// ゲーム内時刻の整形。@minecraft/server に依存しないので Node でも試せる。

const TICKS_PER_HOUR = 1000;
// 時刻 0 tick は朝 6:00 にあたる。
const HOUR_AT_TICK_ZERO = 6;

/**
 * @param {number} day world.getDay() の値（新しいワールドは 0 から始まる）
 * @param {number} timeOfDay world.getTimeOfDay() の値（0 以上 24000 未満の tick）
 * @returns {string} 例: "1日目 06:00"
 */
export function formatClock(day, timeOfDay) {
  const hour = (Math.floor(timeOfDay / TICKS_PER_HOUR) + HOUR_AT_TICK_ZERO) % 24;
  const minute = Math.floor(((timeOfDay % TICKS_PER_HOUR) * 60) / TICKS_PER_HOUR);
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${day + 1}日目 ${hh}:${mm}`;
}

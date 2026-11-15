import { system, world } from "@minecraft/server";
import { formatHud, formatOreLine } from "./format.js";
import { ORES, findNearestOres } from "./ore-finder.js";

// リソースパックの ui/hud_screen.json が、この目印で始まるタイトルを
// 画面の中央には出さず、左上の表示に回す。両方で同じ文字列にすること。
const HUD_MARKER = "infohud:";

// 目印のすぐ後ろに色の指定（白）を挟む。これが無いと、画面定義で目印を引いた
// 結果が「06:58 ...」のように数字で始まり、文字が出なかった。挟むと出る
// （2026-11-14 にゲームで確認。数字で始まるのが原因というのは推定）。
// 色の指定は画面には出ない。
const TEXT_PREFIX = "§f";

// 座標は歩くとすぐ変わるので短い間隔で見る。送るのは文面が変わったときだけ。
const CHECK_INTERVAL_TICKS = 2;
// HUD が作り直されると覚えていた文面が消えるので、変わっていなくても送り直す間隔。
const RESEND_INTERVAL_TICKS = 100;

// タイトルは目印で隠す。送り直しの間隔より長く出しておき、途切れないようにする。
const TITLE_OPTIONS = { fadeInDuration: 0, stayDuration: 200, fadeOutDuration: 0 };

// 鉱石をさがし直す間隔。
const ORE_SEARCH_INTERVAL_TICKS = 20;

// エラーの文面を画面に出すときの長さの上限。
const ERROR_TEXT_MAX_LENGTH = 80;

/** @type {Map<string, string>} プレイヤーの id → 最後に送った文面 */
const lastSent = new Map();

/**
 * @typedef {object} OreState
 * @property {number} tick さがした tick
 * @property {({x: number, y: number, z: number} | undefined)[]} positions ORES と同じ並び
 * @property {string | undefined} searchError さがすのに失敗したときの文面
 */
/** @type {Map<string, OreState>} プレイヤーの id → 鉱石の状態 */
const oreStates = new Map();

// 失敗はゲームで見るしかないので、画面とログの両方に出す。ログは文面が変わったときだけ。
// 画面に出るので、文面に日本語は使わない。
let lastLoggedError;
function describeError(what, error) {
  const text = `${what}: ${error}`.slice(0, ERROR_TEXT_MAX_LENGTH);
  if (text !== lastLoggedError) {
    lastLoggedError = text;
    console.warn(`[Info HUD] ${what} failed: ${error}`);
  }
  return text;
}

/**
 * @param {import("@minecraft/server").Player} player
 * @param {number} tick
 * @returns {OreState}
 */
function getOreState(player, tick) {
  const current = oreStates.get(player.id);
  if (current && tick - current.tick < ORE_SEARCH_INTERVAL_TICKS) return current;

  /** @type {OreState} */
  const next = {
    tick,
    positions: ORES.map(() => undefined),
    searchError: undefined,
  };
  try {
    next.positions = findNearestOres(player);
  } catch (error) {
    next.searchError = describeError("Ore search", error);
  }
  oreStates.set(player.id, next);
  return next;
}

/**
 * @param {import("@minecraft/server").Player} player
 * @param {number} timeOfDay
 * @param {OreState} ores
 * @returns {string}
 */
function buildHudText(player, timeOfDay, ores) {
  const lines = [formatHud(timeOfDay, player.location)];
  if (ores.searchError) {
    lines.push(ores.searchError);
  } else {
    ORES.forEach((ore, index) => {
      lines.push(formatOreLine(ore.label, ores.positions[index], player.location));
    });
  }
  return lines.join("\n");
}

system.runInterval(() => {
  const tick = system.currentTick;
  const forceResend = tick % RESEND_INTERVAL_TICKS < CHECK_INTERVAL_TICKS;
  const timeOfDay = world.getTimeOfDay();
  for (const player of world.getAllPlayers()) {
    if (!player.isValid) continue;
    const ores = getOreState(player, tick);
    const text = buildHudText(player, timeOfDay, ores);
    if (!forceResend && lastSent.get(player.id) === text) continue;
    player.onScreenDisplay.setTitle(HUD_MARKER + TEXT_PREFIX + text, TITLE_OPTIONS);
    lastSent.set(player.id, text);
  }
}, CHECK_INTERVAL_TICKS);

world.afterEvents.playerLeave.subscribe((event) => {
  lastSent.delete(event.playerId);
  oreStates.delete(event.playerId);
});

world.afterEvents.playerSpawn.subscribe((event) => {
  // 入り直しや復活のあとは HUD が空なので、次の回で必ず送る。
  lastSent.delete(event.player.id);
});

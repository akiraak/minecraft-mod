import { system, world } from "@minecraft/server";
import { formatHud } from "./format.js";

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

/** @type {Map<string, string>} プレイヤーの id → 最後に送った文面 */
const lastSent = new Map();

system.runInterval(() => {
  const forceResend = system.currentTick % RESEND_INTERVAL_TICKS < CHECK_INTERVAL_TICKS;
  const timeOfDay = world.getTimeOfDay();
  for (const player of world.getAllPlayers()) {
    if (!player.isValid) continue;
    const text = formatHud(timeOfDay, player.location);
    if (!forceResend && lastSent.get(player.id) === text) continue;
    player.onScreenDisplay.setTitle(HUD_MARKER + TEXT_PREFIX + text, TITLE_OPTIONS);
    lastSent.set(player.id, text);
  }
}, CHECK_INTERVAL_TICKS);

world.afterEvents.playerLeave.subscribe((event) => {
  lastSent.delete(event.playerId);
});

world.afterEvents.playerSpawn.subscribe((event) => {
  // 入り直しや復活のあとは HUD が空なので、次の回で必ず送る。
  lastSent.delete(event.player.id);
});

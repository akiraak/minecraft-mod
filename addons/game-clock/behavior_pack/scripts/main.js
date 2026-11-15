import { system, world } from "@minecraft/server";
import { formatClock } from "./clock.js";

// 1 ゲーム内分は約 16.7 tick。10 tick ごとに書き直せば分の表示が飛ばず、
// アクションバーの文字も消える前に上書きされる。
const UPDATE_INTERVAL_TICKS = 10;

system.runInterval(() => {
  const text = formatClock(world.getDay(), world.getTimeOfDay());
  for (const player of world.getAllPlayers()) {
    player.onScreenDisplay.setActionBar(text);
  }
}, UPDATE_INTERVAL_TICKS);

// スクリプトが読み込まれたことを、時計の表示とは別に確かめられるようにする。
world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    event.player.sendMessage("§a[Game Clock] スクリプトが動いています");
  }
});

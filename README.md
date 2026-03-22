# RPG Boss Battle (React + TypeScript + Tailwind)

單機回合制 RPG Boss 戰鬥小遊戲。

## Features

- 職業系統：Warrior / Mage / Assassin
- 屬性：HP / ATK / DEF / CRIT / LEVEL
- 回合制戰鬥：隨機浮動傷害、爆擊、護盾、技能 CD
- Boss 成長：每關強度提升，含 Enrage 機制
- 成長系統：每次勝利提供 3 個升級選項
- 自動存檔：localStorage 保存進度
- 現代暗色 UI：Tailwind + Framer Motion 動畫
- 可部署 GitHub Pages

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages Deploy

```bash
npm run deploy
```

注意：

- `vite.config.ts` 目前預設 production base 是 `/rpg-game/`。
- 如果你的 repo 名稱不是 `rpg-game`，請改成你的 repo 名稱，例如 `/my-repo/`。

## Core Files

- `src/hooks/useGameEngine.ts`：遊戲流程與狀態管理
- `src/logic/battle.ts`：戰鬥規則、傷害計算、Boss 行為
- `src/data/upgradePool.ts`：升級池與權重抽選
- `src/logic/storage.ts`：localStorage 存讀檔
- `src/components/*`：UI 元件分離

## Line Count

- `src` 內 TS/TSX/CSS 總行數：約 2934 行

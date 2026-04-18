import type { Player, Direction } from './tiles'
import { type Tile } from './tiles'

export const TILE = {
	FLOOR: 0,
	WALL: 1,
	DOOR_CLOSED: 2,
	DOOR_OPEN: 3,
	STAIRS: 4
} as const

export type TileId = (typeof TILE)[keyof typeof TILE]
export type TileDef = {
	name: string
	char: string
	color: string
	pre: string
	style: { fg: string; bg: string }
	walkable: boolean
	lightPass: boolean
	hasAction: boolean
}
export interface Position {
	x: number
	y: number
}

export interface Room {
	id: number
	x: number
	y: number
	width: number
	height: number
}

export interface MapResult {
	map: Tile[][]
	rooms: Room[]
	start: Position
	exit: Position
}

export const colors = {
	dark: 'oklch(14.5% 0 0)',
	bg: 'oklch(20.5% 0 0)',
	accent: 'oklch(37.2% 0.044 257.287)',
	door2: 'oklch(37.2% 0.044 257.287)',
	door1: 'oklch(0.35 0 0)',
	surface: 'oklch(26.9% 0 0)',
	text: 'oklch(92.2% 0 0)',
	primary: 'oklch(86.645% 0.29481 142.511)',
	success: 'oklch(0.7588 0.2948 142.51)',
	error: 'oklch(57.7% 0.245 27.325)',
	warning: 'oklch(87.9% 0.169 91.605)',
	info: 'oklch(68.5% 0.169 237.323)'
}

export const TILE_DEFS: Record<TileId, TileDef> = {
	[TILE.FLOOR]: {
		name: 'floor',
		char: '.',
		color: '#d6d3d1',
		pre: '#eee',
		style: { fg: colors.warning, bg: colors.accent },
		walkable: true,
		lightPass: true,
		hasAction: false
	},
	[TILE.WALL]: {
		name: 'wall',
		char: '#',
		color: '#1c1917',
		pre: '#1c1917',
		style: { fg: colors.text, bg: colors.surface },
		walkable: false,
		lightPass: false,
		hasAction: false
	},
	[TILE.DOOR_CLOSED]: {
		name: 'door-closed',
		char: '+',
		color: '#44403b',
		pre: '#e7000b',
		style: { fg: colors.error, bg: colors.door1 },
		walkable: false,
		lightPass: false,
		hasAction: true
	},
	[TILE.DOOR_OPEN]: {
		name: 'door-open',
		char: '/',
		color: '#e7000b',
		pre: '#e7000b',
		style: { fg: colors.success, bg: colors.door2 },
		walkable: true,
		lightPass: true,
		hasAction: false
	},
	[TILE.STAIRS]: {
		name: 'stairs',
		char: 's',
		color: '#f6339a',
		pre: '#00c950',
		style: { fg: colors.success, bg: colors.accent },
		walkable: true,
		lightPass: true,
		hasAction: true
	}
}

export interface Player {
	x: number
	y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export function isWalkable(tile: Tile): boolean {
	return tile === TILE.FLOOR || tile === TILE.DOOR_OPEN || tile === TILE.STAIRS
}

export function tryOpenDoor(map: Tile[][], x: number, y: number): boolean {
	if (map[y][x] === TILE.DOOR_CLOSED) {
		map[y][x] = TILE.DOOR_OPEN
		return true // Aktion verbraucht Turn
	}
	return false
}

export const DIRS: Record<Direction, { x: number; y: number }> = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 }
}

export function movePlayer(
	player: Player,
	map: Tile[][],
	dir: Direction
): { moved: boolean; reachedExit: boolean } {
	const d = DIRS[dir]
	const newX = player.x + d.x
	const newY = player.y + d.y
	const tile = map[newY]?.[newX]
	// ❌ außerhalb der Map
	if (tile === undefined) {
		return { moved: false, reachedExit: false }
	}

	// 🚪 Tür?
	if (tile === TILE.DOOR_CLOSED) {
		map[newY][newX] = TILE.DOOR_OPEN
		return { moved: false, reachedExit: false }
	}

	// ❌ nicht begehbar
	if (!isWalkable(tile)) {
		return { moved: false, reachedExit: false }
	}

	// ✅ Bewegung
	player.x = newX
	player.y = newY

	return {
		moved: true,
		reachedExit: tile === TILE.STAIRS
	}
}

export function setupInput(
	player: Player,
	map: Tile[][],
	onUpdate: () => void,
	onExit: () => void
) {
	window.addEventListener('keydown', (e) => {
		let dir: Direction | null = null

		switch (e.key) {
			case 'ArrowUp':
			case 'w':
				dir = 'up'
				break
			case 'ArrowDown':
			case 's':
				dir = 'down'
				break
			case 'ArrowLeft':
			case 'a':
				dir = 'left'
				break
			case 'ArrowRight':
			case 'd':
				dir = 'right'
				break
		}

		if (!dir) return

		const result = movePlayer(player, map, dir)

		if (result.reachedExit) {
			onExit()
		}

		if (result.moved) {
			onUpdate()
		}
	})
}

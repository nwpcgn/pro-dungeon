import { Map as ROTMap } from 'rot-js'

export const TILE = {
	FLOOR: 0,
	WALL: 1,
	DOOR_CLOSED: 2,
	DOOR_OPEN: 3,
	EXIT: 4
} as const

export type TileId = (typeof TILE)[keyof typeof TILE]

export const TILE_DEFS: Record<
	TileId,
	{
		name: string
		char: string
		color: string
		pre: string
		walkable: boolean
		lightPass: boolean
	}
> = {
	[TILE.FLOOR]: {
		name: 'floor',
		char: '.',
		color: '#d6d3d1',
		pre: '#eee',
		walkable: true,
		lightPass: true
	},
	[TILE.WALL]: {
		name: 'wall',
		char: '#',
		color: '#57534e',
		pre: '#444',
		walkable: false,
		lightPass: false
	},
	[TILE.DOOR_CLOSED]: {
		name: 'door_closed',
		char: '+',
		color: '#a16207',
		pre: '#8b5cf6',
		walkable: false,
		lightPass: false
	},
	[TILE.DOOR_OPEN]: {
		name: 'door_open',
		char: '/',
		color: '#ca8a04',
		pre: '#a78bfa',
		walkable: true,
		lightPass: true
	},
	[TILE.EXIT]: {
		name: 'exit',
		char: '>',
		color: '#22c55e',
		pre: '#4ade80',
		walkable: true,
		lightPass: true
	}
}

export interface Room {
	index: number
	x: number
	y: number
	width: number
	height: number
}

export interface Position {
	x: number
	y: number
}

export interface DungeonResult {
	map: TileId[][]
	rooms: Room[]
	startPosition: Position
	endPosition: Position
}

export interface DungeonOptions {
	width?: number
	height?: number
	roomWidth?: [number, number]
	roomHeight?: [number, number]
	corridorLength?: [number, number]
	dugPercentage?: number
}

export function generateDungeon(options: DungeonOptions = {}): DungeonResult {
	const {
		width = 80,
		height = 40,
		roomWidth = [4, 10],
		roomHeight = [4, 8],
		corridorLength = [2, 8],
		dugPercentage = 0.3
	} = options

	// Initialize map with walls
	const map: TileId[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => TILE.WALL)
	)

	// Create digger
	const digger = new ROTMap.Digger(width, height, {
		roomWidth,
		roomHeight,
		corridorLength,
		dugPercentage
	})

	// Generate dungeon
	digger.create((x, y, value) => {
		if (value === 0) {
			map[y][x] = TILE.FLOOR
		}
	})

	// Extract rooms
	const rotRooms = digger.getRooms()
	const rooms: Room[] = rotRooms.map((room, index) => ({
		index,
		x: room.getLeft(),
		y: room.getTop(),
		width: room.getRight() - room.getLeft() + 1,
		height: room.getBottom() - room.getTop() + 1
	}))

	// Add doors
	rotRooms.forEach((room) => {
		room.getDoors((x, y) => {
			if (x >= 0 && x < width && y >= 0 && y < height) {
				map[y][x] = TILE.DOOR_CLOSED
			}
		})
	})

	// Calculate start position (center of first room)
	const firstRoom = rotRooms[0]
	const startPosition: Position = {
		x: Math.floor((firstRoom.getLeft() + firstRoom.getRight()) / 2),
		y: Math.floor((firstRoom.getTop() + firstRoom.getBottom()) / 2)
	}

	// Calculate end position (center of last room)
	const lastRoom = rotRooms[rotRooms.length - 1]
	const endPosition: Position = {
		x: Math.floor((lastRoom.getLeft() + lastRoom.getRight()) / 2),
		y: Math.floor((lastRoom.getTop() + lastRoom.getBottom()) / 2)
	}

	// Place exit at end position
	map[endPosition.y][endPosition.x] = TILE.EXIT

	return {
		map,
		rooms,
		startPosition,
		endPosition
	}
}

export interface Camera {
	x: number
	y: number
}

export interface RenderOptions {
	tileSize?: number
	showPlayer?: boolean
	playerPosition?: Position
	playerColor?: string
	camera?: Camera
	viewportWidth?: number
	viewportHeight?: number
}

/**
 * Berechnet die Kameraposition, zentriert auf dem Spieler.
 * Kamera wird an den Kartenraendern geclippt.
 */
export function calculateCamera(
	playerPosition: Position,
	mapWidth: number,
	mapHeight: number,
	viewportWidth: number,
	viewportHeight: number,
	tileSize: number
): Camera {
	const viewportTilesX = Math.floor(viewportWidth / tileSize)
	const viewportTilesY = Math.floor(viewportHeight / tileSize)

	// Zentriere Kamera auf Spieler
	let camX = playerPosition.x - Math.floor(viewportTilesX / 2)
	let camY = playerPosition.y - Math.floor(viewportTilesY / 2)

	// Clamp an Kartenraendern
	camX = Math.max(0, Math.min(camX, mapWidth - viewportTilesX))
	camY = Math.max(0, Math.min(camY, mapHeight - viewportTilesY))

	return { x: camX, y: camY }
}

export function renderDungeon(
	ctx: CanvasRenderingContext2D,
	map: TileId[][],
	options: RenderOptions = {}
): void {
	const {
		tileSize = 16,
		showPlayer = false,
		playerPosition,
		playerColor = '#ef4444',
		camera = { x: 0, y: 0 },
		viewportWidth,
		viewportHeight
	} = options

	const mapHeight = map.length
	const mapWidth = map[0]?.length ?? 0

	// Viewport-Groesse in Tiles berechnen
	const vpWidth = viewportWidth ?? mapWidth * tileSize
	const vpHeight = viewportHeight ?? mapHeight * tileSize
	const tilesX = Math.ceil(vpWidth / tileSize) + 1
	const tilesY = Math.ceil(vpHeight / tileSize) + 1

	// Clear canvas
	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, vpWidth, vpHeight)

	// Render sichtbare Tiles
	for (let dy = 0; dy < tilesY; dy++) {
		for (let dx = 0; dx < tilesX; dx++) {
			const mapX = camera.x + dx
			const mapY = camera.y + dy

			// Ausserhalb der Map -> ueberspringen
			if (mapX < 0 || mapX >= mapWidth || mapY < 0 || mapY >= mapHeight)
				continue

			const tileId = map[mapY][mapX]
			const tileDef = TILE_DEFS[tileId]

			if (tileDef) {
				const screenX = dx * tileSize
				const screenY = dy * tileSize

				ctx.fillStyle = tileDef.color
				ctx.fillRect(screenX, screenY, tileSize, tileSize)

				// Zeichne Tile-Zeichen wenn gross genug
				if (tileSize >= 12) {
					ctx.fillStyle = tileDef.pre
					ctx.font = `${Math.floor(tileSize * 0.7)}px monospace`
					ctx.textAlign = 'center'
					ctx.textBaseline = 'middle'
					ctx.fillText(
						tileDef.char,
						screenX + tileSize / 2,
						screenY + tileSize / 2
					)
				}
			}
		}
	}

	// Render Spieler relativ zur Kamera
	if (showPlayer && playerPosition) {
		const playerScreenX =
			(playerPosition.x - camera.x) * tileSize + tileSize / 2
		const playerScreenY =
			(playerPosition.y - camera.y) * tileSize + tileSize / 2

		// Nur zeichnen wenn im Viewport
		if (
			playerScreenX >= 0 &&
			playerScreenX < vpWidth &&
			playerScreenY >= 0 &&
			playerScreenY < vpHeight
		) {
			ctx.fillStyle = playerColor
			ctx.beginPath()
			ctx.arc(playerScreenX, playerScreenY, tileSize / 3, 0, Math.PI * 2)
			ctx.fill()
		}
	}
}

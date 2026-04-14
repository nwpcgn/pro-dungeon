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

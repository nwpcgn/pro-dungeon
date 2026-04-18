import * as ROT from 'rot-js'
import {
	TILE,
	type Tile,
	type Room,
	type Position,
	type MapResult
} from './tiles' // optional auslagern
import generateDungeon from './generateDungeon'

const MAX_SIZE = 100
const MIN_SIZE = 20
const RES_POS = { x: 0, y: 0 }
const defConfig = {
	width: 50,
	height: 30,
	algorithm: 'digger',
	roomWidth: [3, 9],
	roomHeight: [3, 5],
	corridorLength: [3, 10],
	dugPercentage: 0.2,
	roomDugPercentage: 0.1
}

class Box {
	#width = $state(MIN_SIZE)
	#height = $state(MIN_SIZE)
	area = $derived(this.#width * this.#height)
	map: Tile[][] = $state()
	rooms: Room[] = $state([])
	start: Position = $state(RES_POS)
	exit: Position = $state(RES_POS)

	constructor(width, height) {
		this.#width = width
		this.#height = height
		this.map = this.createGrid(1)
		this.create()
	}

	createGrid(fill: T) {
		return Array.from({ length: this.#height }, () =>
			Array(this.#width).fill(fill)
		)
	}
	create(opt = {}) {
		const _opt = { ...defConfig, ...opt }
		const req = generateDungeon(_opt)
		return req
	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	set width(value) {
		this.#width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, value))
	}

	set height(value) {
		this.#height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, value))
	}

	embiggen(amount) {
		this.width += amount
		this.height += amount
	}
}

export const game = new Box(50, 30)

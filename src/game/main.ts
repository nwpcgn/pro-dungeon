const tileSize = 11
const width = 60
const height = 40

const createGrid = <T>(fill: T) =>
	Array.from({ length: height }, () => Array(width).fill(fill))

let map: Tile[][] = $state(createGrid(1))
let rooms: Room[] = $state([])
let start: Position = $state()
let exit: Position = $state()
let player = $state({
	x: 0,
	y: 0,
	color: '#00a6f4'
})

function drawMap() {
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const target = map[y][x]
			const { color } = TILE_DEFS[target]
			if (color) {
				ctx.fillStyle = color
			} else if (target === 1) {
				ctx.fillStyle = 'black'
			} else {
				ctx.fillStyle = 'lightgrey'
			}
			ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
		}
	}
	ctx.fillStyle = player.color
	ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
}

const reset = () => {
	console.log('reset')
	map = createGrid(1)
	rooms = []
	start = { x: 0, y: 0 }
	exit = { x: 0, y: 0 }
}

const initGrid = (w, h) => {
	reset()
	try {
		const res: MapResult = createMap(w, h)
		if (res) {
			map = res.map
			rooms = res.rooms
			start = res.start
			player = { ...player, ...start }
			exit = res.exit
		}
	} catch (error) {
		reset()
	} finally {
		drawMap()
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

async function run() {
	console.log('App Run!')
	if (canvas) {
		canvas.width = tileSize * width
		canvas.height = tileSize * height
		initGrid(width, height)
		// drawMap()
		setupInput(
			player,
			map,
			() => {
				drawMap()
			},
			() => {
				console.log('Next Level!')
				initGrid(width, height)
			}
		)
	}
}

document.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed')
	run()
})

function clickHandler(event) {
	let el1 = event.target.closest('[data-new-grid]')
	if (el1) {
		initGrid(width, height)
	}
}

document.addEventListener('click', clickHandler)

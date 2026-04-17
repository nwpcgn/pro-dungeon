<script lang="ts">
	import {
		generateDungeon,
		renderDungeon,
		calculateCamera,
		TILE,
		type Position,
		type Camera
	} from './dungeon'

	let canvas: HTMLCanvasElement
	let playerPosition = $state<Position>({ x: 0, y: 0 })
	let camera = $state<Camera>({ x: 0, y: 0 })

	let { dungeon, tileSize = 16 } = $props()
	const mapWidth = dungeon?.map[0].length
	const mapHeight = dungeon?.map.length
	const viewportWidth = 500
	const viewportHeight = 500

	// Prueft ob Tile begehbar ist
	function canMoveTo(x: number, y: number): boolean {
		if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false
		const tile = dungeon.map[y][x]
		return (
			tile === TILE.FLOOR ||
			tile === TILE.DOOR_OPEN ||
			tile === TILE.DOOR_CLOSED ||
			tile === TILE.EXIT
		)
	}

	// Bewegung verarbeiten
	function handleKeydown(e: KeyboardEvent) {
		let dx = 0
		let dy = 0

		switch (e.key) {
			case 'ArrowUp':
				dy = -1
				break
			case 'ArrowDown':
				dy = 1
				break
			case 'ArrowLeft':
				dx = -1
				break
			case 'ArrowRight':
				dx = 1
				break
			default:
				return
		}

		e.preventDefault()

		const newX = playerPosition.x + dx
		const newY = playerPosition.y + dy

		if (canMoveTo(newX, newY)) {
			playerPosition = { x: newX, y: newY }
		}
	}

	// Initialisiere Spielerposition
	$effect(() => {
		playerPosition = { ...dungeon.startPosition }
	})

	// Kamera folgt Spieler
	$effect(() => {
		camera = calculateCamera(
			playerPosition,
			mapWidth,
			mapHeight,
			viewportWidth,
			viewportHeight,
			tileSize
		)
	})

	// Render bei Aenderungen
	$effect(() => {
		const ctx = canvas?.getContext('2d')
		if (!ctx) return

		renderDungeon(ctx, dungeon.map, {
			tileSize,
			showPlayer: true,
			playerPosition,
			playerColor: '#ef4444',
			camera,
			viewportWidth,
			viewportHeight
		})
	})
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="bg-black outline-2 outline-error focus:outline-none"
	style="width: {viewportWidth}px; height: {viewportHeight}px;">
	<canvas bind:this={canvas} width={viewportWidth} height={viewportHeight} />
</div>

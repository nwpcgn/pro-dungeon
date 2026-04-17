<script lang="ts">
	import { TILE_DEFS, TILE } from './dungeon'
	let { map, startPosition, maxPx = 200 } = $props()
	let canvas: HTMLCanvasElement = $state()
	// let ctx: CanvasRenderingContext2D = $state()

	function draw(tiles) {
		if (!canvas) return
		const W = tiles[0].length,
			H = tiles.length

		const tileSize = Math.max(
			1,
			Math.min(Math.floor(maxPx / W), Math.floor(maxPx / H))
		)
		const cw = W * tileSize,
			ch = H * tileSize
		canvas.width = cw
		canvas.height = ch
		canvas.style.width = cw + 'px'
		canvas.style.height = ch + 'px'

		const ctx = canvas.getContext('2d')
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const t = tiles[y][x]
				const { pre, color, char } = TILE_DEFS[t]
				let fill = '#111'
				if (pre) {
					fill = pre
				}
				ctx.fillStyle = fill
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
			}
		}

		// draw start (green dot)
		if (tileSize >= 2) {
			ctx.fillStyle = '#1d9e75'
			ctx.fillRect(
				startPosition.x * tileSize,
				startPosition.y * tileSize,
				tileSize,
				tileSize
			)
		}

		let floorCount = 0
		for (let y = 0; y < H; y++)
			for (let x = 0; x < W; x++) if (tiles[y][x] !== TILE.WALL) floorCount++
		const total = W * H
	}

	$effect(() => {
		if (canvas) {
			draw(map)
		}
	})
</script>

<canvas class="border border-black" bind:this={canvas}></canvas>

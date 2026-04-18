<script lang="ts">
	import { TILE_DEFS } from './tiles'
	let { map, player, tileSize = 4 } = $props()
	let canvas: HTMLCanvasElement = $state()
	let ctx: CanvasRenderingContext2D = $state()

	function drawMap() {
		if (!canvas) return
		ctx = canvas.getContext('2d')
		if (!ctx) return

		console.log({ map })
		const width = map[0].length,
			height = map.length

		canvas.width = width * tileSize
		canvas.height = height * tileSize

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const target = map[y][x]
				const { color, pre } = TILE_DEFS[target]
				if (color) {
					ctx.fillStyle = pre
				} else if (target === 1) {
					ctx.fillStyle = 'black'
				} else {
					ctx.fillStyle = 'lightgrey'
				}
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
			}
		}
		ctx.fillStyle = player.color
		ctx.fillRect(
			player.x * tileSize - 2,
			player.y * tileSize - 2,
			tileSize + 4,
			tileSize + 4
		)
	}

	$effect(() => {
		drawMap(canvas)
	})
</script>

<canvas class="border" bind:this={canvas}></canvas>

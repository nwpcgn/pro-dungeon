<script lang="ts">
	import Preview from './Preview.svelte'
	import { sleep, parseNumber } from '$lib'
	import * as ROT from 'rot-js'
	import createMap from './createMap'
	import { movePlayer, TILE_DEFS, setupInput } from './tiles'
	import type {
		Direction,
		MapResult,
		Player,
		Position,
		Room,
		Tile
	} from './tiles'

	let { width = 60, height = 40, tileSize = 11 } = $props()
	const createGrid = <T,>(fill: T) =>
		Array.from({ length: height }, () => Array(width).fill(fill))
	const playerColor = '#00a6f4'

	let map: Tile[][] = $state(createGrid(1))
	let rooms: Room[] = $state([])
	let start: Position = $state({ x: 0, y: 0 })
	let exit: Position = $state({ x: 0, y: 0 })
	let player = $state({
		x: 0,
		y: 0,
		color: playerColor
	})

	const reset = () => {
		map = createGrid(1)
		rooms = []
		start = { x: 0, y: 0 }
		exit = { x: 0, y: 0 }
		player = { x: 0, y: 0, color: playerColor }
	}

	const generate = () => {
		reset()
		try {
			const res: MapResult = createMap(width, height)
			if (res) {
				map = res.map
				rooms = res.rooms
				player = { ...player, ...res.start }
				exit = res.exit
			}
		} catch (error) {
			reset()
		} finally {
			return map
		}
	}

	const init = async () => {
		console.log('init')
		await sleep(100)

		await generate()
		setupInput(
			player,
			map,
			() => {
				console.log('Sraw Map')
			},
			() => {
				console.log('Next Level!')
			}
		)
	}

	let info = $derived({
		Dungeon: `${width}x${height}`,
		Player: `${parseNumber(player.x)}x${parseNumber(player.y)}`,
		Exit: `${parseNumber(exit?.x)}x${parseNumber(exit?.y)}`,
		Rooms: `${rooms.length}`
	})
	let config = $derived({
		Canvas: `${width * tileSize}x${height * tileSize}`,
		MapWidth: width,
		MapHeight: height,
		TileSize: parseNumber(tileSize)
	})
</script>

<section class="page nwp" data-view="dungeon">
	<article>
		<h4>Dungeon</h4>
		<div class="grid grid-cols-2 gap-4 p-2 outline outline-base-300">
			{#each [config, info] as obj, i (i)}
				{@render objList(obj)}
			{/each}
		</div>
	</article>
	{#await init() then value}
		<div class="grid flex-1 place-content-center">
			<Preview {tileSize} {map} {player}></Preview>
		</div>
	{/await}
</section>
<section class="absolute top-2 right-2">
	<div>
		<Preview tileSize={3} {map} {player}></Preview>
	</div>
</section>

{#snippet objList(obj)}
	<div class="flex flex-col divide-y divide-base-300">
		{#each Object.entries(obj) as [k, v] (k)}
			<span class="split p-1">
				<span>{k}</span>
				<span>{v}</span>
			</span>
		{/each}
	</div>
{/snippet}

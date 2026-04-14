<script lang="ts">
	import type { DungeonResult, Position, Room, TileId } from './lib/dungeon'
	import { generateDungeon } from './lib/dungeon'
	import sleep from './lib/utils/sleep'
	import P1 from './P1.svelte'
	let dialog = $state()

	const openDialog = () => {
		if (dialog) {
			dialog.showModal()
		}
	}

	let tileSize = $state(16)

	let options = $state({
		width: 60,
		height: 50,
		algorithm: 'digger',
		roomWidth: [4, 11],
		roomHeight: [3, 6],
		corridorLength: [4, 14],
		dugPercentage: 0.2,
		roomDugPercentage: 0.1
	})

	let map: TileId[][] = $state(null)
	let rooms: Room[] = $state([])
	let start: Position = $state()
	let end: Position = $state()
	let mapSize = $derived({
		Rooms: rooms.length,
		Start: `${start.x} | ${start.y}`
	})

	const getNewMap = async () => {
		await sleep(100)
		const data: DungeonResult = await generateDungeon(options)
		map = data.map
		rooms = data.rooms
		start = data.startPosition
		end = data.endPosition
		// 	  {  map,  rooms,  startPosition,  endPosition  }
		// console.log({ rooms, start, end })
		return data
	}
</script>

<div class="game-container">
	<header class="header"></header>
	<footer class="foo-bar h-36">
		<div class="p-1 text-xs">nwp</div>
	</footer>

	<main class="main">
		<div class="page nwp">
			<article>
				<!-- buttons -->
				<div class="flex gap-1">
					<button
						class="btn btn-primary"
						onclick={() => {
							options.dugPercentage = 0.2
							getNewMap()
						}}>primary</button>
					<button class="btn btn-secondary"onclick={() => {
							options.dugPercentage = 0.3
							getNewMap()
						}}>secondary</button>
					<button class="btn btn-accent"onclick={() => {
							options.dugPercentage = 0.4
							getNewMap()
						}}>accent</button>
				</div>

				<div class="join">
					<input
						class="btn join-item"
						type="radio"
						name="options"
						aria-label="Radio 1" />
					<input
						class="btn join-item"
						type="radio"
						name="options"
						aria-label="Radio 2" />
					<input
						class="btn join-item"
						type="radio"
						name="options"
						aria-label="Radio 3" />
				</div>
				<div>
					<!-- steps -->
					<ul class="steps">
						<li class="step step-primary">Register</li>
						<li class="step step-primary">Choose plan</li>
						<li class="step">Purchase</li>
						<li class="step">Receive Product</li>
					</ul>
				</div>
				<div>
					<details class="dropdown">
						<summary class="btn m-1">open or close</summary>
						<ul
							class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
							<li><a>Item 1</a></li>
							<li><a>Item 2</a></li>
						</ul>
					</details>
				</div>
				{#if map}
					<P1 {map} {start} maxPx={500}></P1>
				{/if}
			</article>
		</div>
	</main>
	<aside class="aside">
		<!-- card -->
		<div class="card m-4 shadow-sm">
			<figure>
				<img src="https://img.daisyui.com/images/blog/daisyui-5.webp" />
			</figure>
			<div class="card-body">
				<h2 class="card-title">DaisyUI 5.0</h2>
				<p>
					Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit
					sit necessitatibus.
				</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" onclick={openDialog}>Show</button>
				</div>
			</div>
		</div>
	</aside>
</div>

<dialog bind:this={dialog} class="modal">
	<form method="dialog" class="modal-box">
		<p class="py-4">Press ESC key or click the button below to close</p>
		<div class="modal-action">
			<button class="btn">Close</button>
		</div>
	</form>
</dialog>

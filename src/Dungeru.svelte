<script lang="ts">
	import Nav from './lib/Nav.svelte'
	import Steps from './lib/Steps.svelte'
	import { NAV } from './lib'
	import type { DungeonResult, Position, Room, TileId } from './lib/dungeon'
	import { generateDungeon } from './lib/dungeon'
	import sleep from './lib/utils/sleep'
	import P1 from './P1.svelte'
	import { Router, Route, Fallback, location } from '@svelte-router/core'
	import Settings from './game/Settings.svelte'
	const NAVMAP = {
		'/': 0,
		'/settings': 1,
		'/dungeon': 2,
		'/arena': 3
	}
	let current = $derived(location.url?.hash.replace('#', '') || '/')
	let currentId = $derived(NAVMAP[current])
	let dialog = $state()

	const openDialog = () => {
		if (dialog) {
			dialog.showModal()
		}
	}

	let tileSize = $state(16)
	let options = $state({
		width: 50,
		height: 30,
		algorithm: 'digger',
		roomWidth: [3, 9],
		roomHeight: [3, 5],
		corridorLength: [3, 10],
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

<Router>
	<main class="main">
		<Route key="lobby" path="/">
			<section class="page nwp" data-view="lobby">
				<article>
					<h4>Lobby</h4>
				</article>
			</section>
		</Route>

		<Route key="settings" path="/settings">
			<section class="page nwp" data-view="settings">
				<article>
					<h4>Settings</h4>
					<Settings
						onGenerate={(details) => {
							options = { ...options, ...details }
							console.log('OnGenerate', options)
							getNewMap()
							openDialog()
						}}></Settings>
				</article>
			</section>
		</Route>

		<Route key="dungeon" path="/dungeon">
			<section class="page nwp" data-view="dungeon">
				<article>
					<h4>Dungeon</h4>
				</article>
			</section>
		</Route>

		<Route key="arena" path="/arena">
			<section class="page nwp" data-view="arena">
				<article>
					<h4>Arena</h4>
				</article>
			</section>
		</Route>
	</main>

	<header class="header"></header>
	<footer class="foo-bar h-36">
		<div class="p-1 text-xs">nwp</div>
	</footer>

	<aside class="aside">
		<Nav vertical data={NAV} {current}>
			<h4>Navigation</h4>
		</Nav>
		<!-- <Steps vertical data={NAV} active={currentId}></Steps> -->
		<Settings
			onGenerate={(details) => {
				options = { ...options, ...details }
				console.log('OnGenerate', options)
				getNewMap()
				openDialog()
			}}></Settings>
	</aside>
</Router>

<dialog bind:this={dialog} class="modal">
	<form method="dialog" class="modal-box">
		{#if map}
			<div class="flex justify-center bg-black">
				<P1 {map} {start} maxPx={400}></P1>
			</div>
		{/if}
		<div class="modal-action">
			<button class="btn">Close</button>
		</div>
	</form>
</dialog>

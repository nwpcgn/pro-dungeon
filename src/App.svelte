<script lang="ts">
	import Dungeon from '$game/Dungeon.svelte'
	import { generateDungeon } from '$game/dungeon'
	import Nav from './lib/Nav.svelte'
	import Steps from './lib/Steps.svelte'
	import { sleep, NAV } from './lib'
	import { Router, Route, Fallback, location } from '@svelte-router/core'
	import Settings from './game/Settings.svelte'
	import Sprites from './lib/Sprites.svelte'
	import Icon from './lib/components/Icon.svelte'
	import Preview from './game/Preview.svelte'
	const NAVMAP = {
		'/': 0,
		'/settings': 1,
		'/dungeon': 2,
		'/arena': 3
	}
	let iconMap = $state([])
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
	let current = $derived(location.url?.hash.replace('#', '') || '/')
	let currentId = $derived(NAVMAP[current])
	let dialog = $state()
	const openDialog = () => {
		if (dialog) {
			dialog.showModal()
		}
	}

	const tileSize = 32

	let dungeon = $state(generateDungeon(options))
</script>

<Router>
	<div class="game-container">
		<main class="main">
			<Route key="lobby" path="/">
				<section class="page nwp" data-view="lobby">
					<article class="flex flex-col items-center">
						<h4>Lobby</h4>
						<nav class="stack-list w-56">
							{#each NAV as { name, href, icon, hidden, slug } (slug)}
								{#if !hidden && current !== href}
									<a class="btn btn-xl" href="#{href}">{name}</a>
								{/if}
							{/each}
						</nav>
					</article>
					<article class="flex-1">
						<div class="img-grid">
							{#each iconMap as { name, icon }, i (i)}
								<button>
									<figure>
										<Icon {icon} />
										<figcaption>{name}</figcaption>
									</figure>
								</button>
							{/each}
						</div>
					</article>
				</section>
			</Route>

			<Route key="settings" path="/settings">
				<section class="page nwp" data-view="settings">
					<article class="flex flex-col items-center">
						<h4>Settings</h4>
						<Settings
							onGenerate={(details) => {
								console.log({ details })
								options = { ...options, ...details }
								dungeon = generateDungeon(options)
								openDialog()
							}}></Settings>
					</article>
					<article class="flex justify-center"></article>
				</section>
			</Route>

			<Route key="dungeon" path="/dungeon">
				<section class="page nwp page-fixed center">
					<Dungeon {dungeon} {tileSize}></Dungeon>
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
			<Steps vertical data={NAV} active={currentId}></Steps>
					{#if dungeon?.map}
			<div class="flex justify-center">
				<Preview {...dungeon} maxPx={360}></Preview>
			</div>
		{/if}
		</aside>
	</div>
</Router>
<Sprites bind:iconMap />

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		{#if dungeon?.map}
			<div class="flex justify-center">
				<Preview {...dungeon} maxPx={420}></Preview>
			</div>
		{/if}
		<div class="modal-action justify-center">
			<button
				class="btn"
				onclick={() => {
					location.navigate('/dungeon')
					dialog.close()
				}}>Start</button>
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

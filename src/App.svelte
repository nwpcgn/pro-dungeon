<script lang="ts">
	import Dungeru from './game/Game.svelte'
	import Sprites from './lib/Sprites.svelte'
	import { Router, Route, Fallback, location } from '@svelte-router/core'
	let current = $derived(location.url?.hash.replace('#', '') || '/')
</script>

<div class="game-container">

		<Dungeru></Dungeru>
	
</div>

<Sprites />

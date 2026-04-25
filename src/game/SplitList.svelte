<script lang="ts">
	let {
		header,
		row,
		obj = {
			VIEW_WIDTH: 16,
			VIEW_HEIGHT: 16,
			TILE_SIZE: 40,
			MAP_WIDTH: 60,
			MAP_HEIGHT: 40,
			MAP_TYPE: 'Digger'
		}
	} = $props()
</script>

{#if header}
	<div>
		{@render header?.()}
	</div>
{/if}

<div class="split-list">
	{#each Object.entries(obj) as [key, val] (key)}
		{@const parseOk = typeof val === 'string' || typeof val === 'number'}
		{#if row}
			{@render row({ key, val })}
		{:else}
			<div>
				<span class="capitalize">{key}</span>
				{#if !parseOk}
					<span
						class="line-clamp-2 bg-neutral p-1 font-mono text-sm text-success"
						>{JSON.stringify(val)}</span>
				{:else}
					<span>{val}</span>
				{/if}
			</div>
		{/if}
	{/each}
</div>

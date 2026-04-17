<script lang="ts">
	let { data, active, vertical, children } = $props()
</script>

<div>
	{@render children?.()}
	<ul class="steps w-full" class:steps-vertical={vertical}>
		{#each data as { name }, i (i)}
			<li class="step" class:step-info={active >= i}>
				<span class:text-info={active >= i}>{name}</span>
			</li>
		{/each}
	</ul>
</div>

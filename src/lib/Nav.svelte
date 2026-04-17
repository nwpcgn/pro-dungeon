<script lang="ts">
	let { data, current, vertical, children } = $props()
</script>

<nav class:stack-list={vertical} class:nav={!vertical}>
	{@render children?.()}
	{#each data as { name, href, icon, slug } (slug)}
		<a href="#{href}">
			<span class="split" class:text-info={current === href}>
				<span>{name}</span>
				<svg class="nwp-icon"><use xlink:href="#{icon}"></use></svg>
			</span>
		</a>
	{/each}
</nav>

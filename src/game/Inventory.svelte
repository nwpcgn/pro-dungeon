<script lang="ts">
	import type { Item } from './items'

	type Props = {
		inventory: Item[]
		onUse: (item: Item) => void
		onDrop: (item: Item) => void
	}
	let { inventory, onUse, onDrop }: Props = $props()

	// Welches Item ist gerade ausgewählt (per Index im Array)
	let selectedIndex = $state<number | null>(null)

	const selectedItem = $derived(
		selectedIndex !== null ? inventory[selectedIndex] : null
	)

	// Gruppiert für die Listenanzeige — aber selectedIndex zeigt auf Original-Array
	const grouped = $derived(
		Object.values(
			inventory.reduce<Record<string, { item: Item; indices: number[] }>>(
				(acc, item, i) => {
					if (acc[item.name]) {
						acc[item.name].indices.push(i)
					} else {
						acc[item.name] = { item, indices: [i] }
					}
					return acc
				},
				{}
			)
		)
	)

	function handleUse() {
		if (!selectedItem) return
		onUse(selectedItem)
		selectedIndex = null
	}

	function handleDrop() {
		if (!selectedItem) return
		onDrop(selectedItem)
		selectedIndex = null
	}
</script>

<div class="inventory">
	<section class="stack-list callout">
		<header class="split font-bold tracking-wide">
			<span>Inventar </span>
			<span>({inventory.length})</span>
		</header>
		<hr />
		{#if inventory.length === 0}
			<div class="split text-sm tracking-wide opacity-60">
				<span class="italic"> — leer —</span>
				<span></span>
			</div>
		{:else}
			{#each grouped as { item, indices }}
				{@const isSelected =
					selectedIndex !== null && indices.includes(selectedIndex)}

				<button
					class="split"
					class:selected={isSelected}
					onclick={() => (selectedIndex = isSelected ? null : indices[0])}>
					<span class="nav">
						<span class="item-char" style="color: {item.color}"
							>{item.char}</span>
						<span class="flex-1">{item.name}</span>
					</span>

					{#if indices.length > 1}
						<span class="item-count">×{indices.length}</span>
					{/if}
				</button>
			{/each}
		{/if}
		<hr />
	</section>



	<div class="stack-list">
		{#if selectedItem}
			<div class="split">
				<div class="nav">
					<span style="color: {selectedItem.color}; font-size: 1.2rem"
						>{selectedItem.char}</span>
					<span class="detail-name">{selectedItem.name}</span>
				</div>

				<div class="nav">
					<button class="btn btn-accent" onclick={handleUse}>▶ Benutzen</button>
					<button class="btn btn-info" onclick={handleDrop}>↓ Wegwerfen</button>
				</div>
			</div>
		{:else}
			<div class="split">
				<div class="detail-empty">Auswählen…</div>
				<button class="btn opacity-0">x</button>
			</div>
		{/if}
	</div>

	<!-- Detail & Aktionen -->
</div>

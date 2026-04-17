<script lang="ts">
	const typeList = ['Digger', 'Uniform']
	let { onGenerate } = $props()
	let mainOp = $state({
		Digger: {
			roomWidth: [3, 9],
			roomHeight: [3, 5],
			corridorLength: [3, 10],
			dugPercentage: 0.2
		},
		Uniform: {
			roomWidth: [3, 9],
			roomHeight: [3, 5],
			roomDugPercentage: 0.1
		}
	})
	let actType = $state(typeList[0])
	let config1 = $state({
		width: 50,
		height: 30,
		tsize: 16
	})
	let config2 = $derived({
		width: config1.width,
		height: config1.height,
		options: mainOp[actType]
	})
	let options = $derived({
		width: config1.width,
		height: config1.height,
		algorithm: actType.toLowerCase(),
		...mainOp[actType]
	})
	const createGrid = <T,>(fill: T) =>
		Array.from({ length: config1.height }, () =>
			Array(config1.width).fill(fill)
		)

	const generate = async () => {
		// { tiles, rooms, corridorCount, start, exit }
		onGenerate(options)
	}

	// generate()
</script>

<div class="flex flex-col gap-4">
	<div class="join grid grid-cols-2">
		{#each typeList as type (type)}
			<input
				class="btn join-item"
				type="radio"
				value={type}
				bind:group={actType}
				aria-label={type} />
		{/each}
	</div>
	<div class="padded grid grid-cols-2 gap-4 bg-base-100 outline-2">
		{@render form1()}
		{@render form2()}
	</div>

	<div class="grid bg-base-200">
		<button class="btn btn-info" onclick={generate}>Generate</button>
	</div>
</div>

{#snippet form1()}
	<div class="contents">
		{#each Object.entries(config1) as [k, v] (k)}
			{@render numberInput(k, v)}
		{/each}
	</div>
{/snippet}

{#snippet form2()}
	<div class="contents">
		{#each Object.entries(config2.options) as [k, v] (k)}
			{#if k.includes('Percentage')}
				{@render rangeInput(k, v)}
			{:else if k.includes('room') || k.includes('corridor')}
				{@render numberInput2(k, v)}
			{:else if k.includes('topology') || k.includes('cell')}
				{@render numberInput(k, v)}
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet numberInput(key, value)}
	<div class="col-span-2">
		<label class="floating-label">
			<span>{key}</span>
			<input
				type="number"
				onchange={(e) => {
					config1[key] = e.currentTarget.value
				}}
				{value}
				class="input w-full" />
		</label>
	</div>
{/snippet}
{#snippet numberInput2(key, values)}
	{#each values as value, i (i)}
		<label class="floating-label">
			<span>{key} {i == 0 ? 'Min' : 'Max'}</span>
			<input
				type="number"
				{value}
				class="input"
				onchange={(e) => {
					mainOp[actType][key][i] = e.currentTarget.value
				}} />
		</label>
	{/each}
{/snippet}

{#snippet rangeInput(key, value)}
	<fieldset class="col-span-2 flex flex-col gap-1 border-2 border-base-300 p-2">
		<div class="split">
			<span>{key}</span>
			<span>{value}</span>
		</div>

		<input
			type="range"
			min="0"
			max="1"
			{value}
			step={0.05}
			onchange={(e) => {
				mainOp[actType][key] = e.currentTarget.value
			}}
			class="range w-full" />
	</fieldset>
{/snippet}

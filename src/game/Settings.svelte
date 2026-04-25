<script lang="ts">
	import SplitList from './SplitList.svelte'
</script>


	<SplitList>
		{#snippet row({ key, val })}
			<div>
				<h6>{key}</h6>
				<div>{val}</div>
			</div>
		{/snippet}
	</SplitList>


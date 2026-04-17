<script lang="ts">
	import type { Snippet } from 'svelte'
	let {
		children,
		elem = $bindable(),
		id = 'popover-1'
	}: { children: Snippet; elem: HTMLDivElement; id: string } = $props()

	const close = () => {
		elem?.hidePopover()
	}
</script>

<div bind:this={elem} {id} class="popup-block" popover="manual">
	<button aria-label="Close" class="btn-close" onclick={close}>
		<svg class="nwp-icon"><use xlink:href="#game-close"></use></svg>
	</button>
	{@render children?.()}
</div>

<style>
	.btn-close {
		width: fit-content;
		height: fit-content;
		text-align: center;
		padding: min(0.1vw, 0.27rem) min(0.1vw, 0.27rem) min(0.25vw, 0.27rem)
			min(0.8vw, 0.29rem);
		color: rgba(255, 255, 255, 1);
		background: rgba(0, 0, 0, 1);
		position: absolute;
		top: 0;
		right: 0;
	}
	.popup-block {
		max-width: 300px;
		inset: unset;
		padding: min(6vw, 1.5rem);
		padding: 0;
		border: 5px solid #000;
		background: #fff;
		transition:
			opacity 0.5s,
			transform 0.5s,
			overlay 0.5s allow-discrete,
			display 0.5s allow-discrete;
		opacity: 0;
		transform: translate(0, 15%);
		overflow: hidden;
	}

	.popup-block:popover-open {
		/* 設置彈窗開啟樣式 */
		opacity: 1;
		transform: translate(0, 0);
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	@starting-style {
		/* 設置未開啟彈窗樣式 */
		.popup-block:popover-open {
			opacity: 0;
			transform: translate(0, 15%);
		}
	}

	/* 彈窗背景遮罩 ::backdrop */
	.popup-block1.popup-block1::backdrop {
		transition:
			background-color 1.1s,
			backdrop-filter 1.1s;
		backdrop-filter: blur(0px);
	}
	.popup-block1:popover-open::backdrop {
		/* 設置彈窗開啟樣式 */
		background-color: rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(3px);
		transition:
			background-color 0.42s,
			backdrop-filter 0.42s;
	}

	@starting-style {
		/* 設置未開啟彈窗樣式 */
		.popup-block:popover-open::backdrop {
			background-color: rgba(0, 0, 0, 0);
			backdrop-filter: blur(0px);
		}
	}
</style>

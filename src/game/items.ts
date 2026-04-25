export type Item = {
	name: string
	char: string
	color: string
}

export const ITEM_TYPES: Record<string, Item> = {
	POTION: { name: 'Heiltrank', char: '!', color: '#f0f' },
	SWORD: { name: 'Schwert', char: '/', color: '#aaa' },
	GOLD: { name: 'Gold', char: '*', color: 'gold' }
}

export function randomItem(): Item {
	const keys = Object.keys(ITEM_TYPES)
	return ITEM_TYPES[keys[Math.floor(Math.random() * keys.length)]]
}

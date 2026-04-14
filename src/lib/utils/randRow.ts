import { RNG } from 'rot-js'

export const randRow = (arr = []) => {
	const i = Math.floor(RNG.getUniform() * arr.length)
	return i
}
export default randRow

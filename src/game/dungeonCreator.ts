export type OptionsDigger = {
	roomWidth: number[]
	roomHeight: number[]
	corridorLength: number[]
	dugPercentage: number
	timeLimit: number
}

export type Digger = {
	width: number
	height: number
	options: OptionsDigger
}

export type OptionsUniform = {
	roomWidth: number[]
	roomHeight: number[]
	roomDugPercentage: number
	timeLimit: number
}

export type Uniform = {
	width: number
	height: number
	options: OptionsUniform
}

export type Options2 = {
	cellWidth: number
	cellHeight: number
}

export type Rogue = {
	width: number
	height: number
	options: Options2
}

export type OptionsCell = {
	born: number[]
	survive: number[]
	topology: number
}

export type Cellular = {
	width: number
	height: number
	options: OptionsCell
}

export type GeneratorTypes = {
	Digger: Digger
	Uniform: Uniform
	Rogue: Rogue
	Cellular: Cellular
}

const generators: GeneratorTypes = {
	Digger: {
		width: 25,
		height: 25,
		options: {
			roomWidth: [3, 9],
			roomHeight: [3, 5],
			corridorLength: [3, 10],
			dugPercentage: 0.2
		}
	},
	Uniform: {
		width: 25,
		height: 25,
		options: {
			roomWidth: [3, 9],
			roomHeight: [3, 5],
			roomDugPercentage: 0.1
		}
	},
	Rogue: {
		width: 25,
		height: 25,
		options: {
			cellWidth: 3,
			cellHeight: 3
		}
	},
	Cellular: {
		width: 25,
		height: 25,
		options: {
			born: [5, 6, 7, 8],
			survive: [4, 5, 6, 7, 8],
			topology: 8
		}
	}
}

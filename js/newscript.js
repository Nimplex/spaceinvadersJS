// --------------------------------------------------- //

const { keys, directions, types } = {
	keys: {
		left: 'KeyA',
		rigth: 'KeyD',
		space: 'Space',
	},
	directions: {
		left: 1,
		right: 2,
		up: 3,
		down: 4,
		none: 0,
	},
	types: {
		enemy: 0,
		player: 1,
	},
}

// --------------------------------------------------- //

const menu = document.getElementById('menu')
const menuOver = document.getElementById('menu_over')
const menuStart = document.getElementById('menu_start')

// --------------------------------------------------- //

// Play game
const playButton = document.getElementById('playButton')
// Open shop
const shopButton = document.getElementById('shopButton')
// Retry game
const retryButton = document.getElementById('retryButton')
// Back to main menu
const backButton = document.getElementById('backButton')

// --------------------------------------------------- //

class Bullet {} // TODO:...

class Character {} // TODO:...

class Game {
	constructor() {
		this.started = false
		this.over = false

		menuStart.style.display = 'none'
		menuOver.style.display = 'none'
		menu.style.display = 'none'

		playButton.onclick = () => {
			this.started = true
		}
		retryButton.onclick = () => {
			this.reset()
			this.started = true
		}
		backButton.onclick = () => {
			this.started = false
			this.over = false
		}

		setInterval(() => {
			if (this.started) {
				menuStart.style.display = 'none'
				menuOver.style.display = 'none'
				menu.style.display = 'none'
				this.update()
			}
			if (this.over) {
				menu.style.display = 'flex'
				menuOver.style.display = 'block'
				menuStart.style.display = 'none'
			}
			if (!this.started && !this.over) {
				menu.style.display = 'flex'
				menuStart.style.display = 'block'
				menuOver.style.display = 'none'
			}
		}, 1)
	}

	update() {
		console.log('Update')
	}
	draw() {}
	reset() {
		this.over = false
		this.started = false
	}
}

// --------------------------------------------------- //

window.onload = () => new Game()

// --------------------------------------------------- //

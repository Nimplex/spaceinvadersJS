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
const menuShop = document.getElementById('menu_shop')

// --------------------------------------------------- //

// Play game
const playButton = document.getElementById('playButton')
// Open shop
const shopButton = document.getElementById('shopButton')
// Retry game
const retryButton = document.getElementById('retryButton')
// Back to main menu
const backButton = document.getElementsByClassName('backButton')

// --------------------------------------------------- //

class Bullet {} // TODO:...

class Character {} // TODO:...

class Game {
	constructor() {
		this.started = false
		this.over = false
		this.shop = false

		menuStart.style.display = 'none'
		menuOver.style.display = 'none'
		menu.style.display = 'none'

		playButton.onclick = () => {
			this.started = true
			this.shop = false
			this.over = false
		}
		shopButton.onclick = () => {
			this.started = false
			this.shop = true
			this.over = false
		}
		retryButton.onclick = () => {
			this.reset()
			this.started = true
			this.shop = false
			this.over = false
		}
		for (const button of backButton) {
			button.onclick = () => {
				this.started = false
				this.over = false
				this.shop = false
			}
		}

		setInterval(() => {
			if (this.started) {
				menuStart.style.display = 'none'
				menuShop.style.display = 'none'
				menuOver.style.display = 'none'
				menu.style.display = 'none'
				this.update()
			}
			if (this.over) {
				menuStart.style.display = 'none'
				menuShop.style.display = 'none'
				menuOver.style.display = 'block'
				menu.style.display = 'flex'
			}
			if (!this.started && !this.over && !this.shop) {
				menuStart.style.display = 'block'
				menuShop.style.display = 'none'
				menuOver.style.display = 'none'
				menu.style.display = 'flex'
			}
			if (this.shop) {
				menuStart.style.display = 'none'
				menuShop.style.display = 'block'
				menu.style.display = 'flex'
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

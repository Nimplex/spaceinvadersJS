const KEYS = {
	A: 'KeyA',
	D: 'KeyD',
	E: 'KeyE',
	SPACE: 'Space'
}

const DIRECTION = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	NONE: 10
}

const TYPES = {
	ENEMY: 0,
	PLAYER: 1
}

const gameStart = document.getElementById('game_start')
const gameOver = document.getElementById('game_over')
const gameWon = document.getElementById('game_won')

class Bullet {
	constructor(ctx, canvas, game, obj, direction = DIRECTION.UP) {
		this.obj = obj
		this.ctx = ctx
		this.canvas = canvas
		this.game = game
		this.height = 5
		this.width = 5
		this.y = obj.y - this.height
		this.x = obj.x + (obj.width - this.width) / 2
		this.direction = direction
	}
	update() {
		if (this.direction == DIRECTION.UP) this.y -= 1
		if (this.direction == DIRECTION.DOWN) this.y += 1
	}
	draw() {
		this.direction == DIRECTION.DOWN ? this.ctx.fillStyle = '#FF0000' : null
		this.ctx.fillRect(this.x, this.y, this.width, this.height)
		this.ctx.fillStyle = '#FFFFFF'
	}
}

class Enemy {
	constructor(ctx, canvas, game, x, y) {
		this.type = TYPES.ENEMY
		this.ctx = ctx
		this.canvas = canvas
		this.game = game
		this.height = 30
		this.width = 70
		this.y = y - (this.height / 2)
		this.x = x - (this.width / 2)
		this.direction = DIRECTION.NONE
		this.timeout = ''
		
		const images = ['./assets/spaceship_r.png', './assets/spaceship_y.png', './assets/spaceship_b.png', './assets/spaceship_g.png']
		this.image = new Image(304, 132)
		this.image.src = images[Math.floor(Math.random() * images.length)]

		this.timeout = setInterval(() => {
			if (this.game.started) this.y += 20
		}, 6500)
	}
	update() {
		if (this.y >= this.canvas.height - (this.height * 3)) {
			clearInterval(this.timeout)
			this.game.gameOver()
		}
		this.game.bullets.forEach(bullet => {
			if (
				this.x < bullet.x + bullet.width &&
				this.x + this.width > bullet.x &&
				this.y < bullet.y + bullet.height &&
				this.y + this.height > bullet.y
			) {
				if (bullet.obj.type == TYPES.ENEMY) return
				const bulletIndex = this.game.bullets.indexOf(bullet)
				const enemyIndex = this.game.enemies.indexOf(this)
				delete this.game.bullets[bulletIndex]
				delete this.game.enemies[enemyIndex]
			}
		})
		if (Math.floor(Math.random() * 4000) == 2837) this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game, this, DIRECTION.DOWN))
	}
	draw() {
		this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
		// this.ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

class Player {
	constructor(ctx, canvas, game) {
		this.type = TYPES.PLAYER
		this.ctx = ctx
		this.canvas = canvas
		this.game = game
		this.height = 40
		this.width = 50
		this.y = this.canvas.height - (this.height + 20)
		this.x = (this.canvas.width / 2) - (this.width / 2)
		this.direction = DIRECTION.NONE

		this.image = new Image(304, 132)
		this.image.src = './assets/player.png'

		this.shootTimeout = false

		window.addEventListener('keydown', (e) => {
			if (e.code == KEYS.A) this.direction = DIRECTION.LEFT
			if (e.code == KEYS.D) this.direction = DIRECTION.RIGHT
			if (e.code == KEYS.SPACE) {
				if (!this.shootTimeout) {
					setTimeout(() => this.shootTimeout = false, 10)
					this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game, this))
				}
				if (!this.shootTimeout) this.shootTimeout = true
			}
		})
		window.addEventListener('keyup', (e) => {
			if (e.code == KEYS.A && this.direction == DIRECTION.LEFT) this.direction = DIRECTION.NONE
			if (e.code == KEYS.D && this.direction == DIRECTION.RIGHT) this.direction = DIRECTION.NONE
		})
	}
	update() {
		this.game.bullets.forEach(bullet => {
			if (
				this.x < bullet.x + bullet.width &&
				this.x + this.width > bullet.x &&
				this.y < bullet.y + bullet.height &&
				this.y + this.height > bullet.y
			) {
				if (bullet.obj.type == TYPES.PLAYER) return
				const bulletIndex = this.game.bullets.indexOf(bullet)
				delete this.game.bullets[bulletIndex]
				this.game.gameOver()
			}
		})
		if (this.x < 0) this.x = 0
		if (this.x > this.canvas.width - this.width) this.x = this.canvas.width - this.width
		if (this.direction == DIRECTION.LEFT) this.x -= 2
		if (this.direction == DIRECTION.RIGHT) this.x += 2
	}
	draw() {
		this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
	}
}

class Game {
	constructor() {
		this.canvas = document.getElementById('canvas')
		this.ctx = this.canvas.getContext('2d')

		this.canvas.width = document.documentElement.clientWidth
		this.canvas.height = document.documentElement.clientHeight

		this.ctx.fillStyle = '#0f0f0f'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.over = false

		this.bullets = []
		this.enemies = []
		this.player = new Player(this.ctx, this.canvas, this)

		let time;
		let timeout = false;
		let delta = 200;

		window.addEventListener('resize', () => {
			time = new Date()
			if (timeout === false) {
				timeout = true
				setTimeout(resizeend, delta)
			}
		})
		
		const resizeend = () => {
			if (new Date() - time < delta) {
				setTimeout(resizeend, delta)
			} else {
				timeout = false
				location.reload()
			}
		}

		window.addEventListener('keydown', (event) => !this.over ? event.code == KEYS.E ? this.startGame() : null : null)

		for (let y = 1; y <= 3; y++) {
			for (let i = 1; i <= Math.floor(this.canvas.width / 110); i++) 
				this.enemies.push(new Enemy(this.ctx, this.canvas, this, (90 + Math.floor(this.canvas.width / 110)) * i, 40 * y))
		} 

		this.started = false

		setInterval(() => {
			if (this.started) {
				this.update()
				this.draw()
			}
		}, 0)
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}
	update() {
		this.player.update()
		this.bullets.forEach(bullet => {
			const bulletIndex = this.bullets.indexOf(bullet)
			if (bullet.y <= 0) delete this.bullets[bulletIndex]
			bullet.update()
		})
		// const random = Math.floor(Math.random() * 4000)
		// if ([2173, 2381, 21, 283, 1928].includes(random)) {
		// 	console.log('123')
		// 	if ([true, false][Math.floor(Math.random() * 1)])
		// 		this.enemies.forEach(enemy => {
		// 			enemy.x == 0 ? x += 6 : null
		// 			enemy.x -= 3
		// 		})
		// 	else
		// 		this.enemies.forEach(enemy => {
		// 			enemy.x == this.canvas.width ? x -= 6 : null
		// 			enemy.x += 3
		// 		})
		// }
		this.enemies.forEach(enemy => {
			enemy.update()
		})
		if (this.enemies.filter((el) => el.x ? true : false).length == 0) this.gameWon()
	}
	startGame() {
		this.clear()
		this.started = true
		gameStart.style.display = 'none'
	}
	gameWon() {
		this.clear()
		if (this.started) gameWon.style.display = 'flex'
		this.started = false
		this.over = true
	}
	gameOver() {
		this.clear()
		if (this.started) gameOver.style.display = 'flex'
		this.started = false
		this.over = true
	}
	draw() {
		this.clear()
		this.ctx.fillStyle = '#0f0f0f'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.fillStyle = '#FFFFFF'
		this.player.draw()
		this.bullets.forEach(bullet => bullet.draw())
		this.enemies.forEach(enemy => enemy.draw())
	}
}

window.onload = new Game()

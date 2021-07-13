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
const shoot = new Audio('/assets/shoot.wav')
const explosion = new Audio('/assets/explosion.wav')

let time
let timeout = false
let delta = 200
let moveToLeft = false

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
		this.speed = 1.5
		const random = Math.floor(Math.random() * 3)
		if (Math.floor(Math.random() * 10) == random) this.speed = random == 0 ? 1 : random
	}
	update() {
		if (this.direction == DIRECTION.UP) this.y -= this.speed
		if (this.direction == DIRECTION.DOWN) this.y += this.speed
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
		this.height = 50
		this.width = 100
		this.y = y - (this.height / 2)
		this.x = x - (this.width / 2)
		this.direction = DIRECTION.NONE
		this.timeout = ''
		
		const images = ['./assets/spaceship_r.png']
		this.image = new Image()
		this.image.src = images[Math.floor(Math.random() * images.length)]

		this.timeout = setInterval(() => {
			if (this.game.started) this.y += 20
		}, 2000)
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
				explosion.play()
			}
		})
		if (Math.floor(Math.random() * 1000) == 532) this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game, this, DIRECTION.DOWN))
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
		this.height = 80
		this.width = 100
		this.y = this.canvas.height - (this.height + 20)
		this.x = (this.canvas.width / 2) - (this.width / 2)
		this.direction = DIRECTION.NONE

		this.image = new Image()
		this.image.src = './assets/player.png'

		this.shootTimeout = false

		window.addEventListener('keydown', (e) => {
			if (e.code == KEYS.A) this.direction = DIRECTION.LEFT
			if (e.code == KEYS.D) this.direction = DIRECTION.RIGHT
			if (e.code == KEYS.SPACE && this.game.over) {
				if (!this.shootTimeout) {
					setTimeout(() => this.shootTimeout = false, 391)
					this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game, this))
					shoot.play()
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
		this.ctx.imageSmoothingEnabled = false
		this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

		this.canvas.width = document.documentElement.clientWidth
		this.canvas.height = document.documentElement.clientHeight

		this.ctx.fillStyle = '#0f0f0f'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.over = false
		this.started = false

		this.bullets = []
		this.enemies = []
		this.player = new Player(this.ctx, this.canvas, this)

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

		setInterval(() => {
			if (this.started) {
				this.update()
				this.draw()
			}
		}, 0)

		const enemy = new Enemy(this.ctx, this.canvas, this, -900, -900)

		setInterval(() => {
			const enemies = this.enemies.filter((el) => el.x ? true : false)
			if (enemies[0].x <= 0) moveToLeft = false
			if (enemies[enemies.length - 1].x >= this.canvas.width - (enemy.width + 20) || moveToLeft) {
				moveToLeft = true
				this.enemies.forEach(enemy => {
					for (let i = 0; i <= 5; i++) {
						((t) => {
							setTimeout(() => { enemy.x -= 5 }, 200 * t)
						})(i)
					}
				})
			} else if (!moveToLeft) {
				this.enemies.forEach(enemy => {
					for (let i = 0; i <= 5; i++) {
						((t) => {
							setTimeout(() => { enemy.x += 5 }, 200 * t)
						})(i)
					}
				})
			}
		}, 1000)
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
		this.enemies.forEach(enemy => {
			enemy.update()
		})
		if (this.enemies.filter((el) => el.x ? true : false).length == 0) this.gameWon()
	}
	startGame() {
		this.clear()
		this.over = true
		this.started = true
		gameStart.style.display = 'none'
	}
	gameWon() {
		this.clear()
		if (this.started) gameWon.style.display = 'flex'
		this.started = false
		this.over = true
		setTimeout(() => location.reload(), 3000)
	}
	gameOver() {
		this.clear()
		if (this.started) gameOver.style.display = 'flex'
		this.started = false
		this.over = true
		explosion.play()
		setTimeout(() => location.reload(), 3000)
	}
	draw() {
		this.clear()
		this.ctx.fillStyle = '#FFFFFF'
		this.player.draw()
		this.bullets.forEach(bullet => bullet.draw())
		this.enemies.forEach(enemy => enemy.draw())
	}
}

window.onload = new Game()

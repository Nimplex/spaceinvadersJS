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
		this.width = 90
		this.y = y - (this.height / 2)
		this.x = x - (this.width / 2)
		this.direction = DIRECTION.NONE
		this.timeout = ''
		this.timeout = setInterval(() => {
			if (this.game.started) this.y += 20
		}, 8000)
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
		this.ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

class Player {
	constructor(ctx, canvas, game) {
		this.type = TYPES.PLAYER
		this.ctx = ctx
		this.canvas = canvas
		this.game = game
		this.height = 20
		this.width = 20
		this.y = this.canvas.height - (this.height + 20)
		this.x = (this.canvas.width / 2) - (this.width / 2)
		this.direction = DIRECTION.NONE

		window.addEventListener('keydown', (e) => {
			if (e.code == KEYS.A) this.direction = DIRECTION.LEFT
			if (e.code == KEYS.D) this.direction = DIRECTION.RIGHT
			if (e.code == KEYS.SPACE) this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game, this))
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
		this.ctx.fillRect(this.x, this.y, this.width, this.height)
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

		this.bullets = []
		this.enemies = []
		this.player = new Player(this.ctx, this.canvas, this)

		window.addEventListener('keydown', (event) => event.code == KEYS.E ? this.startGame() : null)

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
		this.enemies.forEach(enemy => enemy.update())
	}
	startGame() {
		this.started = true
		gameStart.style.display = 'none'
	}
	gameOver() {
		if (this.started) gameOver.style.display = 'flex'
		this.started = false
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

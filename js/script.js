const KEYS = {
	A: 'KeyA',
	D: 'KeyD',
	SPACE: 'Space'
}

const DIRECTION = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	NONE: 10
}

class Bullet {
	constructor(ctx, canvas, game) {
		this.ctx = ctx
		this.canvas = canvas
		this.game = game
		this.height = 5
		this.width = 5
		this.y = this.game.player.y - this.height
		this.x = this.game.player.x + (this.game.player.width - this.width) / 2
		this.direction = DIRECTION.UP
	}
	update() {
		if (this.direction == DIRECTION.UP) this.y -= 1
	}
	draw() {
		this.ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

class Player {
	constructor(ctx, canvas, game) {
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
			if (e.code == KEYS.SPACE) this.game.bullets.push(new Bullet(this.ctx, this.canvas, this.game))
		})
		window.addEventListener('keyup', (e) => {
			if (e.code == KEYS.A && this.direction == DIRECTION.LEFT) this.direction = DIRECTION.NONE
			if (e.code == KEYS.D && this.direction == DIRECTION.RIGHT) this.direction = DIRECTION.NONE
		})
	}
	update() {
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

		this.bullets = []
		this.player = new Player(this.ctx, this.canvas, this)

		this.started = true

		setInterval(() => {
			if (this.started) this.update()
			this.draw()
		}, 0)
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}
	update() {
		this.player.update()
		this.bullets.forEach(bullet => {
			const bulletIndex = this.bullets.indexOf(bullet)
			if (bullet.y <= 0) this.bullets.splice(bulletIndex, bulletIndex + 1)
			bullet.update()
		})
	}
	draw() {
		this.clear()
		this.ctx.fillStyle = '#0f0f0f'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.fillStyle = '#FFFFFF'
		this.player.draw()
		this.bullets.forEach(bullet => bullet.draw())
	}
}

window.onload = new Game()

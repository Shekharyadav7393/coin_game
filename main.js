const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1f1f1f',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [StartScene, GameScene, EndScene]
};

new Phaser.Game(config);
function StartScene() {
  Phaser.Scene.call(this, { key: 'StartScene' });
}
StartScene.prototype = Object.create(Phaser.Scene.prototype);

StartScene.prototype.create = function () {
  this.add.text(250, 220, 'COIN COLLECTOR', {
    fontSize: '32px',
    fill: '#00ffcc'
  });

  const playBtn = this.add.text(360, 300, 'PLAY', {
    fontSize: '24px',
    fill: '#ffffff'
  }).setInteractive();

  playBtn.on('pointerdown', () => {
    this.scene.start('GameScene');
  });
};
function GameScene() {
  Phaser.Scene.call(this, { key: 'GameScene' });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);

GameScene.prototype.preload = function () {
  this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  this.load.image('coin', 'https://labs.phaser.io/assets/sprites/coin.png');
  this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/robot.png');
};

GameScene.prototype.create = function () {
  this.score = 0;
  this.timeLeft = 45;
  this.player = this.physics.add.sprite(400, 300, 'player');
  this.player.setCollideWorldBounds(true);
  this.enemy = this.physics.add.sprite(100, 100, 'enemy');
  this.enemySpeed = 80;
  this.coins = this.physics.add.group();
  this.scoreText = this.add.text(20, 20, 'Score: 0', { fill: '#ffffff' });
  this.timeText = this.add.text(650, 20, 'Time: 45', { fill: '#ffffff' });
  this.cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
  this.physics.add.overlap(this.player, this.enemy, this.endGame, null, this);
  this.time.addEvent({
    delay: 1200,
    callback: this.spawnCoin,
    callbackScope: this,
    loop: true
  });
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      this.timeLeft--;
      this.timeText.setText('Time: ' + this.timeLeft);

      if (this.timeLeft <= 0) {
        this.scene.start('EndScene', { score: this.score });
      }
    },
    loop: true
  });
};
GameScene.prototype.update = function () {
  this.player.setVelocity(0);
  if (this.cursors.left.isDown) this.player.setVelocityX(-200);
  if (this.cursors.right.isDown) this.player.setVelocityX(200);
  if (this.cursors.up.isDown) this.player.setVelocityY(-200);
  if (this.cursors.down.isDown) this.player.setVelocityY(200);
  this.physics.moveToObject(this.enemy, this.player, this.enemySpeed);
};
GameScene.prototype.spawnCoin = function () {
  const x = Phaser.Math.Between(50, 750);
  const y = Phaser.Math.Between(50, 550);
  this.coins.create(x, y, 'coin');
};
GameScene.prototype.collectCoin = function (player, coin) {
  coin.destroy();
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score);
};
GameScene.prototype.endGame = function () {
  this.scene.start('EndScene', { score: this.score });
};
function EndScene() {
  Phaser.Scene.call(this, { key: 'EndScene' });
}
EndScene.prototype = Object.create(Phaser.Scene.prototype);

EndScene.prototype.init = function (data) {
  this.finalScore = data.score;
};

EndScene.prototype.create = function () {
  this.add.text(300, 240, 'GAME OVER', {
    fontSize: '30px',
    fill: '#ff4444'
  });

  this.add.text(320, 290, 'Score: ' + this.finalScore, {
    fontSize: '22px',
    fill: '#ffffff'
  });

  const restartBtn = this.add.text(330, 340, 'RESTART', {
    fontSize: '22px',
    fill: '#00ffcc'
  }).setInteractive();

  restartBtn.on('pointerdown', () => {
    this.scene.start('GameScene');
  });
};

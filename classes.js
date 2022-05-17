'use strict';

class BigTank {
  constructor(collection = new Map()) {
    const KEYS = collection.keys();
    const SIDE_ARRAY = ['top', 'left', 'bottom', 'right'];
    for (const key of KEYS) {
      this[key] = collection.get(key);
    }
    for (const key of SIDE_ARRAY) {
      this[key] = `url(sprites/${collection.get('image')}-${key}.png)`;
    }
  }

  active() {
    if (k === 0) {
      const tempPoints = player.points;
      player = Object.assign(player, this);
      player.points = tempPoints;
      subtPoints(player, this);
      showPoints();
      hangar.style.display = 'none';
      game();
      player.tank = this.image.toUpperCase();
    }
  }

  die() {
    this.el.parentNode.removeChild(this.el);
  }
}

class SmallTank extends BigTank {
  constructor(collection = new Map()) {
    super(collection);
    this.width = collection.get('size');
    this.height = collection.get('size');
  }
}

const SIDES = {
  'top': 'right',
  'right': 'bottom',
  'bottom': 'left',
  'left': 'top',
};

class Enemy extends SmallTank {
  constructor(collection = new Map()) {
    super(collection);
    this.name = collection.get('name');
    this.points = collection.get('points');
    this.x = collection.get('x');
    this.y = collection.get('y');
    this.side = collection.get('side');
    this.reload = true;
  }

  find() {
    this.el = document.querySelector(`.${this.name}`);
  }

  back() {
    this.el.style.backgroundImage = this[this.side];
  }

  spawn() {
    const div = document.createElement('div');
    div.className = `${this.name}`;
    div.style.display = 'block';
    if (this.name === 'enemy2' || this.name === 'enemy3') {
      this.x -= this.width;
    }
    if (this.name === 'enemy3' || this.name === 'enemy4') {
      this.y -= this.height;
    }
    div.style.left = `${this.x}px`;
    div.style.top = `${this.y}px`;
    div.style.height = `${this.height}px`;
    div.style.width = `${this.width}px`;
    div.classList.add('enemy');
    gamezone.append(div);
    this.find();
    this.back();
  }

  shoot() {
    if (this.reload) {
      setTimeout(() => {
        playAudio(SHOOTINGAUDIOS.M4)
          .then(startTimeAudio(SHOOTINGAUDIOS.M4));
        oneBullet(this);
      }, 500);
      stopAudio(SHOOTINGAUDIOS.M4);
      startTimeAudio(SHOOTINGAUDIOS.M4);
      this.reload = false;
      setTimeout(() => {
        this.reload = true;
      }, this.bullettime);
    }
  }

  difference(size, side) {
    return Math.abs(this[side] + this[size] / 2 - player[side] - player[size] / 2);
  }

  border(usableSize, speed, size, sign, side) {
    const AXIS = {
      'y': [this, 'right', 'left', this.x + this.width < player.x, this.x > player.x + player.width],
      'x': [this, 'top', 'bottom', this.y > player.y + player.height, this.y + this.height < player.y],
    };

    const DIFFERENCE = this.difference(size, side);
    if (sign * this[side] > usableSize) {
      if (DIFFERENCE  < this[size] / 4) {
        turnToCollision(...AXIS[side]);
        this.shoot();
      } else {
        this[side] -= sign * speed;
        if (side === 'y') {
          this.el.style.top = `${this.y}px`;
        } else {
          this.el.style.left = `${this.x}px`;
        }
      }
    } else {
      turn(this, SIDES[this.side], this.width, this.height);
      return 0;
    }
  }

  move() {
    const widthUsable = this.width - gamezone.getBoundingClientRect().width;
    const heightUsable = this.height - gamezone.getBoundingClientRect().height;
    const OBJ = {
      'top': [0, this.speed, 'height', 1, 'y'],
      'right': [widthUsable, this.speed, 'width', -1, 'x'],
      'bottom': [heightUsable, this.speed, 'height', -1, 'y'],
      'left': [0, this.speed, 'width', 1, 'x'],
    };
    this.border(...OBJ[this.side]);
  }

}

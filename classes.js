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
      player = Object.assign(player, this);
      game();
      console.log(player);
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

class Enemy extends SmallTank {
  constructor(collection = new Map()) {
    super(collection);
    this.name = collection.get('name');
    this.points = collection.get('points');
    this.x = collection.get('x');
    this.y = collection.get('y');
    this.side = collection.get('side');
    this.reload = false;
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
    if (this.name === 'enemy2') {
      this.x -= this.width;
    } else if (this.name === 'enemy3') {
      this.x -= this.width;
      this.y -= this.height;
    } else if (this.name === 'enemy4') {
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

  moveHeight(height, speed) {
    const DifferenceHeight = Math.abs(
      this.y + this.height / 2 - player.y - player.height / 2
    );

    if (this.y > height) {
      if (DifferenceHeight < this.height / 4) {
        turnToCollision(this,
          'right',
          'left',
          this.x + this.width < player.x,
          this.x > player.x + player.width
        );
      } else {
        this.y += speed;
        this.el.style.top = `${this.y}px`;
      }
    } else {
      turn(this, 'right', this.height, this.width);
      return 0;
    }
  }

  moveWidth(width, speed) {
    const DifferenceWith = Math.abs(
      this.x + this.width / 2 - player.x - player.width / 2
    );

    if (this.x > width) {
      if (DifferenceWith < this.width / 4) {
        turnToCollision(
          this,
          'top',
          'bottom',
          this.y > player.y + player.height,
          this.y + this.height < player.y
        );
      } else {
        this.x += speed;
        this.el.style.left = `${this.x}px`;
      }
    } else {
      turn(this, 'bottom', this.width, this.height);
      return 0;
    }
  }

  move() {
    if (this.side === 'top') {
      this.moveHeight(0, -1*(this.speed));
    } else if (this.side === 'right') {
      const widthUsable = -1*(gamezone.getBoundingClientRect().width - this.width);
      this.moveWidth(widthUsable, this.speed);
    } else if (this.side === 'bottom') {
      const heightUsable = -1*(gamezone.getBoundingClientRect().height - this.height);
      this.moveHeight(heightUsable, this.speed);
    } else if (this.side === 'left') {
      this.moveWidth(0, -1*(this.speed));
    }
  }

  shoot() {
    if (!this.reload) {
      this.reload = true;
      setTimeout(() => {
        oneBullet(this);
        this.reload = false;
      }, this.bullettime + Math.floor(Math.random() * 5000));
    }
  }
}

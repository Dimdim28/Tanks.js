'use strict';

const gamezone = document.querySelector('.gamezone');
const hangar = document.querySelector('.hangar');
const hp = document.querySelector('.hpnumber');
const points = document.querySelector('.pointsnumber');
const leftpanel = document.querySelector('.leftPanel');

const GAMEZONEWIDTH = gamezone.getBoundingClientRect().width;
const GAMEZONEHEIGHT = gamezone.getBoundingClientRect().height;

let k = 0;
const fps = 1000 / 60;
let direction;

const ints = {
  run: false,
  bullet: false,
};

let player = {
  el: null,
  x: GAMEZONEWIDTH / 2,
  y: GAMEZONEHEIGHT / 2,
  run: false,
  side: 0,
  fire: true,
  points: 0,
};

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
  }

  find() {
    this.el = document.querySelector(`.${this.name}`);
  }

  back() {
    if (this.side === 1) {
      this.el.style.backgroundImage = this.top;
    } else if (this.side === 2) {
      this.el.style.backgroundImage = this.right;
    } else if (this.side === 3) {
      this.el.style.backgroundImage = this.bottom;
    } else if (this.side === 4) {
      this.el.style.backgroundImage = this.left;
    }
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
  move() {
    if (this.side === 1) {
      if (this.y > 0) {
        this.y -= this.speed;
        this.el.style.top = `${this.y}px`;
      } else {
        this.side = 2;
        this.el.style.backgroundImage = this.right;
        return 0;
      }

    } else if (this.side === 2) {
      if (this.x < gamezone.getBoundingClientRect().width - this.width) {
        this.x += this.speed;
        this.el.style.left = `${this.x}px`;
      } else {
        this.side = 3;
        this.el.style.backgroundImage = this.bottom;
        return 0;
      }

    } else if (this.side === 3) {
      if (this.y < gamezone.getBoundingClientRect().height - this.height) {
        this.y += this.speed;
        this.el.style.top = `${this.y}px`;
      } else {
        this.side = 4;
        this.el.style.backgroundImage = this.left;
        return 0;
      }

    } else if (this.side === 4) {
      if (this.x > 0) {
        this.x -= this.speed;
        this.el.style.left = `${this.x}px`;
      } else {
        this.side = 1;
        this.el.style.backgroundImage = this.top;
        return 0;
      }

    }
  }
}

const M4_INFO_ARRAY = [
  ['speed', 10],
  ['hp', 1000],
  ['damage', 400],
  ['image', 'm4'],
  ['size', 77],
  ['bulletspeed', 5],
  ['bullettime', 2000],
  ['bulletsize', 16],
];
const M4_INFO = new Map(M4_INFO_ARRAY);

const KV2_INFO_ARRAY = [
  ['speed', 5],
  ['hp', 1300],
  ['damage', 800],
  ['image', 'kv2'],
  ['size', 150],
  ['bulletspeed', 10],
  ['bullettime', 1600],
  ['bulletsize', 20],
];
const KV2_INFO = new Map(KV2_INFO_ARRAY);

const AMX_INFO_ARRAY = [
  ['speed', 15],
  ['hp', 700],
  ['damage', 300],
  ['image', 'amx'],
  ['size', 77],
  ['bulletspeed', 30],
  ['bullettime', 800],
  ['bulletsize', 12],
];
const AMX_INFO = new Map(AMX_INFO_ARRAY);

const BTR_INFO_ARRAY = [
  ['speed', 20],
  ['hp', 500],
  ['damage', 100],
  ['image', 'btr'],
  ['size', 77],
  ['bulletspeed', 20],
  ['bullettime', 100],
  ['bulletsize', 8],
];
const BTR_INFO = new Map(BTR_INFO_ARRAY);

const WAFEN_INFO_ARRAY = [
  ['speed', 20],
  ['hp', 2000],
  ['damage', 1000],
  ['image', 'wafen'],
  ['height', 100],
  ['width', 75],
  ['bulletspeed', 30],
  ['bullettime', 500],
  ['bulletsize', 15],
];
const WAFEN_INFO = new Map(WAFEN_INFO_ARRAY);

const M4 = new SmallTank(M4_INFO);
const AMX = new SmallTank(AMX_INFO);
const KV2 = new SmallTank(KV2_INFO);
const BTR = new SmallTank(BTR_INFO);
const WAFEN = new BigTank(WAFEN_INFO);

const ENEMY1_INFO_ARRAY = [
  ['speed', 10],
  ['hp', 1000],
  ['damage', 400],
  ['image', 'enemy'],
  ['size', 77],
  ['bulletspeed', 5],
  ['bullettime', 2000],
  ['bulletsize', 16],
  ['points', 100],
  ['name', 'enemy1'],
  ['x', 0],
  ['y', 0],
  ['side', 2]
];

const ENEMY1_INFO = new Map(ENEMY1_INFO_ARRAY);

const ENEMY2_INFO_ARRAY = [
  ['speed', 10],
  ['hp', 1000],
  ['damage', 400],
  ['image', 'enemy'],
  ['size', 77],
  ['bulletspeed', 5],
  ['bullettime', 2000],
  ['bulletsize', 16],
  ['points', 100],
  ['name', 'enemy2'],
  ['x', hangar.getBoundingClientRect().left -
   leftpanel.getBoundingClientRect().width],
  ['y', 0],
  ['side', 3]
];
const ENEMY2_INFO = new Map(ENEMY2_INFO_ARRAY);

const ENEMY3_INFO_ARRAY = [
  ['speed', 10],
  ['hp', 1000],
  ['damage', 400],
  ['image', 'enemy'],
  ['size', 77],
  ['bulletspeed', 5],
  ['bullettime', 2000],
  ['bulletsize', 16],
  ['points', 100],
  ['name', 'enemy3'],
  ['x', hangar.getBoundingClientRect().left -
  leftpanel.getBoundingClientRect().width],
  ['y', gamezone.getBoundingClientRect().height],
  ['side', 4]
];
const ENEMY3_INFO = new Map(ENEMY3_INFO_ARRAY);


const ENEMY4_INFO_ARRAY = [
  ['speed', 10],
  ['hp', 1000],
  ['damage', 400],
  ['image', 'enemy'],
  ['size', 77],
  ['bulletspeed', 5],
  ['bullettime', 2000],
  ['bulletsize', 16],
  ['points', 100],
  ['name', 'enemy4'],
  ['x', 0],
  ['y', gamezone.getBoundingClientRect().height],
  ['side', 1]
];
const ENEMY4_INFO = new Map(ENEMY4_INFO_ARRAY);



const enemy1 = new Enemy(ENEMY1_INFO);
const enemy2 = new Enemy(ENEMY2_INFO);
const enemy3 = new Enemy(ENEMY3_INFO);
const enemy4 = new Enemy(ENEMY4_INFO);

function init() {
  const div = document.createElement('div');
  div.className = 'gamer';
  div.style.display = 'block';
  div.style.left = `${player.x}px`;
  div.style.top = `${player.y}px`;
  div.style.backgroundImage = player.top;
  div.style.height = `${player.height}px`;
  div.style.width = `${player.width}px`;
  gamezone.append(div);
  player.el = document.querySelector('.gamer');
  points.textContent = `${player.points}`;
  hp.textContent = `${player.hp}`;
}
function controllers() {
  const WIDTH = player.width;
  const HEIGHT = player.height;
  document.addEventListener('keydown', e => {
    console.log(e.code);
    switch (e.code) {
    case 'KeyW': //top
      player.run = true;
      player.el.style.backgroundImage = player.top;
      player.height = HEIGHT;
      player.width = WIDTH;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 1;
      direction = 'top';
      break;
    case 'KeyD': //right
      player.run = true;
      player.el.style.backgroundImage = player.right;
      player.height = WIDTH;
      player.width = HEIGHT;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 2;
      direction = 'right';
      break;
    case 'KeyS': //bottom
      player.run = true;
      player.el.style.backgroundImage = player.bottom;
      player.height = HEIGHT;
      player.width = WIDTH;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 3;
      direction = 'bottom';
      break;
    case 'KeyA': //left
      player.run = true;
      player.el.style.backgroundImage = player.left;
      player.height = WIDTH;
      player.width = HEIGHT;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 4;
      direction = 'left';
      break;
    case 'ShiftLeft':
      if (player.side === 1) {
        addbullet(player.width / 2 - player.bulletsize / 2,
          -player.bulletsize);
      } else if (player.side === 2) {
        addbullet(player.width, player.height / 2 - player.bulletsize / 2);
      } else if (player.side === 3) {
        addbullet(player.width / 2 - player.bulletsize / 2,
          player.height + player.bulletsize / 2);
      } else if (player.side === 4) {
        addbullet(-player.bulletsize,
          player.height / 2 - player.bulletsize / 2);
      }
      break;
    }
  });

  document.addEventListener('keyup', e => {
    switch (e.code) {
    case 'KeyW': //top
      player.run = false;
      break;
    case 'KeyD': //right
      player.run = false;
      break;
    case 'KeyS': //bottom
      player.run = false;
      break;
    case 'KeyA': //left
      player.run = false;
      break;
    }
  });
}

function intervalls() {
  ints.run = setInterval(() => {
    if (player.run) {
      switch (player.side) {
      case 1: //top
        if (player.y > 0) {
          player.y -= player.speed;
          player.el.style.top = `${player.y}px`;
        }

        break;
      case 2: //right
        if (
          player.x <
            gamezone.getBoundingClientRect().width - player.width
        ) {
          player.x += player.speed;
          player.el.style.left = `${player.x}px`;
        }

        break;
      case 3: //bottom
        if (
          player.y <
            gamezone.getBoundingClientRect().height - player.height
        ) {
          player.y += player.speed;
          player.el.style.top = `${player.y}px`;
        }

        break;
      case 4: //left
        if (player.x > 0) {
          player.x -= player.speed;
          player.el.style.left = `${player.x}px`;
        }
        break;
      }
    }
  }, fps);
  ints.bullet = setInterval(() => {
    const bullets = document.querySelectorAll('.bullet');
    bullets.forEach(bullet => {
      const direction = bullet.getAttribute('direction');
      if (direction === 'top') {
        if (
          bullet.getBoundingClientRect().top >
          gamezone.getBoundingClientRect().top
        ) {
          bullet.style.top = `${
            parseInt(bullet.style.top.replace('px', ''), 10) -
            player.bulletspeed
          }px`;
        } else {
          bullet.parentNode.removeChild(bullet);
        }
      } else if (direction === 'bottom') {
        if (
          bullet.getBoundingClientRect().bottom <=
          gamezone.getBoundingClientRect().bottom
        ) {
          bullet.style.top = `${
            parseInt(bullet.style.top.replace('px', ''), 10) +
            player.bulletspeed
          }px`;
        } else {
          bullet.parentNode.removeChild(bullet);
        }
      } else if (direction === 'left') {
        if (
          bullet.getBoundingClientRect().left >
          gamezone.getBoundingClientRect().left
        ) {
          bullet.style.left = `${
            parseInt(bullet.style.left.replace('px', ''), 10) -
            player.bulletspeed
          }px`;
        } else {
          bullet.parentNode.removeChild(bullet);
        }
      } else if (direction === 'right') {
        if (
          bullet.getBoundingClientRect().right <
          gamezone.getBoundingClientRect().right
        ) {
          bullet.style.left = `${
            parseInt(bullet.style.left.replace('px', ''), 10) +
            player.bulletspeed
          }px`;
        } else {
          bullet.parentNode.removeChild(bullet);
        }
      }
    });
  }, fps);
  ints.enemmove = setInterval(() => {
    moveenemies();
  }, fps);
}

function addbullet(x, y) {
  if (player.fire === true) {
    const BULLET_EL = `<div class="bullet" direction = ${direction}
     style = "left: ${player.x + x}px; top: ${player.y + y}px;
      width:${player.bulletsize}px; height:${
  player.bulletsize
}px"></div>`;
    gamezone.insertAdjacentHTML('beforeend', BULLET_EL);
    player.fire = false;
    setTimeout(() => (player.fire = true), player.bullettime);
  }
}

function game() {
  init();
  spawnenemies();
  controllers();
  intervalls();
  k++;
}


function spawnenemies() {
  enemy1.spawn();
  enemy2.spawn();
  enemy3.spawn();
  enemy4.spawn();
}

function moveenemies() {
  enemy1.move();
  enemy2.move();
  enemy3.move();
  enemy4.move();
}

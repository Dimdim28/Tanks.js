'use strict';

const gamezone = document.querySelector('.gamezone');
const hp = document.querySelector('.hpnumber');
const points = document.querySelector('.pointsnumber');
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
    this.speed = collection.get('speed');
    this.hp = collection.get('hp');
    this.damage = collection.get('damage');
    this.top = `url(sprites/${collection.get('image')}-top.png)`;
    this.left = `url(sprites/${collection.get('image')}-left.png)`;
    this.rigth = `url(sprites/${collection.get('image')}-right.png)`;
    this.bottom = `url(sprites/${collection.get('image')}-bottom.png)`;
    this.width = collection.get('width');
    this.height = collection.get('height');
    this.bulletspeed = collection.get('bulletspeed');
    this.bullettime = collection.get('bullettime');
    this.bulletsize = collection.get('bulletsize');
    this.bulletsize = collection.get('bulletsize');
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
      player.el.style.backgroundImage = player.rigth;
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
  controllers();
  intervalls();
  k++;
}




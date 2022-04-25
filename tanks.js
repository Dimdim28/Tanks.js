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

const setInt = func => setInterval(func, fps);

const ints = {
  run: false,
  bullet: false,
};

let player = {
  el: null,
  x: GAMEZONEWIDTH / 2,
  y: GAMEZONEHEIGHT / 2,
  run: false,
  side: '',
  fire: true,
  reload: false,
  points: 0,
};

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
  ['side', 'right']
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
  ['side', 'bottom']
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
  ['side', 'left']
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
  ['side', 'top']
];
const ENEMY4_INFO = new Map(ENEMY4_INFO_ARRAY);

const enemy1 = new Enemy(ENEMY1_INFO);
const enemy2 = new Enemy(ENEMY2_INFO);
const enemy3 = new Enemy(ENEMY3_INFO);
const enemy4 = new Enemy(ENEMY4_INFO);

const ENEMIES = [enemy1, enemy2, enemy3, enemy4];

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

function turn(tank, side, width, height) {
  tank.run = true;
  tank.side = side;
  tank.el.style.backgroundImage = tank[side];
  tank.height = height;
  tank.width = width;
  tank.el.style.height = `${tank.height}px`;
  tank.el.style.width = `${tank.width}px`;
}

function controllers() {
  const WIDTH = player.width;
  const HEIGHT = player.height;
  document.addEventListener('keydown', e => {
    if (e.code === 'KeyW') {
      turn(player, 'top', WIDTH, HEIGHT);
    } else if (e.code === 'KeyD') {
      turn(player, 'right', HEIGHT, WIDTH);
    } else if (e.code === 'KeyS') {
      turn(player, 'bottom', WIDTH, HEIGHT);
    } else if (e.code === 'KeyA') {
      turn(player, 'left', HEIGHT, WIDTH);
    } else if (e.code === 'ShiftLeft') {
      player.fire = true;
      if (!player.reload) {
        player.reload = true;
        Shooting();
      }
    }
  });

  document.addEventListener('keyup', e => {
    const codes = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
    if (codes.includes(e.code)) {
      player.run = false;
    } else if (e.code === 'ShiftLeft') {
      player.fire = false;
    }
  });
}



function collision(player, enemy) {
  const playerHealth = player.hp;
  player.hp -= enemy.hp;
  enemy.hp -= playerHealth;
  ShowPoints();
}

function TurnToCollision(element, side1, side2, condition1, condition2) {
  if (condition1) {
    turn(element, side1, element.height, element.width);
  } else if (condition2) {
    turn(element, side2, element.height, element.width);
  } else {
    collision(player, element);
  }
}

function oneBullet(el) {
  const widthZone = gamezone.getBoundingClientRect().width;
  const heightZone = gamezone.getBoundingClientRect().height;
  if (el.side === 'top') {
    addbullet(el, el.x + el.width / 2 -
   el.bulletsize / 2, el.y - el.bulletsize);
  } else if (el.side === 'right') {
    addbullet(el, widthZone -
    el.x - el.width, el.y + el.height / 2 - el.bulletsize / 2);
  } else if (el.side === 'bottom') {
    addbullet(el, el.x + el.width / 2 -
  el.bulletsize / 2, heightZone - el.y - el.height - el.bulletsize / 2);
  } else if (el.side === 'left') {
    addbullet(el, el.x -
    el.bulletsize, el.y + el.height / 2 - el.bulletsize / 2);
  }
}

function Shooting() {
  oneBullet(player);
  const bulletsInt = setInterval(() => {
    if (player.fire === true) {
      oneBullet(player);
    } else {
      player.reload = false;
      clearInterval(bulletsInt);
    }
  }, player.bullettime);
}

function run() {
  if (player.run) {
    if (player.side === 'top')
      (player.y > 0) ? player.y -= player.speed : player.y;
    else if (player.side === 'right')
      (player.x < gamezone.getBoundingClientRect().width -
    player.width) ? player.x += player.speed : player.x;
    else if (player.side === 'bottom')
      (player.y < gamezone.getBoundingClientRect().height -
    player.height) ? player.y += player.speed : player.y;
    else if (player.side === 'left')
      (player.x > 0) ? player.x -= player.speed : player.x;
    player.el.style.top = `${player.y}px`;
    player.el.style.left = `${player.x}px`;
  }
}

function moveBull(tank, direction, bullet, sign) {
  (sign * bullet.getBoundingClientRect()[direction] >
  sign * (gamezone.getBoundingClientRect()[direction] + tank.bulletsize)) ?
    bullet.style[direction] = `${parseInt(bullet.style[direction]
      .replace('px', ''), 10) -
  tank.bulletspeed}px` :
    bullet.parentNode.removeChild(bullet);
}

function playerbullets() {
  const bullets = document.querySelectorAll('.bullet');
  bullets.forEach(bullet => {
    const identity = bullet.getAttribute('identity');
    const tank = identity === 'player' ?
      player :
      ENEMIES[parseInt(identity.slice(-1), 10) - 1];
    const direction = bullet.getAttribute('direction');
    (direction === 'top' || direction === 'left') ?
      moveBull(tank, direction, bullet, 1) :
      moveBull(tank, direction, bullet, -1);
  });
}

function ShowPoints() {
  points.textContent = `${player.points}`;
  hp.textContent = `${player.hp}`;
}

function intervalls() {
  ints.run = setInt(run);
  ints.playerbullets = setInt(playerbullets);
  ints.enemmove = setInt(moveenemies);
  ints.enemshoot = setInt(shootEnemies, fps);
}

function addbullet(tank, x, y) {
  const direction = tank.side;
  const identity = tank.name ? tank.name : 'player';
  let horisontal = 'left';
  let vertical = 'top';
  direction === 'right' ? horisontal = 'right' : horisontal = 'left';
  direction === 'bottom' ? vertical = 'bottom' : vertical = 'top';
  const BULLET_EL = `<div class="bullet" direction = ${direction}
   identity = ${identity}
    style = "${horisontal}: ${x}px; ${vertical}: ${y}px; 
    width:${tank.bulletsize}px; height:${tank.bulletsize}px"></div>`;
  gamezone.insertAdjacentHTML('beforeend', BULLET_EL);
}


function game() {
  init();
  spawnenemies();
  controllers();
  intervalls();
  k++;
}


function spawnenemies() {
  for (const enemy of ENEMIES) {
    enemy.spawn();
  }
}

function moveenemies() {
  for (const enemy of ENEMIES) {
    enemy.move();
  }
}

function shootEnemies() {
  for (const enemy of ENEMIES) {
    enemy.shoot();
  }
}

setTimeout(() => {
  enemy1.die();
}, 2000);

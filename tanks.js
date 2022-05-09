'use strict';

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

const PLAYER_TANKS = {
  M4: new SmallTank(M4_INFO),
  AMX: new SmallTank(AMX_INFO),
  KV2: new SmallTank(KV2_INFO),
  BTR: new SmallTank(BTR_INFO),
  WAFEN: new BigTank(WAFEN_INFO),
};

const ENEMIES = {
  enemy1: new Enemy(ENEMY1_INFO),
  enemy2: new Enemy(ENEMY2_INFO),
  enemy3: new Enemy(ENEMY3_INFO),
  enemy4: new Enemy(ENEMY4_INFO),
};

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
  const  PARAMETRS = [
    ['KeyW', ['top', WIDTH, HEIGHT]],
    ['KeyD', ['right', HEIGHT, WIDTH]],
    ['KeyS', ['bottom', WIDTH, HEIGHT]],
    ['KeyA', ['left', HEIGHT, WIDTH]],
  ];
  const MAP = new Map(PARAMETRS);
  document.addEventListener('keydown', e => {
    const VALUE = MAP.get(e.code);
    if (VALUE) { turn(player, ...VALUE); } else if (e.code === 'ShiftLeft') {
      player.fire = true;
      if (!player.reload) {
        player.reload = true;
        shooting();
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
  player.hp -= 100;
  enemy.hp -= 100;
  showPoints();
}

function turnToCollision(element, side1, side2, condition1, condition2) {
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
  const MAPARRAY = [
    ['top', [el.x + el.width / 2 -
    el.bulletsize / 2, el.y - el.bulletsize]],
    ['right', [ widthZone - el.x -
      el.width, el.y + el.height / 2 - el.bulletsize / 2]],
    ['bottom', [ el.x + el.width / 2 -
    el.bulletsize / 2, heightZone - el.y - el.height - el.bulletsize / 2]],
    ['left', [el.x - el.bulletsize, el.y +
      el.height / 2 - el.bulletsize / 2]], ];
  const MAP = new Map(MAPARRAY);
  addbullet(el, ...MAP.get(el.side));
}

function shooting() {
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
  if (!player.run) return;
  const { side, x, y, speed, width, height } = player;
  const rect = gamezone.getBoundingClientRect();
  if (side === 'top' && y > 0) player.y -= speed;
  else if (side === 'right' && x < rect.width - width) player.x += speed;
  else if (side === 'bottom' && y < rect.height - height) player.y += speed;
  else if (side === 'left' && x > 0) player.x -= speed;
  player.el.style.top = `${y}px`;
  player.el.style.left = `${x}px`;
}

function moveBull(tank, direction, bullet, sign) {
  (sign * bullet.getBoundingClientRect()[direction] >
  sign * (gamezone.getBoundingClientRect()[direction] + tank.bulletsize)) ?
    bullet.style[direction] = `${parseInt(bullet.style[direction]
      .replace('px', ''), 10) -
  tank.bulletspeed}px` :
    bullet.parentNode.removeChild(bullet);
}

function bullets() {
  const bullets = document.querySelectorAll('.bullet');
  for (const bullet of bullets) {
    const identity = bullet.getAttribute('identity');
    const tank = identity === 'player' ?
      player :
      ENEMIES[identity];
    if (!tank) {
      bullet.parentNode.removeChild(bullet);
      continue;
    }
    const direction = bullet.getAttribute('direction');
    const sign = (direction === 'top' || direction === 'left') ? 1 : -1;
    moveBull(tank, direction, bullet, sign);
  }
}

function showPoints() {
  points.textContent = `${player.points}`;
  hp.textContent = `${player.hp}`;
}

function intervalls() {
  ints.run = setInt(run, fps);
  ints.bullets = setInt(bullets, fps);
  ints.enemmove = setInt(moveenemies, fps);
  ints.enemshoot = setInt(shootEnemies, fps);
}

function addbullet(tank, x, y) {
  const DIRECTION = tank.side;
  const IDENTITY = tank.name ? tank.name : 'player';
  const HORISONTAL = DIRECTION === 'right' ? 'right' :  'left';
  const VERTICAL = DIRECTION === 'bottom' ?  'bottom' :  'top';
  const BULLET_EL = `<div class="bullet" direction = ${DIRECTION}
   identity = ${IDENTITY}
    style = "${HORISONTAL}: ${x}px; ${VERTICAL}: ${y}px; 
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

function stopGame(){
clearInterval(ints.bullets);
clearInterval(ints.run);
clearInterval(ints.enemmove);
clearInterval(ints.enemshoot);
const ENEMIES_KEYS = Object.keys(ENEMIES);
for (const key of ENEMIES_KEYS) {
const enemy = ENEMIES[key];
 enemy.die();
  ENEMIES[key] = null;
  }
}

function spawnenemies() {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    ENEMIES[key].spawn();
  }
}

function moveenemies() {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    const enemy = ENEMIES[key];
    if (enemy) {
      if (enemy.hp <= 0) {
        enemy.die();
        ENEMIES[key] = null;
      } else {
        enemy.move();
      }
    }
  }
}

function shootEnemies() {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    const enemy = ENEMIES[key];
    if (enemy) {
      enemy.shoot();
    }
  }
}

setTimeout(() => {
  // ENEMIES.enemy1.die();
}, 2000);

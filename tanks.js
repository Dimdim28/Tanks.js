'use strict';

const setInt = func => setInterval(func, fps);

const PLAYER_TANKS = {
  M4: new SmallTank(M4_INFO),
  AMX: new SmallTank(AMX_INFO),
  KV2: new SmallTank(KV2_INFO),
  BTR: new SmallTank(BTR_INFO),
  WAFEN: new BigTank(WAFEN_INFO),
};

const ENEMIES = {
  enemy1: null,
  enemy2: null,
  enemy3: null,
  enemy4: null,
};

function init() {
  const div = document.createElement('div');
  div.className = 'gamer';
  div.style.display = 'block';
  div.style.left = `${player.x}px`;
  div.style.top = `${player.y}px`;
  div.style.height = `${player.height}px`;
  div.style.width = `${player.width}px`;
  gamezone.append(div);
  player.el = document.querySelector('.gamer');
  points.textContent = `${player.points}`;
  hp.textContent = `${player.hp}`;
  player.el.style.backgroundImage = player.right;
  player.el.style.backgroundImage = player.bottom;
  player.el.style.backgroundImage = player.left;
  player.el.style.backgroundImage = player.top;
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
  const PARAMETRS = [
    ['KeyW', ['top', WIDTH, HEIGHT]],
    ['KeyD', ['right', HEIGHT, WIDTH]],
    ['KeyS', ['bottom', WIDTH, HEIGHT]],
    ['KeyA', ['left', HEIGHT, WIDTH]],
  ];
  const MAP = new Map(PARAMETRS);
  document.addEventListener('keydown', e => {
    if (k) {
      const VALUE = MAP.get(e.code);
      if (VALUE) {
        turn(player, ...VALUE);
      } else if (e.code === 'Enter') {
        player.fire = true;
        if (!player.reload) {
          player.reload = true;
          shooting();
        }
      }
    }
  });

  document.addEventListener('keyup', e => {
    const codes = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
    if (codes.includes(e.code)) player.run = false;
     else if (e.code === 'Enter') player.fire = false;
  });
}

function collision(player, enemy) {
  player.hp -= colissionDamage;
  enemy.hp -= colissionDamage;
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
  const [X, Y, W, H, BSZ] = [el.x, el.y, el.width, el.height, el.bulletsize];
  const MAPARRAY = [
    ['top', [X + W / 2 - BSZ / 2, Y - BSZ]],
    ['right', [widthZone - X - W, Y + H / 2 - BSZ / 2]],
    ['bottom', [X + W / 2 - BSZ / 2, heightZone - Y - H - BSZ / 2]],
    ['left', [X - BSZ, Y + H / 2 - BSZ / 2]],
  ];
  const MAP = new Map(MAPARRAY);
  addbullet(el, ...MAP.get(el.side));
}

function shooting() {
  let audio = shootingAudio(SHOOTINGAUDIOS[player.tank]);
  playAudio(audio)
  .then(oneBullet(player))
  .then(startTimeAudio(audio));
  const bulletsInt = setInterval(() => {
    if (player.fire === true) {
      let audio2 = shootingAudio(SHOOTINGAUDIOS[player.tank]);
      playAudio(audio2)
        .then(oneBullet(player))
        .then(startTimeAudio(audio2));
    } else {
      player.reload = false;
      clearInterval(bulletsInt);
    }
  }, player.bullettime);
}

function run() {
  if (player.hp <= 0) {
    stopGame();
    playAudio(VOICEAUDIOS.FAIL);
    player.hp = 0;
    showPoints();
  }

  if (!player.run) return;
  const { side, x, y, speed, width, height } = player;
  const rect = gamezone.getBoundingClientRect();
  if (side === 'top' && y > speed) player.y -= speed;
  else if (side === 'right' && x < rect.width - width - speed) player.x += speed;
  else if (side === 'bottom' && y < rect.height - height - speed) player.y += speed;
  else if (side === 'left' && x > speed) player.x -= speed;
  player.el.style.top = `${y}px`;
  player.el.style.left = `${x}px`;
}

function strike(bull, elem) {
  return  bull.left > elem.left &&
  bull.right < elem.right &&
  bull.top > elem.top &&
  bull.bottom < elem.bottom;
}

function hit(bull, elem, damage){
  elem.hp -= damage;
  if(bull) bull.parentNode.removeChild(bull);
  showPoints();
}

function moveBull(bullet, sign, size, speed, direction) {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  const tanks = [...ENEMIES_KEYS];
  const BULL = bullet.getBoundingClientRect();
  const damage = parseInt(bullet.getAttribute('damage'), 10);
  for (const elem of tanks) {
    const enemy = ENEMIES[elem];
    if (enemy) {
      const ELEM = enemy.el.getBoundingClientRect();
      const PLAYER = player.el.getBoundingClientRect();
      if (strike(BULL, ELEM)) hit(bullet, enemy, damage);
      else if (strike(BULL, PLAYER)) hit(bullet, player, damage);
    }
  }

  sign * bullet.getBoundingClientRect()[direction] >
  sign * (gamezone.getBoundingClientRect()[direction] + size) ?
    (bullet.style[direction] = `${
      parseInt(bullet.style[direction].replace('px', ''), 10) - speed
    }px`) :
    bullet && bullet.parentNode.removeChild(bullet);
}

function bullets() {
  const bullets = document.querySelectorAll('.bullet');
  for (const bullet of bullets) {
    const direction = bullet.getAttribute('direction');
    const sign = direction === 'top' || direction === 'left' ? 1 : -1;
    const size = parseInt(bullet.style['width'], 10);
    const speed = parseInt(bullet.getAttribute('speed'), 10);
    moveBull(bullet, sign, size, speed, direction);
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
}

function addbullet(tank, x, y) {
  const DIRECTION = tank.side;
  const IDENTITY = tank.name ? tank.name : 'player';
  const DAMAGE = tank.damage;
  const HORISONTAL = DIRECTION === 'right' ? 'right' : 'left';
  const VERTICAL = DIRECTION === 'bottom' ? 'bottom' : 'top';
  const BULLET_EL = `<div class="bullet" direction = ${DIRECTION}
   identity = ${IDENTITY}\
   damage = ${DAMAGE}\
   speed = ${tank.bulletspeed}\
    style = "${HORISONTAL}: ${x}px; ${VERTICAL}: ${y}px; 
    width:${tank.bulletsize}px; height:${tank.bulletsize}px"></div>`;
  gamezone.insertAdjacentHTML('beforeend', BULLET_EL);
}

function game() {
  enemyDead = 0;
  playAudio(THEME);
  const ENEMIES_ENTRIES = ENEMY_CHARS.entries();
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const [index, value] of ENEMIES_ENTRIES) {
    ENEMIES[ENEMIES_KEYS[index]] = new Enemy(value);
  }
  (player.x = GAMEZONEWIDTH / 2), (player.y = GAMEZONEHEIGHT / 2), init();
  spawnenemies();
  controllers();
  intervalls();
  k++;
}

function addPoints(elem, source) {
  elem.points += source.points;
}

function subtPoints(elem, source) {
  elem.points -= source.points;
}

function choose(elem) {
  if (player.points >= PLAYER_TANKS[elem].points) {
    let audio = VOICEAUDIOS.FIGHT;
    playAudio(audio);
    PLAYER_TANKS[elem].active();
  }else{
    alert.textContent = 'Недостаточно очков!!';
    playAudio(VOICEAUDIOS.POINTS);
  }
}

function stopGame() {
  stopAudio(THEME);
  startTimeAudio(THEME);
  clearInterval(ints.bullets);
  clearInterval(ints.run);
  clearInterval(ints.enemmove);
  k = 0;
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    const enemy = ENEMIES[key];
    if (enemy) {
      enemy.die();
      ENEMIES[key] = null;
    }
  }
  player.el.parentNode.removeChild(player.el);
  const bullets = document.querySelectorAll('.bullet');
  for (const bullet of bullets) {
    bullet.parentNode.removeChild(bullet);
  }
  hangar.style.display = 'flex';
  alert.textContent = '';
}

function spawnenemies() {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    if (ENEMIES[key])  ENEMIES[key].spawn();
  }
}

function moveenemies() {
  const ENEMIES_KEYS = Object.keys(ENEMIES);
  for (const key of ENEMIES_KEYS) {
    const enemy = ENEMIES[key];
    if (enemy) {
      if (enemy.hp <= 0) {
        enemy.die();
        enemyDead++;
        addPoints(player, enemy);
        showPoints();
        ENEMIES[key] = null;
        console.log(enemyDead);
        enemyDeathAlert();
      } else  enemy.move();
    }
  }
  if (enemyDead !== 0 && enemyDead % 4 === 0) {
    playAudio(VOICEAUDIOS.VICTORY);
    enemyDead = 0;
    stopGame();
  }
}

function enemyDeathAlert(){
if (enemyDead === 1) playAudio(VOICEAUDIOS.ENEMYDESTR);
 else if (enemyDead === 2) playAudio(VOICEAUDIOS.ENEMYDESTR2);
 else if (enemyDead === 3) playAudio(VOICEAUDIOS.ENEMYDESTR);
}
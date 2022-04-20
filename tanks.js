'use strict';

const gamezone = document.querySelector('.gamezone');
const hp = document.querySelector('.hpnumber');
const points = document.querySelector('.pointsnumber');

let k = 0;
const fps = 1000 / 60;
let direction;

const ints = {
  run: false,
  bullet: false,
};

let player = {
  el: null,
  x: 320,
  y: 300,
  run: false,
  side: 0,
  fire: true,
  points: 0,
};

class Tank {
  constructor(speed, hp, damage, image, width, height,
    bulletspeed, bullettime, bulletsize) {
    this.speed = speed;
    this.hp = hp;
    this.damage = damage;
    this.top = `url(sprites/${image}-top.png)`;
    this.left = `url(sprites/${image}-left.png)`;
    this.rigth = `url(sprites/${image}-right.png)`;
    this.bottom = `url(sprites/${image}-bottom.png)`;
    this.width = width;
    this.height = height;
    this.bulletspeed = bulletspeed;
    this.bullettime = bullettime;
    this.bulletwidth = bulletsize;
    this.bulletheight = bulletsize;

  }
}

const KV2 = new Tank(5, 1300, 800, 'kv2', 150, 150, 10, 1600, 20);
const AMX = new Tank(15, 700, 300, 'amx', 77, 77, 30, 800, 12);
const BTR = new Tank(20, 500, 100, 'btr', 77, 77, 20, 100, 8);
const M4 = new Tank(10, 1000, 400, 'm4', 77, 77, 5, 2000, 16);
const WAFEN = new Tank(20, 2000, 1000, 'wafen', 75, 100, 30, 500, 16);


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
  document.addEventListener('keydown', e => {
    console.log(e.code);
    switch (e.code) {
    case 'KeyW': //top
      player.run = true;
      player.el.style.backgroundImage = player.top;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 1;
      direction = 'top';
      break;
    case 'KeyD': //right
      player.run = true;
      player.el.style.backgroundImage = player.rigth;
      player.el.style.width = `${player.height}px`;
      player.el.style.height = `${player.width}px`;
      player.side = 2;
      direction = 'right';
      break;
    case 'KeyS': //bottom
      player.run = true;
      player.el.style.backgroundImage = player.bottom;
      player.el.style.height = `${player.height}px`;
      player.el.style.width = `${player.width}px`;
      player.side = 3;
      direction = 'bottom';
      break;
    case 'KeyA': //left
      player.run = true;
      player.el.style.backgroundImage = player.left;
      player.el.style.width = `${player.height}px`;
      player.el.style.height = `${player.width}px`;
      player.side = 4;
      direction = 'left';
      break;
    case 'ShiftLeft':
      if (player.side === 1) {
        addbullet(player.width / 2, 0);
      } else if (player.side === 2) {
        addbullet(player.height, player.width / 2);
      } else if (player.side === 3) {
        addbullet(player.width / 2, player.height);
      } else if (player.side === 4) {
        addbullet(0, player.width / 2);
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
      width:${player.bulletwidth}px; height:${
  player.bulletheight
}px"></div>`;
    gamezone.insertAdjacentHTML('beforeend', BULLET_EL);    player.fire = false;
    setTimeout(() => (player.fire = true), player.bullettime);
  }
}

function game() {
  init();
  controllers();
  intervalls();
  k++;
}



const choose = obj => {
  if (k === 0) {
    player = Object.assign(player, obj);
    game();
  }
};

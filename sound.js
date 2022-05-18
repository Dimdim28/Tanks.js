const music = function(source) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = source;
  return audio;
};

const playAudio = audio => audio.play();
const stopAudio = audio => audio.pause();
const startTimeAudio = audio => audio.currentTime = 0;

const THEME = music('./sounds/theme.mp3');

const shootingAudio = name => music('./sounds/shooting/' + name);
const voiceAudio = name => music('./sounds/voice/' + name);

const SHOOTINGAUDIOS = {
  M4: 'm4.mp3',
  BTR: 'btr.mp3',
  AMX: 'amx.mp3',
  KV2: 'kv2.mp3',
  WAFEN: 'wafen.mp3',
};

const VOICEAUDIOS = {
  ARMOR: voiceAudio('armor_destroyed.ogg'),
  BOOSTLOST: voiceAudio('boost_lost.ogg'),
  BOOST: voiceAudio('boost.ogg'),
  CHOOSE: voiceAudio('choose_tank.ogg'),
  CRITICAL: voiceAudio('critical.ogg'),
  DAMAGE: voiceAudio('damage.ogg'),
  ENEMYDESTR: voiceAudio('enemy_destroyed.ogg'),
  ENEMYDESTR2: voiceAudio('enemy_destroyed2.ogg'),
  FAIL: voiceAudio('fail.ogg'),
  FIGHT: voiceAudio('fight.ogg'),
  HIT: voiceAudio('hit.ogg'),
  POINTS: voiceAudio('not_anough_points.ogg'),
  START: voiceAudio('start.ogg'),
  DESTR: voiceAudio('tank_destroyed.ogg'),
  VICTORY: voiceAudio('victory.ogg'),
};

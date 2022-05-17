const music = function(source) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = source;
  return audio;
};
const playAudio = audio => audio.play();
const stopAudio = audio => audio.pause();
const startTimeAudio = audio => audio.currentTime = 0;
const theme = music('./sounds/theme.mp3');

class SoundPlayer {
  private static sounds: { [key: string]: HTMLAudioElement } = {};
  
  static preloadSounds() {
    this.sounds = {
      doorOpen: new Audio('/sounds/door-open.mp3'),
      typing: new Audio('/sounds/typing.mp3'),
      logout: new Audio('/sounds/logout.mp3'),
      goodbye: new Audio('/sounds/goodbye.mp3')
    };
    
    // Preload all sounds
    Object.values(this.sounds).forEach(audio => {
      audio.load();
    });
  }

  static playDoorOpen() {
    this.sounds.doorOpen?.play();
  }

  static playTyping() {
    this.sounds.typing?.play();
  }

  static playLogout() {
    this.sounds.logout?.play();
  }

  static playGoodbye() {
    this.sounds.goodbye?.play();
  }

  static stopTyping() {
    if (this.sounds.typing) {
      this.sounds.typing.pause();
      this.sounds.typing.currentTime = 0;
    }
  }
}

export default SoundPlayer; 
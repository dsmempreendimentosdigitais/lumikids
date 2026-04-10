interface PlayerState {
  storyId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentParagraphIndex: number;
  language: string;
  playbackRate: 0.75 | 1.0 | 1.25;
  volume: number;
  sleepTimer?: number;        // minutos restantes
}

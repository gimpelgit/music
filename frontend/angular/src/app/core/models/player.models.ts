import { Track } from './track.model';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
}

export interface AudioEvent {
  type: 'play' | 'pause' | 'stop' | 'next' | 'previous' | 'seek' | 'volumeChange';
  trackId?: number;
  timestamp: number;
}
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlayerService } from '@/services/playerService';
import type { PlayerState } from '@/types/player';
import type { Track } from '@/types/track';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  stop: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  seekByPercentage: (percentage: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  formatTime: (seconds: number) => string;
  hasNext: boolean;
  hasPrevious: boolean;
  currentProgress: number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>(PlayerService.getState());

  useEffect(() => {
    const unsubscribe = PlayerService.subscribe((newState) => {
      setState(newState);
    });
    
    return unsubscribe;
  }, []);

  const value: PlayerContextType = {
    ...state,
    playTrack: PlayerService.playTrack.bind(PlayerService),
    togglePlay: PlayerService.togglePlay.bind(PlayerService),
    stop: PlayerService.stop.bind(PlayerService),
    playNext: PlayerService.playNext.bind(PlayerService),
    playPrevious: PlayerService.playPrevious.bind(PlayerService),
    seek: PlayerService.seek.bind(PlayerService),
    seekByPercentage: PlayerService.seekByPercentage.bind(PlayerService),
    setVolume: PlayerService.setVolume.bind(PlayerService),
    toggleMute: PlayerService.toggleMute.bind(PlayerService),
    addToQueue: PlayerService.addToQueue.bind(PlayerService),
    removeFromQueue: PlayerService.removeFromQueue.bind(PlayerService),
    clearQueue: PlayerService.clearQueue.bind(PlayerService),
    formatTime: PlayerService.formatTime.bind(PlayerService),
    hasNext: PlayerService.hasNext,
    hasPrevious: PlayerService.hasPrevious,
    currentProgress: PlayerService.currentProgress,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
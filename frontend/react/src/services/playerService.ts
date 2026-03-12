import { type Track } from '@/types/track';
import { type PlayerState } from '@/types/player';

class PlayerServiceClass {
  private audioElement: HTMLAudioElement | null = null;
  private readonly listeners: Set<(state: PlayerState) => void> = new Set();
  
  private state: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    queue: [],
    queueIndex: -1
  };

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio(): void {
    this.audioElement = new Audio();
    
    const savedVolume = localStorage.getItem('playerVolume');
    if (savedVolume) {
      const volume = Number.parseFloat(savedVolume);
      this.audioElement.volume = volume;
      this.state.volume = volume;
    }
    
    this.audioElement.addEventListener('timeupdate', () => {
      this.state.currentTime = this.audioElement?.currentTime || 0;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('durationchange', () => {
      this.state.duration = this.audioElement?.duration || 0;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('ended', () => {
      this.playNext();
    });

    this.audioElement.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.stop();
    });
  }

  private getFullTrackUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    return `http://localhost:8080${fileUrl}`;
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  subscribe(listener: (state: PlayerState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  playTrack(track: Track, queue: Track[] = []): void {
    if (!this.audioElement) {
      this.initializeAudio();
    }
    
    const trackUrl = this.getFullTrackUrl(track.fileUrl);
    
    if (this.state.currentTrack?.id === track.id) {
      this.togglePlay();
    } else {
      if (this.audioElement) {
        this.audioElement.src = trackUrl;
        this.audioElement.load();
        this.audioElement.play().catch(error => {
          console.error('Error playing track:', error);
        });
      }
      
      let newQueue = queue.length > 0 ? queue : [track];
      let queueIndex = newQueue.findIndex(t => t.id === track.id);
      
      if (queueIndex === -1) {
        newQueue = [track];
        queueIndex = 0;
      }

      this.state = {
        ...this.state,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        queue: newQueue,
        queueIndex
      };
      
      this.notifyListeners();
    }
  }

  togglePlay(): void {
    if (!this.audioElement || !this.state.currentTrack) return;

    if (this.state.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play().catch(error => {
        console.error('Error playing track:', error);
      });
    }
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    
    this.state = {
      ...this.state,
      isPlaying: false,
      currentTime: 0
    };
    
    this.notifyListeners();
  }

  seek(time: number): void {
    if (this.audioElement && this.state.duration) {
      const newTime = Math.max(0, Math.min(time, this.state.duration));
      this.audioElement.currentTime = newTime;
    }
  }

  seekByPercentage(percentage: number): void {
    if (this.audioElement && this.state.duration) {
      const newTime = (percentage / 100) * this.state.duration;
      this.audioElement.currentTime = newTime;
    }
  }

  setVolume(volume: number): void {
    const newVolume = Math.max(0, Math.min(1, volume));
    
    if (this.audioElement) {
      this.audioElement.volume = newVolume;
    }
    
    this.state = {
      ...this.state,
      volume: newVolume,
      isMuted: newVolume === 0
    };
    
    localStorage.setItem('playerVolume', newVolume.toString());
    this.notifyListeners();
  }

  toggleMute(): void {
    if (!this.audioElement) return;
    
    if (this.state.isMuted) {
      const lastVolume = Number.parseFloat(localStorage.getItem('playerVolume') || '1');
      this.audioElement.volume = lastVolume;
      this.state = {
        ...this.state,
        volume: lastVolume,
        isMuted: false
      };
    } else {
      this.audioElement.volume = 0;
      this.state = {
        ...this.state,
        isMuted: true
      };
    }
    
    this.notifyListeners();
  }

  playNext(): void {
    const { queue, queueIndex } = this.state;
    if (queueIndex < queue.length - 1) {
      const nextTrack = queue[queueIndex + 1];
      this.playTrack(nextTrack, queue);
    }
  }

  playPrevious(): void {
    const { queue, queueIndex } = this.state;
    if (queueIndex > 0) {
      const prevTrack = queue[queueIndex - 1];
      this.playTrack(prevTrack, queue);
    }
  }

  addToQueue(track: Track): void {
    this.state = {
      ...this.state,
      queue: [...this.state.queue, track]
    };
    this.notifyListeners();
  }

  removeFromQueue(index: number): void {
    if (index < 0 || index >= this.state.queue.length) return;
    
    const newQueue = this.state.queue.filter((_, i) => i !== index);
    let newIndex = this.state.queueIndex;
    
    if (index < this.state.queueIndex) {
      newIndex--;
    } else if (index === this.state.queueIndex) {
      if (newQueue.length > 0 && newIndex < newQueue.length) {
        this.playTrack(newQueue[newIndex], newQueue);
      } else {
        this.stop();
        newIndex = -1;
      }
    }
    
    this.state = {
      ...this.state,
      queue: newQueue,
      queueIndex: newIndex
    };
    
    this.notifyListeners();
  }

  clearQueue(): void {
    this.stop();
    
    this.state = {
      ...this.state,
      queue: [],
      queueIndex: -1
    };
    
    this.notifyListeners();
  }

  formatTime(seconds: number): string {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  get hasNext(): boolean {
    return this.state.queueIndex < this.state.queue.length - 1;
  }

  get hasPrevious(): boolean {
    return this.state.queueIndex > 0;
  }

  get currentProgress(): number {
    const { currentTime, duration } = this.state;
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }
}

export const PlayerService = new PlayerServiceClass();
import { Injectable, signal, computed, effect } from '@angular/core';
import { Track } from '../models/track.model';
import { PlayerState } from '../models/player.models';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioElement: HTMLAudioElement | null = null;
  private readonly state = signal<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    queue: [],
    queueIndex: -1
  });

  readonly currentTrack = computed(() => this.state().currentTrack);
  readonly isPlaying = computed(() => this.state().isPlaying);
  readonly currentTime = computed(() => this.state().currentTime);
  readonly duration = computed(() => this.state().duration);
  readonly volume = computed(() => this.state().volume);
  readonly isMuted = computed(() => this.state().isMuted);
  readonly queue = computed(() => this.state().queue);
  readonly hasNext = computed(() => this.state().queueIndex < this.state().queue.length - 1);
  readonly hasPrevious = computed(() => this.state().queueIndex > 0);
  readonly currentProgress = computed(() => {
    const { currentTime, duration } = this.state();
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  });

  constructor() {
    
    this.initializeAudio();
    
    effect(() => {
      const volume = this.state().volume;
      localStorage.setItem('playerVolume', volume.toString());
    });
  }

  private initializeAudio(): void {
    this.audioElement = new Audio();
    
    const savedVolume = localStorage.getItem('playerVolume');
    if (savedVolume) {
      const volume = Number.parseFloat(savedVolume);
      this.audioElement.volume = volume;
      this.state.update(state => ({ ...state, volume }));
    }
    
    this.audioElement.addEventListener('timeupdate', () => {
      this.state.update(state => ({ 
        ...state, 
        currentTime: this.audioElement?.currentTime || 0 
      }));
    });

    this.audioElement.addEventListener('durationchange', () => {
      this.state.update(state => ({ 
        ...state, 
        duration: this.audioElement?.duration || 0 
      }));
    });

    this.audioElement.addEventListener('ended', () => {
      this.playNext();
    });

    this.audioElement.addEventListener('play', () => {
      this.state.update(state => ({ ...state, isPlaying: true }));
    });

    this.audioElement.addEventListener('pause', () => {
      this.state.update(state => ({ ...state, isPlaying: false }));
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.stop();
    });
  }

  
  playTrack(track: Track, queue: Track[] = []): void {
    if (!this.audioElement) {
      this.initializeAudio();
    }
    const trackUrl = this.getFullTrackUrl(track.fileUrl);
    
    if (this.state().currentTrack?.id === track.id) {
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

      this.state.update(state => ({
        ...state,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        queue: newQueue,
        queueIndex
      }));
    }
  }

  togglePlay(): void {
    if (!this.audioElement || !this.state().currentTrack) return;

    if (this.state().isPlaying) {
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
    this.state.update(state => ({ 
      ...state, 
      isPlaying: false, 
      currentTime: 0 
    }));
  }

  seek(time: number): void {
    if (this.audioElement && this.state().duration) {
      const newTime = Math.max(0, Math.min(time, this.state().duration));
      this.audioElement.currentTime = newTime;
    }
  }

  seekByPercentage(percentage: number): void {
    if (this.audioElement && this.state().duration) {
      const newTime = (percentage / 100) * this.state().duration;
      this.audioElement.currentTime = newTime;
    }
  }

  setVolume(volume: number): void {
    const newVolume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = newVolume;
    }
    this.state.update(state => ({ ...state, volume: newVolume, isMuted: newVolume === 0 }));
  }

  toggleMute(): void {
    if (!this.audioElement) return;
    
    if (this.state().isMuted) {
      
      const lastVolume = Number.parseFloat(localStorage.getItem('playerVolume') || '1');
      this.audioElement.volume = lastVolume;
      this.state.update(state => ({ ...state, volume: lastVolume, isMuted: false }));
    } else {
      
      this.audioElement.volume = 0;
      this.state.update(state => ({ ...state, isMuted: true }));
    }
  }

  playNext(): void {
    const { queue, queueIndex } = this.state();
    if (queueIndex < queue.length - 1) {
      const nextTrack = queue[queueIndex + 1];
      this.playTrack(nextTrack, queue);
    }
  }

  playPrevious(): void {
    const { queue, queueIndex } = this.state();
    if (queueIndex > 0) {
      const prevTrack = queue[queueIndex - 1];
      this.playTrack(prevTrack, queue);
    }
  }

  addToQueue(track: Track): void {
    this.state.update(state => ({
      ...state,
      queue: [...state.queue, track]
    }));
  }

  removeFromQueue(index: number): void {
    if (index < 0 || index >= this.state().queue.length) return;
    
    this.state.update(state => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      let newIndex = state.queueIndex;
      
      if (index < state.queueIndex) {
        newIndex--;
      } else if (index === state.queueIndex) {
        
        if (newQueue.length > 0 && newIndex < newQueue.length) {
          this.playTrack(newQueue[newIndex], newQueue);
        } else {
          this.stop();
          newIndex = -1;
        }
      }
      
      return {
        ...state,
        queue: newQueue,
        queueIndex: newIndex
      };
    });
  }

  clearQueue(): void {
    this.stop();
    this.state.update(state => ({
      ...state,
      queue: [],
      queueIndex: -1
    }));
  }

  private getFullTrackUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    return `http://localhost:8080${fileUrl}`;
  }

  formatTime(seconds: number): string {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
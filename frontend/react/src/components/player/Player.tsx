import React, { useRef } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import './Player.css';

export const Player: React.FC = () => {
  const player = usePlayer();
  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!player.currentTrack) {
    return null;
  }

  const formatArtists = (artists: { name: string }[]): string => {
    return artists.map(a => a.name).join(', ');
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    player.seekByPercentage(percentage);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number.parseFloat(event.target.value);
    player.setVolume(volume);
  };

  const getVolumeIcon = (): string => {
    if (player.isMuted || player.volume === 0) {
      return 'bi-volume-mute-fill';
    }
    if (player.volume > 0.5) {
      return 'bi-volume-up-fill';
    }
    return 'bi-volume-down-fill';
  };

  const getVolumePercentage = (): number => {
    return Math.floor(player.volume * 100);
  };

  return (
    <div className="player-container">
      <div className="player-content">
        <div className="track-info">
          <div className="track-details">
            <div className="track-title">{player.currentTrack.title}</div>
            <div className="track-artist">{formatArtists(player.currentTrack.artists)}</div>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button
              className={`btn btn-link text-white p-2 ${player.hasPrevious ? '' : 'disabled'}`}
              onClick={player.playPrevious}
              disabled={!player.hasPrevious}
            >
              <i className="bi bi-skip-backward-fill fs-5"></i>
            </button>

            <button
              className="btn btn-light rounded-circle p-0 play-button"
              onClick={player.togglePlay}
            >
              <i className={`bi ${player.isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>

            <button
              className={`btn btn-link text-white p-2 ${player.hasNext ? '' : 'disabled'}`}
              onClick={player.playNext}
              disabled={!player.hasNext}
            >
              <i className="bi bi-skip-forward-fill fs-5"></i>
            </button>
          </div>

          <div className="progress-container">
            <span className="time-current">{player.formatTime(player.currentTime)}</span>
            <div className="progress-bar-wrapper" onClick={handleProgressClick} ref={progressBarRef}>
              <div className="progress">
                <div
                  className="progress-bar bg-light"
                  style={{ width: `${player.currentProgress}%` }}
                ></div>
              </div>
            </div>
            <span className="time-total">{player.formatTime(player.duration)}</span>
          </div>
        </div>

        <div className="volume-control">
          <button className="btn btn-link text-white p-2" onClick={player.toggleMute}>
            <i className={`bi ${getVolumeIcon()}`}></i>
          </button>

          <div className="volume-slider-container">
            <input
              type="range"
              className="form-range volume-slider"
              value={player.volume}
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
            />
            <span className="volume-percentage">{getVolumePercentage()}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
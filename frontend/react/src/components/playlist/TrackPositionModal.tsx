import React, { useState, useEffect } from 'react';
import type { Track } from '@/types/track';

interface TrackPositionModalProps {
  track: Track;
  totalTracks: number;
  currentPosition: number;
  onClose: () => void;
  onSave: (newPosition: number) => void;
}

export const TrackPositionModal: React.FC<TrackPositionModalProps> = ({
  track,
  totalTracks,
  currentPosition,
  onClose,
  onSave
}) => {
  const [newPosition, setNewPosition] = useState(currentPosition + 1);

  useEffect(() => {
    setNewPosition(currentPosition + 1);
  }, [currentPosition]);

  const formatArtists = (artists: { name: string }[]): string => {
    return artists.map(a => a.name).join(', ');
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (newPosition >= 1 && newPosition <= totalTracks) {
      onSave(newPosition - 1);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Изменить позицию трека</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <div className="d-flex gap-2 align-items-center mb-3">
                <div className="bg-secondary bg-opacity-10 p-2 rounded">
                  <i className="bi bi-music-note-beamed fs-4"></i>
                </div>
                <div>
                  <div className="fw-semibold">{track.title}</div>
                  <div className="small text-muted">
                    {formatArtists(track.artists)} · {formatDuration(track.durationSeconds)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="trackPosition" className="form-label fw-semibold">
                Новая позиция (1 - {totalTracks})
              </label>
              <input
                id="trackPosition"
                type="number"
                className="form-control"
                value={newPosition}
                onChange={(e) => setNewPosition(Number(e.target.value))}
                min={1}
                max={totalTracks}
                step={1}
              />
              <div className="form-text text-muted small">
                Текущая позиция: {currentPosition + 1}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
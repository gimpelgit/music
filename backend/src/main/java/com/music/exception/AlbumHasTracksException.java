package com.music.exception;

public class AlbumHasTracksException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Невозможно удалить альбом с ID %d, так как он содержит треки. Сначала удалите все треки из альбома.";

  public AlbumHasTracksException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }

  public AlbumHasTracksException(String message) {
    super(message);
  }
}
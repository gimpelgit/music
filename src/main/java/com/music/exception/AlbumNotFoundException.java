package com.music.exception;

public class AlbumNotFoundException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Альбом с ID %d не найден";

  public AlbumNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }

  public AlbumNotFoundException(String message) {
    super(message);
  }
}
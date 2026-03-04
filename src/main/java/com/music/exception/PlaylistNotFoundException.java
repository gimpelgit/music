package com.music.exception;

public class PlaylistNotFoundException extends RuntimeException {

  private static final String MESSAGE_TEMPLATE = "Плейлист с ID %d не найден";

  public PlaylistNotFoundException(String message) {
    super(message);
  }
  
  public PlaylistNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }
}
package com.music.exception;

public class ArtistNotFoundException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Исполнитель с ID %d не найден";

  public ArtistNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }

  public ArtistNotFoundException(String message) {
    super(message);
  }
}
package com.music.exception;

public class TrackNotFoundException extends RuntimeException {

  private static final String MESSAGE_TEMPLATE = "Трек с ID %d не найден";

  public TrackNotFoundException(String message) {
    super(message);
  }

  public TrackNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }
}
package com.music.exception;

public class InvalidAudioFileException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Неверный аудиофайл: %s";

  public InvalidAudioFileException(String message) {
    super(String.format(MESSAGE_TEMPLATE, message));
  }
}
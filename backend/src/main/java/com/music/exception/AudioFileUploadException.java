package com.music.exception;

public class AudioFileUploadException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Ошибка при загрузке аудиофайла: %s";

  public AudioFileUploadException(String message) {
    super(String.format(MESSAGE_TEMPLATE, message));
  }
}
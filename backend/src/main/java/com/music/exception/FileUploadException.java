package com.music.exception;

public class FileUploadException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Ошибка при загрузке файла: %s";

  public FileUploadException(String message) {
    super(String.format(MESSAGE_TEMPLATE, message));
  }
}
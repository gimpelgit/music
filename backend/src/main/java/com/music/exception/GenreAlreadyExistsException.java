package com.music.exception;

public class GenreAlreadyExistsException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Жанр с названием '%s' уже существует";

  public GenreAlreadyExistsException(String name) {
    super(String.format(MESSAGE_TEMPLATE, name));
  }
}
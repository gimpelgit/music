package com.music.exception;

public class GenreNotFoundException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Жанр с ID %d не найден";

  public GenreNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }

  public GenreNotFoundException(String message) {
    super(message);
  }
}
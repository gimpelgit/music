package com.music.exception;

public class ArtistAlreadyExistsException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Исполнитель с именем '%s' уже существует";

  public ArtistAlreadyExistsException(String name) {
    super(String.format(MESSAGE_TEMPLATE, name));
  }
}
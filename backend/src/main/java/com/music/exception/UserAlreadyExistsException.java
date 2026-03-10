package com.music.exception;

public class UserAlreadyExistsException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Пользователь с логином '%s' уже существует";

  public UserAlreadyExistsException(String username) {
    super(String.format(MESSAGE_TEMPLATE, username));
  }
}
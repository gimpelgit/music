package com.music.exception;

public class UserNotFoundException extends RuntimeException {

  private static final String MESSAGE_TEMPLATE = "Пользователь с ID %d не найден";

  public UserNotFoundException(Long id) {
    super(String.format(MESSAGE_TEMPLATE, id));
  }
  
  public UserNotFoundException(String message) {
    super(message);
  }
}
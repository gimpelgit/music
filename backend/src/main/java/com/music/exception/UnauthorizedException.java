package com.music.exception;

public class UnauthorizedException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Ошибка авторизации: %s";

  public UnauthorizedException(String message) {
    super(String.format(MESSAGE_TEMPLATE, message));
  }

  public UnauthorizedException() {
    super("Пользователь не авторизован");
  }
}
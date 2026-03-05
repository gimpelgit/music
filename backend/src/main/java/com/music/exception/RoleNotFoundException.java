package com.music.exception;

public class RoleNotFoundException extends RuntimeException {
  private static final String MESSAGE_TEMPLATE = "Роль '%s' не найдена";

  public RoleNotFoundException(String role) {
    super(String.format(MESSAGE_TEMPLATE, role));
  }
}
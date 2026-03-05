package com.music.enumeration;

public enum Role {
  ROLE_USER,
  ROLE_ADMIN;

  public static boolean isValid(String role) {
    if (role == null) return false;
    try {
      Role.valueOf(role);
      return true;
    } catch (IllegalArgumentException e) {
      return false;
    }
  }
}

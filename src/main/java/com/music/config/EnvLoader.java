package com.music.config;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.Map;

public class EnvLoader {
  private static EnvLoader instance;
  private final Dotenv dotenv;
  private final Map<String, String> systemEnv;

  private EnvLoader() {
    this.dotenv = Dotenv.configure()
      .ignoreIfMissing()
      .load();

    this.systemEnv = System.getenv();
  }

  public static EnvLoader getInstance() {
    if (instance == null) {
      instance = new EnvLoader();
    }
    return instance;
  }

  public String get(String key, String defaultValue) {
    String systemValue = systemEnv.get(key);
    if (systemValue != null && !systemValue.isEmpty()) {
      return systemValue;
    }

    if (dotenv != null) {
      String dotenvValue = dotenv.get(key);
      if (dotenvValue != null && !dotenvValue.isEmpty()) {
        return dotenvValue;
      }
    }

    return defaultValue;
  }
  
  public Integer getInt(String key, Integer defaultValue) {
    String value = get(key, null);
    if (value == null) {
      return defaultValue;
    }
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      return defaultValue;
    }
  }
}
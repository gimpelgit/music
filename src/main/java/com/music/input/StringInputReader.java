package com.music.input;

public class StringInputReader extends BaseInputReader<String, StringInputReader> {
  private Integer minLength;
  private Integer maxLength;

  public StringInputReader withMinLength(int minLength) {
    this.minLength = minLength;
    return this;
  }

  public StringInputReader withMaxLength(int maxLength) {
    this.maxLength = maxLength;
    return this;
  }

  @Override
  public String read(String prompt) {
    while (true) {
      String value = super.read(prompt);

      if (minLength != null && value.length() < minLength) {
        System.out.println("Длина должна быть не меньше " + minLength + " символов");
        continue;
      }

      if (maxLength != null && value.length() > maxLength) {
        System.out.println("Длина должна быть не больше " + maxLength + " символов");
        continue;
      }

      return value;
    }
  }

  @Override
  protected String parse(String input) throws Exception {
    return input;
  }
}
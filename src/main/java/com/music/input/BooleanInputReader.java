package com.music.input;

public class BooleanInputReader extends BaseInputReader<Boolean, BooleanInputReader> {
  private String truePattern = "^(да|yes|y|true|1)$";
  private String falsePattern = "^(нет|no|n|false|0)$";

  public BooleanInputReader withTruePattern(String pattern) {
    this.truePattern = pattern;
    return this;
  }

  public BooleanInputReader withFalsePattern(String pattern) {
    this.falsePattern = pattern;
    return this;
  }

  @Override
  protected Boolean parse(String input) throws Exception {
    String lowerInput = input.toLowerCase().trim();
    if (lowerInput.matches(truePattern)) {
      return true;
    } else if (lowerInput.matches(falsePattern)) {
      return false;
    }
    throw new Exception("Введите да/нет (yes/no)");
  }
}
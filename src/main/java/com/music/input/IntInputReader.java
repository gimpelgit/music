package com.music.input;

public class IntInputReader extends BaseInputReader<Integer, IntInputReader> {
  private Integer minVal;
  private Integer maxVal;

  public IntInputReader withMinVal(int minVal) {
    this.minVal = minVal;
    return this;
  }

  public IntInputReader withMaxVal(int maxVal) {
    this.maxVal = maxVal;
    return this;
  }

  public IntInputReader withRange(int minVal, int maxVal) {
    this.minVal = minVal;
    this.maxVal = maxVal;
    return this;
  }

  @Override
  public Integer read(String prompt) {
    while (true) {
      Integer value = super.read(prompt);

      if (minVal != null && value < minVal) {
        System.out.println("Значение должно быть не меньше " + minVal);
        continue;
      }

      if (maxVal != null && value > maxVal) {
        System.out.println("Значение должно быть не больше " + maxVal);
        continue;
      }

      return value;
    }
  }

  @Override
  protected Integer parse(String input) throws Exception {
    return Integer.parseInt(input);
  }
}
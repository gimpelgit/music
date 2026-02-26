package com.music.input;

import java.util.function.Predicate;

public abstract class BaseInputReader<T, R extends BaseInputReader<T, R>> {
  protected T defaultValue;
  protected Predicate<T> validator;
  protected String errorMessage = "Неверный ввод. Пожалуйста, попробуйте снова.";
  protected final ScannerHolder scanner = ScannerHolder.getInstance();

  @SuppressWarnings("unchecked")
  protected R self() {
    return (R)this;
  }

  public R withDefault(T defaultValue) {
    this.defaultValue = defaultValue;
    return self();
  }

  public R withValidator(Predicate<T> validator, String errorMessage) {
    this.validator = validator;
    this.errorMessage = errorMessage;
    return self();
  }

  public T read(String prompt) {
    while (true) {
      System.out.print(prompt + " ");
      String input = scanner.getScanner().nextLine().trim();

      if (defaultValue != null && input.isEmpty()) {
        return defaultValue;
      }

      if (defaultValue == null && input.isEmpty()) {
        System.out.println("Поле не может быть пустым");
        continue;
      }

      try {
        T value = parse(input);

        if (validator != null && !validator.test(value)) {
          System.out.println(errorMessage);
          continue;
        }

        return value;
      } catch (Exception e) {
        System.out.println("Ошибка формата: " + e.getMessage());
      }
    }
  }

  protected abstract T parse(String input) throws Exception;
}
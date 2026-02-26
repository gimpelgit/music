package com.music.input;

import java.util.Scanner;

public class ScannerHolder {
  private static ScannerHolder instance;
  private final Scanner scanner;

  private ScannerHolder() {
    this.scanner = new Scanner(System.in);
  }

  public static ScannerHolder getInstance() {
    if (instance == null) {
      instance = new ScannerHolder();
    }
    return instance;
  }

  public Scanner getScanner() {
    return scanner;
  }

  public void close() {
    if (scanner != null) {
      scanner.close();
    }
  }
}

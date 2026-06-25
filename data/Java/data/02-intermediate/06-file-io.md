# Lesson 06 — File I/O

**Module 02 · Intermediate · Lesson 06 of 06**


## Learning objectives

- Understand **file i/o** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

File I/O is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// File I/O — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** This is the final lesson in this module.

---

## Additional reference

# File I/O

Java's `java.io` and `java.nio.file` packages let programs read from and write to files on disk.

## Writing to a file

```java
import java.io.FileWriter;
import java.io.IOException;

public class WriteDemo {
    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("notes.txt")) {
            writer.write("Hello, file!\n");
            writer.write("Second line.\n");
        } catch (IOException e) {
            System.out.println("Could not write file: " + e.getMessage());
        }
    }
}
```

The `try (...)` form is called **try-with-resources**: anything declared inside the parentheses is automatically closed when the block ends, even if an exception occurs — you don't need a separate `finally { writer.close(); }`.

## Reading a file line by line

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ReadDemo {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("notes.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Could not read file: " + e.getMessage());
        }
    }
}
```

**Output:**
```
Hello, file!
Second line.
```

`readLine()` returns `null` once there are no more lines — that's the loop's stopping condition.

## A shorter way: `Files` and `Scanner`

For smaller files, two convenient alternatives:

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.io.IOException;

List<String> lines = Files.readAllLines(Path.of("notes.txt"));
for (String line : lines) {
    System.out.println(line);
}
```

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

try (Scanner fileScanner = new Scanner(new File("notes.txt"))) {
    while (fileScanner.hasNextLine()) {
        System.out.println(fileScanner.nextLine());
    }
} catch (FileNotFoundException e) {
    System.out.println("File not found: " + e.getMessage());
}
```

`Scanner` works for files the same way it works for keyboard input (Lesson 10, Module 01) — just point it at a `File` instead of `System.in`.

## Why file operations always involve exceptions

Reading or writing a file can fail for reasons outside your program's control — the file might not exist, the disk might be full, or permissions might be wrong. Java forces you to acknowledge this by requiring a `catch` (or declaring `throws IOException`) anywhere file I/O happens. Exception handling itself is covered in depth in the next lesson.

## Summary

| Task | Class to use |
|---|---|
| Write text to a file | `FileWriter`, often wrapped for try-with-resources |
| Read a file line by line | `BufferedReader` + `FileReader` |
| Read a whole file quickly | `Files.readAllLines(Path.of(...))` |
| Read a file like keyboard input | `Scanner` pointed at a `File` |

> 💡 **Key tip:** Always open files inside a `try (...)` with resources — it guarantees the file is closed properly, even if something goes wrong halfway through.

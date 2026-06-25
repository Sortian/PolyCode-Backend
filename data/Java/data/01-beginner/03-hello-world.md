# Lesson 03 — Hello World

**Module 01 · Beginner · Lesson 03 of 10**


## Learning objectives

- Understand **hello world** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Hello World is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Hello World — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 04 in this module.

---

## Additional reference

# Output and Input Basics

## Printing output

Java gives you three closely related ways to print text:

```java
System.out.println("Hello, World!");   // prints, then moves to a new line
System.out.print("Hello, ");            // prints, stays on the same line
System.out.print("World!");
```

**Output:**
```
Hello, World!
Hello, World!
```

### Concatenating values with `+`

```java
String name = "Maryam";
int age = 21;
System.out.println("Name: " + name + ", Age: " + age);
```

**Output:**
```
Name: Maryam, Age: 21
```

When you use `+` with a `String` on either side, Java converts the other value to text automatically — this is called **string concatenation**, not addition.

### Formatted output with `printf`

For more control over how numbers and text line up, use `System.out.printf`, which works like a template with placeholders:

```java
double price = 19.5;
System.out.printf("Price: $%.2f%n", price);
```

**Output:**
```
Price: $19.50
```

| Placeholder | Meaning |
|---|---|
| `%s` | String |
| `%d` | Integer |
| `%.2f` | Floating-point number, 2 decimal places |
| `%n` | New line (preferred over `\n` — works correctly on every OS) |

## Reading input from the keyboard

To read what a user types, use the `Scanner` class from `java.util`:

```java
import java.util.Scanner;

public class Greeter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("What's your name? ");
        String name = scanner.nextLine();

        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}
```

If the user types `Maryam` and presses Enter:

**Output:**
```
What's your name? Maryam
Hello, Maryam!
```

`Scanner` is covered in full depth in Lesson 10 — this is just enough to read and print a value end-to-end.

> 💡 **Key tip:** `println` adds a newline automatically; `print` does not. Mixing them up is the most common reason beginners get output glued onto one line by accident.

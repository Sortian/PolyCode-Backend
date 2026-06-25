# Lesson 10 — User Input with Scanner

**Module 01 · Beginner · Lesson 10 of 10**


## Learning objectives

- Understand **user input with scanner** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

User Input with Scanner is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// User Input with Scanner — practice sketch
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

# Scanner and User Input

`Scanner` (from `java.util`) is the standard way to read input from the keyboard in a console Java program.

## Setting it up

```java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = scanner.nextLine();

        System.out.println("Hello, " + name + "!");

        scanner.close();   // good practice once you're done reading input
    }
}
```

## Reading different types

`Scanner` has a separate method for each type you want to read:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Enter your age: ");
int age = scanner.nextInt();

System.out.print("Enter your GPA: ");
double gpa = scanner.nextDouble();

System.out.print("Are you enrolled (true/false): ");
boolean enrolled = scanner.nextBoolean();

System.out.print("Enter your full name: ");
String fullName = scanner.nextLine();
```

| Method | Reads |
|---|---|
| `nextInt()` | An `int` |
| `nextDouble()` | A `double` |
| `nextBoolean()` | A `boolean` (`true`/`false`) |
| `next()` | A single word (stops at whitespace) |
| `nextLine()` | An entire line, including spaces |

## The classic `nextInt()` + `nextLine()` pitfall

This trips up almost every beginner at least once:

```java
Scanner scanner = new Scanner(System.in);

System.out.print("Enter your age: ");
int age = scanner.nextInt();        // reads "21", leaves the newline character behind

System.out.print("Enter your name: ");
String name = scanner.nextLine();   // reads that leftover newline as an empty line!

System.out.println(age + " - " + name);  // name prints as empty
```

**Why it happens:** when you type `21` and press Enter, `nextInt()` reads only the `21` — the newline character from pressing Enter is still waiting in the input. The very next `nextLine()` immediately consumes that leftover newline instead of waiting for you to type a name.

**The fix** — add an extra `scanner.nextLine()` to consume the leftover newline before reading the real line:

```java
int age = scanner.nextInt();
scanner.nextLine();                 // consumes the leftover newline
String name = scanner.nextLine();   // now reads the actual typed line correctly
```

## A complete example

```java
import java.util.Scanner;

public class ProfileBuilder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Name: ");
        String name = scanner.nextLine();

        System.out.print("Age: ");
        int age = scanner.nextInt();

        System.out.println("\nProfile created:");
        System.out.println("Name: " + name + ", Age: " + age);

        scanner.close();
    }
}
```

If the user types `Maryam` and then `21`:

**Output:**
```
Name: Maryam
Age: 21

Profile created:
Name: Maryam, Age: 21
```

> 💡 **Key tip:** If text input is coming out blank right after reading a number, you've almost certainly hit the leftover-newline issue — add a throwaway `scanner.nextLine()` right after the numeric read.

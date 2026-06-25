# Lesson 02 — Java Basics and Syntax

**Module 01 · Beginner · Lesson 02 of 10**


## Learning objectives

- Understand **java basics and syntax** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Java Basics and Syntax is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Java Basics and Syntax — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 03 in this module.

---

## Additional reference

# Java Syntax Basics

Every Java program follows the same basic shape. Understanding this shape makes every later lesson easier, because you'll recognize the pattern instead of memorizing each example separately.

## Anatomy of a Java file

```java
// 1. (optional) package declaration — must be the very first line if present
package com.example.myapp;

// 2. (optional) imports — bring in classes from other packages
import java.util.Scanner;

// 3. a class declaration — the file's main container
public class MyProgram {

    // 4. the main method — where execution starts
    public static void main(String[] args) {
        // 5. statements — the actual instructions
        int x = 5;
        System.out.println(x);
    }
}
```

A **class** must match the filename for `public` classes: `MyProgram` must live in `MyProgram.java`.

## Statements and blocks

A **statement** is one instruction, always ending in a semicolon `;`:

```java
int total = 10;
System.out.println(total);
```

A **block** is a group of statements wrapped in curly braces `{ }` — used for class bodies, method bodies, loops, and conditionals:

```java
if (total > 5) {
    System.out.println("Big");
    System.out.println("Number");
}
```

Java ignores extra whitespace and line breaks; only the braces and semicolons define structure. That's the opposite of Python, where indentation itself defines blocks.

## Identifiers and naming conventions

An **identifier** is any name you give to a class, variable, or method. Rules:

- Can contain letters, digits, `_`, and `$`
- Cannot start with a digit
- Cannot be a reserved keyword (`class`, `int`, `if`, etc.)
- Case-sensitive: `age` and `Age` are different identifiers

Conventions (not enforced by the compiler, but expected in real code):

| Element | Convention | Example |
|---|---|---|
| Class | `PascalCase` | `BankAccount` |
| Method / variable | `camelCase` | `calculateTotal`, `userName` |
| Constant | `ALL_CAPS` | `MAX_SIZE` |
| Package | `lowercase.dotted` | `com.example.app` |

## Keywords

Reserved words you can't use as identifiers: `class`, `public`, `private`, `static`, `void`, `int`, `double`, `boolean`, `if`, `else`, `for`, `while`, `return`, `new`, `import`, `package`, `try`, `catch`, and others covered in later lessons.

## A complete minimal example

```java
public class Basics {
    public static void main(String[] args) {
        int age = 21;             // a variable
        String name = "Sara";     // another variable

        if (age >= 18) {
            System.out.println(name + " is an adult.");
        } else {
            System.out.println(name + " is a minor.");
        }
    }
}
```

**Output:**
```
Sara is an adult.
```

## Case sensitivity matters

```java
int score = 10;
// int Score = 5;  // this would be a DIFFERENT variable, not a typo
```

Mixing up `Score` and `score` is a very common beginner bug — the compiler treats them as two unrelated variables.

> 💡 **Key tip:** When something won't compile, check semicolons and braces first. A missing `;` or an unmatched `{` is the single most common beginner error in Java.

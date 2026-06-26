# Lesson 04 — Variables and Data Types

**Module 01 · Beginner · Lesson 04 of 10**


## Learning objectives

- Understand **variables and data types** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Variables and Data Types is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Variables and Data Types — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 05 in this module.

---

## Additional reference

# Variables and Data Types

A **variable** is a named container for a value. In Java, every variable has a fixed **type**, declared before you can use it — this is different from languages like Python or JavaScript, where a variable can hold any type.

## Declaring and initializing variables

```java
int age;        // declaration — no value yet
age = 21;        // assignment

int score = 95;  // declaration + assignment in one line ("initialization")
```

## The 8 primitive types

Java has 8 built-in (primitive) types, split into four groups:

| Category | Type | Size | Example |
|---|---|---|---|
| Whole numbers | `byte` | 1 byte | `byte b = 100;` |
| | `short` | 2 bytes | `short s = 30000;` |
| | `int` | 4 bytes | `int x = 100000;` |
| | `long` | 8 bytes | `long big = 9999999999L;` |
| Decimal numbers | `float` | 4 bytes | `float f = 3.14f;` |
| | `double` | 8 bytes | `double d = 3.14159;` |
| Characters | `char` | 2 bytes | `char c = 'A';` |
| True/false | `boolean` | 1 bit | `boolean isOn = true;` |

`int` and `double` are by far the most commonly used — reach for those unless you have a specific reason for the others.

Note the suffixes: a `long` literal needs `L` (`9999999999L`), and a `float` literal needs `f` (`3.14f`) — without them, Java assumes `int` and `double` by default, and won't compile.

## Reference types

Anything that isn't one of the 8 primitives is a **reference type** — most importantly `String`:

```java
String name = "Maryam";   // double quotes, not single — single quotes are for char
```

`char` uses single quotes for exactly one character; `String` uses double quotes for any amount of text (including zero or one character).

## Type casting

**Widening (implicit)** — Java converts automatically when no data can be lost:

```java
int wholeNumber = 10;
double asDecimal = wholeNumber;   // int → double, automatic
System.out.println(asDecimal);   // 10.0
```

**Narrowing (explicit)** — you must cast manually, because data could be lost:

```java
double price = 19.99;
int wholePrice = (int) price;     // explicit cast required
System.out.println(wholePrice);  // 19 — the decimal part is dropped, not rounded
```

## Constants with `final`

A variable marked `final` cannot be reassigned after its first value:

```java
final double PI = 3.14159;
// PI = 3.2;   // compile error — cannot assign a value to final variable PI
```

By convention, constants are named in `ALL_CAPS`.

## Putting it together

```java
public class VariableDemo {
    public static void main(String[] args) {
        String name = "Maryam";
        int age = 21;
        double gpa = 3.8;
        boolean isEnrolled = true;
        char grade = 'A';

        System.out.println(name + " | age " + age + " | GPA " + gpa
                + " | enrolled: " + isEnrolled + " | grade: " + grade);
    }
}
```

**Output:**
```
Maryam | age 21 | GPA 3.8 | enrolled: true | grade: A
```

> 💡 **Key tip:** Choosing the right type isn't optional in Java — pick `int` for whole numbers, `double` for decimals, `boolean` for true/false, and `String` for text, and you'll cover the vast majority of real situations.

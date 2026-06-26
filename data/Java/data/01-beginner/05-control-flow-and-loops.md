# Lesson 05 — Control Flow and Loops

**Module 01 · Beginner · Lesson 05 of 10**


## Learning objectives

- Understand **control flow and loops** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Control Flow and Loops is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Control Flow and Loops — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 06 in this module.

---

## Additional reference

# Conditional Statements

## `if`, `else if`, `else`

Java conditions are written with parentheses around the condition and curly braces around the block — there's no colon and no indentation requirement (though you should still indent for readability).

```java
int age = 20;
if (age >= 18) {
    System.out.println("You are an adult.");
}
```

### `if-else`

```java
int age = 15;
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}
```

### `if-else if-else` (multiple conditions)

```java
int marks = 78;
String grade;

if (marks >= 90) {
    grade = "A";
} else if (marks >= 80) {
    grade = "B";
} else if (marks >= 70) {
    grade = "C";
} else if (marks >= 60) {
    grade = "D";
} else {
    grade = "F";
}

System.out.println("Grade: " + grade);
```

**Output:**
```
Grade: C
```

Java checks each condition top to bottom and runs the **first** one that's true, skipping the rest.

### Nested `if`

```java
int age = 25;
boolean hasId = true;

if (age >= 18) {
    if (hasId) {
        System.out.println("Entry allowed");
    } else {
        System.out.println("Need ID");
    }
} else {
    System.out.println("Too young");
}
```

### Ternary operator (compact one-line if-else)

```java
int age = 20;
String status = (age >= 18) ? "Adult" : "Minor";
System.out.println(status);

int a = 10, b = 20;
int max = (a > b) ? a : b;
System.out.println("Max: " + max);
```

**Output:**
```
Adult
Max: 20
```

## `switch` statement

`switch` compares one value against several possible matches — a clean alternative to a long `if-else if` chain.

```java
String day = "MONDAY";

switch (day) {
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Weekday");
        break;
}
```

**Output:**
```
Weekday
```

`break` stops the switch from "falling through" into the next case — forgetting it is a classic bug.

### Modern switch expression (Java 14+)

```java
String day = "MONDAY";
String type = switch (day) {
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Weekday";
};
System.out.println(type);
```

This newer arrow form returns a value directly and doesn't need `break`.

## Comparison and logical operators

| Operator | Meaning | Example |
|---|---|---|
| `==` | Equal to | `5 == 5` → `true` |
| `!=` | Not equal to | `5 != 3` → `true` |
| `>` `<` `>=` `<=` | Greater/less (or equal) | `5 >= 5` → `true` |
| `&&` | AND — both must be true | `5 > 3 && 10 > 7` → `true` |
| `\|\|` | OR — at least one true | `5 > 10 \|\| 3 > 1` → `true` |
| `!` | NOT — flips the value | `!(5 > 3)` → `false` |

> ⚠️ Use `==` to compare numbers and `boolean`s, but **not** to compare `String` content — use `.equals()` instead (covered in Lesson 09).

## Loops

### `for` loop — when you know how many times to repeat

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}
```

The three parts are: starting value (`int i = 1`), continue condition (`i <= 5`), and what happens after each pass (`i++`).

### `while` loop — repeat while a condition holds

```java
int count = 0;
while (count < 3) {
    System.out.println("Running: " + count);
    count++;
}
```

### `do-while` loop — runs the body at least once

```java
int n = 10;
do {
    System.out.println("n is " + n);
    n++;
} while (n < 5);
```

**Output:**
```
n is 10
```

Even though `n < 5` is false immediately, the body still runs once — that's the defining feature of `do-while`.

### `break` and `continue`

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;       // exits the loop entirely
    if (i % 2 == 0) continue; // skips to the next iteration
    System.out.println(i);
}
```

**Output:**
```
1
3
```

> 💡 **Key tip:** Reach for `for` when you know the number of repetitions in advance, and `while` when you're repeating until some condition changes (like user input or a flag).

# Lesson 06 — Methods

**Module 01 · Beginner · Lesson 06 of 10**


## Learning objectives

- Understand **methods** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Methods is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Methods — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 07 in this module.

---

## Additional reference

# Methods

A **method** is a named, reusable block of code that performs a task. Instead of repeating the same statements, you define them once and call the method whenever you need them.

**Benefits:** reusability (write once, use many times), readability (named blocks are easier to follow), and maintainability (fix a bug in one place).

## Defining and calling a method

```java
public class Calculator {

    static void greet() {
        System.out.println("Hello, World!");
    }

    public static void main(String[] args) {
        greet();   // calling the method
        greet();   // can call it as many times as needed
    }
}
```

A method declaration has four parts: **modifiers** (`static`), a **return type** (`void` here, meaning "returns nothing"), a **name**, and **parentheses** for parameters.

## Methods with parameters

```java
static void greet(String name) {
    System.out.println("Hello, " + name + "!");
}

greet("Alice");
greet("Bob");
```

**Output:**
```
Hello, Alice!
Hello, Bob!
```

Parameters must each declare a type, and arguments are matched **by position**, left to right.

## Methods that return a value

Replace `void` with the type you're returning, and use `return`:

```java
static int add(int a, int b) {
    return a + b;
}

int result = add(5, 3);
System.out.println(result);   // 8
```

A method can only return **one** value (though that value can be an array, a list, or an object holding several pieces of data).

## Method overloading

Java lets you define multiple methods with the **same name** but **different parameter lists** — the compiler picks the right one based on the arguments you pass:

```java
static int add(int a, int b) {
    return a + b;
}

static double add(double a, double b) {
    return a + b;
}

System.out.println(add(2, 3));       // calls the int version → 5
System.out.println(add(2.5, 3.5));   // calls the double version → 6.0
```

This is how `System.out.println` itself works — it's overloaded to accept `int`, `String`, `double`, and more.

## Scope — where a variable "lives"

```java
public class ScopeDemo {
    static int counter = 0;   // field — visible to the whole class

    static void increment() {
        int local = 5;        // local variable — only exists inside this method
        counter++;
    }

    public static void main(String[] args) {
        increment();
        increment();
        System.out.println(counter);   // 2
        // System.out.println(local);  // ERROR — local doesn't exist out here
    }
}
```

A variable declared inside a method (a **local variable**) only exists for that method's call — it disappears once the method finishes.

## Recursion — a method that calls itself

Every recursive method needs a **base case** (when to stop) to avoid running forever:

```java
static int factorial(int n) {
    if (n == 0 || n == 1) {   // base case
        return 1;
    }
    return n * factorial(n - 1);   // recursive call
}

System.out.println(factorial(5));   // 120
```

**Trace:** `factorial(5)` = `5 * factorial(4)` = `5 * 4 * factorial(3)` = ... = `5 * 4 * 3 * 2 * 1` = `120`.

## Summary

| Concept | Description |
|---|---|
| `void` method | Performs an action, returns nothing |
| Method with return type | Returns one value of that type |
| Parameters | Inputs declared with a type, matched by position |
| Overloading | Same name, different parameter lists |
| Local variable | Only exists inside the method where it's declared |
| Recursion | A method calling itself, with a base case to stop |

> 💡 **Key tip:** A good method does **one thing** and has a name that describes exactly what that thing is — `calculateTotal()`, not `doStuff()`.

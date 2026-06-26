# Lesson 09 — Strings

**Module 01 · Beginner · Lesson 09 of 10**


## Learning objectives

- Understand **strings** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Strings is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Strings — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 10 in this module.

---

## Additional reference

# Strings

A `String` is a sequence of characters. In Java, `String` is a reference type (not a primitive) with a large set of built-in methods.

## Creating strings

```java
String name = "Maryam";                 // common way — a string literal
String greeting = new String("Hello");   // also valid, rarely needed
```

## Strings are immutable

Once a `String` is created, it **cannot be changed**. Methods that look like they modify a string actually return a brand-new one:

```java
String name = "maryam";
name.toUpperCase();          // does nothing to `name` — the result is discarded
System.out.println(name);   // still "maryam"

name = name.toUpperCase();   // reassign to capture the new value
System.out.println(name);   // "MARYAM"
```

## Common String methods

```java
String text = "  Hello, Java World!  ";

System.out.println(text.length());              // 23 (counts the spaces)
System.out.println(text.trim());                // "Hello, Java World!" (no leading/trailing spaces)
System.out.println(text.toUpperCase());          // "  HELLO, JAVA WORLD!  "
System.out.println(text.toLowerCase());          // "  hello, java world!  "
System.out.println(text.trim().charAt(0));       // 'H' — character at index 0
System.out.println(text.indexOf("Java"));        // position where "Java" starts
System.out.println(text.contains("World"));      // true
System.out.println(text.trim().substring(7));    // "Java World!" — from index 7 to the end
System.out.println(text.trim().substring(0, 5)); // "Hello" — index 0 up to (not including) 5
System.out.println(text.replace("Java", "Python")); // "  Hello, Python World!  "
```

## Comparing strings: `==` vs `.equals()`

This is one of the most important habits to build early:

```java
String a = "hello";
String b = "hello";
String c = new String("hello");

System.out.println(a == b);        // true — literals can share the same memory
System.out.println(a == c);        // false — `new String(...)` is a separate object
System.out.println(a.equals(c));   // true — compares the actual characters
```

`==` checks whether two variables point to the **same object in memory**. `.equals()` checks whether the **content** is the same. For comparing what a string actually *says*, always use `.equals()`.

## Splitting and joining

```java
String csv = "apple,banana,cherry";
String[] fruits = csv.split(",");
System.out.println(fruits[1]);   // banana

String joined = String.join(" - ", fruits);
System.out.println(joined);      // apple - banana - cherry
```

## Building strings efficiently: `StringBuilder`

Because `String` is immutable, repeatedly concatenating inside a loop creates many throwaway objects. `StringBuilder` is a mutable alternative built for this:

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i).append(" ");
}
System.out.println(sb.toString());   // 1 2 3 4 5
```

## Summary

| Method | Purpose |
|---|---|
| `.length()` | Number of characters |
| `.charAt(i)` | Character at index `i` |
| `.substring(start, end)` | Extract part of the string |
| `.indexOf(text)` | Position where `text` first appears, or `-1` |
| `.contains(text)` | `true`/`false` |
| `.equals(other)` | Compares content (use this, not `==`) |
| `.toUpperCase()` / `.toLowerCase()` | Case conversion (returns a new string) |
| `.trim()` | Removes leading/trailing whitespace |
| `.split(delimiter)` | Breaks a string into a `String[]` |

> 💡 **Key tip:** Always compare string *content* with `.equals()`, never `==`. Using `==` is one of the most common bugs new Java developers write.

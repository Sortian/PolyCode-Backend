# Lesson 01 — Streams API

**Module 03 · Advanced · Lesson 01 of 07**


## Learning objectives

- Understand **streams api** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Streams API is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Streams API — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 02 in this module.

---

## Additional reference

# Streams API

A **Stream** is a pipeline for processing collections of data declaratively — describing *what* you want done (filter these, map those, sum it up), rather than writing manual loops to do it.

## Creating a stream

```java
import java.util.List;
import java.util.stream.Stream;

List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
Stream<Integer> stream = numbers.stream();
```

A stream doesn't store data itself — it's a view over a source (like a `List`) that you can chain operations onto.

## The pipeline shape: source → intermediate ops → terminal op

```java
import java.util.List;

List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> result = numbers.stream()
        .filter(n -> n % 2 == 0)   // intermediate: keep even numbers
        .map(n -> n * n)            // intermediate: square each one
        .sorted()                    // intermediate: sort ascending
        .toList();                   // terminal: collect into a List

System.out.println(result);
```

**Output:**
```
[4, 16, 36, 64, 100]
```

**Intermediate operations** (`filter`, `map`, `sorted`) return another stream, so you can chain more onto them. **Terminal operations** (`toList`, `forEach`, `count`, `sum`) end the pipeline and produce a result.

## Common operations

```java
import java.util.List;

List<String> names = List.of("Maryam", "Ali", "Sara", "Hassan", "Amna");

// filter — keep elements matching a condition
names.stream()
     .filter(name -> name.length() > 4)
     .forEach(System.out::println);

// map — transform each element
names.stream()
     .map(String::toUpperCase)
     .forEach(System.out::println);

// count — how many match
long count = names.stream().filter(name -> name.startsWith("A")).count();
System.out.println("Names starting with A: " + count);

// reduce — combine all elements into one result
int totalLetters = names.stream()
        .mapToInt(String::length)
        .sum();
System.out.println("Total letters: " + totalLetters);
```

**Output:**
```
Maryam
Hassan
MARYAM
ALI
SARA
HASSAN
AMNA
Names starting with A: 2
Total letters: 23
```

## Sorting with a custom rule

```java
List<String> sorted = names.stream()
        .sorted((a, b) -> a.length() - b.length())   // shortest name first
        .toList();
System.out.println(sorted);
```

## Why use streams instead of a for-loop?

```java
// Traditional loop
List<Integer> evens = new java.util.ArrayList<>();
for (int n : numbers) {
    if (n % 2 == 0) {
        evens.add(n);
    }
}

// Equivalent stream
List<Integer> evensStream = numbers.stream()
        .filter(n -> n % 2 == 0)
        .toList();
```

Both produce the same result — streams just read closer to a description of the *goal* ("give me the even ones") instead of the step-by-step *mechanics* of a loop.

## Summary

| Operation | Type | Purpose |
|---|---|---|
| `filter(predicate)` | Intermediate | Keep elements matching a condition |
| `map(function)` | Intermediate | Transform each element |
| `sorted()` | Intermediate | Sort the elements |
| `forEach(action)` | Terminal | Run an action on each element |
| `count()` | Terminal | Count matching elements |
| `toList()` / `collect(...)` | Terminal | Gather results into a collection |
| `reduce(...)` | Terminal | Combine all elements into one value |

> 💡 **Key tip:** A stream can only be consumed **once**. If you need to run two different pipelines over the same data, call `.stream()` again on the original collection for each one.

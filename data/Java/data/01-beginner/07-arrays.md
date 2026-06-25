# Lesson 07 — Arrays

**Module 01 · Beginner · Lesson 07 of 10**


## Learning objectives

- Understand **arrays** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Arrays is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Arrays — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 08 in this module.

---

## Additional reference

# Arrays

An **array** is a fixed-size container that holds multiple values of the **same type**, stored in order and accessed by a numeric index.

## Declaring and creating arrays

```java
int[] numbers = new int[5];      // an array of 5 ints, all default to 0
String[] names = new String[3];  // an array of 3 Strings, all default to null
```

Or declare and fill it in one step using an **array literal**:

```java
int[] scores = {90, 85, 77, 92, 60};
String[] fruits = {"Apple", "Banana", "Cherry"};
```

## Accessing elements

Arrays are **zero-indexed** — the first element is at index `0`, not `1`.

```java
int[] scores = {90, 85, 77, 92, 60};
System.out.println(scores[0]);   // 90 — first element
System.out.println(scores[4]);   // 60 — last element
scores[1] = 100;                  // update an element
System.out.println(scores[1]);   // 100
```

Trying to access `scores[5]` throws an `ArrayIndexOutOfBoundsException` — the valid indices for a 5-element array are `0` through `4`.

## Array length

```java
int[] scores = {90, 85, 77, 92, 60};
System.out.println(scores.length);   // 5
```

Note: `length` is a **field**, not a method — no parentheses, unlike `String`'s `.length()`.

## Looping through an array

### Classic `for` loop (use when you need the index)

```java
int[] scores = {90, 85, 77, 92, 60};
for (int i = 0; i < scores.length; i++) {
    System.out.println("Score " + i + ": " + scores[i]);
}
```

### `for-each` loop (cleaner when you only need the values)

```java
int[] scores = {90, 85, 77, 92, 60};
for (int score : scores) {
    System.out.println(score);
}
```

## Common array operations via `java.util.Arrays`

```java
import java.util.Arrays;

int[] scores = {90, 85, 77, 92, 60};

Arrays.sort(scores);                       // sorts in place, ascending
System.out.println(Arrays.toString(scores)); // [60, 77, 85, 90, 92]
```

`Arrays.toString()` is the standard way to print an array's contents — printing the array variable directly (`System.out.println(scores)`) just prints a cryptic memory reference, not the values.

## Multi-dimensional arrays

A 2D array is an "array of arrays" — useful for grids or tables:

```java
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};

System.out.println(grid[0][2]);   // 3 — row 0, column 2
System.out.println(grid[1][0]);   // 4 — row 1, column 0

for (int[] row : grid) {
    for (int value : row) {
        System.out.print(value + " ");
    }
    System.out.println();
}
```

**Output:**
```
1 2 3 
4 5 6 
```

## Summary

| Operation | Syntax |
|---|---|
| Declare with size | `int[] arr = new int[5];` |
| Declare with values | `int[] arr = {1, 2, 3};` |
| Access an element | `arr[index]` |
| Get the size | `arr.length` |
| Loop with index | `for (int i = 0; i < arr.length; i++)` |
| Loop over values | `for (int x : arr)` |

> 💡 **Key tip:** Arrays have a **fixed size** once created. If you need a list that can grow or shrink, use `ArrayList` (covered in the Collections lesson, Module 02).

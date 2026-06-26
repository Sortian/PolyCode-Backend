# Lesson 01 — Algorithms in Java

**Module 05 · Mastery · Lesson 01 of 04**


## Learning objectives

- Understand **algorithms in java** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Algorithms in Java is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Algorithms in Java — practice sketch
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

# Algorithms

An **algorithm** is a step-by-step procedure for solving a problem. This lesson covers how to reason about an algorithm's efficiency, and walks through two foundational examples: sorting and searching.

## Big O notation — describing efficiency

**Big O** describes how an algorithm's running time grows as the input size (`n`) grows — not the exact time, but the *shape* of the growth.

| Notation | Name | Example |
|---|---|---|
| `O(1)` | Constant | Accessing `array[5]` |
| `O(log n)` | Logarithmic | Binary search |
| `O(n)` | Linear | A single loop through `n` items |
| `O(n log n)` | Linearithmic | Efficient sorting (merge sort, quicksort) |
| `O(n²)` | Quadratic | Nested loops over the same data (bubble sort) |

A smaller-growth algorithm isn't always faster on tiny inputs, but it wins decisively as `n` gets large — an `O(n²)` algorithm on 1,000,000 items does roughly a trillion operations; an `O(n log n)` one does roughly 20 million.

## Sorting: Bubble Sort

Bubble sort repeatedly compares neighboring elements and swaps them if they're out of order — each full pass "bubbles" the largest remaining value to the end.

```java
public class BubbleSort {
    static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] numbers = {5, 2, 9, 1, 7};
        sort(numbers);
        System.out.println(java.util.Arrays.toString(numbers));
    }
}
```

**Output:**
```
[1, 2, 5, 7, 9]
```

Bubble sort is `O(n²)` — easy to understand, but too slow for large datasets. (In real code, just call `Arrays.sort(arr)`, which uses a far more efficient algorithm internally — bubble sort is taught for understanding, not for production use.)

## Searching: Linear Search vs Binary Search

**Linear search** checks every element one by one — works on any array, sorted or not, in `O(n)` time:

```java
static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;   // not found
}
```

**Binary search** is dramatically faster, but only works on a **sorted** array — it repeatedly checks the middle element and discards half the remaining search space each time, giving `O(log n)`:

```java
static int binarySearch(int[] sortedArr, int target) {
    int low = 0;
    int high = sortedArr.length - 1;

    while (low <= high) {
        int mid = (low + high) / 2;

        if (sortedArr[mid] == target) {
            return mid;
        } else if (sortedArr[mid] < target) {
            low = mid + 1;    // target must be in the right half
        } else {
            high = mid - 1;   // target must be in the left half
        }
    }
    return -1;   // not found
}
```

```java
int[] sorted = {1, 3, 5, 7, 9, 11, 13};
System.out.println(binarySearch(sorted, 9));    // 4
System.out.println(binarySearch(sorted, 4));    // -1
```

**Why it's faster:** searching 1,000,000 sorted items linearly could take up to 1,000,000 comparisons; binary search takes at most about 20 — each step cuts the remaining possibilities in half.

## Summary

| Algorithm | Time complexity | Requirement |
|---|---|---|
| Bubble sort | `O(n²)` | None |
| Linear search | `O(n)` | None |
| Binary search | `O(log n)` | Array must already be sorted |

> 💡 **Key tip:** Before reaching for a clever algorithm, ask: is the data sorted? Binary search's massive speed advantage only exists *because* the data is already in order.

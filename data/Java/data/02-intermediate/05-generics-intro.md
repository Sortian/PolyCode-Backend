# Lesson 05 — Generics Introduction

**Module 02 · Intermediate · Lesson 05 of 06**


## Learning objectives

- Understand **generics introduction** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Generics Introduction is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Generics Introduction — practice sketch
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

# Generics Introduction

**Generics** let you write a class or method that works with any type, while still keeping Java's type safety — the compiler checks types for you instead of you discovering mismatches at runtime.

## The problem generics solve

Without generics, a general-purpose container would have to use `Object`, losing all type information:

```java
class Box {
    private Object content;
    void set(Object content) { this.content = content; }
    Object get() { return content; }
}

Box box = new Box();
box.set("Hello");
String text = (String) box.get();   // manual cast required — easy to get wrong
```

If you accidentally put an `Integer` in and tried to cast it to `String`, that mistake wouldn't surface until the program crashed at runtime.

## A generic class

```java
class Box<T> {
    private T content;

    void set(T content) {
        this.content = content;
    }

    T get() {
        return content;
    }
}
```

`T` is a **type parameter** — a placeholder for "whatever type is decided when this box is created."

```java
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String text = stringBox.get();   // no cast needed — the compiler already knows it's a String

Box<Integer> intBox = new Box<>();
intBox.set(42);
int number = intBox.get();
```

Trying `stringBox.set(42)` simply **won't compile** — the mistake is caught immediately, instead of crashing later.

## A generic method

Type parameters can also apply to a single method rather than a whole class:

```java
class Util {
    static <T> void printArray(T[] array) {
        for (T item : array) {
            System.out.print(item + " ");
        }
        System.out.println();
    }
}
```

```java
Integer[] numbers = {1, 2, 3, 4};
String[] words = {"a", "b", "c"};

Util.printArray(numbers);   // 1 2 3 4
Util.printArray(words);     // a b c
```

The same method body works for both `Integer[]` and `String[]` — and any other type — without being rewritten.

## Multiple type parameters

```java
class Pair<K, V> {
    private K key;
    private V value;

    Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    K getKey() { return key; }
    V getValue() { return value; }
}
```

```java
Pair<String, Integer> score = new Pair<>("Maryam", 95);
System.out.println(score.getKey() + ": " + score.getValue());
```

**Output:**
```
Maryam: 95
```

## Where you've already met generics

`ArrayList<String>`, `HashMap<String, Integer>`, and `List<T>` are all generic types from the standard library — every time you write `List<String>`, you're using generics, just without defining one yourself.

> 💡 **Key tip:** Generics move type-mismatch errors from *runtime crashes* to *compile-time errors* — the same bug, caught much earlier and much more cheaply.

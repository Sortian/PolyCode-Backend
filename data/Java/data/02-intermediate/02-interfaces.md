# Lesson 02 — Interfaces and Abstract Classes

**Module 02 · Intermediate · Lesson 02 of 06**


## Learning objectives

- Understand **interfaces and abstract classes** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Interfaces and Abstract Classes is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Interfaces and Abstract Classes — practice sketch
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

# Interfaces

An **interface** defines a contract — a set of method signatures that any implementing class must provide, without saying *how* those methods work. It's Java's way of saying "anything that's a `Drawable` must have a `draw()` method," without caring what kind of object does the drawing.

## Declaring and implementing an interface

```java
interface Drawable {
    void draw();   // no body — just a signature, ending in a semicolon
}

class Circle implements Drawable {
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

class Square implements Drawable {
    public void draw() {
        System.out.println("Drawing a square");
    }
}
```

```java
Drawable shape1 = new Circle();
Drawable shape2 = new Square();
shape1.draw();   // Drawing a circle
shape2.draw();   // Drawing a square
```

**Output:**
```
Drawing a circle
Drawing a square
```

Notice the variable type is `Drawable`, but each object behaves according to its actual class — this is **polymorphism**: treating different types uniformly through a shared contract.

## Implementing multiple interfaces

Unlike classes (which can only extend one parent), a class can implement **as many interfaces as it needs**:

```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() {
        System.out.println("Duck is flying");
    }
    public void swim() {
        System.out.println("Duck is swimming");
    }
}
```

This is one of the main reasons interfaces exist — Java doesn't allow multiple class inheritance, but it does allow implementing multiple interfaces.

## Default and static methods (Java 8+)

Interfaces can also include methods with actual bodies, using `default` (an implementation any implementing class can use as-is, or override) or `static` (called directly on the interface itself):

```java
interface Greetable {
    void greet();   // abstract — must be implemented

    default void sayHello() {           // default — has a body, optional to override
        System.out.println("Hello there!");
    }

    static void info() {                 // static — belongs to the interface itself
        System.out.println("This is the Greetable interface.");
    }
}

class Person implements Greetable {
    public void greet() {
        System.out.println("Hi, I'm a person.");
    }
}
```

```java
Person p = new Person();
p.greet();        // Hi, I'm a person.
p.sayHello();      // Hello there! (inherited default behavior, not overridden)
Greetable.info();  // This is the Greetable interface. (called on the interface, not an object)
```

## Interface vs abstract class

| | Interface | Abstract class |
|---|---|---|
| Methods | Mostly abstract (plus `default`/`static`) | Can mix abstract and fully implemented |
| Fields | Only `public static final` constants | Any kind of field |
| Inheritance | A class can implement many | A class can extend only one |
| Use it for | "Can-do" capabilities (`Flyable`, `Comparable`) | A shared base with common state/behavior |

> 💡 **Key tip:** Reach for an interface when you're describing a **capability** that unrelated classes might share (a `Car` and a `Bird` are both `Movable`, despite having nothing else in common).

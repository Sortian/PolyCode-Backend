# Lesson 08 — Classes Introduction

**Module 01 · Beginner · Lesson 08 of 10**


## Learning objectives

- Understand **classes introduction** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Classes Introduction is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Classes Introduction — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 09 in this module.

---

## Additional reference

# Classes and Objects

A **class** is a blueprint that describes what data (fields) and behavior (methods) something has. An **object** is one specific instance created from that blueprint.

Think of `class Car` as the architectural drawing, and each individual car you build from it (a red Civic, a blue Tesla) as an object.

## Defining a class

```java
public class Dog {
    // fields — the data each Dog object holds
    String name;
    int age;

    // method — behavior every Dog object can perform
    void bark() {
        System.out.println(name + " says Woof!");
    }
}
```

## Creating objects with `new`

```java
public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();   // create an object (an "instance") of Dog
        myDog.name = "Rex";
        myDog.age = 3;
        myDog.bark();
    }
}
```

**Output:**
```
Rex says Woof!
```

Each object has its **own copy** of the fields. Creating a second `Dog` doesn't affect the first one's `name` or `age`.

## Constructors

A **constructor** is a special method, matching the class name, that runs automatically when you create an object with `new`. It's the standard way to set up initial values.

```java
public class Dog {
    String name;
    int age;

    // constructor
    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void bark() {
        System.out.println(name + " says Woof!");
    }
}
```

```java
Dog myDog = new Dog("Rex", 3);   // values passed straight in
myDog.bark();
```

### The `this` keyword

Inside the constructor, `this.name` refers to the object's field, while plain `name` refers to the parameter — `this` is how Java tells them apart when they share a name.

## Encapsulation: `private` fields with getters and setters

Making fields `private` prevents code outside the class from changing them directly. Instead, you expose controlled access through public methods:

```java
public class Dog {
    private String name;
    private int age;

    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // getter
    public String getName() {
        return name;
    }

    // setter — can include validation
    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }

    public int getAge() {
        return age;
    }
}
```

```java
Dog myDog = new Dog("Rex", 3);
System.out.println(myDog.getName());   // Rex
myDog.setAge(4);
System.out.println(myDog.getAge());    // 4
myDog.setAge(-1);                       // ignored by the validation check
System.out.println(myDog.getAge());    // still 4
```

This is one of Java's core principles: keep data **private**, and only let outside code change it through methods you control.

## Summary

| Term | Meaning |
|---|---|
| Class | The blueprint/template |
| Object | A specific instance created from a class |
| Field | A piece of data an object holds |
| Method | A behavior an object can perform |
| Constructor | Runs automatically when an object is created with `new` |
| `this` | Refers to the current object, disambiguating from parameters |
| Encapsulation | Keeping fields `private` and exposing controlled access via getters/setters |

> 💡 **Key tip:** If a field shouldn't change carelessly from outside the class, make it `private` and write a getter/setter — this is the default habit in professional Java code.

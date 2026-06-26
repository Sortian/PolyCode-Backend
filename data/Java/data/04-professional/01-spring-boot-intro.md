# Lesson 01 — Spring Boot Introduction

**Module 04 · Professional · Lesson 01 of 06**


## Learning objectives

- Understand **spring boot introduction** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Spring Boot Introduction is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Spring Boot Introduction — practice sketch
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

# Spring Boot Introduction

**Spring Boot** is a framework that drastically reduces the setup work needed to build a Java web application — it auto-configures sensible defaults so you can focus on your application's actual logic instead of plumbing.

## The entry point

Every Spring Boot app starts with a class annotated `@SpringBootApplication`:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

This single annotation combines three things behind the scenes: component scanning (find your classes), auto-configuration (set up sensible defaults), and marking this as a configuration class.

## Dependency Injection — Spring's core idea

Instead of a class creating the objects it depends on with `new`, Spring creates and "injects" them for you. This keeps classes decoupled and easy to test.

```java
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Service
class GreetingService {
    String greet(String name) {
        return "Hello, " + name + "!";
    }
}

@Component
class Greeter {
    private final GreetingService greetingService;

    @Autowired   // Spring supplies a GreetingService automatically — you never write `new GreetingService()`
    Greeter(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    void run() {
        System.out.println(greetingService.greet("Maryam"));
    }
}
```

`@Service` and `@Component` mark classes Spring should manage; `@Autowired` tells Spring "give me an instance of this when you build the object."

## Your first REST endpoint

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class HelloController {

    @GetMapping("/hello")
    String hello() {
        return "Hello from Spring Boot!";
    }
}
```

With the app running, visiting `http://localhost:8080/hello` in a browser returns:

```
Hello from Spring Boot!
```

`@RestController` marks a class whose methods respond directly to web requests; `@GetMapping("/hello")` maps that specific method to `GET /hello`. REST endpoints in depth are the focus of the next lesson.

## `application.properties`

App-wide settings (like the port or database connection) live in `src/main/resources/application.properties`:

```properties
server.port=8081
spring.application.name=my-app
```

## Running the app

If you're using Maven (covered in Lesson 03), the standard command is:

```bash
mvn spring-boot:run
```

## Summary

| Annotation | Purpose |
|---|---|
| `@SpringBootApplication` | Marks the main entry-point class |
| `@Component` / `@Service` | Marks a class Spring should manage and inject where needed |
| `@Autowired` | Requests Spring to supply a dependency automatically |
| `@RestController` | Marks a class that handles web requests and returns data directly |
| `@GetMapping(path)` | Maps a method to handle `GET` requests at that path |

> 💡 **Key tip:** You almost never write `new SomeService()` in Spring code — if you find yourself doing that, you're probably fighting the framework instead of using dependency injection as intended.

# Lesson 02 — Building REST APIs

**Module 04 · Professional · Lesson 02 of 06**


## Learning objectives

- Understand **building rest apis** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Building REST APIs is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Building REST APIs — practice sketch
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

# REST APIs

**REST** (Representational State Transfer) is a style for designing web APIs around resources (like "a student" or "a course") and standard HTTP methods that act on them.

## The core HTTP methods

| Method | Typical use | Example |
|---|---|---|
| `GET` | Read data | `GET /students` — list all students |
| `POST` | Create new data | `POST /students` — add a new student |
| `PUT` | Replace/update existing data | `PUT /students/5` — update student 5 |
| `DELETE` | Remove data | `DELETE /students/5` — delete student 5 |

## A full CRUD controller in Spring Boot

```java
import org.springframework.web.bind.annotation.*;
import java.util.*;

record Student(int id, String name, String grade) {}

@RestController
@RequestMapping("/students")
class StudentController {

    private final List<Student> students = new ArrayList<>(List.of(
            new Student(1, "Maryam", "A"),
            new Student(2, "Ali", "B")
    ));

    @GetMapping
    List<Student> getAll() {
        return students;
    }

    @GetMapping("/{id}")
    Student getOne(@PathVariable int id) {
        return students.stream()
                .filter(s -> s.id() == id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @PostMapping
    Student create(@RequestBody Student newStudent) {
        students.add(newStudent);
        return newStudent;
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable int id) {
        students.removeIf(s -> s.id() == id);
    }
}
```

## What each annotation is doing

| Annotation | Meaning |
|---|---|
| `@RequestMapping("/students")` | Every method in this class handles a path starting with `/students` |
| `@GetMapping` | Handles `GET /students` |
| `@GetMapping("/{id}")` | Handles `GET /students/5` — `{id}` is a path variable |
| `@PathVariable int id` | Pulls the `5` out of the URL into the `id` parameter |
| `@RequestBody Student newStudent` | Converts incoming JSON in the request body into a `Student` object |

## Example requests and responses

```
GET /students
```

```json
[
  { "id": 1, "name": "Maryam", "grade": "A" },
  { "id": 2, "name": "Ali", "grade": "B" }
]
```

```
POST /students
Body: { "id": 3, "name": "Sara", "grade": "A" }
```

```json
{ "id": 3, "name": "Sara", "grade": "A" }
```

## Status codes worth knowing

| Code | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | A new resource was created successfully |
| `400 Bad Request` | The client sent invalid data |
| `404 Not Found` | The requested resource doesn't exist |
| `500 Internal Server Error` | Something went wrong on the server |

A controller method can set the status explicitly using `ResponseEntity`:

```java
import org.springframework.http.ResponseEntity;

@GetMapping("/{id}")
ResponseEntity<Student> getOne(@PathVariable int id) {
    return students.stream()
            .filter(s -> s.id() == id)
            .findFirst()
            .map(ResponseEntity::ok)                          // 200 with the student
            .orElse(ResponseEntity.notFound().build());        // 404 if missing
}
```

> 💡 **Key tip:** Design your URLs around **nouns** (resources), not actions — `/students/5` is RESTful; `/getStudentById?id=5` is not. The HTTP method (`GET`, `POST`, etc.) is what carries the action.

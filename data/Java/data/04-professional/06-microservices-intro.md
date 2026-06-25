# Lesson 06 — Microservices Introduction

**Module 04 · Professional · Lesson 06 of 06**


## Learning objectives

- Understand **microservices introduction** in Java
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Microservices Introduction is a core topic on the PolyCode **Java Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Java expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```java
// Microservices Introduction — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** This is the final lesson in this module.

---

## Additional reference

# Microservices Introduction

A **microservices** architecture splits one application into several small, independently deployable services, each responsible for one specific area of business capability — instead of one large, single deployable unit.

## Monolith vs. microservices

**Monolithic architecture** — one codebase, one deployment, everything runs as a single process:

```
[ Single Application ]
  ├─ User management
  ├─ Order processing
  ├─ Payment handling
  └─ Notifications
```

**Microservices architecture** — the same responsibilities, split into independent services:

```
[ User Service ]  [ Order Service ]  [ Payment Service ]  [ Notification Service ]
       │                  │                   │                      │
       └──────────────────┴─────── API calls ─┴──────────────────────┘
```

Each box above is its own small Spring Boot application (or similar), with its own codebase, its own database, and its own deployment pipeline.

## Why split things up at all?

| Benefit | Explanation |
|---|---|
| Independent deployment | Update the Payment Service without redeploying everything else |
| Independent scaling | Scale the heavily-used Order Service without scaling the rarely-used Notification Service |
| Technology flexibility | Each service can use whatever language/database best fits its job |
| Fault isolation | If Notifications crashes, Orders and Payments can keep working |

## The trade-offs

| Cost | Explanation |
|---|---|
| Network calls replace method calls | Services talk over HTTP/messaging instead of direct in-process calls — slower, and can fail |
| Operational complexity | More services to deploy, monitor, and keep track of |
| Data consistency is harder | Each service often owns its own database; keeping data in sync across services takes deliberate design |

This is why microservices are usually adopted by larger teams/systems where the benefits (independent deployment, scaling) outweigh the added complexity — a small project usually starts simpler as a monolith.

## A basic example: calling another service

A typical microservice calls another one over HTTP using a REST client (Spring provides `RestTemplate` or the newer `RestClient`):

```java
import org.springframework.web.client.RestClient;

public class OrderService {
    private final RestClient restClient = RestClient.create("http://payment-service:8082");

    public boolean chargeCustomer(int orderId, double amount) {
        var response = restClient.post()
                .uri("/payments")
                .body(new PaymentRequest(orderId, amount))
                .retrieve()
                .toEntity(PaymentResponse.class);

        return response.getStatusCode().is2xxSuccessful();
    }
}

record PaymentRequest(int orderId, double amount) {}
record PaymentResponse(String status) {}
```

The Order Service doesn't know or care how the Payment Service is implemented internally — it just sends a request to a known address and reads back a response, exactly like calling a REST API built in the earlier lesson.

## Key concepts you'll meet in real microservice systems

- **API Gateway** — a single entry point that routes incoming requests to the right internal service.
- **Service discovery** — a registry that tracks where each service instance currently lives, so others can find it even as instances start, stop, or move.
- **Independent databases** — each service typically owns its own data store, rather than sharing one giant database.

## Summary

| | Monolith | Microservices |
|---|---|---|
| Deployment | One unit | Many independent units |
| Codebase | Single | One per service |
| Scaling | All-or-nothing | Per-service |
| Best for | Smaller teams, simpler systems | Larger teams, systems needing independent scaling |

> 💡 **Key tip:** Microservices solve organizational and scaling problems — they are not automatically "better" architecture. Many successful, large systems run perfectly well as a well-structured monolith.

# Lesson 06 — Functions Basics

**Module 01 · Beginner · Lesson 6 of 8**

Functions are reusable blocks of code. They help you avoid repetition and organize programs into clear steps.

## Defining and calling a function

```javascript
function sayHello() {
  console.log("Hello from PolyCode!");
}

sayHello(); // call the function
```

## Parameters and return values

```javascript
function add(a, b) {
  return a + b;
}

const total = add(3, 5);
console.log(total); // 8
```

- **Parameters** — placeholders in the function definition (`a`, `b`)
- **Arguments** — actual values you pass when calling (`3`, `5`)
- **Return value** — what the function sends back to the caller

## Arrow functions (modern style)

```javascript
const multiply = (a, b) => a * b;

const greet = (name) => {
  return `Welcome, ${name}!`;
};
```

Use arrow functions for short utilities and callbacks. Use regular `function` when you need a named function for recursion or clearer stack traces.

## Default parameters

```javascript
function createUser(name, role = "student") {
  return { name, role };
}

console.log(createUser("Sara"));
// { name: "Sara", role: "student" }
```

## Callbacks (functions as arguments)

```javascript
function processNumbers(nums, callback) {
  return nums.map(callback);
}

const doubled = processNumbers([1, 2, 3], (n) => n * 2);
console.log(doubled); // [2, 4, 6]
```

Callbacks appear everywhere in JavaScript — especially in arrays, timers, and event handlers.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting `return` | Add `return` when you need a value back |
| Same parameter name twice | Use unique, descriptive names |
| Calling before defining (with `const`) | Define arrow functions before use |

## Practice exercises

1. Write `celsiusToFahrenheit(c)` and test with `0`, `25`, and `100`.
2. Write `isEven(n)` that returns `true` or `false`.
3. Write `applyDiscount(price, percent)` with `percent` defaulting to `10`.

## Key takeaway

Functions are the building blocks of JavaScript programs. Master parameters, return values, and arrow syntax before moving to async code.

**Next:** [Arrays](07-arrays.md)

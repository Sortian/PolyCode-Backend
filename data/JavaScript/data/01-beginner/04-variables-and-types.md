# Lesson 04 — Variables and Data Types

**Module 01 · Beginner · Lesson 4 of 8**

Variables store information your program needs. Data types describe what kind of information you are storing.

## Declaring variables

Use `const` by default, `let` when the value must change, and avoid `var` in new code.

```javascript
const APP_NAME = "PolyCode";
let score = 0;
score = 10; // OK — let can be reassigned

// const API_URL = "https://api.example.com";
// API_URL = "other"; // Error — const cannot be reassigned
```

| Keyword | Can reassign? | Scope |
|---------|---------------|-------|
| `const` | No | Block |
| `let` | Yes | Block |
| `var` | Yes | Function (legacy) |

## Primitive data types

```javascript
const name = "Ayesha";           // string
const age = 22;                  // number
const isEnrolled = true;         // boolean
let nickname;                    // undefined (not assigned yet)
const empty = null;              // intentional empty value
const id = Symbol("user-id");    // unique identifier
const big = 9007199254740991n;   // bigint (very large integers)
```

## Reference types

```javascript
const user = { name: "Ali", role: "student" }; // object
const tags = ["js", "web", "api"];             // array

function greet() {
  return "Hello!";
}
```

Arrays and functions are technically objects in JavaScript, but you will use them so often they feel like their own categories.

## Checking types

```javascript
console.log(typeof name);        // "string"
console.log(typeof age);         // "number"
console.log(typeof isEnrolled);  // "boolean"
console.log(typeof empty);       // "object" (known quirk for null)
console.log(Array.isArray(tags)); // true
```

## Type conversion (coercion)

JavaScript can convert types automatically — sometimes in surprising ways.

```javascript
console.log("5" + 2);   // "52" (string concatenation)
console.log("5" - 2);   // 3 (subtraction converts to number)
console.log(Number("42")); // 42
console.log(String(100));  // "100"
```

**Tip:** Use `Number()`, `String()`, or `Boolean()` when you want explicit, predictable conversion.

## Practice exercises

1. Create variables for your name, age, and favorite language. Log each with `typeof`.
2. Build an object `course` with `title`, `level`, and `completed` properties.
3. Convert the string `"19.99"` to a number and add tax: `price * 1.17`.

## Key takeaway

Choose the right type for your data, prefer `const` and `let`, and use `typeof` / `Array.isArray()` when debugging.

**Next:** [Control flow and loops](05-control-flow-and-loops.md)

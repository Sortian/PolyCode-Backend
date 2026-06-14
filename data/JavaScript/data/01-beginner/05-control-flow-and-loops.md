# Lesson 05 — Control Flow and Loops

**Module 01 · Beginner · Lesson 5 of 8**

Control flow decides **which code runs** and **how many times** it runs.

## Conditionals

### if / else

```javascript
const score = 82;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Keep practicing!");
}
```

### Ternary operator (short if/else)

```javascript
const age = 20;
const label = age >= 18 ? "adult" : "minor";
```

### switch

```javascript
const day = "Friday";

switch (day) {
  case "Monday":
    console.log("Start of the week");
    break;
  case "Friday":
    console.log("Almost weekend!");
    break;
  default:
    console.log("Regular day");
}
```

## Loops

### for — when you know how many iterations

```javascript
for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}
```

### while — loop while a condition is true

```javascript
let count = 3;
while (count > 0) {
  console.log(count);
  count--;
}
```

### for...of — loop over array values

```javascript
const languages = ["JavaScript", "Python", "C++"];

for (const lang of languages) {
  console.log(lang);
}
```

## break and continue

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // skip 3
  if (i === 8) break;    // stop at 8
  console.log(i);
}
```

## Practice exercises

1. Print numbers 1–20, but log `"Fizz"` for multiples of 3.
2. Write a loop that sums all numbers in `[4, 8, 15, 16, 23, 42]`.
3. Use `switch` to print a message for `"beginner"`, `"intermediate"`, or `"advanced"`.

## Key takeaway

Use `if/else` for decisions and loops for repetition. Prefer `for...of` when iterating arrays in modern JavaScript.

**Next:** [Functions basics](06-functions-basics.md)

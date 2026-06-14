# JavaScript Certificate — Final Assessment

This assessment verifies that you are ready for the **PolyCode JavaScript Developer Certificate**. Aim for **70% or higher** overall.

---

## Section A — Fundamentals (25 points)

### A1. Variables and types
What is the output of this code? Explain why.

```javascript
const items = [1, 2, 3];
items.push(4);
console.log(typeof items);
console.log(items.length);
```

### A2. Functions
Write a function `celsiusToFahrenheit(c)` that converts Celsius to Fahrenheit using the formula `F = C * 9/5 + 32`.

### A3. Control flow
Write a function `gradeFromScore(score)` that returns `"A"` (90+), `"B"` (80–89), `"C"` (70–79), `"D"` (60–69), or `"F"` (below 60).

---

## Section B — Intermediate (25 points)

### B1. ES6
Rewrite using arrow functions, template literals, and destructuring where appropriate:

```javascript
function formatUser(user) {
  return "Hello, " + user.firstName + " " + user.lastName + "!";
}
```

### B2. Async
Explain the difference between callbacks, Promises, and `async/await`. When would you use each?

### B3. DOM
Describe the steps to attach a click handler to a button and update a `<span>` with the click count.

---

## Section C — Advanced (25 points)

### C1. Closures
What will this print? Explain closure in one paragraph.

```javascript
function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}
const counter = makeCounter();
console.log(counter());
console.log(counter());
```

### C2. Prototypes vs classes
When would you use a JavaScript `class` versus adding methods to a prototype? Give one example of each.

### C3. Error handling
Write a safe `async` function `fetchJson(url)` that returns parsed JSON or `null` if the request fails.

---

## Section D — Professional & mastery (25 points)

### D1. Node & Express
List the HTTP methods GET, POST, PUT, and DELETE and describe what each is typically used for in a REST API.

### D2. Testing
Why do developers write unit tests? Name one JavaScript testing library.

### D3. Practical challenge (required)

Build a **Task Manager** (minimum viable version):

**Requirements:**
- Add a task with a title
- Mark a task complete
- Remove a task
- Store tasks in `localStorage` so they persist after refresh

You may use plain HTML/CSS/JS or React. Submit your code with a short README explaining how to run it.

### D4. Algorithms
Implement a function that returns `true` if a string is a palindrome (reads the same forwards and backwards), ignoring case and spaces.

```javascript
isPalindrome("Race car"); // true
isPalindrome("hello");    // false
```

---

## Scoring guide

| Section | Points | Pass threshold |
|---------|--------|----------------|
| A — Fundamentals | 25 | 18+ |
| B — Intermediate | 25 | 18+ |
| C — Advanced | 25 | 18+ |
| D — Professional | 25 | 18+ |
| **Total** | **100** | **70+** |

## Before you submit

- [ ] I completed Modules 01 through 05
- [ ] I finished at least 3 hands-on projects
- [ ] I can explain my practical challenge code without reading it line by line
- [ ] I reviewed weak areas using the [Course roadmap](00-roadmap.md)

**Congratulations** — passing this assessment means you have earned the PolyCode JavaScript Developer Certificate track completion. Keep building and shipping projects!

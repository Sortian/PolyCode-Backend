# Lesson 03 — Hello World

**Module 01 · Beginner · Lesson 3 of 8**

Your first runnable JavaScript program. This lesson pairs with the code file `03-hello-world.js`.

## What you will do

1. Run a script that prints messages to the console
2. See how `const` stores a string
3. Confirm your JavaScript environment works

## The code

```javascript
console.log("Hello, JavaScript World!");

const message = "The JavaScript hub is working correctly.";
console.log(message);
```

## How to run it

**In Node.js (terminal):**
```bash
node 03-hello-world.js
```

**In the browser:**
- Open DevTools (F12) → Console
- Paste the code and press Enter

**In PolyCode Playground:**
- Open the Playground, paste the code, and run

## Expected output

```
Hello, JavaScript World!
The JavaScript hub is working correctly.
```

## Try it yourself

Change the message to include your name, then add a second `console.log` that prints today's date using `new Date()`.

**Next:** [Variables and data types](04-variables-and-types.md)

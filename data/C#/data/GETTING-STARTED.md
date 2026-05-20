# Getting Started with C#

**Welcome!** This quick start guide gets you up and running in 30 minutes.

## ⚡ 5-Minute Setup

### **What You Need**

- ✅ Visual Studio Code ([download](https://code.visualstudio.com/)) or Visual Studio ([download](https://visualstudio.microsoft.com/))
- ✅ .NET SDK ([download](https://dotnet.microsoft.com/download))
- ✅ A text editor and terminal

### **Verify Installation**

Open your terminal and run:

```bash
dotnet --version
```

You should see a version number (e.g., `8.0.x`). If not, reinstall the .NET SDK.

---

## 🎯 Your First Program (10 Minutes)

### **Step 1: Create a Project**

```bash
dotnet new console -n HelloWorld
cd HelloWorld
```

### **Step 2: Open in Your Editor**

```bash
code .
```

### **Step 3: Replace Program.cs Content**

```csharp
// This is your first C# program!
Console.WriteLine("Hello, World!");
Console.WriteLine("Welcome to C#!");
```

### **Step 4: Run It**

```bash
dotnet run
```

**🎉 Success!** You just ran your first C# program.

---

## 📚 What You'll Learn

### **Level 1 (This Week)**

```
Variables → Loops → Conditionals → Methods
↓
You'll write simple programs that calculate, make decisions, and reuse code
```

### **Level 2 (Next 2 Weeks)**

```
Classes → Objects → Inheritance → Interfaces
↓
You'll model real-world concepts like Bank Accounts, Animals, Vehicles
```

### **Level 3 (Weeks 3-4)**

```
LINQ → Async/Await → Generics → Events
↓
You'll query data, run parallel code, and handle thousands of events
```

### **Level 4 (Weeks 5-6)**

```
Design Patterns → Testing → Dependency Injection → Performance
↓
You'll write production-grade code used in real companies
```

---

## 🎓 Three Learning Styles

### **1️⃣ Visual Learner? (Watch + Learn)**

- Open `Level-1-Foundations/`
- Read the `.md` file (theory)
- Open the `.cs` example file
- Run it: `dotnet run`
- Modify it and experiment

### **2️⃣ Hands-On Learner? (Just Code)**

- Start with projects in `Projects/`
- Build something immediately
- Look up concepts as needed
- Use `Reference/cheatsheet.md` for quick lookup

### **3️⃣ Exercise Learner? (Problem Solving)**

- Go to `Exercises/`
- Solve the challenge
- Check the example solution
- Progress to next exercise

---

## 💻 Common Commands (You'll Use These Daily)

```bash
# Create a new project
dotnet new console -n ProjectName

# Run your program
dotnet run

# Build the project
dotnet build

# Add a reference (library)
dotnet add package PackageName

# Clean built files
dotnet clean

# Run tests
dotnet test
```

---

## 🧭 Navigation Guide

### **For: "I'm brand new to programming"**

→ Start here → `README.md` Learning Path → `Level-1-Foundations/`

### **For: "I know programming but not C#"**

→ Skip `Level-1`, start at `Level-2-OOP-Basics/`

### **For: "I want to build something now"**

→ Go to `Projects/01-Console-Calculator/`

### **For: "I'm stuck on a concept"**

→ Check `Reference/common-mistakes.md`

### **For: "I need a quick syntax reminder"**

→ Use `Reference/cheatsheet.md`

---

## ❓ Frequently Asked Questions

### **Q: How long does this take?**

**A:** 8-12 weeks for Level 1-4 at ~5-7 hours/week. Or go faster/slower based on your pace.

### **Q: Do I need to buy anything?**

**A:** No! Everything here is free. .NET, VS Code, and all tools are free and open-source.

### **Q: What if I'm stuck?**

**A:**

1. Re-read the lesson (it usually clicks on 2nd read)
2. Study the example code
3. Check `common-mistakes.md`
4. Modify the example and experiment
5. Search Microsoft's [official C# docs](https://docs.microsoft.com/en-us/dotnet/csharp/)

### **Q: Can I skip a level?**

**A:** Not recommended for beginners. Each level builds on the previous. But if you know OOP, you might skip Level 2.

### **Q: Should I memorize syntax?**

**A:** No. Memorize _concepts_, not syntax. Cheatsheets and autocomplete are your friends.

### **Q: How do I know I'm ready for the next level?**

**A:**

- ✅ You can complete all exercises in current level
- ✅ You can build a small project combining those concepts
- ✅ You understand _why_ you write code, not just _how_

---

## 🎬 Quick Start by Interest

### **"I want to build web apps"**

```
Level 1 → Level 2 → Level 3 → Level 4
→ Projects/05-REST-API-Beginner/
→ ASP.NET Core (next course)
```

### **"I want to build games"**

```
Level 1 → Level 2 → Unity (separate framework)
```

### **"I want to learn data science"**

```
Level 1 → Level 3 (focus on LINQ)
→ Projects/04-Library-Management/ (data handling)
→ Python (for data science specialization)
```

### **"I want a job as a C# developer"**

```
Level 1 → Level 2 → Level 3 → Level 4
→ All projects with portfolio presentation
→ Contribute to open-source C# projects
```

---

## 🔥 Pro Tips

1. **Type every example yourself** - Copy-paste helps nothing; typing builds muscle memory
2. **Experiment constantly** - Break code on purpose; see what happens
3. **Don't rush** - Understanding is more important than speed
4. **Take notes** - Write down what confused you and how you solved it
5. **Review often** - Go back to Level 1 occasionally; you'll see things you missed
6. **Build projects** - That's where real learning happens
7. **Join communities** - r/csharp, Microsoft Learn, local meetups

---

## ✅ Your First Checklist

- [ ] Install .NET SDK and verify `dotnet --version`
- [ ] Create your first "Hello World" project
- [ ] Run your first program
- [ ] Modify the program (change the text, add a second line)
- [ ] Go to `Level-1-Foundations/` and read the first lesson
- [ ] Run the first example code
- [ ] Complete the first exercise
- [ ] Mark Level 1, Section 1 as complete!

---

## 🚀 Next Steps

1. **Read:** Go to [README.md](README.md) for the full learning path
2. **Start:** Open `Level-1-Foundations/`
3. **Code:** Create your first project and start learning
4. **Build:** Complete the first project (Console Calculator)
5. **Share:** Show someone your code!

---

**Ready? Let's code! → [Level 1: Foundations](Level-1-Foundations/)**

Good luck! 🎓
